"use client";

import { useState, useCallback, useRef } from 'react';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import './quote-calculator.css';

// ── Types ────────────────────────────────────────────────────────────────────

type Material = 'PLA' | 'PETG' | 'ASA' | 'TPU' | 'Resin';
type Quality  = 'Draft' | 'Standard' | 'Fine';
type Infill   = 15 | 25 | 50 | 100;

interface ParseResult {
  volumeCm3: number;
  dims: { x: number; y: number; z: number };
}

// ── Pricing constants ────────────────────────────────────────────────────────

const MATERIAL_COST: Record<Material, number> = {
  PLA:   0.06,
  PETG:  0.08,
  ASA:   0.09,
  TPU:   0.12,
  Resin: 0.20,
};

const QUALITY_FACTOR: Record<Quality, number> = {
  Draft:    1.0,
  Standard: 1.3,
  Fine:     1.8,
};

const INFILL_FACTOR: Record<Infill, number> = {
  15:  0.25,
  25:  0.35,
  50:  0.60,
  100: 1.0,
};

function qtyDiscount(qty: number): number {
  if (qty <= 1) return 1.0;
  if (qty <= 3) return 0.90;
  if (qty <= 5) return 0.85;
  return 0.80;
}

function calcPrice(
  volumeCm3: number,
  material: Material,
  quality: Quality,
  infill: Infill,
  qty: number,
): number {
  const infillFactor = material === 'Resin' ? 1.0 : INFILL_FACTOR[infill];
  const unitPrice = 5 + volumeCm3 * MATERIAL_COST[material] * infillFactor * QUALITY_FACTOR[quality];
  return Math.max(10, unitPrice * qty * qtyDiscount(qty));
}

// ── STL parsing ──────────────────────────────────────────────────────────────

type Vec3 = [number, number, number];

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function signedTriVol(v1: Vec3, v2: Vec3, v3: Vec3): number {
  return dot(v1, cross(v2, v3)) / 6.0;
}

function computeFromTriangles(triangles: Vec3[][]): ParseResult {
  let volume = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const [v1, v2, v3] of triangles) {
    volume += signedTriVol(v1, v2, v3);
    for (const v of [v1, v2, v3]) {
      if (v[0] < minX) minX = v[0];
      if (v[1] < minY) minY = v[1];
      if (v[2] < minZ) minZ = v[2];
      if (v[0] > maxX) maxX = v[0];
      if (v[1] > maxY) maxY = v[1];
      if (v[2] > maxZ) maxZ = v[2];
    }
  }

  // STL/OBJ units are mm → convert mm³ to cm³
  const volumeMm3 = Math.abs(volume);
  return {
    volumeCm3: volumeMm3 / 1000,
    dims: {
      x: Math.round((maxX - minX) * 10) / 10,
      y: Math.round((maxY - minY) * 10) / 10,
      z: Math.round((maxZ - minZ) * 10) / 10,
    },
  };
}

function parseStlBinary(buffer: ArrayBuffer): ParseResult {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  const triangles: Vec3[][] = [];

  for (let i = 0; i < triangleCount; i++) {
    const offset = 84 + i * 50;
    // skip normal (12 bytes), read 3 vertices
    const v1: Vec3 = [
      view.getFloat32(offset + 12, true),
      view.getFloat32(offset + 16, true),
      view.getFloat32(offset + 20, true),
    ];
    const v2: Vec3 = [
      view.getFloat32(offset + 24, true),
      view.getFloat32(offset + 28, true),
      view.getFloat32(offset + 32, true),
    ];
    const v3: Vec3 = [
      view.getFloat32(offset + 36, true),
      view.getFloat32(offset + 40, true),
      view.getFloat32(offset + 44, true),
    ];
    triangles.push([v1, v2, v3]);
  }

  return computeFromTriangles(triangles);
}

function parseStlAscii(text: string): ParseResult {
  const lines = text.split('\n');
  const vertices: Vec3[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('vertex ')) {
      const parts = t.split(/\s+/);
      vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
    }
  }

  const triangles: Vec3[][] = [];
  for (let i = 0; i + 2 < vertices.length; i += 3) {
    triangles.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
  }
  return computeFromTriangles(triangles);
}

function parseStl(buffer: ArrayBuffer): ParseResult {
  // Detect binary vs ASCII: binary STL starts with an 80-byte header
  const header = new Uint8Array(buffer, 0, Math.min(256, buffer.byteLength));
  const text = new TextDecoder().decode(header);
  if (text.trimStart().startsWith('solid')) {
    // Could be ASCII — try ASCII first
    const full = new TextDecoder().decode(buffer);
    if (full.includes('facet normal') && full.includes('vertex')) {
      return parseStlAscii(full);
    }
  }
  return parseStlBinary(buffer);
}

// ── OBJ parsing ──────────────────────────────────────────────────────────────

function parseObj(text: string): ParseResult {
  const verts: Vec3[] = [];
  const triangles: Vec3[][] = [];

  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('v ')) {
      const p = t.split(/\s+/);
      verts.push([parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])]);
    } else if (t.startsWith('f ')) {
      const parts = t.split(/\s+/).slice(1);
      // Parse face indices (handle v, v/vt, v/vt/vn, v//vn)
      const indices = parts.map((p) => parseInt(p.split('/')[0]) - 1);
      // Fan triangulation for polygons
      for (let i = 1; i + 1 < indices.length; i++) {
        const v0 = verts[indices[0]];
        const v1 = verts[indices[i]];
        const v2 = verts[indices[i + 1]];
        if (v0 && v1 && v2) triangles.push([v0, v1, v2]);
      }
    }
  }

  return computeFromTriangles(triangles);
}

// ── Main parse dispatcher ────────────────────────────────────────────────────

async function parseFile(file: File): Promise<ParseResult | null> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'stl') {
    const buffer = await file.arrayBuffer();
    return parseStl(buffer);
  }

  if (ext === 'obj') {
    const text = await file.text();
    return parseObj(text);
  }

  // 3MF — just accept, no parse
  return null;
}

// ── Component ────────────────────────────────────────────────────────────────

export function QuoteCalculator() {
  const { addQuote } = useQuoteCart();
  const [addedToBasket, setAddedToBasket] = useState(false);

  const [file, setFile]           = useState<File | null>(null);
  const [parsed, setParsed]       = useState<ParseResult | null>(null);
  const [is3mf, setIs3mf]         = useState(false);
  const [parseError, setParseError] = useState('');
  const [dragging, setDragging]   = useState(false);

  const [material, setMaterial]   = useState<Material>('PLA');
  const [quality, setQuality]     = useState<Quality>('Standard');
  const [infill, setInfill]       = useState<Infill>(25);
  const [quantity, setQuantity]   = useState(1);

  const [showContact, setShowContact] = useState(false);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    setParseError('');
    setParsed(null);
    setIs3mf(false);
    setFile(f);
    setShowContact(false);
    setSubmitted(false);

    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext === '3mf') {
      setIs3mf(true);
      return;
    }

    try {
      const result = await parseFile(f);
      if (result) {
        setParsed(result);
      } else {
        setParseError('Could not parse file. Please try an STL or OBJ file.');
      }
    } catch {
      setParseError('Error reading file. Please try again.');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const price = parsed
    ? calcPrice(parsed.volumeCm3, material, quality, infill, quantity)
    : null;

  const priceRange = price
    ? `€${(price * 0.85).toFixed(0)} – €${(price * 1.15).toFixed(0)}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email) return;

    setSubmitting(true);
    setSubmitError('');

    const summary = parsed
      ? [
          `3D PRINT QUOTE REQUEST`,
          ``,
          `File: ${file.name}`,
          `Dimensions: ${parsed.dims.x} × ${parsed.dims.y} × ${parsed.dims.z} mm`,
          `Volume: ${parsed.volumeCm3.toFixed(2)} cm³`,
          `Material: ${material}`,
          `Quality: ${quality}`,
          `Infill: ${material === 'Resin' ? '100%' : infill + '%'}`,
          `Quantity: ${quantity}`,
          `Estimated price: ${priceRange}`,
        ].join('\n')
      : `3D PRINT QUOTE REQUEST\n\nFile: ${file.name} (3MF format)\n\nPlease review attached file and provide pricing.\nQuantity: ${quantity}`;

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('service', '3D Printing');
    fd.append('message', summary);
    fd.append('upload', file);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasFile = !!file;
  const canPrice = parsed !== null;

  const specsText = parsed
    ? [
        `3D PRINT QUOTE`,
        ``,
        `File: ${file?.name ?? ''}`,
        `Dimensions: ${parsed.dims.x} × ${parsed.dims.y} × ${parsed.dims.z} mm`,
        `Volume: ${parsed.volumeCm3.toFixed(2)} cm³`,
        `Material: ${material}`,
        `Quality: ${quality}`,
        `Infill: ${material === 'Resin' ? '100%' : infill + '%'}`,
        `Quantity: ${quantity}`,
        `Estimated price: ${priceRange}`,
      ].join('\n')
    : file ? `3D PRINT QUOTE\n\nFile: ${file.name} (3MF)\nQuantity: ${quantity}\nPricing on request.` : '';

  const handleAddToBasket = () => {
    if (!hasFile || (!canPrice && !is3mf)) return;
    addQuote({
      service: '3D Printing',
      label: is3mf
        ? `3MF · ×${quantity}`
        : `${material} · ${quality} · ${material === 'Resin' ? '100%' : infill + '%'} · ×${quantity}`,
      specs: specsText,
      priceRange: priceRange ?? 'Pricing on request',
      fileName: file?.name,
      quantity,
    });
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 3000);
  };

  return (
    <section className="quote-calc">
      <p className="quote-calc__sub">
        Upload your 3D model and get an instant quote. Supported formats: STL, OBJ, 3MF.
      </p>

      {/* ── Drop zone ── */}
      <div
        className={`quote-calc__dropzone${dragging ? ' quote-calc__dropzone--active' : ''}${hasFile ? ' quote-calc__dropzone--has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".stl,.obj,.3mf"
          style={{ display: 'none' }}
          onChange={onPick}
        />

        {!hasFile ? (
          <>
            <div className="quote-calc__drop-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="quote-calc__drop-label">Drop your file here or <span>click to browse</span></p>
            <p className="quote-calc__drop-hint">STL · OBJ · 3MF</p>
          </>
        ) : (
          <div className="quote-calc__file-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="quote-calc__file-name">{file.name}</span>
            <button
              className="quote-calc__remove"
              onClick={(e) => { e.stopPropagation(); setFile(null); setParsed(null); setIs3mf(false); setShowContact(false); }}
              aria-label="Remove file"
            >×</button>
          </div>
        )}
      </div>

      {parseError && <p className="quote-calc__error">{parseError}</p>}

      {/* ── Parsed dims ── */}
      {parsed && (
        <div className="quote-calc__dims">
          <span className="quote-calc__dim-tag">{parsed.dims.x} × {parsed.dims.y} × {parsed.dims.z} mm</span>
          <span className="quote-calc__dim-tag">{parsed.volumeCm3.toFixed(2)} cm³</span>
        </div>
      )}

      {is3mf && (
        <div className="quote-calc__dims">
          <span className="quote-calc__dim-tag">3MF file uploaded</span>
          <span className="quote-calc__dim-tag quote-calc__dim-tag--muted">dimensions calculated on review</span>
        </div>
      )}

      {/* ── Settings ── */}
      {hasFile && (
        <div className="quote-calc__settings">
          <label className="quote-calc__field">
            <span>Material</span>
            <select value={material} onChange={(e) => setMaterial(e.target.value as Material)}>
              <option value="PLA">PLA</option>
              <option value="PETG">PETG</option>
              <option value="ASA">ASA / ABS</option>
              <option value="TPU">TPU (Flexible)</option>
              <option value="Resin">Resin (SLA)</option>
            </select>
          </label>

          <label className="quote-calc__field">
            <span>Quality</span>
            <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>
              <option value="Draft">Draft (0.3 mm)</option>
              <option value="Standard">Standard (0.2 mm)</option>
              <option value="Fine">Fine (0.1 mm)</option>
            </select>
          </label>

          {material !== 'Resin' && (
            <label className="quote-calc__field">
              <span>Infill</span>
              <select value={infill} onChange={(e) => setInfill(Number(e.target.value) as Infill)}>
                <option value={15}>15% (Light)</option>
                <option value={25}>25% (Standard)</option>
                <option value={50}>50% (Strong)</option>
                <option value={100}>100% (Solid)</option>
              </select>
            </label>
          )}

          <label className="quote-calc__field">
            <span>Quantity</span>
            <div className="quote-calc__qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(50, q + 1))}>+</button>
            </div>
          </label>
        </div>
      )}

      {/* ── Price ── */}
      {(canPrice || is3mf) && (
        <div className="quote-calc__price-box">
          {priceRange ? (
            <>
              <p className="quote-calc__price-label">Estimated price</p>
              <p className="quote-calc__price">{priceRange}</p>
              <p className="quote-calc__price-note">Estimate only — final price confirmed after file review</p>
            </>
          ) : (
            <>
              <p className="quote-calc__price-label">Price on request</p>
              <p className="quote-calc__price-note">We&apos;ll review your 3MF file and send a quote</p>
            </>
          )}

          {!submitted ? (
            <>
              <div className="quote-calc__actions">
                <button
                  className={`quote-calc__cta${addedToBasket ? ' quote-calc__cta--added' : ''}`}
                  onClick={handleAddToBasket}
                >
                  {addedToBasket ? '✓ Added to Basket' : 'Add to Basket'}
                </button>
                <button
                  className="quote-calc__cta quote-calc__cta--outline"
                  onClick={() => setShowContact((v) => !v)}
                >
                  {showContact ? 'Cancel' : 'Send Quote Request'}
                </button>
              </div>

              {showContact && (
                <form className="quote-calc__contact" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {submitError && <p className="quote-calc__error">{submitError}</p>}
                  <button type="submit" className="quote-calc__submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Request'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="quote-calc__success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Quote request sent! We&apos;ll get back to you shortly.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

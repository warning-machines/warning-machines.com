"use client";

import { useState, useCallback, useRef } from 'react';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import './quote-calculator.css';

// ── Types ────────────────────────────────────────────────────────────────────

type LaserMaterial  = 'MildSteel' | 'StainlessSteel' | 'Aluminium' | 'Acrylic' | 'Brass';
type SheetThickness = 1 | 2 | 3 | 5 | 8 | 10;
type CutComplexity  = 'Simple' | 'Medium' | 'Complex';

interface ParseResult {
  sheetW: number; // mm
  sheetH: number; // mm
}

// ── Pricing constants ────────────────────────────────────────────────────────

const MATERIAL_COST: Record<LaserMaterial, number> = {
  MildSteel:      0.08,
  StainlessSteel: 0.15,
  Aluminium:      0.10,
  Acrylic:        0.06,
  Brass:          0.18,
};

const MATERIAL_LABEL: Record<LaserMaterial, string> = {
  MildSteel:      'Mild Steel',
  StainlessSteel: 'Stainless Steel',
  Aluminium:      'Aluminium',
  Acrylic:        'Acrylic',
  Brass:          'Brass',
};

const COMPLEXITY_LABEL: Record<CutComplexity, string> = {
  Simple:  'Simple (basic shapes)',
  Medium:  'Medium (mixed curves)',
  Complex: 'Complex (fine detail)',
};

const THICKNESS_FACTOR: Record<SheetThickness, number> = {
  1: 1.0, 2: 1.3, 3: 1.6, 5: 2.2, 8: 3.0, 10: 3.8,
};

const COMPLEXITY_FACTOR: Record<CutComplexity, number> = {
  Simple: 1.0, Medium: 1.5, Complex: 2.2,
};

const SETUP_FEE = 15;
const MIN_PRICE = 25;

function qtyDiscount(qty: number): number {
  if (qty <= 1)  return 1.0;
  if (qty <= 5)  return 0.90;
  if (qty <= 10) return 0.82;
  return 0.75;
}

function calcLaserPrice(w: number, h: number, material: LaserMaterial, thickness: SheetThickness, complexity: CutComplexity, qty: number): number {
  const areaCm2 = (w * h) / 100;
  const unitPrice = SETUP_FEE + areaCm2 * MATERIAL_COST[material] * THICKNESS_FACTOR[thickness] * COMPLEXITY_FACTOR[complexity];
  return Math.max(MIN_PRICE, unitPrice * qty * qtyDiscount(qty));
}

// ── Geometry parsing — extract 2D bounding box (X × Y footprint) ─────────────

type Vec3 = [number, number, number];

function computeFromTriangles(triangles: Vec3[][]): ParseResult {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  for (const tri of triangles) {
    for (const v of tri) {
      if (v[0] < minX) minX = v[0]; if (v[1] < minY) minY = v[1];
      if (v[0] > maxX) maxX = v[0]; if (v[1] > maxY) maxY = v[1];
    }
  }
  return {
    sheetW: Math.round((maxX - minX) * 10) / 10,
    sheetH: Math.round((maxY - minY) * 10) / 10,
  };
}

function parseStlBinary(buffer: ArrayBuffer): ParseResult {
  const view = new DataView(buffer);
  const count = view.getUint32(80, true);
  const tris: Vec3[][] = [];
  for (let i = 0; i < count; i++) {
    const o = 84 + i * 50;
    tris.push([
      [view.getFloat32(o+12,true), view.getFloat32(o+16,true), view.getFloat32(o+20,true)],
      [view.getFloat32(o+24,true), view.getFloat32(o+28,true), view.getFloat32(o+32,true)],
      [view.getFloat32(o+36,true), view.getFloat32(o+40,true), view.getFloat32(o+44,true)],
    ]);
  }
  return computeFromTriangles(tris);
}

function parseStlAscii(text: string): ParseResult {
  const verts: Vec3[] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('vertex ')) {
      const p = t.split(/\s+/);
      verts.push([parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])]);
    }
  }
  const tris: Vec3[][] = [];
  for (let i = 0; i+2 < verts.length; i += 3) tris.push([verts[i], verts[i+1], verts[i+2]]);
  return computeFromTriangles(tris);
}

function parseStl(buffer: ArrayBuffer): ParseResult {
  const text = new TextDecoder().decode(new Uint8Array(buffer, 0, Math.min(256, buffer.byteLength)));
  if (text.trimStart().startsWith('solid')) {
    const full = new TextDecoder().decode(buffer);
    if (full.includes('facet normal') && full.includes('vertex')) return parseStlAscii(full);
  }
  return parseStlBinary(buffer);
}

function parseObj(text: string): ParseResult {
  const verts: Vec3[] = [];
  const tris: Vec3[][] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('v ')) {
      const p = t.split(/\s+/);
      verts.push([parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3])]);
    } else if (t.startsWith('f ')) {
      const parts = t.split(/\s+/).slice(1);
      const idx = parts.map((p) => parseInt(p.split('/')[0]) - 1);
      for (let i = 1; i+1 < idx.length; i++) {
        const v0=verts[idx[0]], v1=verts[idx[i]], v2=verts[idx[i+1]];
        if (v0 && v1 && v2) tris.push([v0, v1, v2]);
      }
    }
  }
  return computeFromTriangles(tris);
}

async function parseFile(file: File): Promise<ParseResult | null> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'stl') return parseStl(await file.arrayBuffer());
  if (ext === 'obj') return parseObj(await file.text());
  return null; // DXF, SVG, PDF — accepted for review but not parseable client-side
}

// ── Component ────────────────────────────────────────────────────────────────

export function LaserQuoteCalculator() {
  const { addQuote } = useQuoteCart();

  const [file, setFile]             = useState<File | null>(null);
  const [parsed, setParsed]         = useState<ParseResult | null>(null);
  const [isNoParse, setIsNoParse]   = useState(false); // DXF/SVG/PDF
  const [parseError, setParseError] = useState('');
  const [dragging, setDragging]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [material, setMaterial]     = useState<LaserMaterial>('MildSteel');
  const [thickness, setThickness]   = useState<SheetThickness>(2);
  const [complexity, setComplexity] = useState<CutComplexity>('Medium');
  const [quantity, setQuantity]     = useState(1);

  const [showContact, setShowContact] = useState(false);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [addedToBasket, setAddedToBasket] = useState(false);

  const handleFile = useCallback(async (f: File) => {
    setParseError('');
    setParsed(null);
    setIsNoParse(false);
    setFile(f);
    setShowContact(false);
    setSubmitted(false);

    try {
      const result = await parseFile(f);
      if (result) {
        setParsed(result);
      } else {
        setIsNoParse(true); // DXF/SVG/PDF — dimensions reviewed manually
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

  const hasFile = !!file;
  const price = parsed
    ? calcLaserPrice(parsed.sheetW, parsed.sheetH, material, thickness, complexity, quantity)
    : null;
  const priceRange = price
    ? `€${(price * 0.85).toFixed(0)} – €${(price * 1.15).toFixed(0)}`
    : null;

  const specsText = [
    `LASER CUTTING QUOTE`,
    ``,
    `File: ${file?.name ?? ''}`,
    parsed ? `Sheet size: ${parsed.sheetW} × ${parsed.sheetH} mm (bounding box)` : '',
    `Material: ${MATERIAL_LABEL[material]}`,
    `Thickness: ${thickness} mm`,
    `Cut complexity: ${COMPLEXITY_LABEL[complexity]}`,
    `Quantity: ${quantity}`,
    priceRange ? `Estimated price: ${priceRange}` : 'Pricing on request (file review required)',
  ].filter(Boolean).join('\n');

  const handleAddToBasket = () => {
    if (!hasFile || (!parsed && !isNoParse)) return;
    addQuote({
      service: 'Laser Cutting',
      label: `${MATERIAL_LABEL[material]} · ${thickness}mm · ${complexity} · ×${quantity}`,
      specs: specsText,
      priceRange: priceRange ?? 'Pricing on request',
      fileName: file?.name,
      quantity,
    });
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !file) return;
    setSubmitting(true);
    setSubmitError('');

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('service', 'Laser Cutting');
    fd.append('message', specsText);
    fd.append('upload', file);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) { setSubmitted(true); }
      else { setSubmitError(data.error ?? 'Something went wrong.'); }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="quote-calc">
      <p className="quote-calc__sub">
        Upload your cut file for an instant estimate. Supported formats: STL, OBJ. Also accepts DXF, SVG, PDF for manual review.
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
          accept=".stl,.obj,.dxf,.svg,.pdf,.ai"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
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
            <p className="quote-calc__drop-hint">STL · OBJ · DXF · SVG · PDF</p>
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
              onClick={(e) => { e.stopPropagation(); setFile(null); setParsed(null); setIsNoParse(false); setShowContact(false); }}
              aria-label="Remove file"
            >×</button>
          </div>
        )}
      </div>

      {parseError && <p className="quote-calc__error">{parseError}</p>}

      {/* ── Parsed dims ── */}
      {parsed && (
        <div className="quote-calc__dims">
          <span className="quote-calc__dim-tag">{parsed.sheetW} × {parsed.sheetH} mm</span>
        </div>
      )}
      {isNoParse && (
        <div className="quote-calc__dims">
          <span className="quote-calc__dim-tag">{file?.name}</span>
          <span className="quote-calc__dim-tag quote-calc__dim-tag--muted">dimensions reviewed manually</span>
        </div>
      )}

      {/* ── Settings ── */}
      {hasFile && (
        <div className="quote-calc__settings">
          <label className="quote-calc__field">
            <span>Material</span>
            <select value={material} onChange={(e) => setMaterial(e.target.value as LaserMaterial)}>
              <option value="MildSteel">Mild Steel</option>
              <option value="StainlessSteel">Stainless Steel</option>
              <option value="Aluminium">Aluminium</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Brass">Brass</option>
            </select>
          </label>
          <label className="quote-calc__field">
            <span>Thickness</span>
            <select value={thickness} onChange={(e) => setThickness(Number(e.target.value) as SheetThickness)}>
              <option value={1}>1 mm</option>
              <option value={2}>2 mm</option>
              <option value={3}>3 mm</option>
              <option value={5}>5 mm</option>
              <option value={8}>8 mm</option>
              <option value={10}>10 mm</option>
            </select>
          </label>
          <label className="quote-calc__field">
            <span>Cut Complexity</span>
            <select value={complexity} onChange={(e) => setComplexity(e.target.value as CutComplexity)}>
              <option value="Simple">Simple (basic shapes)</option>
              <option value="Medium">Medium (mixed curves)</option>
              <option value="Complex">Complex (fine detail)</option>
            </select>
          </label>
          <label className="quote-calc__field">
            <span>Quantity</span>
            <div className="quote-calc__qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(500, q + 1))}>+</button>
            </div>
          </label>
        </div>
      )}

      {/* ── Price ── */}
      {(parsed || isNoParse) && (
        <div className="quote-calc__price-box">
          {priceRange ? (
            <>
              <p className="quote-calc__price-label">Estimated price</p>
              <p className="quote-calc__price">{priceRange}</p>
              <p className="quote-calc__price-note">Estimate only — confirmed after file review</p>
            </>
          ) : (
            <>
              <p className="quote-calc__price-label">Price on request</p>
              <p className="quote-calc__price-note">We&apos;ll review your file and send a quote</p>
            </>
          )}

          {!submitted ? (
            <div className="quote-calc__actions">
              <button
                className={`quote-calc__cta${addedToBasket ? ' quote-calc__cta--added' : ''}`}
                onClick={handleAddToBasket}
              >
                {addedToBasket ? '✓ Added to Basket' : 'Add to Basket'}
              </button>
              <button className="quote-calc__cta quote-calc__cta--outline" onClick={() => setShowContact((v) => !v)}>
                {showContact ? 'Cancel' : 'Send Quote Request'}
              </button>
            </div>
          ) : null}

          {showContact && !submitted && (
            <form className="quote-calc__contact" onSubmit={handleSubmit}>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {submitError && <p className="quote-calc__error">{submitError}</p>}
              <button type="submit" className="quote-calc__submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Request'}
              </button>
            </form>
          )}

          {submitted && (
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

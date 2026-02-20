"use client";

import { useState, useCallback, useRef } from 'react';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import './quote-calculator.css';

// ── Types ────────────────────────────────────────────────────────────────────

type CNCMaterial = 'Al6061' | 'Al7075' | 'StainlessSteel' | 'SteelAlloy' | 'CopperAlloy' | 'Plastic';
type Tolerance   = 'ISO2768' | 'PM010' | 'PM005';

const MATERIAL_LABEL: Record<CNCMaterial, string> = {
  Al6061:       'Aluminium 6061',
  Al7075:       'Aluminium 7075',
  StainlessSteel: 'Stainless Steel',
  SteelAlloy:   'Steel Alloy',
  CopperAlloy:  'Copper Alloy',
  Plastic:      'Plastic',
};

const TOLERANCE_LABEL: Record<Tolerance, string> = {
  ISO2768: 'ISO 2768 medium',
  PM010:   '±0.10 mm',
  PM005:   '±0.05 mm',
};

// ── Component ────────────────────────────────────────────────────────────────

export function CNCQuoteCalculator() {
  const { addQuote } = useQuoteCart();

  const [file, setFile]             = useState<File | null>(null);
  const [dragging, setDragging]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [material, setMaterial]   = useState<CNCMaterial>('Al6061');
  const [tolerance, setTolerance] = useState<Tolerance>('ISO2768');
  const [quantity, setQuantity]   = useState(1);

  const [showContact, setShowContact] = useState(false);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [addedToBasket, setAddedToBasket] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setShowContact(false);
    setSubmitted(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const hasFile = !!file;

  const specsText = [
    `CNC MACHINING QUOTE`,
    ``,
    `File: ${file?.name ?? ''}`,
    `Material: ${MATERIAL_LABEL[material]}`,
    `Tolerance: ${TOLERANCE_LABEL[tolerance]}`,
    `Quantity: ${quantity}`,
    `Pricing on request (file review required)`,
  ].join('\n');

  const handleAddToBasket = () => {
    if (!hasFile) return;
    addQuote({
      service: 'CNC Machining',
      label: `${MATERIAL_LABEL[material]} · ${TOLERANCE_LABEL[tolerance]} · ×${quantity}`,
      specs: specsText,
      priceRange: 'Pricing on request',
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
    fd.append('service', 'CNC Machining');
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
        Upload your STEP file to get a quote. We&apos;ll review your model and confirm pricing.
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
          accept=".step,.stp"
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
            <p className="quote-calc__drop-hint">STEP · STP</p>
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
              onClick={(e) => { e.stopPropagation(); setFile(null); setShowContact(false); }}
              aria-label="Remove file"
            >×</button>
          </div>
        )}
      </div>

      {/* ── Settings ── */}
      {hasFile && (
        <div className="quote-calc__settings">
          <label className="quote-calc__field">
            <span>Material</span>
            <select value={material} onChange={(e) => setMaterial(e.target.value as CNCMaterial)}>
              <option value="Al6061">Aluminium 6061</option>
              <option value="Al7075">Aluminium 7075</option>
              <option value="StainlessSteel">Stainless Steel</option>
              <option value="SteelAlloy">Steel Alloy</option>
              <option value="CopperAlloy">Copper Alloy</option>
              <option value="Plastic">Plastic</option>
            </select>
          </label>
          <label className="quote-calc__field">
            <span>Tolerance</span>
            <select value={tolerance} onChange={(e) => setTolerance(e.target.value as Tolerance)}>
              <option value="ISO2768">ISO 2768 medium</option>
              <option value="PM010">±0.10 mm</option>
              <option value="PM005">±0.05 mm</option>
            </select>
          </label>
          <label className="quote-calc__field">
            <span>Quantity</span>
            <div className="quote-calc__qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(100, q + 1))}>+</button>
            </div>
          </label>
        </div>
      )}

      {/* ── Price on request ── */}
      {hasFile && (
        <div className="quote-calc__price-box">
          <p className="quote-calc__price-label">Price on request</p>
          <p className="quote-calc__price-note">We&apos;ll review your file and send a confirmed quote</p>

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

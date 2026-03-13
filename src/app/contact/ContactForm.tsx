'use client';

import { useState, type FormEvent } from 'react';
import { submitContact } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

const services = ['General Inquiry', 'Electronics / PCB', 'Industrial Design', 'Firmware', 'Manufacturing', 'Other'];

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(services[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(undefined);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('service', service);
    formData.append('message', message);

    try {
      const res = await submitContact(formData);
      if (res.success) {
        setStatus('success');
        setName(''); setEmail(''); setMessage(''); setService(services[0]);
      } else {
        setStatus('error');
        setError(res.error);
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-service">Topic</label>
        <select id="contact-service" value={service} onChange={(e) => setService(e.target.value)}>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you need…"
          required
        />
      </div>

      <div className="contact-form__submit">
        <button type="submit" className="button button--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'success' && (
          <p className="contact-form__status contact-form__status--ok">Message sent! We'll get back to you within 24 hours.</p>
        )}
        {status === 'error' && (
          <p className="contact-form__status contact-form__status--error">{error || 'Submission failed. Please try again.'}</p>
        )}
      </div>
    </form>
  );
}

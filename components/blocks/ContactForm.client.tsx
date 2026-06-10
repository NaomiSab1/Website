'use client';

import { useState } from 'react';

export function ContactForm({
  interests,
  successMessage,
}: {
  interests: string[];
  successMessage: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState('sending');
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setState('done');
      form.reset();
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="form-success" role="status">{successMessage}</p>;
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      {/* Honeypot — bots fill it, humans never see it */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      <div className="frow">
        <label className="fg">
          <span className="fl">First name*</span>
          <input className="fi" type="text" name="first_name" required autoComplete="given-name" />
        </label>
        <label className="fg">
          <span className="fl">Last name*</span>
          <input className="fi" type="text" name="last_name" required autoComplete="family-name" />
        </label>
      </div>
      <label className="fg">
        <span className="fl">Email*</span>
        <input className="fi" type="email" name="email" required autoComplete="email" />
      </label>
      <label className="fg">
        <span className="fl">Phone</span>
        <input className="fi" type="tel" name="phone" autoComplete="tel" />
      </label>
      {interests.length > 0 && (
        <label className="fg">
          <span className="fl">Interest</span>
          <select className="fi" name="interest" defaultValue={interests[0]}>
            {interests.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="fg">
        <span className="fl">Message*</span>
        <textarea className="fi fta" name="message" rows={5} required />
      </label>
      <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Submit Enquiry'} <span aria-hidden>→</span>
      </button>
      {state === 'error' && (
        <p className="form-error" role="alert">
          Something went wrong — please try again or email us directly.
        </p>
      )}
    </form>
  );
}

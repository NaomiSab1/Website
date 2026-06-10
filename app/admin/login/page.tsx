'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import '../admin.css';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push(params.get('next') || '/admin');
    router.refresh();
  }

  return (
    <form className="login-card" onSubmit={onSubmit}>
      <h1>Sabdia Admin</h1>
      <p className="login-sub">Sign in to edit your website</p>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-wrap">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

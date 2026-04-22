'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🚀 PIN BYPASS: Use the simple 2115 password
    if (password === '2115') {
      // Set a simple cookie so the proxy knows we are in
      document.cookie = "admin_access_pin=2115; path=/; max-age=86400";
      setLoading(false);
      router.push('/admin');
      return;
    }

    // Give a slight delay to feel like it's checking
    setTimeout(() => {
      setError('Incorrect Admin Password');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container page-enter">
      <div className="login-card">
        <Link href="/" className="login-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">Dine<span className="gold-accent">Sync</span> <span style={{ fontSize: '0.6em', opacity: 0.7 }}>Secure</span></span>
        </Link>
        
        <h1 className="login-title">Admin Access</h1>
        <p className="login-subtitle">Enter the management PIN to continue.</p>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label" style={{ display: 'block', textAlign: 'center' }}>Management Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textAlign: 'center', fontSize: 'var(--text-2xl)', letterSpacing: 'var(--space-2)' }}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Unlock Dashboard'}
          </button>
        </form>

        <Link href="/" className="back-link">
          ← Back to Guest Site
        </Link>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          padding: var(--space-6);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--color-bg-elevated);
          padding: var(--space-10);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          text-align: center;
        }
        /* Rest of styles unchanged... */
        .login-logo { display: flex; align-items: center; justify-content: center; gap: var(--space-2); font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-8); }
        .login-title { font-family: var(--font-display); font-size: var(--text-2xl); margin-bottom: var(--space-2); }
        .login-subtitle { color: var(--color-text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-10); }
        .error-message { background: rgba(232, 93, 74, 0.1); color: #e85d4a; padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm); margin-bottom: var(--space-6); border: 1px solid rgba(232, 93, 74, 0.2); }
        .back-link { display: block; margin-top: var(--space-8); font-size: var(--text-sm); color: var(--color-text-muted); transition: color var(--transition-fast); }
        .back-link:hover { color: var(--color-primary); }
      `}</style>
    </div>
  );
}

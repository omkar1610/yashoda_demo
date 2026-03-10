import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { supabase } from '../../services/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const redirect = (router.query.redirect as string) || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(redirect);
  };

  return (
    <Layout title="Login – Hotel Yashoda">
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p>Login to manage your bookings</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button
              className="btn btn--primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <div className="divider">or</div>
          <Link
            href="/rooms"
            className="btn btn--outline"
            style={{ width: '100%', display: 'block', textAlign: 'center' }}
          >
            Continue as Guest
          </Link>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--color-primary)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

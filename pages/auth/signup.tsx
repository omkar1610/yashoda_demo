import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { supabase } from '../../services/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, name, email, role: 'user' });
    }
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <Layout title="Sign Up – Hotel Yashoda">
      <div className="auth-page">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p>Join us and manage your bookings easily</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>
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
                minLength={6}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button
              className="btn btn--primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Sign Up'}
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
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-primary)' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

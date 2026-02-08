import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const mapAuthError = (raw: string) => {
    const lower = raw.toLowerCase();
    if (lower.includes('email rate limit exceeded')) {
      return 'Too many signup emails were requested recently. Wait a few minutes, or sign in with an existing account.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Your account exists but email is not confirmed yet. Check inbox/spam, or ask admin to confirm for dev.';
    }
    return raw;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage('Account created. If email confirmation is enabled, check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMessage(mapAuthError((err as Error).message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-2">Welcome to Hingaa</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to use live activities, requests, and chat.</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          {isSignUp && (
            <input
              className="w-full bg-slate-900 border border-border-dark rounded-xl p-3 text-white"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            className="w-full bg-slate-900 border border-border-dark rounded-xl p-3 text-white"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full bg-slate-900 border border-border-dark rounded-xl p-3 text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button
            className="w-full bg-primary hover:bg-accent text-white rounded-xl py-3 font-bold disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {message && <p className="mt-4 text-xs text-slate-300">{message}</p>}

        <button
          className="mt-6 text-sm text-primary font-bold"
          onClick={() => setIsSignUp((v) => !v)}
          type="button"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
        <button
          className="mt-3 text-xs text-slate-400 hover:text-white"
          onClick={() => {
            setIsSignUp(false);
            setEmail('test1770544941985@proton.me');
            setPassword('TempPass123!');
            setMessage('Loaded demo account credentials for testing.');
          }}
          type="button"
        >
          Use demo account for testing
        </button>
      </div>
    </div>
  );
};

export default Auth;

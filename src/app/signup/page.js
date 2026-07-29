'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', { email, password });
      setSession(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-32 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-300 to-amber-300 opacity-30 blur-3xl" />
        <div className="animate-blob absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-300 to-emerald-300 opacity-30 blur-3xl [animation-delay:8s]" />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-fuchsia-200/50 p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-fuchsia-200">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            AI Content Studio
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
        <p className="text-slate-500 text-sm mb-6">Get started for free</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">At least 8 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none transition-all"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:brightness-110 disabled:from-slate-300 disabled:to-slate-300 disabled:brightness-100 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-200 transition-all transform active:scale-95"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-fuchsia-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

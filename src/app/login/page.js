'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setSession(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-32 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-300 to-fuchsia-300 opacity-30 blur-3xl" />
        <div className="animate-blob absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-sky-300 to-emerald-300 opacity-30 blur-3xl [animation-delay:8s]" />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-indigo-200/50 p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-fuchsia-200">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            AI Content Studio
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-6">Log in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:brightness-110 disabled:from-slate-300 disabled:to-slate-300 disabled:brightness-100 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

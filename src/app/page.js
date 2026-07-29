'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ClipboardDocumentIcon, SparklesIcon, CheckIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { getToken, getUser, clearSession } from '@/lib/auth';

const categories = [
  {
    id: 'blogging',
    label: 'Blogging',
    gradient: 'from-rose-500 to-red-600',
    active: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 shadow-sm',
    ring: 'focus:ring-rose-100 focus:border-rose-400',
    text: 'text-rose-600',
    shadow: 'shadow-rose-200',
  },
  {
    id: 'website-seo',
    label: 'Website & SEO',
    gradient: 'from-violet-500 to-purple-600',
    active: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200 shadow-sm',
    ring: 'focus:ring-violet-100 focus:border-violet-400',
    text: 'text-violet-600',
    shadow: 'shadow-violet-200',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    gradient: 'from-fuchsia-500 to-pink-600',
    active: 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200 shadow-sm',
    ring: 'focus:ring-fuchsia-100 focus:border-fuchsia-400',
    text: 'text-fuchsia-600',
    shadow: 'shadow-fuchsia-200',
  },
  {
    id: 'social-ads',
    label: 'Social & Ads',
    gradient: 'from-sky-500 to-blue-600',
    active: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200 shadow-sm',
    ring: 'focus:ring-sky-100 focus:border-sky-400',
    text: 'text-sky-600',
    shadow: 'shadow-sky-200',
  },
  {
    id: 'email',
    label: 'Email',
    gradient: 'from-teal-500 to-cyan-600',
    active: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200 shadow-sm',
    ring: 'focus:ring-teal-100 focus:border-teal-400',
    text: 'text-teal-600',
    shadow: 'shadow-teal-200',
  },
  {
    id: 'misc',
    label: 'More Tools',
    gradient: 'from-amber-400 to-orange-500',
    active: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 shadow-sm',
    ring: 'focus:ring-amber-100 focus:border-amber-400',
    text: 'text-amber-600',
    shadow: 'shadow-amber-200',
  },
];

const menuItems = [
  // Blogging
  { id: 'blog-title', category: 'blogging', label: 'Blog Title', icon: '🔤', endpoint: '/api/generate/blog-title' },
  { id: 'blog-outline', category: 'blogging', label: 'Blog Outline', icon: '🗂️', endpoint: '/api/generate/blog-outline' },
  { id: 'blog-intro', category: 'blogging', label: 'Blog Intro', icon: '✍️', endpoint: '/api/generate/blog-intro' },
  { id: 'blog-conclusion', category: 'blogging', label: 'Blog Conclusion', icon: '🏁', endpoint: '/api/generate/blog-conclusion' },
  // Website & SEO
  { id: 'about-us', category: 'website-seo', label: 'About Us', icon: '🏢', endpoint: '/api/generate/about-us' },
  { id: 'seo', category: 'website-seo', label: 'SEO Metadata', icon: '🔍', endpoint: '/api/generate/seo' },
  { id: 'headline', category: 'website-seo', label: 'Hero Headline', icon: '💥', endpoint: '/api/generate/headline' },
  { id: 'faq', category: 'website-seo', label: 'FAQ', icon: '❓', endpoint: '/api/generate/faq' },
  // E-commerce
  { id: 'description', category: 'ecommerce', label: 'Product Description', icon: '📝', endpoint: '/api/generate/description' },
  { id: 'short-desc', category: 'ecommerce', label: 'Short Description', icon: '⚡', endpoint: '/api/generate/short-description' },
  { id: 'specs', category: 'ecommerce', label: 'Technical Specs', icon: '🛠️', endpoint: '/api/generate/specs' },
  { id: 'product-name', category: 'ecommerce', label: 'Product Name', icon: '🏷️', endpoint: '/api/generate/product-name' },
  // Social & Ads
  { id: 'ad-copy', category: 'social-ads', label: 'Ad Copy', icon: '📣', endpoint: '/api/generate/ad-copy' },
  { id: 'social-caption', category: 'social-ads', label: 'Social Caption', icon: '📱', endpoint: '/api/generate/social-caption' },
  { id: 'youtube-description', category: 'social-ads', label: 'YouTube Description', icon: '▶️', endpoint: '/api/generate/youtube-description' },
  { id: 'google-ads', category: 'social-ads', label: 'Google Ads', icon: '🎯', endpoint: '/api/generate/google-ads' },
  // Email
  { id: 'email-subject', category: 'email', label: 'Email Subject Lines', icon: '✉️', endpoint: '/api/generate/email-subject' },
  { id: 'email-body', category: 'email', label: 'Marketing Email', icon: '📧', endpoint: '/api/generate/email-body' },
  // More Tools
  { id: 'quora-answer', category: 'misc', label: 'Quora Answer', icon: '💬', endpoint: '/api/generate/quora-answer' },
  { id: 'video-script', category: 'misc', label: 'Video Script', icon: '🎬', endpoint: '/api/generate/video-script' },
  { id: 'press-release', category: 'misc', label: 'Press Release', icon: '📰', endpoint: '/api/generate/press-release' },
  { id: 'bio', category: 'misc', label: 'Professional Bio', icon: '👤', endpoint: '/api/generate/bio' },
  { id: 'tagline', category: 'misc', label: 'Tagline / Slogan', icon: '✨', endpoint: '/api/generate/tagline' },
  { id: 'review-reply', category: 'misc', label: 'Review Reply', icon: '⭐', endpoint: '/api/generate/review-reply' },
];

const categoryOf = (item) => categories.find((c) => c.id === item.category);

export default function AIApp() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(menuItems.find((m) => m.id === 'about-us'));
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeStyle = categoryOf(activeTab);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
    setCheckingAuth(false);
  }, [router]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const { data } = await api.post(activeTab.endpoint, { prompt });
      setResult(data.data);
    } catch (error) {
      setResult("### ⚠️ Error\nCould not connect to the backend. Please ensure your Node.js server is running on port 5000.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-32 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-300 to-fuchsia-300 opacity-30 blur-3xl" />
        <div className="animate-blob absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-300 to-emerald-300 opacity-30 blur-3xl [animation-delay:6s]" />
        <div className="animate-blob absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-amber-300 to-rose-300 opacity-30 blur-3xl [animation-delay:12s]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-72 bg-white/70 backdrop-blur-xl border-r border-white/60 p-6 flex flex-col shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-fuchsia-200">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            AI Content Studio
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto pr-1 -mr-1 flex flex-col gap-1">
          {categories.map((category) => (
            <div key={category.id}>
              <p className="px-3 pt-4 pb-1 first:pt-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {category.label}
              </p>
              {menuItems
                .filter((item) => item.category === category.id)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item); setResult(''); setPrompt(''); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab.id === item.id
                        ? category.active
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} text-sm shadow-sm`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-3 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            Log out{user?.email ? ` (${user.email})` : ''}
          </button>
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-fuchsia-50 ring-1 ring-indigo-100 rounded-2xl text-xs text-slate-500 italic">
            Powered by Gemini 2.0 & OpenRouter
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Drafting:{' '}
            <span className={`bg-gradient-to-r ${activeStyle.gradient} bg-clip-text text-transparent font-bold`}>
              {activeTab.label}
            </span>
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {/* Input Section */}
          <section className="max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">What are we creating?</h3>
                <p className="text-slate-500 mt-1">Provide details about your project or product below.</p>
              </div>
            </div>

            <div className="relative group">
              <textarea
                className={`w-full h-44 p-5 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm focus:ring-4 outline-none transition-all resize-none text-lg leading-relaxed ${activeStyle.ring}`}
                placeholder={`Describe your product for the ${activeTab.label.toLowerCase()}...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className={`absolute bottom-4 right-4 px-6 py-2.5 bg-gradient-to-r ${activeStyle.gradient} hover:brightness-110 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl font-bold shadow-lg ${activeStyle.shadow} transition-all transform active:scale-95 flex items-center gap-2`}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Working...</>
                ) : (
                  <><SparklesIcon className="w-4 h-4 text-white/80" /> Generate</>
                )}
              </button>
            </div>
          </section>

          {/* Output Section */}
          {result && (
            <section className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className={`h-1.5 w-full bg-gradient-to-r ${activeStyle.gradient}`} />
                <div className="border-b border-slate-100 px-8 py-4 bg-slate-50/50 flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase tracking-tighter ${activeStyle.text}`}>Generated Result</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition"
                  >
                    {copied ? <><CheckIcon className="w-3 h-3"/> Copied!</> : <><ClipboardDocumentIcon className="w-3 h-3"/> Copy Text</>}
                  </button>
                </div>
                <div className="p-10 prose prose-slate max-w-none text-slate-700 leading-loose">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';
import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ClipboardDocumentIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline'; // Optional: Install @heroicons/react

const menuItems = [
  { id: 'about-us', label: 'About Us', icon: '🏢', endpoint: '/api/generate/about-us' },
  { id: 'description', label: 'Product Description', icon: '📝', endpoint: '/api/generate/description' },
  { id: 'short-desc', label: 'Short Description', icon: '⚡', endpoint: '/api/generate/short-description' },
  { id: 'specs', label: 'Technical Specs', icon: '🛠️', endpoint: '/api/generate/specs' },
  { id: 'seo', label: 'SEO Metadata', icon: '🔍', endpoint: '/api/generate/seo' },
  { id: 'blog', label: 'Blog Intro', icon: '✍️', endpoint: '/api/generate/blog-intro' },
];

export default function AIApp() {
  const [activeTab, setActiveTab] = useState(menuItems[0]);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const { data } = await axios.post(`https://ai-apis.mart4trade.com${activeTab.endpoint}`, { prompt });
      setResult(data.data);
    } catch (error) {
      setResult("### ⚠️ Error\nCould not connect to the backend. Please ensure your Node.js server is running on port 5000.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AI Content Studio</h1>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item); setResult(''); setPrompt(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab.id === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto p-4 bg-slate-100 rounded-2xl text-xs text-slate-500 italic">
          Powered by Gemini 2.0 & OpenRouter
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Drafting: <span className="text-indigo-600">{activeTab.label}</span>
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
                className="w-full h-44 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none text-lg leading-relaxed"
                placeholder={`Describe your product for the ${activeTab.label.toLowerCase()}...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="absolute bottom-4 right-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Working...</>
                ) : (
                  <><SparklesIcon className="w-4 h-4 text-indigo-200" /> Generate</>
                )}
              </button>
            </div>
          </section>

          {/* Output Section */}
          {result && (
            <section className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="border-b border-slate-100 px-8 py-4 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Generated Result</span>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition"
                  >
                    {copied ? <><CheckIcon className="w-3 h-3"/> Copied!</> : <><ClipboardDocumentIcon className="w-3 h-3"/> Copy Text</>}
                  </button>
                </div>
                <div className="p-10 prose prose-indigo max-w-none text-slate-700 leading-loose">
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
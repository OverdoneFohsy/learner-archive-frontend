'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';

export default function NewChatPage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // In a real app, you might call a Server Action here to 
    // create a new chat record in Postgres and get an ID back.
    const mockChatId = Math.random().toString(36).substring(7);
    
    // Redirect to the dynamic chat route with the message as a query param
    // or pass it via state/context.
    router.push(`/conversation/${mockChatId}?firstMsg=${encodeURIComponent(input)}`);
  };

  const suggestions = [
    "Summarize the React Hook video",
    "What are the key takeaways from my PDF?",
    "Explain the architecture of FastAPI",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center no-scrollbar">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 animate-in fade-in zoom-in duration-500">
          <Sparkles className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          What are we learning today?
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          Ask anything about your archived videos and documents. Your AI Researcher is ready.
        </p>
      </div>

      {/* Primary Input */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleInitialSubmit} className="relative group">
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search your knowledge..."
            className="w-full p-6 pr-16 rounded-[32px] bg-white border-2 border-slate-100 shadow-2xl shadow-slate-200/50 outline-none focus:border-blue-500 transition-all text-lg text-slate-800"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 p-4 bg-slate-900 text-white rounded-[24px] hover:bg-blue-600 transition-all active:scale-95 group-focus-within:bg-blue-600"
          >
            <ArrowRight size={24} />
          </button>
        </form>

        {/* Suggestion Chips
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {suggestions.map((text, i) => (
            <button
              key={i}
              onClick={() => setInput(text)}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-2"
            >
              <Lightbulb size={14} className="text-amber-400" />
              {text}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
}
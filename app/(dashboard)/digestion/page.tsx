'use client'

import { useState, useActionState, useRef } from 'react'
import { Youtube, FileText, UploadCloud, Loader2, X, CheckCircle2 } from 'lucide-react'
import { digestVideoAction, digestPdfAction } from './actions'
import {toast} from 'sonner'

export default function DigestionPage() {
  const [activeTab, setActiveTab] = useState<'video' | 'pdf'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const videoFormRef = useRef<HTMLFormElement>(null);
  const pdfFormRef = useRef<HTMLFormElement>(null);

  const onVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await digestVideoAction(null, formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Video is being digested!");
        videoFormRef.current?.reset();
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const onPdfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await digestPdfAction(null, formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "PDF uploaded successfully!");
        setSelectedFile(null);
        pdfFormRef.current?.reset();
      }
    } catch (err) {
      toast.error("Failed to upload PDF.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Digestion Lab</h1>
        <p className="text-slate-500 mt-2">Feed your archive with new knowledge sources.</p>
      </header>

      {/* Source Switcher */}
      <div className="flex justify-center lg:justify-start gap-2 p-1.5 bg-slate-200/50 w-fit rounded-2xl mb-8">
        <button    
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Youtube size={18} /> YouTube
        </button>
        <button 
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pdf' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FileText size={18} /> PDF File
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        {activeTab === 'video' ? (
          <form ref={videoFormRef} onSubmit={onVideoSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">YouTube Video ID</label>
              <input 
                name="videoId"
                required
                placeholder="e.g., dQw4w9WgXcQ"
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Digest Video'}
            </button>
          </form>
        ) : (
          <form ref={pdfFormRef} onSubmit={onPdfSubmit} className="space-y-6">
            <div className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-slate-50 transition-all overflow-hidden">
              <input 
                type="file" 
                name="file"
                accept=".pdf"
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 ${selectedFile || isPending ? 'pointer-events-none' : ''}`}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />

              {!selectedFile ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <p className="font-bold text-slate-700">Click or drag PDF here</p>
                  <p className="text-sm text-slate-400 mt-1">Maximum 10MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-bold text-slate-800 truncate max-w-xs">{selectedFile.name}</p>
                  {!isPending && (
                    <button 
                      type="button"
                      onClick={() => setSelectedFile(null)} 
                      className="relative z-20 mt-4 text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <X size={14} /> Remove file
                    </button>
                  )}
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isPending || !selectedFile}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Upload & Process PDF'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
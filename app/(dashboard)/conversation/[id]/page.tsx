'use client'

import { useState, useRef, useEffect, use } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { sendMessageAction, logToTerminal, getChatHistoryAction } from '../action';
import { useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from "sonner"

type Message = {
  role: 'user' | 'assistant',
  content: string
}
export default function ChatPage({ params }: { params: Promise<{id: string }> }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessedFirstMsg = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const firstMsg = searchParams.get('firstMsg');

  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;

  useEffect(()=>{

    const loadHistory = async () =>{
      //setMessages([]);
      setIsInitialLoading(true);
      const data = await getChatHistoryAction(sessionId);

      if (data && data.history && data.history.length>0){
        const mappedMessages = data.history.map((msg:any)=>({
          role: msg.role,
          content: msg.content
        }));
        mappedMessages.map((msg:any)=> logToTerminal(`mappedMessages: ${msg.content}`));
        setMessages(mappedMessages);
      }

      setIsInitialLoading(false);
    }

    loadHistory();
    
  }, [sessionId]);

  useEffect(() => {
    if (!firstMsg || isInitialLoading || hasProcessedFirstMsg.current || messages.length > 0) {
      return;
    }
    // if (firstMsg && !hasProcessedFirstMsg.current && !isInitialLoading && messages.length === 0) {
    //   hasProcessedFirstMsg.current = true;
    //   handleSendMessage(undefined, firstMsg);
    // }
    hasProcessedFirstMsg.current = true;

    handleSendMessage(undefined, firstMsg);
  }, [firstMsg, sessionId, isInitialLoading]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, manualInput?: string) => {
    e?.preventDefault();
  
    const messageContent = manualInput || input;
    if (!messageContent.trim() || isLoading) return;
  
    // 1. Snapshot for rollback
    const savedInput = messageContent;
    const tempId = Date.now(); // We use a timestamp to track this specific optimistic message
  
    // 2. Optimistic Update
    setMessages((prev) => [...prev, { role: 'user', content: messageContent, id: tempId } as any]);
    if (!manualInput) setInput('');
    setIsLoading(true);
  
    try {
      const response = await sendMessageAction(sessionId, messageContent);
  
      // 3. Check for the exception/error from your Server Action
      if (response.error) {
        // ROLLBACK LOGIC
        // Put the text back if it wasn't a "manual" hint click
        if (!manualInput) setInput(savedInput);
  
        // Filter out the optimistic message so it disappears from the chat
        setMessages((prev) => prev.filter((msg: any) => msg.id !== tempId));
  
        // Show the Sonner toast
        toast.warning("Message not sent", {
          description: response.error.includes("quota") 
            ? "AI limit reached. Your message has been restored." 
            : response.error,
          duration: 5000,
        });
      } 
      else if (response.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.content }]);
      }
    } catch (err: any) {
      // Handle unexpected network crashes
      logToTerminal(`Error message: ${err.message}`);
      setInput(savedInput);
      setMessages((prev) => prev.filter((msg: any) => msg.id !== tempId));
      toast.error("Message failed", {
        description: err.message,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (messages.length === 0 && !isLoading){
    return (<div className="h-full w-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-700">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
        <Sparkles size={32} />
      </div>
      <div className="max-w-sm space-y-2">
        <h2 className="text-xl font-semibold text-slate-800">
          Analyze your YouTube Archive
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Ask questions about your uploaded videos, transcripts, or specific 
          moments in your history.
        </p>
      </div>
      
      {/* <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Summarize my last video', 'Find mentions of React'].map((hint) => (
          <button
            key={hint}
            onClick={() => handleSendMessage(undefined, hint)}
            className="px-4 py-2 border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            "{hint}"
          </button>
        ))}
      </div> */}
    </div>)
  }
  else return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] min-w-0 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-[24px] min-w-0 flex-1 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                <div className={`prose prose-sm max-w-none 
                ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-slate'} 
                prose-p:leading-relaxed prose-p:text-inherit 
                prose-li:my-0 prose-ul:list-disc prose-ul:ml-4`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
              </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- NEW LOADING DIALOG --- */}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="flex gap-3 max-w-[80%] flex-row">
              {/* Assistant Icon */}
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-slate-600" />
              </div>
              
              {/* Animated Loading Bubble */}
              <div className="p-4 rounded-[24px] rounded-tl-none bg-white border border-slate-200 shadow-sm">
                <div className="flex gap-1.5 items-center h-5 px-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-2 px-4">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSendMessage}
            className="relative bg-white border border-slate-200 rounded-[28px] shadow-lg p-2 flex items-center gap-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask your archive anything..."
              className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none px-4 py-3 text-slate-700 placeholder:text-slate-400 min-h-[52px] max-h-[200px]"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-300 disabled:scale-100"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
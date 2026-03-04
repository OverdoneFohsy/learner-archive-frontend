import Link from 'next/link';
import { LayoutDashboard, MessageSquare, Settings, LogOut, PlusCircle, Plus } from 'lucide-react';
import { getSessionsAction } from './action';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const sessions = await getSessionsAction();
  console.log( `sessions: ${sessions}`)
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 tracking-tight">Learner's Archive</h2>
        </div>

        {/* Action Button: New Conversation */}
        <div className="px-4 mb-4">
          <Link 
            href="/conversation" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <Link href="/digestion" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
            <PlusCircle size={20} />
            <span className="font-medium">New Digestion</span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">          
          <div className="py-4">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Chats</p>
            {sessions.map((session:any) => (
            <Link 
            key={session.id}
            href={`/conversation/${session.id}`} 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors group"
          >
            <MessageSquare size={18} className="shrink-0 group-hover:text-blue-600" />
            <span className="text-sm truncate font-medium">
              {session.title || 'Untitled Chat'}
            </span>
          </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Section: Settings & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
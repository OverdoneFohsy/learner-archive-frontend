'use client'
import { deleteSessionAction } from "@/app/(dashboard)/action";
import {MessageSquare, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function SidebarNav({sessions}:{sessions:any[]}){
    const router = useRouter();
    const pathname = usePathname();

    async function handleDeleteSession(sessionId: string) {

        const result = await deleteSessionAction(sessionId);
    
        try{
          if (result.success){
            const isCurrentPage = pathname.includes(sessionId);
            alert("The conversation is deleted successfully");
            if (isCurrentPage) router.push("/conversation");
            else router.refresh();
          }
          else{
            console.error("Delete failed: ", result.error);
            alert(`Error: ${result.error}` || "Failed to delete the session");
          } 
        }
        catch(error){
          console.error("An unexpected error occured: ", error);
            alert(`Error: ${error}` || "An error occured while trying to delete the session. ");
        }
      }
      
    return (
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">          
          <div className="py-4">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Chats</p>
            {sessions.map((session:any) => (
            <div key={session.id} className="flex items-center gap-1">
            {/* 1. The Link takes up all available space */}
            <Link 
              href={`/conversation/${session.id}`} 
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors truncate ${
                pathname.includes(session.id) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquare size={18} className="shrink-0" />
              <span className="text-sm truncate font-medium">
                {session.title || 'Untitled Chat'}
              </span>
            </Link>
          
            {/* 2. The Button just sits next to it in the row */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) handleDeleteSession(session.id);
              }}
              className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
            ))}
          </div>
        </nav>
    )
}
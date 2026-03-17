'use client'
import { useState } from "react";
import { deleteSessionAction } from "@/app/(dashboard)/action";
import { LogOut, MessageSquare, Plus, PlusCircle, Trash2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

// Added isMobile prop to the interface
export default function SidebarNav({ sessions, isMobile = false }: { sessions: any[], isMobile?: boolean }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const collapsed = isMobile ? false : isCollapsed;

    async function handleDeleteSession(sessionId: string) {
        if (!confirm("Are you sure you want to delete this conversation?")) return;
        const result = await deleteSessionAction(sessionId);
        try {
            if (result.success) {
                const isCurrentPage = pathname.includes(sessionId);
                if (isCurrentPage) router.push("/conversation");
                else router.refresh();
            }
        } catch (error) {
            console.error("An unexpected error occured: ", error);
        }
    }

    return (
        <div 
            className={`transition-all duration-300 ease-in-out flex flex-col h-full bg-white 
            ${!isMobile ? 'h-full border-r border-slate-200' : ''} 
            ${collapsed ? 'w-[80px]' : 'w-[280px]'}`}
        >
            {/* Toggle Header */}
            <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <h2 className="text-xl font-bold text-blue-600 truncate">Learner Archive</h2>}
                
                {/* Only show the toggle button if we are NOT on mobile */}
                {!isMobile && (
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                    >
                        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-3 mb-4 space-y-2">
                <Link 
                    href="/conversation" 
                    title="New Chat"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    {!collapsed && <span className="truncate">New Chat</span>}
                </Link>

                <Link href="/digestion" title="New Digestion" className="flex items-center justify-center gap-3 px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">
                    <PlusCircle size={20} className="shrink-0" />
                    {!collapsed && <span className="font-medium truncate flex-1">New Digestion</span>}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
                {!collapsed && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recent</p>}
                {sessions.map((session: any) => (
                    <div key={session.id} className="flex items-center group">
                        <Link 
                            href={`/conversation/${session.id}`} 
                            title={session.title}
                            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors truncate ${
                                pathname.includes(session.id) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <MessageSquare size={18} className="shrink-0" />
                            {!collapsed && <span className="text-sm truncate font-medium">{session.title || 'Untitled Chat'}</span>}
                        </Link>
            
                        {!collapsed && (
                            <button
                                onClick={(e) => { e.preventDefault(); handleDeleteSession(session.id); }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100">
                <button title="Logout" className="w-full flex items-center justify-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium truncate">Logout</span>}
                </button>
            </div>
        </div>
    );
}
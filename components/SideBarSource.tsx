'use client'
import { useState } from "react";
import { LayoutDashboard, Loader2, PanelRightClose, PanelRightOpen, Trash2 } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
  } from "@/components/ui/dialog";
import { FileText, Youtube, ExternalLink } from "lucide-react";
import { toast } from "sonner"
import { deleteSourceAction } from "@/app/(dashboard)/action";

export default function SidebarSource({ 
    sources, 
    isMobile = false 
}: { 
    sources: any[], 
    isMobile?: boolean 
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [localSources, setLocalSources] = useState(sources);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    // const [selectedSource, setSelectedSource] = useState<any | null>(null);
    // Force expanded view if it's the mobile drawer
    const collapsed = isMobile ? false : isCollapsed;

    const handleDelete = async (e: React.MouseEvent, sourceId: string, sourceName: string) => {
        e.stopPropagation(); // Stop the card's onClick from firing
    
        // Native Browser Confirmation
        const hasConfirmed = window.confirm(
            `Are you sure you want to delete "${sourceName}"? This will remove it from the AI's memory.`
        );
    
        if (!hasConfirmed) return;
    
        // 1. Snapshot for Rollback
        const previousSources = [...localSources];
    
        // 2. Optimistic Update
        setLocalSources((prev) => prev.filter(s => s.id !== sourceId));
        setDeletingId(sourceId);
    
        try {
            const result = await deleteSourceAction(sourceId);
            
            if (result?.error) {
                throw new Error(result.error);
            }
            
            toast.success("Source deleted");
        } catch (err: any) {
            // 3. Rollback on failure
            setLocalSources(previousSources);
            toast.error("Delete failed", {
                description: err.message
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div 
            className={`transition-all duration-300 ease-in-out flex flex-col h-full bg-slate-50 overflow-hidden flex-none
            ${!isMobile ? 'h-full border-l border-slate-200' : ''}
            ${collapsed ? 'w-[80px]' : 'w-[320px]'}`}
        >
            {/* Header */}
            <div className={`p-4 border-b border-slate-200 bg-white flex items-center shrink-0 ${collapsed ? 'justify-center' : 'justify-start gap-3'}`}>
                {/* Only show the toggle button if we are NOT on mobile */}
                {!isMobile && (
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 shrink-0"
                    >
                        {collapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
                    </button>
                )}
                
                {!collapsed && (
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 truncate whitespace-nowrap">
                        <LayoutDashboard size={18} className="text-blue-600 shrink-0" />
                        Ingestion Sources
                    </h3>
                )}
            </div>

            {/* List Content */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar transition-opacity duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                {sources && sources.length > 0 ? (
                    sources.map((source: any) => (
                        <div 
                            key={source.id} 
                            className="group p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-semibold text-slate-700 line-clamp-2 flex-1">
                                    {source.display_name || 'Untitled Source'}
                                </p>
                                
                                {!collapsed && (
                                    <button
                                        onClick={(e) => handleDelete(e, source.source_id, source.display_name)}
                                        disabled={deletingId === source.id}
                                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                    >
                                        {deletingId === source.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Bottom Row: Metadata and External Link */}
                            {!collapsed && (
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                        source.source_type === 'video' 
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                                    }`}>
                                        {source.source_type === 'video' ? <Youtube size={10} /> : <FileText size={10} />}
                                        {source.source_type === 'video' ? 'YouTube Transcript' : (source.source_type || 'Document')}
                                    </span>
                                    {/* <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        {!collapsed && <p className="text-sm text-slate-400">No sources found.</p>}
                    </div>
                )}
            </div>

            {/* --- SOURCE DETAIL DIALOG --- */}
            {/* <Dialog open={!!selectedSource} onOpenChange={(open) => !open && setSelectedSource(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden dark:bg-slate-950">
                    <DialogHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            {selectedSource?.source_type === 'video' ? <Youtube size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold leading-tight">
                                {selectedSource?.display_name || 'Source Detail'}
                            </DialogTitle>
                            <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                Source Type: {selectedSource?.source_type || 'General'}
                            </DialogDescription>
                        </div>
                    </div>
                    </DialogHeader>

                    
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-transparent">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transcript / Content</h4>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                                    {selectedSource?.transcript || selectedSource?.content || "No transcript content available for this source."}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}
import { getSessionsAction, getSources } from './action';
import SidebarNav from '@/components/SideBarNav';
import SidebarSource from '@/components/SideBarSource';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessions = await getSessionsAction();
  const sources = await getSources();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 relative">
      
      {/* --- LEFT SIDEBAR --- */}
      {/* Desktop: Always visible above 1280px */}
      <div className="hidden xl:flex h-full">
        <SidebarNav sessions={sessions} />
      </div>
      
      {/* Mobile/Tablet: Drawer via Shadcn Sheet */}
      <div className="xl:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50">
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-none">
            <SidebarNav sessions={sessions} isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-white relative z-10">
        {children}
      </main>

      {/* --- RIGHT SIDEBAR --- */}
      {/* Desktop: Always visible above 1280px */}
      <div className="hidden xl:flex h-full">
        <SidebarSource sources={sources} />
      </div>

      {/* Mobile/Tablet: Drawer via Shadcn Sheet */}
      <div className="xl:hidden fixed top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50">
              <LayoutDashboard size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[320px] border-none">
            <SidebarSource sources={sources} isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>
      
    </div>
  );
}
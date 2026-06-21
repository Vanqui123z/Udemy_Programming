"use client";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd/dist/core/DndProvider";
import { Toaster } from "sonner";
import { ParentSidebar, navItems } from "@/components/parent/layout/sidebar/ParentSidebar";
import ParentHeader from "@/components/parent/layout/header/ParentHeader";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { COLORS } from "../../../styles/constant/constantColor";
import { useMarkStore } from "@/store/store";


export default function ParentLayout({ children }: { children: React.ReactNode }) {
    const {getUnreadCount} = useMarkStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const currentLabel = navItems.find(item => item.href === pathname)?.label || '';
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen">
                <div className="flex flex-col flex-1">
                        <main className="flex h-full overflow-hidden" style={{ background: COLORS.BG }}>
                            <ParentSidebar  sidebarOpen={sidebarOpen} pathname={pathname} />
                            {/* Main content */}
                            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-full ">
                                {/* Header */}
                                <ParentHeader  pathname={pathname} currentLabel={currentLabel} getUnreadCount={getUnreadCount} sidebarOpen={sidebarOpen}
                                    setSidebarOpen={setSidebarOpen} />
                                {children}
                            </div>
                        </main>
                        <Toaster richColors />
                </div>

            </div>
        </DndProvider>

    );
}



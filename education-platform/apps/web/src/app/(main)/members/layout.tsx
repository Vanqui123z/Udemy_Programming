"use client"

import HeaderChild from '@/components/members/layout/header/headerChild';
import BottomNavChild from '@/components/members/layout/navbar/BottomNav';
import {useApp} from  "@/context/AppContext"

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  const {isTaskDetail} = useApp()

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto relative w-screen " style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <HeaderChild isTaskDetail={isTaskDetail} />

      <div className="flex-1 flex flex-col overflow-hidden">
      {children }
      </div>

      {/* Bottom nav */}
      <BottomNavChild  />
    </div>
  );
}

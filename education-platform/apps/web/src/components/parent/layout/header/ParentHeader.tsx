import { Bell, ChevronRight, Menu } from 'lucide-react';
import { COLORS } from '../../../../styles/constant/constantColor';
import { useRouter } from 'next/navigation';
import { useMemberStore } from '@/store/store';
import { useMembers } from '@/hooks/queries/useMembers';

type ParentNavbarProps = {
    pathname: string;
    currentLabel: string;
    getUnreadCount:  number;
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ParentHeader({ pathname,  currentLabel, getUnreadCount, sidebarOpen, setSidebarOpen }: ParentNavbarProps) {
    const {selectedMember} = useMemberStore();
    
    const router = useRouter()
    return (
        <>
            <header className="h-14 flex items-center px-4 gap-3 shrink-0" style={{ background: '#FFFFFF', borderBottom: `1px solid ${COLORS.BORDER}` }}>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-xl transition-colors" style={{ color: COLORS.MUTED }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F5F4'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <Menu className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-sm" style={{ color: COLORS.MUTED }}>
                    {selectedMember ? (
                        <>
                            <button onClick={() => { router.push('/parent/dashboard/members'); }} className="transition-colors" style={{ color: COLORS.MUTED }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.TEXT)} onMouseLeave={e => (e.currentTarget.style.color = COLORS.MUTED)}>Thành viên</button>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span style={{ color: COLORS.TEXT, fontWeight: 700 }}>{selectedMember.name}</span>
                            {pathname !== '/parent/dashboard/members' && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                    <span style={{ color: COLORS.TEXT, fontWeight: 700 }}>{currentLabel}</span>
                                </>
                            )}
                        </>
                    ) : (
                        <span style={{ color: COLORS.TEXT, fontWeight: 700 }}>{currentLabel}</span>
                    )}
                </div>

                <div className="ml-auto">
                    <button onClick={() => router.push('/parent/dashboard/notifications')} className="relative p-2 rounded-xl transition-colors" style={{ color: COLORS.MUTED }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F5F4'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <Bell className="w-4 h-4" />
                        {getUnreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex items-center justify-center rounded-full text-white font-bold" style={{ width: 14, height: 14, fontSize: 9, background: '#EF4444' }}>
                                {getUnreadCount > 9 ? '9+' : getUnreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>
        </>
    )

}

import { Bell, CheckSquare, } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
const { PEACH_DARK, BORDER ,PEACH_BG} = COLORS;
import { useRouter,usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';


export default function BottomNavChild() {
    const {  getUnreadCount, members } = useApp();
    const member = members[0] as any;
    const unread = getUnreadCount('member', member.id);
    const router = useRouter();
    const pathname = usePathname();
    
    const tabs = [
        {id: 'tasks', href: "/child/dashboard/taskList",icon: CheckSquare, label: 'Nhiệm vụ'},
        { id: 'notifications', href: "/child/dashboard/notifications", icon: Bell, label: 'Thông báo', badge: unread > 0 ? unread : undefined },
    ];
    return (
        <nav className="flex items-center justify-around px-6 py-3 shrink-0" style={{ background: '#FFFFFF', borderTop: `1px solid ${BORDER}` }}>
            {tabs.map(tab => {
                const isActive = pathname.startsWith(tab.href);
                return (
                    <button key={tab.id} onClick={() => router.push(tab.href)} className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all" style={{ background: isActive ? PEACH_BG : 'transparent' }}>
                        <div className="relative">
                            <tab.icon className="w-5 h-5" style={{ color: isActive ? PEACH_DARK : '#A8A29E' }} />
                            {tab.badge && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold" style={{ width: 14, height: 14, fontSize: 8, background: '#EF4444' }}>{tab.badge}</span>
                            )}
                        </div>
                        <span className="text-xs font-bold" style={{ color: isActive ? PEACH_DARK : '#A8A29E' }}>{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    )
}
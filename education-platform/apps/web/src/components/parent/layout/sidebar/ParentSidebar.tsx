
import { Bot, Bell, BarChart2, CheckSquare, GraduationCap, LogOut, Users, X } from 'lucide-react';
import { COLORS } from '../../../../styles/constant/constantColor';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/contextAPI-provider';
import { useMemberStore,useAuthStore, useMarkStore } from '@/store/store';

type ParentSidebarProps = {
    pathname: string;
    sidebarOpen: boolean;
};


export const navItems = [
    { id: "1", href: '/parent/dashboard/members', icon: Users, label: 'Thành viên' },
    { id: "2", href: '/parent/dashboard/task-board', icon: CheckSquare, label: 'Nhiệm vụ', requiresMember: true },
    { id: "3", href: '/parent/dashboard/ai-creator', icon: Bot, label: 'AI Tạo bài tập' },
    { id: "4", href: '/parent/dashboard/reports', icon: BarChart2, label: 'Báo cáo' },
    { id: "5", href: '/parent/dashboard/notifications', icon: Bell, label: 'Thông báo' },
    { id: "6", href: '/parent/dashboard/ai-grader', icon: Bell, label: 'Máy chấm điểm AI'  },
];

export function ParentSidebar({ pathname, sidebarOpen }: ParentSidebarProps) {
    const { currentUser } = useAuthStore();
    console.log("Current user in sidebar:", currentUser);
    const { logout } = useAuth();
    const {selectedMember, clearSelectedMember} = useMemberStore();
      const {getUnreadCount} = useMarkStore();    
    const router = useRouter();



    return (
        <>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-56' : 'w-14'} flex flex-col transition-all duration-200 shrink-0 h-full`} style={{ background: '#FFFFFF', borderRight: `1px solid ${COLORS.BORDER}` }}>
                {/* Logo */}
                <div className="h-14 px-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${COLORS.BORDER}` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)` }}>
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    {sidebarOpen && <span style={{ color: COLORS.TEXT, fontWeight: 700 }}>KidTask</span>}
                </div>

                {/* Selected member pill */}
                {selectedMember && sidebarOpen && (
                    <div className="mx-3 mt-3 p-2.5 rounded-2xl" style={{ background: COLORS.MINT_BG }}>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#A7F3D0', color: COLORS.MINT_DARK }}>
                                {selectedMember.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate" style={{ color: COLORS.MINT_DARK }}>{selectedMember.name}</p>
                                <p className="text-xs" style={{ color: COLORS.MINT }}>
                                    Lớp {selectedMember.grade}
                                </p>
                            </div>
                            <button onClick={() => { router.push("/parent/dashboard/members"), clearSelectedMember()}} style={{ color: COLORS.MINT_DARK }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.MINT)} onMouseLeave={e => (e.currentTarget.style.color = COLORS.MINT_DARK)}>
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Nav items */}
                    <nav className="flex-1 p-2.5 space-y-0.5 mt-2">
                        {navItems.map(item => {
                            const isDisabled = item.requiresMember && (!selectedMember || !selectedMember.id);
                            const isActive = pathname === item.href;

                            return (
                                <button key={item.id} onClick={() => !isDisabled && router.push(item.href)} disabled={isDisabled} title={!sidebarOpen ? item.label : undefined}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-150"
                                    style={{
                                        background: isActive ? COLORS.MINT_BG : 'transparent',
                                        color: isActive ? COLORS.MINT_DARK : isDisabled ? '#D6D3D1' : COLORS.MUTED,
                                        fontWeight: isActive ? 700 : 500,
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    }}
                                    onMouseEnter={e => { if (!isActive && !isDisabled) (e.currentTarget as HTMLElement).style.background = '#F5F5F4'; }}
                                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    <item.icon className="w-4 h-4 shrink-0" />
                                    {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                                    {sidebarOpen && item.label=== 'Thông báo' && getUnreadCount && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#FEE2E2', color: '#EF4444' }}>
                                            {getUnreadCount > 9 ? '9+' : getUnreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Profile */}
                    <div className="p-2.5" style={{ borderTop: `1px solid ${COLORS.BORDER}` }}>
                        <div className="flex items-center gap-2.5 px-2 py-2 rounded-2xl" style={{ cursor: 'default' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: COLORS.MINT_BG, color: COLORS.MINT_DARK }}>
                                {currentUser?.name?.charAt(0)}
                            </div>
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate" style={{ color: COLORS.TEXT }}>{currentUser?.name}</p>
                                    <p className="text-xs truncate" style={{ color: COLORS.MUTED }}>{currentUser?.email}</p>
                                </div>
                            )}
                            <button onClick={logout} title="Đăng xuất" style={{ color: COLORS.MUTED }}
                                onMouseEnter={e => (e.currentTarget.style.color = COLORS.MINT)} onMouseLeave={e => (e.currentTarget.style.color = COLORS.MUTED)}>
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
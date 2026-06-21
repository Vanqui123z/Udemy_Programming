import { LogOut, ArrowLeft, BookOpen } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
const { BORDER, PEACH, TEXT, MUTED, BG } = COLORS;
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';



export default function HeaderChild({ isTaskDetail }: { isTaskDetail?: boolean }) {
    const { logout, selectedTaskId, getTaskById, setIsTaskDetail } = useApp();
      const task = selectedTaskId ? getTaskById(selectedTaskId) : null;
    
    const router = useRouter();

    return (

        <header className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: '#FFFFFF', borderBottom: `1px solid ${BORDER}` }}>
            {isTaskDetail ? (
                <>
                    <button onClick={() => {setIsTaskDetail(false) ; router.back()}} className="p-1.5 rounded-xl transition-colors" style={{ color: MUTED }} onMouseEnter={e => (e.currentTarget.style.background = BG)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="flex-1 truncate text-sm" style={{ color: TEXT, fontWeight: 700 }}>{task?.title || 'Chi tiết nhiệm vụ'}</h1>
                </>
            ) : (
                <>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PEACH}, #FB923C)` }}>
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h1 style={{ color: TEXT, fontWeight: 700, flex: 1 }}>KidTask</h1>
                    <button onClick={logout} style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                        <LogOut className="w-4 h-4" />
                    </button>
                </>
            )}
        </header>
    )
}
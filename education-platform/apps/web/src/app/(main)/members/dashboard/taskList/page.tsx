"use client"

import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { CheckCircle2, Eye, Send, Star } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
import TaskCard from '@/components/members/dashboard/taskList/taskCard';
import { Task } from '@/types/types';
import { useRouter } from 'next/navigation';
const { PEACH_DARK, TEXT, MUTED, MINT_DARK, MINT_BG, PEACH_BG, PEACH } = COLORS;



export const STATUS_CFG = {
    assigned: { label: 'Đã giao', bg: '#DBEAFE', color: '#2563EB', icon: Send },
    viewed: { label: 'Đang xem', bg: PEACH_BG, color: PEACH_DARK, icon: Eye },
    completed: { label: 'Hoàn thành', bg: MINT_BG, color: MINT_DARK, icon: CheckCircle2 },
};

export default function TaskListView() {

    const {  getTasksForMember, updateTaskStatus,setSelectedTaskId, members,setIsTaskDetail } = useApp();
    const member = members[0] as any;
    const tasks = getTasksForMember(member.id).sort((a, b) => a.date.localeCompare(b.date));
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const overdue = tasks.filter(t => t.date < todayStr && t.memberStatus[member.id] !== 'completed');
    const today = tasks.filter(t => t.date === todayStr);
    const upcoming = tasks.filter(t => t.date > todayStr);
    const router = useRouter();

    const openTask = (task: Task) => {
        updateTaskStatus(task.id, member.id, 'viewed');
        setIsTaskDetail(true);
        setSelectedTaskId(task.id);
        router.push('/child/dashboard/task-detail');
    };



    const Section = ({ title, items, accentColor, dim = false }: { title: string; items: Task[]; accentColor: string; dim?: boolean }) => (
        <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: accentColor }}>{title}</p>
            <div className="space-y-2">{items.map(t => <TaskCard key={t.id} task={t} dim={dim} member={member} openTask={openTask} STATUS_CFG={STATUS_CFG} />)}</div>
        </div>
    );

    return (
        <>
            <div className="flex-1 overflow-auto pb-24">
                <div className="p-5 pb-4">
                    <p className="text-sm font-bold" style={{ color: PEACH_DARK }}>Xin chào,</p>
                    <h1 style={{ color: TEXT, fontWeight: 700, fontSize: '1.75rem' }}>{member.name} 👋</h1>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                            { label: 'Đã giao', count: tasks.filter(t => t.memberStatus[member.id] === 'assigned').length, bg: '#DBEAFE', color: '#2563EB' },
                            { label: 'Đang làm', count: tasks.filter(t => t.memberStatus[member.id] === 'viewed').length, bg: PEACH_BG, color: PEACH_DARK },
                            { label: 'Xong!', count: tasks.filter(t => t.memberStatus[member.id] === 'completed').length, bg: MINT_BG, color: MINT_DARK },
                        ].map(s => (
                            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg }}>
                                <p style={{ color: s.color, fontWeight: 700, fontSize: '1.5rem' }}>{s.count}</p>
                                <p className="text-xs font-bold" style={{ color: s.color + 'CC' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-5 space-y-5">
                    {overdue.length > 0 && <Section title={`⚠️ Quá hạn (${overdue.length})`} items={overdue} accentColor="#DC2626" />}
                    {today.length > 0 && <Section title={`📅 Hôm nay (${today.length})`} items={today} accentColor={PEACH_DARK} />}
                    {upcoming.length > 0 && <Section title={`🗓 Sắp tới (${upcoming.length})`} items={upcoming} accentColor={MUTED} dim />}
                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: PEACH_BG }}>
                                <Star className="w-10 h-10" style={{ color: PEACH }} />
                            </div>
                            <p style={{ color: TEXT, fontWeight: 700 }}>Tuyệt vời! 🌟</p>
                            <p className="text-sm mt-1" style={{ color: MUTED }}>Bạn chưa có nhiệm vụ nào</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )

}
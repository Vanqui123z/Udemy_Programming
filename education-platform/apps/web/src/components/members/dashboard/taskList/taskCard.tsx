"use client";


import  { Task, Member } from '@/types/types';
import {  Clock, BrainCircuit, Paperclip, ChevronRight } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
const {  BORDER, PEACH, TEXT, MUTED, PURPLE } = COLORS;

interface TaskCardProps {
    task: Task;
     dim?: boolean | undefined;
    member: Member;
    openTask: (task: Task) => void;
    STATUS_CFG: any;
}

export default function TaskCard({ task, dim = false,member,openTask,STATUS_CFG }: TaskCardProps) {
        const status = task.memberStatus[member.id] || 'assigned';
        const cfg = STATUS_CFG[status];
        const StatusIcon = cfg.icon;
        const hasQ = task.questions.length > 0;
        return (
            <>
                <button onClick={() => openTask(task)} className="w-full text-left rounded-3xl p-4 border-2 transition-all" style={{ background: '#FFFFFF', borderColor: BORDER, opacity: dim ? 0.65 : 1, boxShadow: '0 1px 4px 0 rgba(41,37,36,0.04)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PEACH; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px 0 rgba(253,186,116,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px 0 rgba(41,37,36,0.04)'; }}>
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                            <StatusIcon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm leading-tight" style={{ color: TEXT, fontWeight: 700 }}>{task.title}</h3>
                                <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#D6D3D1' }} />
                            </div>
                            {task.note && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: MUTED }}>{task.note}</p>}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                {task.duration && <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}><Clock className="w-3 h-3" />{task.duration}</span>}
                                {hasQ && <span className="flex items-center gap-1 text-xs font-bold" style={{ color: PURPLE }}><BrainCircuit className="w-3 h-3" />{task.questions.length} câu hỏi</span>}
                                {task.files.length > 0 && <span className="flex items-center gap-1 text-xs" style={{ color: MUTED }}><Paperclip className="w-3 h-3" />{task.files.length}</span>}
                            </div>
                        </div>
                    </div>
                </button>
            </>
        )
    }
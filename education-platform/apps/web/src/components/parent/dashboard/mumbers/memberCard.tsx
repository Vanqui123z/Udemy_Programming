"use client"

import { COLORS } from "@/styles/constant/constantColor";
import { Member } from "@/types/types";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { useApp } from "@/context/AppContext";
import { useMemberStore } from "@/store/member.store";

interface MemberCardProps {
    member: Member;
    onEdit: (member: Member) => void;
    onDelete: (member: Member) => void;
    onShowCredentials: (member: Member) => void;
};

const cardStyle = {
    background: '#FFFFFF', borderRadius: 24, border: `2px solid ${COLORS.BORDER}`,
    boxShadow: '0 2px 8px 0 rgba(41,37,36,0.04)', transition: 'all 0.2s', cursor: 'pointer',
};
const getTasksForMember = (memberId: string) => [
    {
        memberStatus: {
            "1": "completed",
            "2": "pending",
        },
    },
];

function getAvatar(name: string, gender: string) {
    console.log("getAvatar", name, gender);
    return gender === 'FEMALE' ? ['👧', '🧒', '👩'][name.charCodeAt(0) % 3] : ['👦', '🧒', '🧑'][name.charCodeAt(0) % 3];
}

export default function MemberCard({  member, onEdit, onDelete, onShowCredentials }: MemberCardProps) {
    const {setSelectedMember} = useMemberStore();
    const router = useRouter();
    const tasks = getTasksForMember(member.id);
    const completed = tasks.filter((t: any) => t.memberStatus[member.id] === 'completed').length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const interestStyle = { bg: '#F5F5F4', color: COLORS.MUTED };
    return (
        <div key={member.id} className="p-5 group"
            style={cardStyle}
            onClick={() => {  setSelectedMember(member); router.push(`/parent/dashboard/task-board`); }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLORS.MINT; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px 0 rgba(74,222,128,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = COLORS.BORDER; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px 0 rgba(41,37,36,0.04)'; }}>

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: member.gender === 'FEMALE' ? '#FCE7F3' : '#EFF6FF' }}>
                        {getAvatar(member.name, member.gender)}
                    </div>
                    <div>
                        <h3 style={{ color: COLORS.TEXT, fontWeight: 700 }}>{member.name}</h3>
                        <p className="text-xs mt-0.5" style={{ color: COLORS.MUTED }}>Lớp {member.grade} · {member.gender === 'MALE' ? 'Nam' : 'Nữ'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onShowCredentials(member)} className="p-1.5 rounded-xl transition-colors" style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.MUTED)} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { onEdit(member); }} className="p-1.5 rounded-xl transition-colors" style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.MINT_DARK)} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(member)} className="p-1.5 rounded-xl transition-colors" style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.MUTED)} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold" style={{ background: interestStyle.bg, color: interestStyle.color }}>
                    <Sparkles className="w-3 h-3" />
                    {member.interest}
                </span>

                <div>
                    <div className="flex items-center justify-between mb-1.5" style={{ color: COLORS.MUTED, fontSize: '0.75rem' }}>
                        <span>Tiến độ</span>
                        <span style={{ color: COLORS.TEXT, fontWeight: 700 }}>{completed}/{total}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F5F5F4' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.MINT}, #34D399)` }} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.MUTED }}>
                        <Trophy className="w-3.5 h-3.5" style={{ color: COLORS.PEACH }} />
                        <span>{progress}% hoàn thành</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: COLORS.MINT_DARK }}>
                        <span>Xem nhiệm vụ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </div>
    )
}
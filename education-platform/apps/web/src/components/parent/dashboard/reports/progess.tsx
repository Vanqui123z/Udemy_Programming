

import {Member, Task} from '@/types/types';
import { COLORS } from '@/styles/constant/constantColor';
const { MINT, MINT_DARK, MINT_BG, BORDER, PEACH, PEACH_BG, TEXT, MUTED, PURPLE, PURPLE_BG,BG } = COLORS;


type ProgressProps = {
    members: Member[];
    tasks: Task[];
};


export default function Progress({ members, tasks }: ProgressProps) {

    return (
        <>
            {members.map(m => {
                const mt = tasks.filter(t => t.assignedTo.includes(m.id));
                const done = mt.filter(t => t.memberStatus[m.id] === 'completed').length;
                const pct = mt.length > 0 ? Math.round((done / mt.length) * 100) : 0;
                return (
                    <div key={m.id}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: MINT_BG, color: MINT_DARK }}>{m.name[0]}</div>
                                <span className="text-sm font-bold" style={{ color: TEXT }}>{m.name}</span>
                                <span className="text-xs" style={{ color: MUTED }}>Lớp {m.grade}</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: TEXT }}>{done}/{mt.length}</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F5F5F4' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${MINT}, #34D399)` }} />
                        </div>
                        <p className="text-xs mt-1 text-right" style={{ color: MUTED }}>{pct}% hoàn thành</p>
                    </div>
                );
            })}
        </>
    )
}
import {COLORS} from '@/styles/constant/constantColor';
const { BORDER, TEXT, MUTED } = COLORS;
import { LucideIcon } from "lucide-react";

type StatCardProps = {
    statCards: StatCardItem[];
}
type StatCardItem = {
    label: string;
    value: number | string;
    icon: LucideIcon;
    bg: string;
    color: string;
}

export default function StatCard({ statCards }: StatCardProps) {

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-3xl p-4" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}`, boxShadow: '0 1px 4px 0 rgba(41,37,36,0.04)' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p style={{ color: TEXT, fontWeight: 700, fontSize: '1.5rem' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{label}</p>
          </div>
        ))}
      </div>
    )
}
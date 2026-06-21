import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS } from '@/styles/constant/constantColor';
const { MINT, MINT_BG, MINT_DARK, PEACH, PEACH_BG, BORDER, TEXT, MUTED } = COLORS;

type ChartProps = {
    weekData: { day: string; total: number; done: number }[];
    pieData: { name: string; value: number }[];
}
const tooltipStyle = { borderRadius: 16, border: 'none', boxShadow: '0 4px 12px 0 rgba(41,37,36,0.1)', fontFamily: 'Quicksand, Nunito, sans-serif' };
const PIE_COLORS = ['#BFDBFE', PEACH, MINT];


export default function Chart({ weekData, pieData }: ChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Weekly bar chart */}
            <div className="lg:col-span-2 rounded-3xl p-5" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
                <h3 className="mb-4" style={{ color: TEXT, fontWeight: 700 }}>Nhiệm vụ 7 ngày qua</h3>
                {weekData.every(d => d.total === 0) ? (
                    <div className="h-40 flex items-center justify-center text-sm" style={{ color: MUTED }}>Chưa có dữ liệu</div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={weekData} barSize={18}>
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: MUTED, fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="total" fill="#DCFCE7" radius={[8, 8, 0, 0]} name="Tổng" />
                            <Bar dataKey="done" fill={MINT} radius={[8, 8, 0, 0]} name="Hoàn thành" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Pie chart */}
            <div className="rounded-3xl p-5" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
                <h3 className="mb-4" style={{ color: TEXT, fontWeight: 700 }}>Trạng thái</h3>
                {pieData.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-sm" style={{ color: MUTED }}>Chưa có dữ liệu</div>
                ) : (
                    <div>
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2">
                            {pieData.map((d, i) => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                        <span style={{ color: MUTED, fontWeight: 600 }}>{d.name}</span>
                                    </div>
                                    <span style={{ color: TEXT, fontWeight: 700 }}>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>


    )

}
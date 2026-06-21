"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trophy, CheckCircle2, TrendingUp, Users, BarChart2, Bot } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
import Chart from '@/components/parent/dashboard/reports/Chart';
import StatCard from '@/components/parent/dashboard/reports/StatCard';
import AiScores from '@/components/parent/dashboard/reports/aiScores';
import Progress from '@/components/parent/dashboard/reports/progess';
const { MINT, MINT_BG, MINT_DARK, PEACH, PEACH_BG, BORDER, TEXT, MUTED, BG } = COLORS;


export default function ReportsView() {
  const { currentUser, getMembersForParent, tasks, parents } = useApp();
  const parent = parents[0] as any;
  const members = getMembersForParent(parent.id);
  const [selectedMemberId, setSelectedMemberId] = useState<string | 'all'>('all');

  const filtered = selectedMemberId === 'all'
    ? tasks.filter(t => t.assignedTo.some(id => members.find(m => m.id === id)))
    : tasks.filter(t => t.assignedTo.includes(selectedMemberId));

  const total = filtered.length;
  const completed = selectedMemberId === 'all'
    ? filtered.filter(t => Object.values(t.memberStatus).some(s => s === 'completed')).length
    : filtered.filter(t => t.memberStatus[selectedMemberId] === 'completed').length;
  const viewed = selectedMemberId === 'all'
    ? filtered.filter(t => Object.values(t.memberStatus).some(s => s === 'viewed')).length
    : filtered.filter(t => t.memberStatus[selectedMemberId] === 'viewed').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayTasks = filtered.filter(t => t.date === date);
    const done = selectedMemberId === 'all'
      ? dayTasks.filter(t => Object.values(t.memberStatus).some(s => s === 'completed')).length
      : dayTasks.filter(t => t.memberStatus[selectedMemberId] === 'completed').length;
    return { day: format(subDays(new Date(), 6 - i), 'EEE', { locale: vi }), total: dayTasks.length, done };
  });

  const pieData = [
    { name: 'Đã giao', value: total - completed - viewed },
    { name: 'Đã xem', value: viewed },
    { name: 'Hoàn thành', value: completed },
  ].filter(d => d.value > 0);

  const aiScores = filtered.flatMap(t =>
    t.submissions.filter(s => s.aiScore !== undefined && (selectedMemberId === 'all' || s.memberId === selectedMemberId))
      .map(s => ({ name: t.title.length > 22 ? t.title.slice(0, 22) + '…' : t.title, score: s.aiScore!, member: s.memberName }))
  );

  const statCards = [
    { label: 'Tổng nhiệm vụ', value: total, icon: BarChart2, bg: '#EFF6FF', color: '#2563EB' },
    { label: 'Hoàn thành', value: completed, icon: CheckCircle2, bg: MINT_BG, color: MINT_DARK },
    { label: 'Tỷ lệ hoàn thành', value: rate + '%', icon: TrendingUp, bg: PEACH_BG, color: '#D97706' },
    { label: 'Bài AI đã chấm', value: aiScores.length, icon: Bot, bg: '#F5F3FF', color: '#7C3AED' },
  ];


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.5rem' }}>Báo cáo học tập</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>Tổng quan tiến độ và kết quả</p>
        </div>
        <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} className="text-sm rounded-2xl px-3 py-2 font-semibold focus:outline-none" style={{ border: `1.5px solid ${BORDER}`, background: '#FFFFFF', color: TEXT }}>
          <option value="all">Tất cả thành viên</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Stat cards */}
      <StatCard statCards={statCards} />
      {/* Charts */}
      <Chart weekData={weekData} pieData={pieData} />
      {/* AI Scores */}
      <AiScores aiScores={aiScores} />

      <div className="rounded-3xl p-5" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
        <h3 className="mb-4 flex items-center gap-2" style={{ color: TEXT, fontWeight: 700 }}>
          <Users className="w-4 h-4" style={{ color: MINT_DARK }} />Tiến độ từng thành viên
        </h3>
        <div className="space-y-4">
          <Progress members={members} tasks={filtered} />
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, CheckCircle2, Send, AlertCircle, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {COLORS} from '@/styles/constant/constantColor';
const { MINT_BG, TEXT, MUTED, BORDER, BG,MINT_DARK,MINT } = COLORS;


const TYPE_CFG = {
  new_task: { icon: Send, bg: '#DBEAFE', color: '#1D4ED8', label: 'Nhiệm vụ mới' },
  submission: { icon: CheckCircle2, bg: MINT_BG, color: MINT_DARK, label: 'Bài nộp' },
  deadline: { icon: AlertCircle, bg: '#FEE2E2', color: '#DC2626', label: 'Sắp hết hạn' },
};

export default function NotificationsPanel() {
  const { currentUser,parents, getNotificationsFor, markNotificationRead, markAllRead, getUnreadCount } = useApp();
  const parent = parents[0] as any;
  const notifs = getNotificationsFor('parent', parent.id);
  const unread = getUnreadCount('parent', parent.id);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.5rem' }}>
            Thông báo
            {unread > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#FEE2E2', color: '#DC2626' }}>{unread}</span>
            )}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{notifs.length} thông báo</p>
        </div>
        {unread > 0 && (
          <button onClick={() => markAllRead('parent', parent.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold border transition-all" style={{ borderColor: BORDER, color: MUTED }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = BG; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <CheckCheck className="w-4 h-4" />Đọc tất cả
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border-2 border-dashed" style={{ borderColor: BORDER }}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: BG }}>
            <Bell className="w-8 h-8" style={{ color: '#D6D3D1' }} />
          </div>
          <p style={{ color: TEXT, fontWeight: 600 }}>Chưa có thông báo</p>
          <p className="text-sm mt-1" style={{ color: MUTED }}>Thông báo sẽ xuất hiện khi có bài nộp hoặc nhiệm vụ mới</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const cfg = TYPE_CFG[n.type];
            const Icon = cfg.icon;
            return (
              <div key={n.id} onClick={() => !n.read && markNotificationRead(n.id)} className="flex items-start gap-3 p-4 rounded-3xl border-2 cursor-pointer transition-all"
                style={{ background: n.read ? '#FFFFFF' : MINT_BG, borderColor: n.read ? BORDER : '#86EFAC', boxShadow: n.read ? 'none' : '0 2px 8px 0 rgba(74,222,128,0.12)' }}
                onMouseEnter={e => { if (n.read) (e.currentTarget as HTMLElement).style.borderColor = MINT; }}
                onMouseLeave={e => { if (n.read) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}>
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm" style={{ color: TEXT, fontWeight: n.read ? 400 : 700 }}>{n.message}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: MINT_DARK }} />}
                  </div>
                  {n.memberName && <p className="text-xs mt-0.5" style={{ color: MUTED }}>👤 {n.memberName}</p>}
                  <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

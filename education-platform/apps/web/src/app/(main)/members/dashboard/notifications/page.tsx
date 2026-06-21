"use client"


import { useApp } from '@/context/AppContext';
import { vi } from 'date-fns/locale';

import { formatDistanceToNow } from 'date-fns';
import { Bell, AlertCircle, CheckSquare, CheckCircle2 } from 'lucide-react';

import { COLORS } from "@/styles/constant/constantColor"
const { TEXT, MUTED, PEACH, BORDER, MINT_BG, MINT_DARK, PEACH_BG } = COLORS


export default function TaskListView() {
    const { currentUser, getNotificationsFor, markNotificationRead, markAllRead, getUnreadCount, members } = useApp();
    const member = members[0] as any;
    const notifs = getNotificationsFor('member', member.id);
    const unread = getUnreadCount('member', member.id);

    return (
        <div className="flex-1 overflow-auto p-5 pb-24">
            <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.25rem' }}>Thông báo {unread > 0 && <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#FEE2E2', color: '#DC2626' }}>{unread}</span>}</h2>
                {unread > 0 && <button onClick={() => markAllRead('member', member.id)} className="text-xs font-bold flex items-center gap-1" style={{ color: MUTED }}>Đọc tất cả</button>}
            </div>
            {notifs.length === 0 ? (
                <div className="text-center py-12">
                    <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: '#D6D3D1' }} />
                    <p className="text-sm" style={{ color: MUTED }}>Chưa có thông báo nào</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifs.map(n => (
                        <div key={n.id} onClick={() => markNotificationRead(n.id)} className="flex items-start gap-3 p-3.5 rounded-3xl border-2 cursor-pointer transition-all"
                            style={{ background: n.read ? '#FFFFFF' : PEACH_BG, borderColor: n.read ? BORDER : '#FED7AA' }}>
                            <div className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0" style={{ background: n.type === 'new_task' ? '#DBEAFE' : n.type === 'submission' ? MINT_BG : '#FEE2E2' }}>
                                {n.type === 'new_task' ? <CheckSquare className="w-4 h-4" style={{ color: '#2563EB' }} /> : n.type === 'submission' ? <CheckCircle2 className="w-4 h-4" style={{ color: MINT_DARK }} /> : <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm" style={{ color: TEXT, fontWeight: n.read ? 400 : 700 }}>{n.message}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: PEACH }} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
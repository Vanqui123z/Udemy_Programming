"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, CheckCircle2 } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
import { Member } from '@/types/types';


export default function CredentialsDialog({ member, onClose, copiedField, onCopy }: { member: Member | null; onClose: () => void; copiedField: string | null; onCopy: (text: string, field: string) => void }) {
    if (!member) return null;
    return (
        <Dialog open={!!member} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader><DialogTitle style={{ color: COLORS.TEXT }}>Thông tin đăng nhập</DialogTitle></DialogHeader>
                <p className="text-sm" style={{ color: COLORS.MUTED }}>Chia sẻ với <strong>{member.name}</strong> để đăng nhập.</p>
                <div className="space-y-3 mt-2">
                    {[{ label: 'Tên đăng nhập', value: member.username, field: 'username' }, { label: 'Mật khẩu', value: member.password, field: 'password' }].map(({ label, value, field }) => (
                        <div key={field}>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.MUTED }}>{label}</p>
                            <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: COLORS.BG, border: `1px solid ${COLORS.BORDER}` }}>
                                <code className="flex-1 text-sm font-mono" style={{ color: COLORS.TEXT }}>{value}</code>
                                <button onClick={() => onCopy(value, field)} style={{ color: copiedField === field ? COLORS.MINT_DARK : '#A8A29E' }}>
                                    {copiedField === field ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-3 py-2.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)`, color: '#14532D' }} onClick={onClose}>Đóng</button>
                <DialogDescription className="mt-2" style={{ color: COLORS.MUTED }}>Bạn có thể chỉnh sửa thông tin đăng nhập này trong phần chỉnh sửa thành viên nếu cần thiết.</DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Member } from '@/types/types';
import { Plus, Users } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberFormData, MemberFormSchema } from '@/schema/page/memberFormSchema';
import { useCallback, useState } from 'react';
import MemberForm from "@/components/parent/dashboard/mumbers/MemberForm";
import CredentialsDialog from "@/components/parent/dashboard/mumbers/CredentialsDialog";
import MemberCard from "@/components/parent/dashboard/mumbers/memberCard";
import { useMembers } from '@/hooks/queries/useMembers';
import { useMutationMember } from '@/hooks/mutations/useMutationMember';





export default function MembersView() {

    const { data: members } = useMembers.useMembersForParent();
    const { addMemberMutation, updateMemberMutation, deleteMemberMutation } = useMutationMember();
    const { reset, setValue, formState: { errors } } = useForm<MemberFormData>({
        resolver: zodResolver(MemberFormSchema),
    });

    const [showAdd, setShowAdd] = useState(false);
    const [showCredentials, setShowCredentials] = useState<Member | null>(null);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Member | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleSaveAdd = useCallback(
        async (data: MemberFormData) => {
            const member =
                await addMemberMutation.mutateAsync({
                    name: data.name,
                    gender: data.gender,
                    grade: data.grade,
                    interest: data.interest,
                });

            setShowAdd(false);
            setShowCredentials(member);
        },
        [addMemberMutation]
    );

    const handleSaveEdit = useCallback(
        (data: MemberFormData) => {
            if (!editMember) return;

            updateMemberMutation.mutate({
                membersId: editMember.id,
                data,
            });

            setEditMember(null);
        },
        [editMember, updateMemberMutation]
    );

    const handleDelete = useCallback(
        (member: Member) => {
            deleteMemberMutation.mutate({
                membersId: member.id,
            });

            setDeleteConfirm(null);
        },
        [deleteMemberMutation]
    );

    const copyToClipboard = useCallback(
        (text: string, field: string) => {
            navigator.clipboard.writeText(text);

            setCopiedField(field);

            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        },
        []
    );


    if (!members || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6" style={{ background: COLORS.MINT_BG }}>
                    <Users className="w-12 h-12" style={{ color: COLORS.MINT_DARK }} />
                </div>
                <h2 style={{ color: COLORS.TEXT, fontWeight: 700, fontSize: '1.5rem' }}>Chào mừng đến với KidTask!</h2>
                <p className="mt-2 mb-8 max-w-sm" style={{ color: COLORS.MUTED }}>Hãy thêm thành viên đầu tiên để bắt đầu giao nhiệm vụ học tập.</p>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)`, color: '#14532D' }}>
                    <Plus className="w-4 h-4" />
                    Thêm thành viên đầu tiên
                </button>
                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent className="sm:max-w-md">
                        <MemberForm onSave={handleSaveAdd} onCancel={() => setShowAdd(false)} title="Thêm thành viên" />
                        <DialogDescription className="mt-2" style={{ color: COLORS.MUTED }}>Bạn sẽ tạo tài khoản cho con bạn và có thể quản lý thông tin cũng như nhiệm vụ học tập của con sau này.</DialogDescription>
                    </DialogContent>
                </Dialog>
                <CredentialsDialog member={showCredentials} onClose={() => setShowCredentials(null)} copiedField={copiedField} onCopy={copyToClipboard} />
            </div>
        );
    }


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 style={{ color: COLORS.TEXT, fontWeight: 700, fontSize: '1.5rem' }}>Thành viên</h2>
                    <p className="text-sm mt-0.5" style={{ color: COLORS.MUTED }}>{members.length} thành viên trong gia đình</p>
                </div>
                <button onClick={() => { setShowAdd(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)`, color: '#14532D' }}>
                    <Plus className="w-4 h-4" />
                    Thêm thành viên
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member: Member, key: React.Key) => {
                    return (
                        <MemberCard key={key} member={member} onEdit={setEditMember} onDelete={setDeleteConfirm} onShowCredentials={setShowCredentials} />
                    );
                })}
            </div>

            <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogContent className="sm:max-w-md">
                    <MemberForm onSave={handleSaveAdd} onCancel={() => setShowAdd(false)} title="Thêm thành viên" />
                    <DialogDescription className="mt-2" style={{ color: COLORS.MUTED }}>Bạn sẽ tạo tài khoản cho con bạn và có thể quản lý thông tin cũng như nhiệm vụ học tập của con sau này.</DialogDescription>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editMember} onOpenChange={(open: boolean) => !open && setEditMember(null)}>
                <DialogContent className="sm:max-w-md">
                    <MemberForm onSave={handleSaveEdit} onCancel={() => setEditMember(null)} initialData={editMember ?? undefined} title="Chỉnh sửa thành viên" />
                    <DialogDescription className="mt-2" style={{ color: COLORS.MUTED }}>Bạn đang chỉnh sửa thông tin của <strong>{editMember?.name}</strong>. Hãy đảm bảo thông tin chính xác để quản lý nhiệm vụ hiệu quả.</DialogDescription>
                </DialogContent>
            </Dialog>

            <CredentialsDialog member={showCredentials} onClose={() => setShowCredentials(null)} copiedField={copiedField} onCopy={copyToClipboard} />

            <Dialog open={!!deleteConfirm} onOpenChange={(open: boolean) => !open && setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle style={{ color: COLORS.TEXT }}>Xóa thành viên?</DialogTitle></DialogHeader>
                    <DialogDescription className="mt-2" style={{ color: COLORS.MUTED }}>Sau khi xóa <strong>{deleteConfirm?.name}</strong>, bạn sẽ không thể khôi phục lại thông tin này.</DialogDescription>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2.5 rounded-2xl text-sm font-bold border transition-colors" style={{ borderColor: COLORS.BORDER, color: COLORS.MUTED }} onClick={() => setDeleteConfirm(null)}>Hủy</button>
                        <button className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90" style={{ background: '#FEE2E2', color: '#DC2626' }} onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Xóa</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}



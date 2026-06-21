
"use client"

import { MemberFormData, MemberFormSchema } from '@/schema/page/memberFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { COLORS } from '@/styles/constant/constantColor';
import { useEffect } from 'react';


interface MemberFormType {
    onSave: (data: MemberFormData) => void,
    initialData?: MemberFormData,
    onCancel: () => void,
    title: string
}

const INTERESTS = [
    { id: 'Toán', bg: 'bg-[#EDE9FE]', border: 'border-[#6D28D9]', text: 'text-[#6D28D9]' },
    { id: 'Tiếng Anh', bg: 'bg-[#E0F2FE]', border: 'border-[#0369A1]', text: 'text-[#0369A1]' },
    { id: 'Tự giác học', bg: 'bg-[#DCFCE7]', border: 'border-[#15803D]', text: 'text-[#15803D]' },
    { id: 'Thành tích thi cử', bg: 'bg-[#FEF9C3]', border: 'border-[#A16207]', text: 'text-[#A16207]' },
    { id: 'Khoa học', bg: 'bg-[#FFF7ED]', border: 'border-[#C2410C]', text: 'text-[#C2410C]' },
    { id: 'Văn học', bg: 'bg-[#FCE7F3]', border: 'border-[#9D174D]', text: 'text-[#9D174D]' },
];


const GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1));


export default function MemberForm({ onSave, onCancel, initialData, title }: MemberFormType) {

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue, } = useForm<MemberFormData>({
        resolver: zodResolver(MemberFormSchema), defaultValues: {
            name: initialData?.name || "",
            gender: initialData?.gender || "MALE",
            grade: initialData?.grade || "5",
            interest: initialData?.interest || ["Toán"],
        }
    });
    useEffect(() => {
        reset({
            name: initialData?.name || "",
            gender: initialData?.gender || "MALE",
            grade: initialData?.grade || "5",
            interest: initialData?.interest || ["Toán"],
        })
    }, [initialData, reset])
    const onError = (errors: any) => console.log(errors);

    return (
        <>
            {/* header dialog */}
            <DialogHeader><DialogTitle style={{ color: COLORS.TEXT }}>{title}</DialogTitle></DialogHeader>
            {/* form */}
            <form className="space-y-4 mt-2" onSubmit={handleSubmit(onSave, onError)}>
                <div className="space-y-1.5">
                    <Label style={{ color: COLORS.TEXT }}>Họ và tên</Label>
                    <Input placeholder="Nguyễn Minh Khoa" {...register("name")} style={{ borderRadius: 12, borderColor: COLORS.BORDER, background: COLORS.BG }} />
                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label style={{ color: COLORS.TEXT }}>Giới tính</Label>
                        <Select value={watch("gender")} onValueChange={(value) => setValue("gender", value as "MALE" | "FEMALE")}>
                            <SelectTrigger style={{ borderRadius: 12, borderColor: COLORS.BORDER, background: COLORS.BG }}><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                <SelectItem value="MALE">Nam</SelectItem>
                                <SelectItem value="FEMALE">Nữ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label style={{ color: COLORS.TEXT }}>Lớp</Label>
                        <Select value={watch("grade")} onValueChange={(value: any) => setValue("grade", value)}>
                            <SelectTrigger style={{ borderRadius: 12, borderColor: COLORS.BORDER, background: COLORS.BG }}><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl">{GRADES.map(g => <SelectItem key={g} value={g}>Lớp {g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label style={{ color: COLORS.TEXT }}>Quan tâm nhất điều gì?</Label>
                    <div className="grid grid-cols-2 gap-2">

                        {INTERESTS.map(({ id, bg, border, text }) => {
                          const interests = watch("interest");
                            const isSelected = interests?.includes(id);
                            return (

                                <button key={id} type="button" onClick={() => {
                                    const currentInterests = Array.isArray(interests)? interests: [];
                                    if (isSelected) {
                                        setValue("interest", currentInterests.filter(interest => interest !== id))
                                    } else {
                                        setValue("interest", [...currentInterests, id])
                                    }
                                }}
                                    className={`px-3 py-2 rounded-2xl text-sm font-bold border-2 transition-all
                                     ${isSelected ? `${bg} ${border} ${text}` : 'bg-[#FAFAF9] border-gray-200 text-gray-400'}`}>
                                    {id}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl text-sm font-bold border" style={{ borderColor: COLORS.BORDER, color: COLORS.MUTED }}>Hủy</button>
                    <button type="submit" className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)`, color: '#14532D' }}>Lưu thành viên</button>
                </div>
            </form>
        </>
    );
}

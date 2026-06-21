"use client";

import { CheckCircle2, Pencil, Trash2, Plus, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Question } from '@/types/types';

import { COLORS } from '@/styles/constant/constantColor';
const { MINT, MINT_DARK, MINT_BG, PEACH_BG, BORDER, BG, TEXT, MUTED, PURPLE, PURPLE_BG } = COLORS;

interface ReviewStepProps {
    step: string;
    form: any;
    prompt: string;
    fields: any;
    append: any;
    remove: any;
    update: any;
    editingIdx: number | null;
    setEditingIdx: (idx: number | null) => void;
    handleAttach: () => void;
    setStep: (string: 'input' | 'review') => void;
    note: string;

}
//   <ReviewStep step="review" form={form} fields={fields} append={append} remove={remove} update={update} editingIdx={editingIdx} setEditingIdx={setEditingIdx} handleAttach={handleAttach}  setStep={setStep} />

export default function ReviewStep({ step, form, prompt, fields, append, remove, update, editingIdx, setEditingIdx, handleAttach, setStep, note }: ReviewStepProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm" style={{ color: MUTED }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: MINT_DARK }} />
                    AI đã tạo <strong style={{ color: TEXT }}>{fields.length} câu hỏi</strong>
                </div>
                <button onClick={() => { setStep('input'); form.setValue("questions", []); }} className="text-xs" style={{ color: MUTED }}>← Tạo lại</button>
            </div>

            <div className="rounded-2xl p-3 text-sm font-semibold" style={{ background: PEACH_BG, color: '#C2410C', border: `1px solid #FED7AA` }}>
                💬 {prompt}
            </div>

            <div className="space-y-3">
                {fields.map((q: Question, idx: number) => (
                    <div key={q.id} className="rounded-3xl p-4" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}`, boxShadow: '0 1px 4px 0 rgba(41,37,36,0.04)' }}>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ background: PURPLE }}>{idx + 1}</span>
                            <div className="flex-1">
                                {editingIdx === idx ? (
                                    <div className="space-y-2">
                                        <Input value={q.text} onChange={e => update(idx, { text: e.target.value })} style={{ borderRadius: 12, borderColor: BORDER }} />
                                        {q.type === 'multiple_choice' && (
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {(q.options || []).map((opt, oi) => <Input key={oi} value={opt} onChange={e => update(idx, oi, e.target.value)} style={{ borderRadius: 12, borderColor: BORDER, fontSize: '0.8rem', height: 32 }} />)}
                                                <div className="col-span-2 flex items-center gap-2">
                                                    <span className="text-xs shrink-0" style={{ color: MUTED }}>Đáp án:</span>
                                                    <Input value={q.correctAnswer || ''} onChange={e => update(idx, { correctAnswer: e.target.value })} style={{ borderRadius: 12, borderColor: BORDER, fontSize: '0.8rem', height: 32 }} />
                                                </div>
                                            </div>
                                        )}
                                        {q.type === 'short_answer' && <Input value={q.correctAnswer || ''} onChange={e => update(idx, { correctAnswer: e.target.value })} placeholder="Đáp án mẫu" style={{ borderRadius: 12, borderColor: BORDER, fontSize: '0.8rem', height: 32 }} />}
                                        <button onClick={() => setEditingIdx(null)} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: PURPLE_BG, color: PURPLE }}>Xong ✓</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: TEXT }}>{q.text}</p>
                                        {q.type === 'multiple_choice' && q.options && (
                                            <div className="mt-2 grid grid-cols-2 gap-1">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className="text-xs px-2 py-1.5 rounded-xl font-semibold" style={{ background: opt === q.correctAnswer ? MINT_BG : BG, color: opt === q.correctAnswer ? MINT_DARK : MUTED }}>
                                                        {String.fromCharCode(65 + oi)}. {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.type === 'short_answer' && q.correctAnswer && <p className="text-xs mt-1 font-semibold" style={{ color: MINT_DARK }}>✓ {q.correctAnswer}</p>}
                                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: q.type === 'multiple_choice' ? '#DBEAFE' : PEACH_BG, color: q.type === 'multiple_choice' ? '#1D4ED8' : '#C2410C' }}>
                                            {q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => setEditingIdx(editingIdx === idx ? null : idx)} style={{ color: '#A8A29E' }}><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => remove(idx)} style={{ color: '#A8A29E' }}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={() => append({ id: `q${Date.now()}`, text: '', type: 'short_answer', options: ['', '', '', ''], correctAnswer: '' })} className="w-full py-3 rounded-3xl border-2 border-dashed text-sm font-bold transition-all" style={{ borderColor: '#DDD6FE', color: PURPLE }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = PURPLE_BG; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <Plus className="w-4 h-4 inline mr-1" />Thêm câu hỏi
                </button>
            </div>

            <div className="space-y-1.5">
                <Label style={{ color: TEXT }}>Lời nhắc cho thành viên (tuỳ chọn)</Label>
                <Textarea placeholder="VD: Con hãy đọc kỹ đề bài và làm cẩn thận nhé! 💪" value={note} onChange={e => form.setValue("note", e.target.value)} rows={2} className="resize-none" style={{ borderRadius: 12, borderColor: BORDER, background: BG }} />
            </div>

            <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('input')} className="flex-1 py-2.5 rounded-2xl text-sm font-bold border" style={{ borderColor: BORDER, color: MUTED }}>Tạo lại</button>
                <button onClick={handleAttach} disabled={fields.length === 0} className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: fields.length > 0 ? `linear-gradient(135deg, ${MINT}, #34D399)` : '#E7E5E4', color: fields.length > 0 ? '#14532D' : '#A8A29E' }}>
                    <ArrowRight className="w-4 h-4" />Gắn vào nhiệm vụ
                </button>
            </div>
        </div>
    )
}
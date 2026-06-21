"use client"

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Task, Question } from '@/types/types';
import { TaskStatus } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { format, addDays, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Clock, GripVertical, Bot, CheckCircle2, Eye, Send, ChevronLeft, ChevronRight, Paperclip, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/constant/constantColor';
import { useApp } from '@/context/AppContext';

const ItemTypes = { TASK: 'task' };

const STATUS_CFG: Record<TaskStatus, { label: string; bg: string; color: string; icon: React.ComponentType<any> }> = {
    assigned: { label: 'Đã giao', bg: '#EFF6FF', color: '#2563EB', icon: Send },
    viewed: { label: 'Đã xem', bg: COLORS.PEACH_BG, color: '#D97706', icon: Eye },
    completed: { label: 'Hoàn thành', bg: COLORS.MINT_BG, color: COLORS.MINT_DARK, icon: CheckCircle2 },
};

function DraggableTaskCard({ task, memberId, onEdit, onDelete, onGrade }: { task: Task; memberId: string; onEdit: (t: Task) => void; onDelete: (id: string) => void; onGrade: (id: string) => void }) {
    const [{ isDragging }, drag] = useDrag({ type: ItemTypes.TASK, item: { id: task.id }, collect: m => ({ isDragging: m.isDragging() }) });
    const status = task.memberStatus[memberId] || 'assigned';
    const cfg = STATUS_CFG[status];
    const StatusIcon = cfg.icon;
    const submission = task.submissions.find(s => s.memberId === memberId);

    return (
        <div ref={drag as any} className="group"
            style={{ background: COLORS.BG, borderRadius: 16, border: `1.5px solid ${COLORS.BORDER}`, padding: '12px', boxShadow: '0 1px 4px 0 rgba(41,37,36,0.05)', opacity: isDragging ? 0.4 : 1, cursor: 'grab', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#A7F3D0'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px 0 rgba(74,222,128,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = COLORS.BORDER; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px 0 rgba(41,37,36,0.05)'; }}>
            <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D6D3D1' }} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm leading-tight" style={{ color: COLORS.TEXT, fontWeight: 600 }}>{task.title}</h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={e => { e.stopPropagation(); onEdit(task); }} className="p-1 rounded-lg transition-colors" style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.MINT_DARK)} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                                <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); onDelete(task.id); }} className="p-1 rounded-lg transition-colors" style={{ color: '#A8A29E' }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.DANGER)} onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}>
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    {task.note && <p className="text-xs mb-2 line-clamp-2" style={{ color: COLORS.MUTED }}>{task.note}</p>}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                            <StatusIcon className="w-2.5 h-2.5" />{cfg.label}
                        </span>
                        {task.duration && <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.MUTED }}><Clock className="w-3 h-3" />{task.duration}</span>}
                        {task.questions.length > 0 && <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.MUTED }}><BrainCircuit className="w-3 h-3" />{task.questions.length} câu</span>}
                        {task.files.length > 0 && <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.MUTED }}><Paperclip className="w-3 h-3" />{task.files.length}</span>}
                    </div>
                    {status === 'completed' && submission && (
                        <button onClick={e => { e.stopPropagation(); onGrade(task.id); }} className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs rounded-xl py-1.5 transition-all font-bold" style={{ background: '#EDE9FE', color: '#6D28D9' }}
                         onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#DDD6FE'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#EDE9FE'; }}>
                            <Bot className="w-3.5 h-3.5" />Phân tích AI
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function DayColumn({ date, tasks, memberId, onTaskDrop, onAdd, onEdit, onDelete, onGrade }: { date: string; tasks: Task[]; memberId: string; onTaskDrop: (id: string, date: string) => void; onAdd: (date: string) => void; onEdit: (t: Task) => void; onDelete: (id: string) => void; onGrade: (id: string) => void }) {
    const [{ isOver }, drop] = useDrop({ accept: ItemTypes.TASK, drop: (item: { id: string }) => onTaskDrop(item.id, date), collect: m => ({ isOver: m.isOver() }) });
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const isToday = date === todayStr;
    const dayLabel = format(parseISO(date), 'EEEE', { locale: vi });
    const dateLabel = format(parseISO(date), 'dd/MM');
    const completed = tasks.filter(t => t.memberStatus[memberId] === 'completed').length;

    return (
        <div ref={drop as any} className="flex-1 min-w-72 flex flex-col rounded-3xl transition-all overflow-hidden" style={{ background: isOver ? COLORS.MINT_BG : COLORS.BG, border: `2px solid ${isOver ? COLORS.MINT : COLORS.BORDER}` }}>
            {/* Column header */}
            <div className="p-4 pb-3 rounded-t-3xl" style={{ background: isToday ? `linear-gradient(135deg, ${COLORS.MINT}, ${COLORS.MINT})` : COLORS.BG, borderBottom: isToday ? 'none' : `1px solid ${COLORS.BORDER}` }}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold capitalize" style={{ color: isToday ? COLORS.SUCCESS_DARK : COLORS.MUTED }}>{isToday ? 'Hôm nay' : dayLabel}</p>
                        <p style={{ color: isToday ? COLORS.SUCCESS_DARK : COLORS.TEXT, fontWeight: 700, fontSize: '1.1rem' }}>{dateLabel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {tasks.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: isToday ? COLORS.SUCCESS_LIGHT : COLORS.GRAY_LIGHT, color: isToday ? COLORS.SUCCESS_DARK : COLORS.MUTED }}>{completed}/{tasks.length}</span>
                        )}
                        <button onClick={() => onAdd(date)} className="p-1.5 rounded-xl transition-all" style={{ color: isToday ? COLORS.SUCCESS_DARK : COLORS.MUTED }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isToday ? COLORS.SUCCESS_LIGHT : COLORS.GRAY_LIGHT; }} 
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-3 space-y-2 min-h-32">
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-20 gap-1" style={{ color: '#D6D3D1' }}>
                        <CheckCircle2 className="w-6 h-6" />
                        <p className="text-xs">Chưa có nhiệm vụ</p>
                    </div>
                )} 
                {tasks.map(task => (
                    <DraggableTaskCard key={task.id} task={task} memberId={memberId} onEdit={onEdit} onDelete={onDelete} onGrade={onGrade} />
                ))}
            </div>
        </div>
    );
}

interface TaskFormState { title: string; note: string; duration: string; assignedTo: string[]; questions: Question[]; }

export default function TaskBoard() {
    const { selectedMemberId, getMemberById, getTasksForDate, addTask, updateTask, deleteTask, moveTask, getMembersForParent, parents, setParentView, setGradingTaskId, pendingAIQuestions, setPendingAIQuestions } = useApp();
    const member = selectedMemberId ? getMemberById(selectedMemberId) : null;
    const parent = parents[0];
    const allMembers = getMembersForParent(parent.id);

    const [startDate, setStartDate] = useState(new Date());
    const dates = [0, 1, 2].map(i => format(addDays(startDate, i), 'yyyy-MM-dd'));

    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [modalDate, setModalDate] = useState(dates[0]);
    const [form, setForm] = useState<TaskFormState>({ title: '', note: '', duration: '30 phút', assignedTo: selectedMemberId ? [selectedMemberId] : [], questions: [] });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const openAdd = (date: string) => {
        setEditTask(null); setModalDate(date);
        setForm({ title: '', note: '', duration: '30 phút', assignedTo: selectedMemberId ? [selectedMemberId] : [], questions: pendingAIQuestions });
        if (pendingAIQuestions.length > 0) setPendingAIQuestions([]);
        setShowModal(true);
    };
    const openEdit = (task: Task) => {
        setEditTask(task); setModalDate(task.date);
        setForm({ title: task.title, note: task.note, duration: task.duration, assignedTo: task.assignedTo, questions: task.questions });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.title.trim()) { toast.error('Vui lòng nhập tên nhiệm vụ'); return; }
        if (form.assignedTo.length === 0) { toast.error('Vui lòng chọn thành viên'); return; }
        if (editTask) {
            updateTask(editTask.id, { title: form.title, note: form.note, duration: form.duration, assignedTo: form.assignedTo, questions: form.questions });
            toast.success('Đã cập nhật nhiệm vụ!');
        } else {
            addTask({ title: form.title, note: form.note, duration: form.duration, date: modalDate, assignedTo: form.assignedTo, files: [], questions: form.questions });
            toast.success('Đã tạo và giao nhiệm vụ! 🎉');
        }
        setShowModal(false);
    };

    if (!member) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 pb-0 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.BORDER}`, paddingBottom: 16 }}>
                <div>
                    <h2 style={{ color: COLORS.MUTED, fontWeight: 700, fontSize: '1.2rem' }}>Nhiệm vụ của {member.name}</h2>
                    <p className="text-sm" style={{ color: COLORS.MUTED }}>Lớp {member.grade} · {member.interest}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setStartDate(d => addDays(d, -1))} className="p-2 rounded-xl transition-colors" style={{ color: COLORS.MUTED, background: '#FFFFFF', border: `1px solid ${COLORS.BORDER}` }}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setStartDate(new Date())} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all" style={{ background: COLORS.MINT_BG, color: COLORS.MINT_DARK }}>Hôm nay</button>
                    <button onClick={() => setStartDate(d => addDays(d, 1))} className="p-2 rounded-xl transition-colors" style={{ color: COLORS.MUTED, background: '#FFFFFF', border: `1px solid ${COLORS.BORDER}` }}>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setParentView('ai-creator')} className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all border" style={{ background: '#F5F3FF', color: '#7C3AED', borderColor: '#DDD6FE' }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EDE9FE'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F5F3FF'; }}>
                        <Bot className="w-4 h-4" />AI tạo bài
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 flex gap-4 overflow-x-auto">
                {dates.map(date => (
                    <DayColumn key={date} date={date} tasks={getTasksForDate(date, selectedMemberId!)} memberId={selectedMemberId!}
                        onTaskDrop={(id, d) => { moveTask(id, d); toast.success('Đã di chuyển nhiệm vụ'); }}
                        onAdd={openAdd} onEdit={openEdit} onDelete={id => setDeleteConfirm(id)}
                        onGrade={id => { setGradingTaskId(id); setParentView('ai-grader'); }} />
                ))}
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <TaskForm form={form} setForm={setForm} members={allMembers} selectedDate={modalDate} onSave={handleSave} onCancel={() => setShowModal(false)} isEditing={!!editTask} />
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle style={{ color: COLORS.TEXT }}>Xóa nhiệm vụ?</DialogTitle></DialogHeader>
                    <p className="text-sm" style={{ color: COLORS.MUTED }}>Hành động này không thể hoàn tác.</p>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2.5 rounded-2xl text-sm font-bold border" style={{ borderColor: COLORS.BORDER, color: COLORS.MUTED }} onClick={() => setDeleteConfirm(null)}>Hủy</button>
                        <button className="flex-1 py-2.5 rounded-2xl text-sm font-bold" style={{ background: '#FEE2E2', color: '#DC2626' }} onClick={() => { if (deleteConfirm) { deleteTask(deleteConfirm); setDeleteConfirm(null); toast.success('Đã xóa'); } }}>Xóa</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function TaskForm({ form, setForm, members, selectedDate, onSave, onCancel, isEditing }: { form: TaskFormState; setForm: (f: TaskFormState) => void; members: any[]; selectedDate: string; onSave: () => void; onCancel: () => void; isEditing: boolean }) {
    const toggleMember = (id: string) => setForm({ ...form, assignedTo: form.assignedTo.includes(id) ? form.assignedTo.filter(x => x !== id) : [...form.assignedTo, id] });
    const addQ = () => setForm({ ...form, questions: [...form.questions, { id: `q${Date.now()}`, text: '', type: 'short_answer', options: ['', '', '', ''], correctAnswer: '' }] });
    const removeQ = (idx: number) => setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
    const updateQ = (idx: number, data: Partial<Question>) => setForm({ ...form, questions: form.questions.map((q, i) => i === idx ? { ...q, ...data } : q) });
    const updateOpt = (qi: number, oi: number, val: string) => { const qs = [...form.questions]; const opts = [...(qs[qi].options || [])]; opts[oi] = val; qs[qi] = { ...qs[qi], options: opts }; setForm({ ...form, questions: qs }); };

    const inputStyle = { borderRadius: 12, borderColor: COLORS.BORDER, background: COLORS.BG, color: COLORS.TEXT };

    return (
        <>
            <DialogHeader><DialogTitle style={{ color: COLORS.TEXT }}>{isEditing ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ mới'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label style={{ color: COLORS.TEXT }}>Tên nhiệm vụ *</Label>
                    <Input placeholder="VD: Làm bài tập Toán trang 45" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                    <Label style={{ color: COLORS.TEXT }}>Ghi chú</Label>
                    <Textarea placeholder="Hướng dẫn chi tiết..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} className="resize-none" style={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label style={{ color: COLORS.TEXT }}>Thời gian</Label>
                        <Input placeholder="30 phút" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} />
                    </div>
                    <div className="space-y-1.5">
                        <Label style={{ color: COLORS.TEXT }}>Ngày</Label>
                        <div className="h-10 rounded-xl px-3 flex items-center text-sm capitalize" style={{ background: COLORS.BG, border: `1px solid ${COLORS.BORDER}`, color: COLORS.MUTED }}>{format(parseISO(selectedDate), 'EEE, dd/MM', { locale: vi })}</div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label style={{ color: COLORS.TEXT }}>Giao cho</Label>
                    {members.map(m => (
                        <label key={m.id} className="flex items-center gap-2.5 p-2.5 rounded-2xl border cursor-pointer transition-colors" style={{ borderColor: form.assignedTo.includes(m.id) ? COLORS.MINT : COLORS.BORDER, background: form.assignedTo.includes(m.id) ? COLORS.BG : '#FAFAF9' }}>
                            <Checkbox checked={form.assignedTo.includes(m.id)} onCheckedChange={() => toggleMember(m.id)} />
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: COLORS.BG, color: COLORS.MINT_DARK }}>{m.name[0]}</div>
                            <span className="text-sm font-semibold" style={{ color: COLORS.TEXT }}>{m.name}</span>
                            <span className="text-xs" style={{ color: COLORS.MUTED }}>Lớp {m.grade}</span>
                        </label>
                    ))}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label style={{ color: COLORS.TEXT }}>Câu hỏi {form.questions.length > 0 && <span className="text-xs ml-1" style={{ color: COLORS.MUTED }}>({form.questions.length})</span>}</Label>
                        <button onClick={addQ} className="flex items-center gap-1 text-xs font-bold" style={{ color: '#7C3AED' }}><Plus className="w-3 h-3" />Thêm câu</button>
                    </div>
                    {form.questions.map((q, idx) => (
                        <div key={q.id} className="rounded-2xl p-3 space-y-2" style={{ border: `1.5px solid ${COLORS.BORDER}`, background: COLORS.BACKGROUND }}>
                            <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ background: '#7C3AED' }}>{idx + 1}</span>
                                <Input placeholder="Nội dung câu hỏi..." value={q.text} onChange={e => updateQ(idx, { text: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF' }} />
                                <button onClick={() => removeQ(idx)} style={{ color: '#A8A29E' }}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex gap-3 pl-7">
                                {(['multiple_choice', 'short_answer'] as const).map(t => (
                                    <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer font-semibold" style={{ color: q.type === t ? '#7C3AED' : COLORS.MUTED }}>
                                        <input type="radio" checked={q.type === t} onChange={() => updateQ(idx, { type: t })} style={{ accentColor: '#7C3AED' }} />
                                        {t === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                                    </label>
                                ))}
                            </div>
                            {q.type === 'multiple_choice' && (
                                <div className="pl-7 grid grid-cols-2 gap-1.5">
                                    {(q.options || ['', '', '', '']).map((opt, oi) => (
                                        <div key={oi} className="flex items-center gap-1.5">
                                            <span className="text-xs w-4" style={{ color: COLORS.MUTED }}>{String.fromCharCode(65 + oi)}.</span>
                                            <Input value={opt} onChange={e => updateOpt(idx, oi, e.target.value)} style={{ ...inputStyle, background: '#FFFFFF', fontSize: '0.8rem', height: 32 }} placeholder={`Lựa chọn ${oi + 1}`} />
                                        </div>
                                    ))}
                                    <div className="col-span-2 flex items-center gap-1.5">
                                        <span className="text-xs shrink-0" style={{ color: COLORS.MUTED }}>Đáp án:</span>
                                        <Input value={q.correctAnswer || ''} onChange={e => updateQ(idx, { correctAnswer: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF', fontSize: '0.8rem', height: 32 }} />
                                    </div>
                                </div>
                            )}
                            {q.type === 'short_answer' && (
                                <div className="pl-7 flex items-center gap-1.5">
                                    <span className="text-xs shrink-0" style={{ color: COLORS.MUTED }}>Đáp án:</span>
                                    <Input value={q.correctAnswer || ''} onChange={e => updateQ(idx, { correctAnswer: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF', fontSize: '0.8rem', height: 32 }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 pt-2">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl text-sm font-bold border" style={{ borderColor: COLORS.BORDER, color: COLORS.MUTED }}>Hủy</button>
                    <button onClick={onSave} className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${COLORS.MINT}, #34D399)`, color: '#14532D' }}>
                        <Send className="w-4 h-4" />{form.questions.length > 0 ? 'Giao nhiệm vụ + bài tập' : 'Giao nhiệm vụ'}
                    </button>
                </div>
            </div>
        </>
    );
}

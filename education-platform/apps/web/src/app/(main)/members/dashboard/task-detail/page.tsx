"use client";

import { useApp } from '@/context/AppContext';
import { Answer, FileAttachment } from '@/types/types';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Download, FileText, Paperclip, X, Image, Video, Mic, BrainCircuit, ChevronRight,Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { COLORS } from '@/styles/constant/constantColor';
const { BORDER, PEACH, PEACH_BG, TEXT, MUTED, MINT_BG, MINT_DARK, PURPLE, PURPLE_BG,BG } = COLORS;
import { useState } from 'react';
import { vi } from 'date-fns/locale';
import QuizSection from '@/components/members/dashboard/taskDetail/quizSection';
import {STATUS_CFG} from '../taskList/page';
import { useRouter } from 'next/dist/client/components/navigation';


export default function TaskViewDetail() {
  
  const router = useRouter();
  const { currentUser, selectedTaskId, getTaskById, submitTask, members } = useApp();
  const member = members[0] as any;
  const task = selectedTaskId ? getTaskById(selectedTaskId) : null;
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  if (!task) return null;
  const status = task.memberStatus[member.id] || 'assigned';
  const submission = task.submissions.find(s => s.memberId === member.id);
  const hasQ = task.questions.length > 0;
  const allAnswered = !hasQ || (answers.length === task.questions.length && answers.every(a => a.answer.trim()));

  const mockUpload = (type: FileAttachment['type'], ext: string) => {
    const f: FileAttachment = { id: `f${Date.now()}`, name: `${type}_${Date.now()}${ext}`, type, size: `${Math.floor(Math.random() * 900 + 100)}KB`, uploadedAt: new Date().toISOString(), uploadedBy: 'member' };
    setFiles(prev => [...prev, f]);
    toast.success('Đã thêm file!');
  };

  const handleSubmit = async () => {
    if (!allAnswered) { toast.error('Hãy hoàn thành bài tập trước khi nộp!'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    submitTask(task.id, member.id, files, answers, note);
    setSubmitting(false);
    toast.success('Nộp bài thành công! 🎉');
    router.push('/child/dashboard/taskList');
  };

  const cfg = STATUS_CFG[status];
  const StatusIcon = cfg.icon;

  const FILE_BTNS = [
    { icon: Paperclip, label: 'Tệp', type: 'document' as const, ext: '.pdf', bg: '#DBEAFE', color: '#2563EB' },
    { icon: Image, label: 'Ảnh', type: 'image' as const, ext: '.jpg', bg: '#DCFCE7', color: MINT_DARK },
    { icon: Video, label: 'Video', type: 'video' as const, ext: '.mp4', bg: PEACH_BG, color: '#D97706' },
    { icon: Mic, label: 'Ghi âm', type: 'audio' as const, ext: '.mp3', bg: PURPLE_BG, color: PURPLE },
  ];

  return (
    <div className="flex-1 overflow-auto pb-8">
      <div className="p-5 space-y-4">
        {/* Task info */}
        <div className="rounded-3xl p-4" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
          <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.1rem' }}>{task.title}</h2>
          {task.note && <p className="text-sm mt-1.5" style={{ color: MUTED }}>{task.note}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
              <StatusIcon className="w-3 h-3" />{cfg.label}
            </span>
            {task.duration && <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}><Clock className="w-3 h-3" />{task.duration}</span>}
            <span className="text-xs" style={{ color: MUTED }}>{format(new Date(task.date), 'EEEE, dd/MM', { locale: vi })}</span>
          </div>
        </div>

        {/* Parent files */}
        {task.files.length > 0 && (
          <div className="rounded-3xl p-4" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: TEXT }}><Paperclip className="w-4 h-4" style={{ color: MUTED }} />Tài liệu đính kèm</h3>
            {task.files.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-2xl mb-1.5" style={{ background: BG }}>
                <FileText className="w-4 h-4" style={{ color: MUTED }} />
                <span className="flex-1 text-sm truncate" style={{ color: TEXT }}>{f.name}</span>
                <span className="text-xs" style={{ color: MUTED }}>{f.size}</span>
                <Download className="w-3.5 h-3.5" style={{ color: MUTED }} />
              </div>
            ))}
          </div>
        )}

        {/* Quiz trigger */}
        {hasQ && !showQuiz && status !== 'completed' && (
          <button onClick={() => setShowQuiz(true)} className="w-full rounded-3xl p-4 text-left transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">Có bài tập cần làm! 📝</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{task.questions.length} câu hỏi · Nhấn để bắt đầu</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        {hasQ && showQuiz && status !== 'completed' && (
          <QuizSection questions={task.questions} answers={answers} setAnswers={setAnswers} onClose={() => setShowQuiz(false)} />
        )}

        {/* Completed */}
        {status === 'completed' && submission && (
          <div className="rounded-3xl p-4 border-2" style={{ background: MINT_BG, borderColor: '#86EFAC' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5" style={{ color: MINT_DARK }} />
              <h3 className="font-bold" style={{ color: MINT_DARK }}>Đã nộp bài! 🎉</h3>
            </div>
            <p className="text-xs" style={{ color: '#15803D' }}>Nộp lúc {format(new Date(submission.submittedAt), 'HH:mm, dd/MM/yyyy')}</p>
            {submission.aiScore !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: submission.aiScore >= 8 ? MINT_DARK : submission.aiScore >= 5 ? '#D97706' : '#DC2626' }}>{submission.aiScore}/10</span>
                <span className="text-xs font-bold" style={{ color: MINT_DARK }}>Điểm AI</span>
              </div>
            )}
          </div>
        )}

        {/* Upload & submit */}
        {status !== 'completed' && (
          <div className="rounded-3xl p-4" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: TEXT }}>Nộp bài của bạn</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {FILE_BTNS.map(({ icon: Icon, label, type, ext, bg, color }) => (
                <button key={type} onClick={() => mockUpload(type, ext)} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all" style={{ border: `1.5px solid ${BORDER}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PEACH; (e.currentTarget as HTMLElement).style.background = PEACH_BG; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: MUTED }}>{label}</span>
                </button>
              ))}
            </div>

            {files.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: BG, border: `1px solid ${BORDER}` }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: MUTED }} />
                    <span className="flex-1 text-xs truncate" style={{ color: TEXT }}>{f.name}</span>
                    <span className="text-xs" style={{ color: MUTED }}>{f.size}</span>
                    <button onClick={() => setFiles(p => p.filter(x => x.id !== f.id))} style={{ color: '#A8A29E' }}><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}

            <Textarea placeholder="Ghi chú thêm cho bố/mẹ... 💬" value={note} onChange={e => setNote(e.target.value)} rows={2} className="resize-none mb-4 text-sm" style={{ borderRadius: 12, borderColor: BORDER, background: BG }} />

            <button onClick={handleSubmit} disabled={submitting || !allAnswered} className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: allAnswered ? `linear-gradient(135deg, ${PEACH}, #FB923C)` : '#E7E5E4', color: allAnswered ? '#7C2D12' : '#A8A29E' }}>
              {submitting ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />Đang nộp...</> : <><Send className="w-4 h-4" />Nộp bài</>}
            </button>

            {hasQ && !allAnswered && (
              <p className="text-xs text-center mt-2 font-semibold" style={{ color: '#D97706' }}>⚠️ Hoàn thành bài tập trước khi nộp</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
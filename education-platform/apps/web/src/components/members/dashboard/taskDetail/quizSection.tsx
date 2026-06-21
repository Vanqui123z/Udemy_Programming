"use client"
import { Answer } from '@/types/types';
import { CheckCircle2, BrainCircuit, X } from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
const { MINT_DARK, MINT_BG, PURPLE, PURPLE_BG, TEXT,BORDER,BG } = COLORS;

interface  TaskListViewProps {
    questions: any[];
    answers: Answer[];
    setAnswers: (answers: Answer[]) => void;
    onClose: () => void;
}

export default function QuizSection({ questions, answers, setAnswers, onClose }: TaskListViewProps) {

    const getAns = (id: string) => answers.find(a => a.questionId === id)?.answer || '';
    const setAns = (id: string, val: string) => setAnswers([...answers.filter(a => a.questionId !== id), { questionId: id, answer: val }]);
    const done = answers.filter(a => a.answer.trim()).length;

    return (
        <div className="rounded-3xl overflow-hidden" style={{ border: `2px solid #DDD6FE` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)` }}>
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-white" />
                    <span className="font-bold text-white">Bài tập AI</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-white/75 font-bold">{done}/{questions.length} câu</span>
                    <button onClick={onClose} className="text-white/75 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="p-4 space-y-4" style={{ background: '#FFFFFF' }}>
                {questions.map((q, idx) => (
                    <div key={q.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: PURPLE }}>{idx + 1}</span>
                            <p className="text-sm font-bold" style={{ color: TEXT }}>{q.text}</p>
                        </div>
                        {q.type === 'multiple_choice' && q.options && (
                            <div className="pl-8 space-y-1.5">
                                {q.options.map((opt: string, oi: number) => (
                                    <button key={oi} onClick={() => setAns(q.id, opt)} className="w-full text-left text-sm px-3 py-2 rounded-2xl border-2 transition-all font-semibold"
                                        style={{ borderColor: getAns(q.id) === opt ? PURPLE : BORDER, background: getAns(q.id) === opt ? PURPLE_BG : BG, color: getAns(q.id) === opt ? PURPLE : TEXT }}>
                                        <span className="mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                                    </button>
                                ))}
                            </div>
                        )}
                        {q.type === 'short_answer' && (
                            <div className="pl-8">
                                <textarea placeholder="Câu trả lời của bạn..." value={getAns(q.id)} onChange={e => setAns(q.id, e.target.value)} rows={2}
                                    className="w-full resize-none text-sm px-3 py-2 rounded-2xl focus:outline-none transition-colors"
                                    style={{ border: `2px solid ${getAns(q.id) ? PURPLE : BORDER}`, background: BG, fontFamily: 'Quicksand, Nunito, sans-serif' }} />
                            </div>
                        )}
                    </div>
                ))}
                {done === questions.length && (
                    <div className="flex items-center gap-2 text-sm p-3 rounded-2xl font-bold" style={{ background: MINT_BG, color: MINT_DARK }}>
                        <CheckCircle2 className="w-4 h-4" />Hoàn thành bài tập! Nhấn "Nộp bài" bên dưới.
                    </div>
                )}
            </div>
        </div>
    );
}
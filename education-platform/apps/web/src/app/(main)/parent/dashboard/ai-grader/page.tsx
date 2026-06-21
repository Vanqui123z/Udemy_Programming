"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Submission, AIAnalysisItem } from '@/types/types';
import { Bot, CheckCircle2, XCircle, Lightbulb, BarChart2, ArrowLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { COLORS } from '@/styles/constant/constantColor';
const { MINT, MINT_DARK, MINT_BG, BORDER, PEACH, PEACH_BG, TEXT, MUTED, PURPLE, PURPLE_BG,BG } = COLORS;
import {useRouter} from 'next/navigation';


function generateAnalysis(questions: any[], answers: any[]): { score: number; analysis: AIAnalysisItem[] } {
  const analysis: AIAnalysisItem[] = questions.map(q => {
    const ans = answers.find(a => a.questionId === q.id);
    const memberAnswer = ans?.answer || '(Không trả lời)';
    const isCorrect = !!(q.correctAnswer && memberAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
    const correctPhrases = ['Xuất sắc! Câu trả lời chính xác.', 'Rất tốt! Bạn nắm vững kiến thức này. 🌟', 'Đúng rồi! Bạn hiểu rõ vấn đề. ✨'];
    const wrongPhrases = ['Chưa chính xác. Hãy xem lại lý thuyết.', 'Sai một chút, ôn lại phần này nhé! 📚', 'Cần luyện tập thêm nội dung này.'];
    const suggCorrect = ['Tiếp tục phát huy! 💪', 'Hãy thử bài khó hơn!', 'Làm tốt lắm, tiếp tục nhé!'];
    const suggWrong = ['Đọc lại sách giáo khoa và thử lại.', 'Ôn lại kiến thức cơ bản rồi làm bài nhé.', 'Xem ví dụ trong sách và thử làm lại.'];
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return { questionId: q.id, questionText: q.text, memberAnswer, correctAnswer: q.correctAnswer || 'N/A', isCorrect, explanation: isCorrect ? pick(correctPhrases) : pick(wrongPhrases), suggestion: isCorrect ? pick(suggCorrect) : pick(suggWrong) };
  });
  const score = questions.length > 0 ? Math.round((analysis.filter(a => a.isCorrect).length / questions.length) * 10) : 0;
  return { score, analysis };

}

export default function AIGrader() {
  const { gradingTaskId, getTaskById, getMemberById, setAIAnalysis } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const router = useRouter();
  const task = gradingTaskId ? getTaskById(gradingTaskId) : null;

  if (!task) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: BG }}><BarChart2 className="w-8 h-8" style={{ color: '#D6D3D1' }} /></div>
      <p style={{ color: MUTED }}>Chưa chọn nhiệm vụ để phân tích.</p>
      <button onClick={() => router.push('/parent/task-board')} className="mt-4 px-4 py-2 rounded-2xl text-sm font-bold border flex items-center gap-2" style={{ borderColor: BORDER, color: MUTED }}>
        <ArrowLeft className="w-4 h-4" />Quay lại bảng nhiệm vụ
      </button>
    </div>
  );

  const subs = task.submissions;
  const selectedSub = selectedSubId ? subs.find(s => s.id === selectedSubId) : subs[0] || null;

  const handleAnalyze = async (sub: Submission) => {
    if (!task.questions.length) { toast.error('Nhiệm vụ này không có câu hỏi'); return; }
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    const { score, analysis } = generateAnalysis(task.questions, sub.answers);
    setAIAnalysis(task.id, sub.memberId, score, analysis);
    setSelectedSubId(sub.id);
    setAnalyzing(false);
    toast.success('Phân tích AI hoàn tất! 🎉');
  };

  const scoreColor = (s: number) => s >= 8 ? { bg: MINT_BG, text: MINT_DARK, bar: MINT } : s >= 5 ? { bg: PEACH_BG, text: '#D97706', bar: PEACH } : { bg: '#FEE2E2', text: '#DC2626', bar: '#EF4444' };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/parent/task-board')} className="p-2 rounded-xl transition-colors" style={{ color: MUTED }} onMouseEnter={e => (e.currentTarget.style.background = BG)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, #60A5FA, ${PURPLE})` }}>
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.25rem' }}>AI Chấm Bài</h2>
          <p className="text-sm" style={{ color: MUTED }}>{task.title}</p>
        </div>
      </div>

      {subs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl" style={{ background: '#FFFFFF', border: `2px dashed ${BORDER}` }}>
          <FileText className="w-12 h-12 mb-4" style={{ color: '#D6D3D1' }} />
          <p style={{ color: TEXT, fontWeight: 600 }}>Chưa có bài nộp nào</p>
          <p className="text-sm mt-1" style={{ color: MUTED }}>Thành viên chưa nộp bài cho nhiệm vụ này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Submission list */}
          <div className="space-y-2">
            <p className="text-xs font-bold mb-2" style={{ color: MUTED }}>BÀI NỘP ({subs.length})</p>
            {subs.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              const sc = sub.aiScore;
              const colors = sc !== undefined ? scoreColor(sc) : null;
              return (
                <button key={sub.id} onClick={() => setSelectedSubId(sub.id)} className="w-full text-left p-3 rounded-2xl border-2 transition-all" style={{ background: '#FFFFFF', borderColor: isSelected ? MINT : BORDER, boxShadow: isSelected ? `0 0 0 3px ${MINT_BG}` : 'none' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: PURPLE_BG, color: PURPLE }}>{sub.memberName[0]}</div>
                    <span className="text-sm font-bold" style={{ color: TEXT }}>{sub.memberName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: MUTED }}>{format(new Date(sub.submittedAt), 'HH:mm dd/MM')}</span>
                    {colors && sc !== undefined ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text }}>{sc}/10</span>
                    ) : <span className="text-xs" style={{ color: MUTED }}>Chưa chấm</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Analysis */}
          {selectedSub && (
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl p-4 border" style={{ background: '#FFFFFF', borderColor: BORDER }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 style={{ color: TEXT, fontWeight: 700 }}>{selectedSub.memberName}</h3>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>Nộp lúc {format(new Date(selectedSub.submittedAt), 'HH:mm, dd/MM/yyyy')}</p>
                  </div>
                  <button onClick={() => handleAnalyze(selectedSub)} disabled={analyzing} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all" style={{ background: analyzing ? '#E7E5E4' : `linear-gradient(135deg, #60A5FA, ${PURPLE})`, color: analyzing ? MUTED : '#FFFFFF' }}>
                    {analyzing ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang phân tích...</> : <><Bot className="w-4 h-4" />{selectedSub.aiAnalysis?.length ? 'Chấm lại' : 'Phân tích AI'}</>}
                  </button>
                </div>
                {selectedSub.files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSub.files.map(f => (
                      <span key={f.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-xl" style={{ background: BG, border: `1px solid ${BORDER}`, color: MUTED }}>
                        <FileText className="w-3 h-3" />{f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {selectedSub.aiScore !== undefined && (selectedSub.aiAnalysis ?? []).length > 0 && (
                <>
                  {/* Score card */}
                  {(() => { const colors = scoreColor(selectedSub.aiScore!); return (
                    <div className="rounded-3xl p-5 border-2" style={{ background: colors.bg, borderColor: colors.bar + '50' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: colors.bar }}>
                            {selectedSub.aiScore}
                          </div>
                          <div>
                            <p style={{ color: TEXT, fontWeight: 700, fontSize: '1.2rem' }}>{selectedSub.aiScore}/10 điểm</p>
                            <p className="text-sm" style={{ color: colors.text }}>
                              {selectedSub.aiScore >= 8 ? '🌟 Xuất sắc!' : selectedSub.aiScore >= 7 ? '👍 Tốt!' : selectedSub.aiScore >= 5 ? '🔄 Cần cải thiện' : '📚 Cần ôn lại nhiều'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: TEXT }}>{(selectedSub.aiAnalysis ?? []).filter(a => a.isCorrect).length}/{(selectedSub.aiAnalysis ?? []).length}</p>
                          <p className="text-xs" style={{ color: MUTED }}>câu đúng</p>
                          <div className="flex items-center gap-1 justify-end mt-2">
                            {(selectedSub.aiAnalysis ?? []).map((a, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: a.isCorrect ? MINT : '#FCA5A5' }} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );})()}

                  {/* Per-question analysis */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold" style={{ color: MUTED }}>PHÂN TÍCH TỪNG CÂU</p>
                    {(selectedSub.aiAnalysis ?? []).map((item, idx) => (
                      <div key={item.questionId} className="rounded-3xl p-4 border-2" style={{ background: '#FFFFFF', borderColor: item.isCorrect ? '#86EFAC' : '#FCA5A5' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.isCorrect ? MINT_BG : '#FEE2E2' }}>
                            {item.isCorrect ? <CheckCircle2 className="w-4 h-4" style={{ color: MINT_DARK }} /> : <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold mb-2" style={{ color: TEXT }}>Câu {idx + 1}: {item.questionText}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex gap-2">
                                <span style={{ color: MUTED, minWidth: 60 }}>Trả lời:</span>
                                <span style={{ color: item.isCorrect ? MINT_DARK : '#DC2626', fontWeight: 600 }}>{item.memberAnswer}</span>
                              </div>
                              {!item.isCorrect && (
                                <div className="flex gap-2">
                                  <span style={{ color: MUTED, minWidth: 60 }}>Đáp án:</span>
                                  <span style={{ color: MINT_DARK, fontWeight: 600 }}>{item.correctAnswer}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2 mt-2 p-2.5 rounded-2xl" style={{ background: item.isCorrect ? MINT_BG : PEACH_BG }}>
                                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: item.isCorrect ? MINT_DARK : '#D97706' }} />
                                <span style={{ color: item.isCorrect ? MINT_DARK : '#9A3412' }}>{item.suggestion}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {(!selectedSub.aiAnalysis || !selectedSub.aiAnalysis.length) && !analyzing && (
                <div className="flex flex-col items-center justify-center py-12 rounded-3xl border-2 border-dashed" style={{ borderColor: BORDER }}>
                  <Bot className="w-10 h-10 mb-3" style={{ color: '#D6D3D1' }} />
                  <p style={{ color: TEXT, fontWeight: 600 }}>Chưa có phân tích AI</p>
                  <p className="text-sm mt-1" style={{ color: MUTED }}>Nhấn "Phân tích AI" để xem kết quả chi tiết</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

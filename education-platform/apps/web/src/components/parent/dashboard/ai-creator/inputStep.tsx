
"use client";


import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import {COLORS} from '@/styles/constant/constantColor';
import { SUGGESTIONS } from './dataTemple';
const { PURPLE, PURPLE_BG, BORDER, TEXT, MUTED } = COLORS;

interface InputStepsProps {
    steps: string;
    prompt: string;
    handleGenerate: (promptText: string) => void;
    setPrompt: (value: string) => void;
    generating: boolean;
}

export default function InputStep({steps,prompt,handleGenerate,setPrompt,generating}:InputStepsProps) {

    return (
            <div className="space-y-5">
                <div className="rounded-3xl p-5" style={{ background: `linear-gradient(135deg, ${PURPLE_BG}, #EDE9FE)`, border: `1.5px solid #DDD6FE` }}>
                    <Label className="flex items-center gap-2 mb-3" style={{ color: PURPLE }}><Sparkles className="w-4 h-4" />Mô tả yêu cầu bài tập</Label>
                    <Textarea placeholder="VD: Tạo 4 câu hỏi trắc nghiệm Toán lớp 5 về phân số, độ khó vừa phải..." value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="resize-none mb-3" style={{ borderRadius: 12, borderColor: '#DDD6FE', background: '#FFFFFF' }} />
                    <button onClick={() => handleGenerate(prompt)} disabled={generating || !prompt.trim()} className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all" style={{ background: generating || !prompt.trim() ? '#D6D3D1' : `linear-gradient(135deg, ${PURPLE}, #6D28D9)` }}>
                        {generating ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                AI đang tạo bài tập...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" />Tạo bài tập với AI</span>
                        )}
                    </button>
                </div>

                <div>
                    <p className="text-xs font-bold mb-2" style={{ color: MUTED }}>Gợi ý nhanh:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SUGGESTIONS.map(s => (
                            <button key={s} onClick={() => setPrompt(s.replace(/^[^\s]+\s/, ''))} className="text-left text-sm px-4 py-3 rounded-2xl border transition-all font-semibold" style={{ background: '#FFFFFF', borderColor: BORDER, color: TEXT }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#DDD6FE'; (e.currentTarget as HTMLElement).style.background = PURPLE_BG; (e.currentTarget as HTMLElement).style.color = PURPLE; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.color = TEXT; }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
  
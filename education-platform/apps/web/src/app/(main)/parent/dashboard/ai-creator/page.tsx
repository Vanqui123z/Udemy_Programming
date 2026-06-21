"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Question } from '@/types/types';
import { Bot, Router } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/constant/constantColor';
import { AI_TEMPLATES } from '../../../../../components/parent/dashboard/ai-creator/dataTemple';
import InputStep from '@/components/parent/dashboard/ai-creator/inputStep';
import ReviewStep from '@/components/parent/dashboard/ai-creator/reviewStep';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
const { TEXT, MUTED, PURPLE, PURPLE_BG } = COLORS;


function getTemplate(prompt: string): Question[] {
  const p = prompt.toLowerCase();
  const template = p.includes('toán') || p.includes('số') || p.includes('phân số') ? AI_TEMPLATES.math
    : p.includes('tiếng anh') || p.includes('english') ? AI_TEMPLATES.english
      : p.includes('khoa học') || p.includes('tự nhiên') ? AI_TEMPLATES.science
        : AI_TEMPLATES.math;
  return template.map(q => ({ ...q, id: `ai_${Date.now()}_${q.id}` }));
}


type AIForm = {
  prompt: string,
  note: string,
  questions: Question[];
};

export default function AICreator() {
  const router = useRouter();
  const { setPendingAIQuestions } = useApp();
  const [generating, setGenerating] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');

  


  const form = useForm<AIForm>({
    defaultValues: {
      prompt: "",
      note: "",
      questions: [],
    },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const prompt = form.watch("prompt");
  const note = form.watch("note");
  const setPrompt = (value: string) => {
    form.setValue("prompt", value);
};

  const handleGenerate = async (promptText: string) => {
    if (!promptText.trim()) { toast.error('Vui lòng nhập yêu cầu cho AI'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    replace(getTemplate(promptText));
    setGenerating(false);
    setStep('review');
  };

  const handleAttach = () => {
    setPendingAIQuestions(form.getValues("questions"));
    router.push('/parent/dashboard/task-board');
    toast.success('Bài tập đã sẵn sàng! Tạo nhiệm vụ mới để đính kèm.');
  };

  // const removeQ = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
  // const updateOpt = (qi: number, oi: number, val: string) => {
  //   const qs = [...fields]; const opts = [...(qs[qi].options || [])]; opts[oi] = val; qs[qi] = { ...qs[qi], options: opts }; setQuestions(qs);
  // };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)` }}>
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 style={{ color: TEXT, fontWeight: 700, fontSize: '1.25rem' }}>AI Tạo Bài Tập</h2>
          <p className="text-sm" style={{ color: MUTED }}>Mô tả yêu cầu, AI sẽ tạo bài tập phù hợp</p>
        </div>
      </div>

    {fields.length === 0 ? (
      <InputStep steps="input" prompt={prompt} handleGenerate={handleGenerate} setPrompt={setPrompt} generating={generating} />
    ) : (
      <ReviewStep step="review" prompt={prompt} form={form} fields={fields} append={append} remove={remove} update={update} editingIdx={editingIdx} setEditingIdx={setEditingIdx} handleAttach={handleAttach} setStep={(step) => setStep(step)} note={note} />
    )}
    </div>
  );
}

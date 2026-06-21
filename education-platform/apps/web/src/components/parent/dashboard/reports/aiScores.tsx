
import {Bot} from 'lucide-react';
import { COLORS } from '@/styles/constant/constantColor';
const { BORDER, TEXT, MUTED, BG,MINT_BG,PEACH_BG,MINT_DARK } = COLORS;

type AIScoreProps = {
  aiScores: AIScoreItem[];
};
type AIScoreItem = {
  name: string;
  score: number;
  member: string;
};

export default function Chart({ aiScores }: AIScoreProps) {
    return (
        <>
         {aiScores.length > 0 && (
                <div className="rounded-3xl p-5" style={{ background: '#FFFFFF', border: `1.5px solid ${BORDER}` }}>
                  <h3 className="mb-4 flex items-center gap-2" style={{ color: TEXT, fontWeight: 700 }}>
                    <Bot className="w-4 h-4" style={{ color: '#7C3AED' }} />Lịch sử điểm AI
                  </h3>
                  <div className="space-y-2">
                    {aiScores.map((s, i) => {
                      const bg = s.score >= 8 ? MINT_BG : s.score >= 5 ? PEACH_BG : '#FEE2E2';
                      const color = s.score >= 8 ? MINT_DARK : s.score >= 5 ? '#D97706' : '#DC2626';
                      return (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl" style={{ background: BG }}>
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold" style={{ background: bg, color }}>{s.score}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: TEXT }}>{s.name}</p>
                            <p className="text-xs" style={{ color: MUTED }}>{s.member}</p>
                          </div>
                          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#F5F5F4' }}>
                            <div className="h-full rounded-full" style={{ width: `${s.score * 10}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              </>
    )
}
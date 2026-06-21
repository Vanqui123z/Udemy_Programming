'use client';
import { useAuth } from '@/providers/contextAPI-provider';
import { BookOpen, Users, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

 const handleClickLogin = (role: 'parent' | 'child') => {
  if (isAuthenticated) {
    router.push('/dashboard');
    return;
  }
  router.push(`/login?role=${role}`);
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[linear-gradient(135deg,#DCFCE7_0%,#FAFAF9_40%,#FFF7ED_100%)]">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg bg-[linear-gradient(135deg,#4ADE80,#34D399)]">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-[#292524] font-bold text-[2.5rem] tracking-tight">KidTask</h1>
        <p className="mt-2 max-w-xs mx-auto text-[#78716C] text-base leading-relaxed">
          Quản lý học tập nhẹ nhàng, kết nối gia đình mỗi ngày ✨
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg">
        {/* Parent */}
        <button
          onClick={() => handleClickLogin('parent')}
          className="group text-left rounded-3xl p-7 border-2 border-[#E7E5E4] bg-white transition-all duration-300 -translate-y-0 
          hover:-translate-y-1 shadow-[0_2px_12px_0_rgba(74,222,128,0.08)] 
          hover:shadow-[0_8px_24px_0_rgba(74,222,128,0.18)] 
          hover:border-[#4ADE80]"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 bg-[#DCFCE7]">
            <Users className="w-7 h-7 text-[#16A34A]" />
          </div>
          <h2 className="text-[#292524] font-bold text-lg">Phụ huynh</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#78716C]">Giao nhiệm vụ, theo dõi tiến độ và dùng AI hỗ trợ giảng dạy</p>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#16A34A]">
            <span>Vào bảng điều khiển</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Member */}
        <button
          onClick={() => handleClickLogin('child')}
          className="group text-left rounded-3xl p-7 border-2 border-[#E7E5E4] bg-white transition-all duration-300 -translate-y-0 
          hover:-translate-y-1 shadow-[0_2px_12px_0_rgba(253,186,116,0.08)] 
          hover:shadow-[0_8px_24px_0_rgba(253,186,116,0.2)] 
          hover:border-[#FDBA74]"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-[#FFF7ED]">
            <BookOpen className="w-7 h-7 text-[#EA580C]" />
          </div>
          <h2 className="text-[#292524] font-bold text-lg">Thành viên</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#78716C]">Xem nhiệm vụ hôm nay, nộp bài và làm bài tập được giao 📚</p>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#EA580C]">
            <span>Bắt đầu học</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      {/* Features */}
      <div className="mt-12 space-y-3 text-center">
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {['AI tạo bài tập', 'Theo dõi tiến độ', 'Thông báo tức thì'].map(f => (
            <div key={f} className="flex items-center gap-1.5 text-sm text-[#78716C]">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
              <span>{f}</span>
            </div>
          ))}
        </div>
        <p className="text-xs flex items-center justify-center gap-1 text-[#A8A29E]">
          <Sparkles className="w-3.5 h-3.5" />
          68 chức năng · Hỗ trợ AI thông minh
        </p>
      </div>
    </div>
  );
}
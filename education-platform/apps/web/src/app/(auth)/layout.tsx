import "@/styles/auth-common.css";
import React from "react";
import LogoCode from "../../components/logoCode/logoCode";
import { codeSnippet } from "../../helper/codeSnippet";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(135deg,#DCFCE7_0%,#FAFAF9_40%,#FFF7ED_100%)]">
      
      {/* ─── Navbar ─── */}
      <nav className="relative z-20 px-10 py-5">
        <button className="absolute right-10 top-5 text-sm text-[#0F172A] hover:text-[#064E3B] transition-colors duration-200">
          <Link href={"/home"}> Back to Home </Link>
        </button>
        <LogoCode />
      </nav>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12 pt-4">
        
        <main className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.02),0_24px_60px_rgba(74,222,128,0.08)] border border-[#E7E5E4] flex flex-col md:flex-row animate-[cardIn_0.55s_cubic-bezier(0.22,1,0.36,1)_both]">
          
          <div className="md:flex-[0_0_42%] relative bg-[#0F172A] overflow-hidden min-h-[220px] md:min-h-[540px]" aria-hidden="true">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0F172A_0%,#064E3B_60%,#0F172A_100%)] opacity-90 z-10" />
            
            <pre className="absolute inset-0 z-20 font-mono text-[11px] leading-relaxed text-[#94A3B8] p-8 md:p-10 white-space-pre-wrap overflow-hidden animate-[fadeCode_1.2s_ease_both]">
              {codeSnippet}
            </pre>
           
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

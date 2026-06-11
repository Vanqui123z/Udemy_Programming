import "@/styles/auth-common.css";
import React from "react";
import LogoCode from "../../components/ui/logoCode";
import { codeSnippet } from "../../utils/codeSnippet";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="root">
      <nav className="navbar">
        <LogoCode />
      </nav>
      <div className="relative z-10">
        <main className="card-wrapper">
          <div className="card">
            {/* Left panel – code image */}
            <div className="card-image" aria-hidden="true">
              <div className="code-overlay" />
              <pre className="code-snippet">
                {codeSnippet}
              </pre>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

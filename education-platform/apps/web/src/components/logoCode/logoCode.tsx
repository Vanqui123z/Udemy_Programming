import { Hexagon } from "lucide-react";
import './logoCode.css';

export default function LogoCode() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <Hexagon size={28} strokeWidth={1.5} className="logo-hex" />
        <span className="logo-inner">C</span>
      </div>
      <span className="logo-text">
        <span className="logo-bold">Code</span>Mastery
      </span>
    </div>
  );
}
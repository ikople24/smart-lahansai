import { Globe, ContactRound, Facebook ,  } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-white/30 text-gray-800 text-sm py-3 px-4 backdrop-blur-md border-t border-gray-300 flex justify-between items-center">
      <div>© 2025 smart-lahansai — All rights reserved</div>
      <div className="flex gap-4 text-lg">
        <a href="https://lahansai.go.th/" className="hover:text-[#1DA1F2] transition-colors duration-200"><Globe size={20} strokeWidth={1.5} /></a>
        <a href="https://lin.ee/fQ6G0jg" className="hover:text-[#67ff49] transition-colors duration-200"><ContactRound size={20} strokeWidth={1.5} /></a>
        <a href="https://www.facebook.com/p/%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%A5%E0%B8%B0%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B2%E0%B8%A2-100068905822377" className="hover:text-[#1877F2] transition-colors duration-200"><Facebook size={20} strokeWidth={1.5} /></a>
      </div>
    </footer>
  );
}
import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-white text-black text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 group-hover:translate-y-0 translate-y-1 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
}

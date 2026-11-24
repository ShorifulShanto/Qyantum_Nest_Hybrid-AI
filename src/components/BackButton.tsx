import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onBack,
  label = 'Back',
}) => {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B1026]/80 hover:bg-[#131C3D] border border-white/10 text-xs font-mono text-[#CBD5E1] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[#5DA9FF]" />
      <span>{label}</span>
    </button>
  );
};

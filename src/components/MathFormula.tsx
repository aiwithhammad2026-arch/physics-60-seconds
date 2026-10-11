import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  latex: string;
  label?: string;
  unit?: string;
  glowColor?: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  label,
  unit,
  glowColor = '#00f0ff',
  highlight = false,
  size = 'md',
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  }, [latex]);

  const sizeClasses = {
    sm: 'text-sm py-1 px-2.5',
    md: 'text-base py-1.5 px-3',
    lg: 'text-lg py-2 px-4',
    xl: 'text-2xl py-3 px-5',
  };

  return (
    <div
      className={`math-formula-badge group relative flex flex-col items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: highlight ? `${glowColor}99` : 'rgba(255, 255, 255, 0.12)',
        background: highlight
          ? `linear-gradient(135deg, ${glowColor}18 0%, rgba(10, 15, 30, 0.75) 100%)`
          : 'rgba(10, 15, 30, 0.65)',
        boxShadow: highlight
          ? `0 0 25px ${glowColor}33, inset 0 0 15px ${glowColor}18`
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      {label && (
        <span
          className="math-label mb-1 text-[10px] font-semibold tracking-widest uppercase transition-colors"
          style={{ color: highlight ? glowColor : 'rgba(200, 220, 255, 0.7)' }}
        >
          {label}
        </span>
      )}
      <div
        className="katex-render-container select-none leading-none"
        style={{
          textShadow: highlight ? `0 0 12px ${glowColor}` : 'none',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {unit && (
        <span className="mt-1 text-[10px] tracking-wider text-slate-400 font-mono">
          [{unit}]
        </span>
      )}
    </div>
  );
};

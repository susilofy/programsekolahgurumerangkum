import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { ProgramData, SectionKey } from '../types/program';
import {
  SECTIONS_META,
  validateProgramSections,
  calculateProgramProgress,
} from '../utils/validation';

interface SectionNavProps {
  currentSection: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  program: ProgramData;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  currentSection,
  onSelectSection,
  program,
}) => {
  const validations = validateProgramSections(program);
  const progressPercent = calculateProgramProgress(program);

  const getValidation = (key: SectionKey) => {
    return validations.find((v) => v.key === key);
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Top Header & Progress */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sistematika Dokumen
          </span>
          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {progressPercent}% Lengkap
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent >= 80
                ? 'bg-emerald-500'
                : progressPercent >= 50
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Connection Flow Helper Pill */}
      <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100/60 flex items-center gap-1.5 text-[11px] text-indigo-900 font-medium">
        <GitBranch className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span className="truncate">Alur: Latar → Tujuan → Sasaran → Kegiatan → Monev</span>
      </div>

      {/* Sections List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {SECTIONS_META.map((meta) => {
          const isSelected = currentSection === meta.key;
          const status = getValidation(meta.key);
          const isComplete = status?.isComplete ?? false;

          return (
            <button
              key={meta.key}
              onClick={() => onSelectSection(meta.key)}
              className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Step badge */}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-indigo-700 text-white font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {meta.stepNumber}
                </span>

                <span className="truncate">{meta.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {isComplete ? (
                  <span title="Lengkap">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-600'
                      }`}
                    />
                  </span>
                ) : (
                  <span title="Belum Lengkap">
                    <AlertCircle
                      className={`w-4 h-4 ${
                        isSelected ? 'text-amber-300' : 'text-amber-500'
                      }`}
                    />
                  </span>
                )}
                {isSelected && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Summary Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
        <span>13 Bagian Dokumen</span>
        <span className="font-semibold text-slate-700">
          {validations.filter((v) => v.isComplete).length} / 13 Selesai
        </span>
      </div>
    </aside>
  );
};

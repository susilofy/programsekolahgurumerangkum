import React from 'react';
import {
  CheckCircle2,
  FileSearch,
  Eye,
  FileDown,
  Printer,
  ArrowLeft,
  School,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from 'lucide-react';
import { ProgramData, SchoolData } from '../types/program';

interface HeaderProps {
  currentProgram: ProgramData | null;
  school: SchoolData;
  isSaving: boolean;
  lastSavedTime: Date | null;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onOpenAnalysis?: () => void;
  onOpenPreview?: () => void;
  onExportDocx?: () => void;
  onPrint?: () => void;
  onBackToList?: () => void;
  onDeleteProgram?: () => void;
  onSetAsDefault?: () => void;
  isEditorView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentProgram,
  school,
  isSaving,
  lastSavedTime,
  isSidebarOpen = true,
  onToggleSidebar,
  onOpenAnalysis,
  onOpenPreview,
  onExportDocx,
  onPrint,
  onBackToList,
  onDeleteProgram,
  onSetAsDefault,
  isEditorView = false,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Program or App Context */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Toggle Sidebar Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold shrink-0 cursor-pointer ${
                !isSidebarOpen
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
              title={isSidebarOpen ? 'Tutup Menu Bar (Ctrl+B)' : 'Buka Menu Bar (Ctrl+B)'}
              aria-label="Buka / Tutup Menu Bar"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 text-slate-700" />
              ) : (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-amber-300" />
                  <span className="font-bold hidden sm:inline">Buka Menu</span>
                </>
              )}
            </button>
          )}

          {isEditorView && onBackToList && (
            <button
              onClick={onBackToList}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Kembali ke Daftar Program"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            {isEditorView && currentProgram ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md shrink-0">
                  {currentProgram.bidang}
                </span>
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {currentProgram.namaProgram}
                </h2>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <School className="w-4 h-4 text-indigo-600" />
                  <span>{school.namaSekolah}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Tahun Pelajaran: {school.tahunPelajaran} • NPSN: {school.npsn}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Autosave & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Autosave Status */}
          {isEditorView && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
              {isSaving ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">✓ Tersimpan otomatis</span>
                  {lastSavedTime && (
                    <span className="text-[10px] text-emerald-600/80">
                      ({lastSavedTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {/* Action Buttons in Editor */}
          {isEditorView && (
            <div className="flex items-center gap-2">
              {onOpenAnalysis && (
                <button
                  onClick={onOpenAnalysis}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-2xs"
                  title="Analisis Keterpaduan & Mutu Program dengan AI"
                >
                  <FileSearch className="w-3.5 h-3.5 text-purple-600" />
                  <span>Analisis AI</span>
                </button>
              )}

              {onOpenPreview && (
                <button
                  onClick={onOpenPreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preview</span>
                </button>
              )}

              {onExportDocx && (
                <button
                  onClick={onExportDocx}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                  title="Download File Microsoft Word (.docx)"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Word (.docx)</span>
                </button>
              )}

              {onPrint && (
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
                  title="Cetak atau Simpan ke PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak / PDF</span>
                </button>
              )}

              {onDeleteProgram && (
                <button
                  onClick={onDeleteProgram}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Program Dokumen Ini"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

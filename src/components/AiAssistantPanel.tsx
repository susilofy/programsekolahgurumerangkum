import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  FileEdit,
  Minimize2,
  Maximize2,
  Building2,
  RefreshCw,
  Check,
  X,
  Undo2,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ProgramData, SectionKey } from '../types/program';
import { aiService, AiAssistParams } from '../services/aiService';

interface AiAssistantPanelProps {
  currentSection: SectionKey;
  program: ProgramData;
  currentContent: any;
  onApplyAiResult: (newContent: any) => void;
  onRestorePrevious?: () => void;
  hasPreviousVersion?: boolean;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  currentSection,
  program,
  currentContent,
  onApplyAiResult,
  onRestorePrevious,
  hasPreviousVersion = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [activeActionLabel, setActiveActionLabel] = useState<string | null>(null);

  const quickActions: {
    id: AiAssistParams['actionType'];
    label: string;
    icon: any;
    desc: string;
    color: string;
  }[] = [
    {
      id: 'buat_awal',
      label: '✨ Buat dari awal',
      icon: Sparkles,
      desc: 'Buatkan draf baru berdasarkan identitas & tujuan program',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    },
    {
      id: 'perbaiki',
      label: '✏️ Perbaiki tulisan',
      icon: FileEdit,
      desc: 'Sempurnakan kalimat, koherensi, dan substansi',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    {
      id: 'persingkat',
      label: '📌 Persingkat',
      icon: Minimize2,
      desc: 'Jadikan lebih padat, ringkas, dan to-the-point',
      color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
    },
    {
      id: 'perpanjang',
      label: '📖 Perjelas & Uraikan',
      icon: Maximize2,
      desc: 'Uraikan lebih detail disertai contoh konkrit di SD',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    {
      id: 'kondisi_sekolah',
      label: '🏫 Sesuaikan kondisi SD',
      icon: Building2,
      desc: 'Selaraskan dengan karakteristik guru & siswa SD',
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    },
    {
      id: 'alternatif',
      label: '🔄 Buat alternatif',
      icon: RefreshCw,
      desc: 'Tampilkan pilihan ide dan redaksi yang berbeda',
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    {
      id: 'formal',
      label: '🧹 Perbaiki bahasa resmi',
      icon: Wand2,
      desc: 'Standarkan ke bahasa dinas resmi (EYD / PUEBI)',
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    },
  ];

  const handleExecuteAction = async (
    actionType: AiAssistParams['actionType'],
    label: string
  ) => {
    setLoading(true);
    setError(null);
    setActiveActionLabel(label);

    try {
      const result = await aiService.requestSectionAssist({
        sectionKey: currentSection,
        actionType,
        currentContent,
        program,
        userInstruction: customInstruction.trim() || undefined,
      });

      setAiDraft(result);
    } catch (err: any) {
      console.error('Error invoking AI assistant:', err);
      let msg = err.message || 'Gagal memanggil asisten AI. Periksa koneksi internet.';
      if (
        msg.includes('503') ||
        msg.includes('high demand') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('overloaded')
      ) {
        msg =
          'Layanan AI sedang mengalami lonjakan antrean (503). Silakan coba lagi beberapa saat lagi.';
      } else if (msg.startsWith('{') && msg.includes('"message"')) {
        try {
          const parsed = JSON.parse(msg);
          if (parsed.error?.message) {
            msg = parsed.error.message;
          }
        } catch (_) {}
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!aiDraft) return;

    // Check if output is JSON for table sections
    if (['kegiatan', 'pelaksana', 'indikator', 'pembiayaan'].includes(currentSection)) {
      try {
        // Find JSON array in the text
        const jsonMatch = aiDraft.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          onApplyAiResult(parsed);
          setAiDraft(null);
          return;
        }
      } catch (e) {
        console.warn('Could not parse AI output as JSON, applying as raw text or fallback', e);
      }
    }

    onApplyAiResult(aiDraft);
    setAiDraft(null);
  };

  const handleCancelDraft = () => {
    setAiDraft(null);
    setError(null);
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Bantuan AI</h3>
            <p className="text-[11px] text-slate-500">
              Asisten penyusunan program SD
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Undo to previous version button */}
        {hasPreviousVersion && onRestorePrevious && (
          <button
            onClick={onRestorePrevious}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Undo2 className="w-3.5 h-3.5 text-slate-600" />
            <span>↩️ Kembalikan ke versi sebelumnya</span>
          </button>
        )}

        {/* Quick Actions List */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Pilihan Tindakan AI
          </label>
          <div className="space-y-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  disabled={loading}
                  onClick={() => handleExecuteAction(action.id, action.label)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-start gap-2.5 ${action.color} ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-semibold">{action.label}</div>
                    <div className="text-[10px] opacity-80 leading-snug">
                      {action.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Instruction Box */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Instruksi Khusus (Opsional)</span>
            <span title="Contoh: Buat dengan fokus pada siswa kelas awal (kelas 1-2)">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Contoh: Sesuaikan dengan Rapor Pendidikan numerasi, tambahkan contoh..."
              className="w-full text-xs p-2.5 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden resize-none bg-slate-50/50"
            />
            {customInstruction && (
              <button
                disabled={loading}
                onClick={() => handleExecuteAction('custom', 'Instruksi Khusus')}
                className="absolute right-2 bottom-2.5 p-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                title="Kirim instruksi khusus"
              >
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center space-y-2 animate-pulse">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin mx-auto" />
            <div className="text-xs font-semibold text-indigo-900">
              Menyusun {activeActionLabel || 'draft'}...
            </div>
            <p className="text-[11px] text-indigo-700/80">
              Menghubungkan konteks: <em>{program.namaProgram}</em>
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Gagal memproses bantuan AI</span>
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed">{error}</p>
            <button
              onClick={() => handleExecuteAction('perbaiki', 'Perbaiki')}
              className="text-[11px] font-bold text-red-700 underline hover:text-red-900"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* AI Result Preview Box */}
        {aiDraft && !loading && (
          <div className="border border-indigo-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hasil Saran AI</span>
              </span>
              <button
                onClick={handleCancelDraft}
                className="text-white/80 hover:text-white p-0.5"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 max-h-60 overflow-y-auto bg-slate-50/50 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap border-b border-slate-200">
              {aiDraft}
            </div>

            <div className="p-2.5 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={handleCancelDraft}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Abaikan
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>✓ Terapkan ke Dokumen</span>
              </button>
            </div>
          </div>
        )}

        {/* Ethical principle info */}
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <span>🛡️ Prinsip AI Program SD</span>
          </div>
          <p className="leading-snug text-amber-800">
            AI adalah asisten, keputusan akhir di tangan Bapak/Ibu Kepala Sekolah & Guru. Seluruh saran AI dapat diedit sebelum dokumen dicetak.
          </p>
        </div>
      </div>
    </aside>
  );
};

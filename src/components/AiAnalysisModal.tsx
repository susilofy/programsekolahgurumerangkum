import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  X,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { ProgramData, ProgramAnalysis } from '../types/program';
import { aiService } from '../services/aiService';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramData;
  onApplyImprovement: (updatedFields: Partial<ProgramData>) => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  program,
  onApplyImprovement,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ProgramAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'rekomendasi'>('audit');
  const [proposedFixesAccepted, setProposedFixesAccepted] = useState<Record<string, boolean>>({
    latarBelakang: true,
    tujuan: true,
  });
  const [appliedNotification, setAppliedNotification] = useState(false);

  if (!isOpen) return null;

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeProgram(program);
      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      let msg = err.message || 'Gagal menjalankan analisis AI.';
      if (
        msg.includes('503') ||
        msg.includes('high demand') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('overloaded')
      ) {
        msg =
          'Layanan AI sedang mengalami lonjakan antrean di server pusat (503). Sistem telah mencoba kembali otomatis. Silakan klik tombol "Coba Lagi Sekarang" di bawah.';
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

  const handleApplyProposedFixes = () => {
    if (!analysis?.usulanPerbaikanAI) return;

    const updates: Partial<ProgramData> = {};
    if (
      proposedFixesAccepted.latarBelakang &&
      analysis.usulanPerbaikanAI.latarBelakang
    ) {
      updates.latarBelakang = analysis.usulanPerbaikanAI.latarBelakang;
    }
    if (
      proposedFixesAccepted.tujuan &&
      analysis.usulanPerbaikanAI.tujuan &&
      analysis.usulanPerbaikanAI.tujuan.length > 0
    ) {
      updates.tujuan = analysis.usulanPerbaikanAI.tujuan;
    }

    onApplyImprovement(updates);
    setAppliedNotification(true);
    setTimeout(() => {
      setAppliedNotification(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <FileSearch className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                Analisis Program dengan AI
                <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                  10 Aspek Mutu Dokumen SD
                </span>
              </h3>
              <p className="text-xs text-purple-200/80">
                Pemeriksaan keselarasan Latar Belakang, Tujuan, Sasaran, Kegiatan, Indikator, & Evaluasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!analysis && !loading && (
            <div className="text-center py-12 px-4 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Siap Memeriksa Mutu Dokumen Program?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI akan bertindak sebagai auditor mutu independen untuk memeriksa apakah seluruh bagian program saling sinkron, indikator dapat diukur, dan bahasa sesuai standar kedinasan sekolah.
              </p>
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mulai Analisis Program Saya</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  Sedang Menganalisis 10 Aspek Program...
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Memverifikasi kesesuaian latar belakang, perumusan tujuan, keterukuran indikator, dan konsistensi rencana kegiatan SD.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2.5">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Terjadi kendala analisis AI</span>
              </div>
              <p className="leading-relaxed text-slate-700">{error}</p>
              <div className="pt-1">
                <button
                  onClick={runAnalysis}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xs active:scale-95 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Coba Lagi Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <div className="text-xs text-indigo-300 font-semibold mb-1">
                    STATUS KELAYAKAN DOKUMEN
                  </div>
                  <div className="text-xl font-extrabold flex items-center gap-2">
                    <span>{analysis.statusKeseluruhan}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                    {analysis.ringkasanEksekutif}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300">Skor Kualitas Program</div>
                  <div className="text-3xl font-black text-amber-400">
                    {analysis.skorKeseluruhan}
                    <span className="text-sm font-normal text-slate-300">/100</span>
                  </div>
                </div>
              </div>

              {/* Notification Banner when applied */}
              {appliedNotification && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perbaikan AI berhasil diterapkan ke dalam dokumen program Anda!</span>
                </div>
              )}

              {/* Sub tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'audit'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Detail 10 Aspek Evaluasi
                </button>
                <button
                  onClick={() => setActiveTab('rekomendasi')}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'rekomendasi'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Usulan Perbaikan dengan AI</span>
                </button>
              </div>

              {/* Tab 1: Audit 10 Aspects */}
              {activeTab === 'audit' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.analisisItem.map((item, index) => {
                    const isGood = item.status.includes('🟢');
                    const isWarning = item.status.includes('🟡');

                    return (
                      <div
                        key={index}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isGood
                            ? 'bg-emerald-50/40 border-emerald-200/70'
                            : isWarning
                            ? 'bg-amber-50/50 border-amber-200/80'
                            : 'bg-red-50/40 border-red-200/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h5 className="font-bold text-xs text-slate-900 leading-snug">
                            {index + 1}. {item.aspek}
                          </h5>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isGood
                                ? 'bg-emerald-100 text-emerald-800'
                                : isWarning
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                          {item.catatan}
                        </p>
                        {item.saranPerbaikan && (
                          <div className="p-2 rounded-lg bg-white/80 border border-slate-200/60 text-[11px] text-indigo-900 font-medium">
                            <span className="font-bold text-indigo-700">Rekomendasi: </span>
                            {item.saranPerbaikan}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Proposed Fixes with Approval */}
              {activeTab === 'rekomendasi' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>Prinsip Persetujuan Pengguna</span>
                    </div>
                    <p className="text-purple-800 leading-relaxed">
                      AI telah menyiapkan usulan penyempurnaan redaksi. Centang bagian yang ingin Anda terapkan ke dalam dokumen sebelum menekan tombol "Terapkan Perbaikan Terpilih".
                    </p>
                  </div>

                  {analysis.usulanPerbaikanAI?.latarBelakang && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={proposedFixesAccepted.latarBelakang}
                            onChange={(e) =>
                              setProposedFixesAccepted((prev) => ({
                                ...prev,
                                latarBelakang: e.target.checked,
                              }))
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span>Usulan Penyempurnaan Latar Belakang</span>
                        </label>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                          Revisi Narasi
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200">
                        {analysis.usulanPerbaikanAI.latarBelakang}
                      </div>
                    </div>
                  )}

                  {analysis.usulanPerbaikanAI?.tujuan && analysis.usulanPerbaikanAI.tujuan.length > 0 && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={proposedFixesAccepted.tujuan}
                            onChange={(e) =>
                              setProposedFixesAccepted((prev) => ({
                                ...prev,
                                tujuan: e.target.checked,
                              }))
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span>Usulan Perumusan Tujuan Lebih Spesifik & Terukur</span>
                        </label>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                          {analysis.usulanPerbaikanAI.tujuan.length} Butir Tujuan
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 space-y-1.5 border border-slate-200">
                        {analysis.usulanPerbaikanAI.tujuan.map((tuj, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-bold text-indigo-700">{i + 1}.</span>
                            <span>{tuj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.usulanPerbaikanAI?.kegiatanTambahan && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800 mb-1">
                        Saran Penguatan Rangkaian Kegiatan:
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis.usulanPerbaikanAI.kegiatanTambahan}
                      </p>
                    </div>
                  )}

                  {analysis.usulanPerbaikanAI?.indikatorSaran && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800 mb-1">
                        Saran Keterukuran Indikator:
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis.usulanPerbaikanAI.indikatorSaran}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleApplyProposedFixes}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Setujui & Terapkan Perbaikan ke Dokumen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {analysis ? 'Analisis selesai dihitung' : 'Siap melakukan audit'}
          </div>
          <div className="flex items-center gap-2">
            {analysis && (
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Analisis Ulang
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

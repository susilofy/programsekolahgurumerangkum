import React from 'react';
import {
  FilePlus2,
  FolderKanban,
  Library,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  FileDown,
  Trash2,
  Copy,
  BookOpen,
  Award,
  Calendar,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { ProgramData, SchoolData } from '../types/program';
import { calculateProgramProgress } from '../utils/validation';
import { TEMPLATES } from '../data/initialData';

interface DashboardViewProps {
  programs: ProgramData[];
  school: SchoolData;
  onSelectProgram: (prog: ProgramData) => void;
  onStartNewWizard: () => void;
  onOpenTemplates: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (prog: ProgramData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  programs,
  school,
  onSelectProgram,
  onStartNewWizard,
  onOpenTemplates,
  onDuplicate,
  onDelete,
  onPreview,
}) => {
  const totalPrograms = programs.length;
  const completedCount = programs.filter(
    (p) => calculateProgramProgress(p) >= 80
  ).length;
  const draftCount = totalPrograms - completedCount;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Penyusun Program Kegiatan Sekolah Berbantuan AI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Selamat Datang di PROGRAMKU SD
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Membantu Kepala Sekolah & Guru SD menyusun dokumen Program Kegiatan Sekolah secara sistematis, cepat, profesional, dan sesuai regulasi pendidikan Indonesia.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartNewWizard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <FilePlus2 className="w-4 h-4 text-amber-300" />
              <span>+ Buat Program Baru</span>
            </button>

            <button
              onClick={onOpenTemplates}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <Library className="w-4 h-4 text-slate-300" />
              <span>Gunakan Template Siap Pakai ({TEMPLATES.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Program Disusun</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalPrograms}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tahun {school.tahunPelajaran}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Program Siap Pengesahan</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
            <div className="text-[11px] text-emerald-600/80 mt-0.5">Kelengkapan di atas 80%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Draf Dalam Proses</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{draftCount}</div>
            <div className="text-[11px] text-amber-600/80 mt-0.5">Dapat disempurnakan dengan AI</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Programs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Program Terkini</h2>
            <p className="text-xs text-slate-500">
              Daftar dokumen kegiatan yang sedang aktif dikerjakan di {school.namaSekolah}.
            </p>
          </div>
          <button
            onClick={onStartNewWizard}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>+ Program Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {programs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Program Kegiatan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai susun dokumen program pertama Anda dengan wizard berbantuan AI atau gunakan template yang sudah tersedia.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={onStartNewWizard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700"
              >
                + Buat Program Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.slice(0, 6).map((prog) => {
              const progress = calculateProgramProgress(prog);

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md truncate max-w-[160px]">
                        {prog.bidang}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {prog.tahunPelajaran}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProgram(prog)}
                      className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {prog.namaProgram}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.latarBelakang
                        ? prog.latarBelakang
                        : 'Belum ada latar belakang. Klik untuk mulai melengkapi.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    {/* Progress indicator */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-500">Kelengkapan</span>
                        <span
                          className={
                            progress >= 80 ? 'text-emerald-600' : 'text-indigo-600'
                          }
                        >
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress >= 80 ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview(prog);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Preview A4 Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(prog.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Duplikasi Program"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(prog.id);
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Program"
                          aria-label="Hapus Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProgram(prog)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>Buka Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guidelines Box */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="font-bold flex items-center gap-2 text-sm text-amber-900">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Panduan Penyusunan Dokumen Program SD yang Baik</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Setiap program sekolah hendaknya berpijak pada masalah nyata (Rapor Pendidikan), memiliki tujuan yang selaras dengan indikator terukur, serta memuat mekanisme monev dan tindak lanjut yang dapat dipertanggungjawabkan kepada pengawas dan komite sekolah.
        </p>
      </div>

      {/* Developer Attribution Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
            SF
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pengembang Aplikasi
            </div>
            <div className="text-sm font-bold text-slate-900">
              Susilo Fitri Yatmoko, M.Pd
            </div>
            <div className="text-xs text-slate-500">
              Pengembang Aplikasi & Konten Edukasi Pendidikan Dasar
            </div>
          </div>
        </div>

        <a
          href="https://www.gurumerangkum.com/?m=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 text-xs font-bold transition-all shadow-2xs group"
          title="Buka Website Resmi Pengembang"
        >
          <Globe className="w-4 h-4 text-indigo-500 group-hover:text-white transition-colors" />
          <span>Kunjungi Web: gurumerangkum.com</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </div>
  );
};

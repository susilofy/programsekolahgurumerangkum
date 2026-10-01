import React, { useState } from 'react';
import {
  Search,
  Filter,
  FilePlus2,
  Eye,
  FileDown,
  Copy,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { ProgramData, SchoolData } from '../types/program';
import { PROGRAM_FIELDS } from '../data/initialData';
import { calculateProgramProgress } from '../utils/validation';
import { exportService } from '../services/exportService';

interface ProgramListViewProps {
  programs: ProgramData[];
  school: SchoolData;
  onSelectProgram: (prog: ProgramData) => void;
  onStartNewWizard: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (prog: ProgramData) => void;
}

export const ProgramListView: React.FC<ProgramListViewProps> = ({
  programs,
  school,
  onSelectProgram,
  onStartNewWizard,
  onDuplicate,
  onDelete,
  onPreview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'Selesai' | 'Draft'>('Semua');

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.namaProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang =
      selectedBidang === 'Semua' || p.bidang === selectedBidang;

    const progress = calculateProgramProgress(p);
    const matchesStatus =
      selectedStatus === 'Semua' ||
      (selectedStatus === 'Selesai' && progress >= 80) ||
      (selectedStatus === 'Draft' && progress < 80);

    return matchesSearch && matchesBidang && matchesStatus;
  });

  const handleExportWord = async (e: React.MouseEvent, prog: ProgramData) => {
    e.stopPropagation();
    try {
      await exportService.exportToDocx(prog, school);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Daftar Program Saya
          </h1>
          <p className="text-xs text-slate-500">
            Kelola, edit, duplikasi, dan cetak seluruh dokumen program kegiatan SD Anda.
          </p>
        </div>

        <button
          onClick={onStartNewWizard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
        >
          <FilePlus2 className="w-4 h-4 text-amber-300" />
          <span>+ Buat Program Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama program, bidang, atau penanggung jawab..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Filter Bidang */}
          <div>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            >
              <option value="Semua">Semua Bidang Program</option>
              {PROGRAM_FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
            >
              <option value="Semua">Semua Status Kelengkapan</option>
              <option value="Selesai">Siap Pengesahan (≥80%)</option>
              <option value="Draft">Masih Draf (&lt;80%)</option>
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Menampilkan {filteredPrograms.length} dari {programs.length} program</span>
          {(searchTerm || selectedBidang !== 'Semua' || selectedStatus !== 'Semua') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBidang('Semua');
                setSelectedStatus('Semua');
              }}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid of Programs */}
      {filteredPrograms.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Tidak Ditemukan Program</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada dokumen program yang sesuai dengan kata kunci pencarian atau filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((prog) => {
            const progress = calculateProgramProgress(prog);
            const isComplete = progress >= 80;

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md truncate max-w-[170px]">
                      {prog.bidang}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isComplete
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isComplete ? 'Siap Pengesahan' : 'Draf'}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProgram(prog)}
                    className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                  >
                    {prog.namaProgram}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-600">PJ:</span>
                      <span className="truncate">{prog.penanggungJawab}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Diperbarui: {new Date(prog.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-semibold">
                      <span className="text-slate-500">Kelengkapan Sistematika</span>
                      <span className={isComplete ? 'text-emerald-600' : 'text-indigo-600'}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
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
                        onClick={(e) => handleExportWord(e, prog)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Download Word (.docx)"
                      >
                        <FileDown className="w-4 h-4" />
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Buka & Edit</span>
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
  );
};

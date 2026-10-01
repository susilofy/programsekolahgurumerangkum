import React, { useState, useMemo } from 'react';
import {
  Library,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calculator,
  Smile,
  Users,
  Compass,
  HeartHandshake,
  Shield,
  Layers,
  Eye,
  FileCheck,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Check,
} from 'lucide-react';
import { TEMPLATES } from '../data/initialData';
import { ProgramData, SchoolData } from '../types/program';

interface TemplatesViewProps {
  school: SchoolData;
  onUseTemplate: (template: Partial<ProgramData>) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  school,
  onUseTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<ProgramData> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState<string>('Semua');

  const getTemplateIcon = (bidang?: string) => {
    switch (bidang) {
      case 'Literasi':
        return BookOpen;
      case 'Numerasi':
        return Calculator;
      case 'Karakter':
        return Smile;
      case 'PTK (Pendidik & Tendik)':
        return Users;
      case 'Ekstrakurikuler':
        return Compass;
      case 'UKS':
        return Shield;
      case 'Kemitraan':
        return HeartHandshake;
      case 'Perpustakaan':
        return Library;
      case 'Kesiswaan':
        return CheckCircle2;
      case 'Pembelajaran':
        return Sparkles;
      case 'Manajemen Sekolah':
        return FileCheck;
      default:
        return Layers;
    }
  };

  // Get unique categories and count
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    TEMPLATES.forEach((t) => {
      const b = t.bidang || 'Lainnya';
      map.set(b, (map.get(b) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filter templates by category and search query
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tmpl) => {
      const matchBidang =
        selectedBidang === 'Semua' || tmpl.bidang === selectedBidang;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tmpl.namaProgram?.toLowerCase().includes(q) ||
        tmpl.bidang?.toLowerCase().includes(q) ||
        tmpl.latarBelakang?.toLowerCase().includes(q) ||
        tmpl.masalahKondisi?.toLowerCase().includes(q);
      return matchBidang && matchSearch;
    });
  }, [searchQuery, selectedBidang]);

  const handleApply = (template: Partial<ProgramData>) => {
    onUseTemplate(template);
  };

  const calculateBudgetTotal = (tmpl: Partial<ProgramData>) => {
    if (!tmpl.pembiayaan?.items || tmpl.pembiayaan.items.length === 0) return 0;
    return tmpl.pembiayaan.items.reduce((sum, it) => sum + (it.jumlah || 0), 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with dynamic template count */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-indigo-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Library className="w-3.5 h-3.5 text-amber-300" />
            <span>Koleksi {TEMPLATES.length} Template Standar Kemendikbudristek untuk SD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Template Program Sekolah Siap Pakai
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pilih dari {TEMPLATES.length} draf program terstruktur lengkap (Latar Belakang, Regulasi, Sasaran, 4 Tahapan Kegiatan, Indikator SMART, Rincian Anggaran, dan Instrumen Monev). Langsung gunakan atau sesuaikan dengan bantuan AI untuk satuan pendidikan Anda.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama program, kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Result Count Indicator */}
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 self-end sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              Menampilkan <strong>{filteredTemplates.length}</strong> dari{' '}
              <strong>{TEMPLATES.length}</strong> template
            </span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedBidang('Semua')}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              selectedBidang === 'Semua'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({TEMPLATES.length})
          </button>
          {categories.map(([bidang, count]) => (
            <button
              key={bidang}
              onClick={() => setSelectedBidang(bidang)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                selectedBidang === bidang
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bidang} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
          <Library className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Tidak ada template yang cocok</p>
          <p className="text-xs text-slate-500">
            Coba ubah kata kunci pencarian atau pilih kategori bidang lainnya.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBidang('Semua');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-100"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tmpl, idx) => {
            const Icon = getTemplateIcon(tmpl.bidang);
            const totalBudget = calculateBudgetTotal(tmpl);

            return (
              <div
                key={tmpl.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                      {tmpl.bidang}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Template #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {tmpl.namaProgram}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {tmpl.latarBelakang}
                  </p>

                  {/* Highlights */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        <strong>Tujuan:</strong> {tmpl.tujuan?.[0] || 'Tercantum lengkap'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>
                          <strong>Kegiatan:</strong> {tmpl.kegiatan?.length || 4} tahapan
                        </span>
                      </div>
                      {totalBudget > 0 && (
                        <div className="flex items-center gap-1 text-slate-500 font-medium">
                          <DollarSign className="w-3 h-3 text-amber-600" />
                          <span>Rp {totalBudget.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTemplate(tmpl)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Rincian</span>
                  </button>

                  <button
                    onClick={() => handleApply(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
                  >
                    <span>Gunakan Template Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Template */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {selectedTemplate.bidang}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">
                  {selectedTemplate.namaProgram}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Latar Belakang:</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedTemplate.latarBelakang}
                </p>
              </div>

              {selectedTemplate.dasarHukum && selectedTemplate.dasarHukum.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Dasar Hukum & Regulasi:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedTemplate.dasarHukum.map((dh, i) => (
                      <li key={i}>{dh.text}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Butir Tujuan Program:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {selectedTemplate.tujuan?.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Rangkaian Tahapan Kegiatan:</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 w-32">Tahap</th>
                        <th className="p-2">Uraian Kegiatan</th>
                        <th className="p-2 w-36">PJ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedTemplate.kegiatan?.map((k, i) => (
                        <tr key={i}>
                          <td className="p-2 font-semibold text-slate-800">{k.tahapan}</td>
                          <td className="p-2 text-slate-600">{k.uraian}</td>
                          <td className="p-2 text-slate-500">{k.penanggungJawab || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedTemplate.indikator && selectedTemplate.indikator.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Indikator Keberhasilan:</h4>
                  <div className="space-y-1.5">
                    {selectedTemplate.indikator.map((ind, i) => (
                      <div
                        key={i}
                        className="bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-lg flex items-start gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-emerald-950">{ind.indikator}</div>
                          <div className="text-emerald-700 text-[10px]">Target: {ind.target}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.pembiayaan?.items && selectedTemplate.pembiayaan.items.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900">Rencana Anggaran Biaya:</h4>
                    <span className="text-[11px] font-bold text-indigo-700">
                      Total: Rp {calculateBudgetTotal(selectedTemplate).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2">Kebutuhan</th>
                          <th className="p-2 w-20 text-center">Vol</th>
                          <th className="p-2 w-24 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedTemplate.pembiayaan.items.map((item, i) => (
                          <tr key={i}>
                            <td className="p-2 text-slate-700">{item.kebutuhan}</td>
                            <td className="p-2 text-center text-slate-600">
                              {item.volume} {item.satuan}
                            </td>
                            <td className="p-2 text-right font-semibold text-slate-800">
                              Rp {(item.jumlah || 0).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const tmpl = selectedTemplate;
                  setSelectedTemplate(null);
                  handleApply(tmpl);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Gunakan Template Ini Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
  AlertCircle,
  Users,
  Check,
} from 'lucide-react';
import {
  ProgramData,
  SchoolData,
  Teacher,
  ActivityItem,
  PelaksanaItem,
  IndikatorItem,
  BudgetItem,
  DasarHukumItem,
} from '../types/program';
import { PROGRAM_FIELDS } from '../data/initialData';
import { exportService } from '../services/exportService';
import {
  getSectionNarrative,
  formatLatarBelakangMinimal3Paragraf,
} from '../utils/documentNarratives';

interface NarrativeSectionFieldsProps {
  sectionTitle: string;
  pengantarValue?: string;
  penjelasValue?: string;
  defaultPengantar: string;
  defaultPenjelas: string;
  onPengantarChange: (val: string) => void;
  onPenjelasChange: (val: string) => void;
}

const NarrativeSectionFields: React.FC<NarrativeSectionFieldsProps> = ({
  sectionTitle,
  pengantarValue,
  penjelasValue,
  defaultPengantar,
  defaultPenjelas,
  onPengantarChange,
  onPenjelasChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const isCustomized = Boolean(pengantarValue || penjelasValue);

  return (
    <div className="border border-indigo-100 rounded-xl bg-indigo-50/40 p-3.5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-950">
            📝 Narasi Paragraf Awal & Paragraf Penjelas ({sectionTitle})
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              isCustomized
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {isCustomized ? 'Teks Kustom' : 'Otomatis Baku'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline self-start sm:self-auto"
        >
          {open ? 'Sembunyikan Narasi' : 'Edit Paragraf Pengantar & Penjelas'}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 pt-3 border-t border-indigo-100/80 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                1. Paragraf Pengantar (Paragraf Awal sebelum data/tabel):
              </label>
              <button
                type="button"
                onClick={() => onPengantarChange(defaultPengantar)}
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
                title="Kembalikan ke narasi baku standar kedinasan"
              >
                Gunakan Teks Baku
              </button>
            </div>
            <textarea
              rows={2}
              value={pengantarValue ?? defaultPengantar}
              onChange={(e) => onPengantarChange(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                2. Paragraf Penjelas (Paragraf Penutup setelah data/tabel):
              </label>
              <button
                type="button"
                onClick={() => onPenjelasChange(defaultPenjelas)}
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
                title="Kembalikan ke narasi baku standar kedinasan"
              >
                Gunakan Teks Baku
              </button>
            </div>
            <textarea
              rows={2}
              value={penjelasValue ?? defaultPenjelas}
              onChange={(e) => onPenjelasChange(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionEditorProps {
  sectionKey: string;
  program: ProgramData;
  school: SchoolData;
  teachers: Teacher[];
  onChange: (updated: Partial<ProgramData>) => void;
  onRequestAi: (actionType?: string, customNote?: string) => void;
}

export const SectionEditors: React.FC<SectionEditorProps> = ({
  sectionKey,
  program,
  school,
  teachers,
  onChange,
  onRequestAi,
}) => {
  // Helpers
  const classesList = [
    'Kelas I',
    'Kelas II',
    'Kelas III',
    'Kelas IV',
    'Kelas V',
    'Kelas VI',
  ];

  /* -------------------------------------------------------------
   * 01. IDENTITAS PROGRAM
   * ----------------------------------------------------------- */
  if (sectionKey === 'identitas') {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            A. Identitas Program Kegiatan Sekolah
          </h3>
          <p className="text-xs text-slate-500">
            Informasi umum mengenai satuan pendidikan, judul program, dan penanggung jawab kegiatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Satuan Pendidikan
            </label>
            <input
              type="text"
              value={school.namaSekolah}
              disabled
              className="w-full text-xs p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Dapat diubah pada menu Data Sekolah
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tahun Pelajaran
            </label>
            <input
              type="text"
              value={program.tahunPelajaran}
              onChange={(e) => onChange({ tahunPelajaran: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Program / Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={program.namaProgram}
              onChange={(e) => onChange({ namaProgram: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bidang Program
            </label>
            <select
              value={program.bidang}
              onChange={(e) => onChange({ bidang: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {PROGRAM_FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Penanggung Jawab Utama
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={program.penanggungJawab}
                onChange={(e) => onChange({ penanggungJawab: e.target.value })}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) onChange({ penanggungJawab: e.target.value });
                }}
                className="text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 shrink-0"
              >
                <option value="">Pilih Guru</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.nama}>
                    {t.nama} ({t.jabatan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tempat Penyusunan / Pengesahan
            </label>
            <input
              type="text"
              value={program.tempatPenyusunan}
              onChange={(e) => onChange({ tempatPenyusunan: e.target.value })}
              placeholder="Contoh: Nusantara"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Pengesahan Dokumen
            </label>
            <input
              type="text"
              value={program.tanggalPengesahan}
              onChange={(e) => onChange({ tanggalPengesahan: e.target.value })}
              placeholder="Contoh: 20 Juli 2026"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Status Penerapan KOP Surat pada Dokumen */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>📄</span> KOP Surat pada Dokumen Resmi:
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                school.kopUrl
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {school.kopUrl ? '⭐ KOP Gambar Diterapkan' : 'Format Teks Kedinasan'}
            </span>
          </div>

          {school.kopUrl ? (
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center shadow-2xs">
              <img
                src={school.kopUrl}
                alt={`KOP ${school.namaSekolah}`}
                className="max-h-24 w-auto max-w-full mx-auto object-contain block select-none"
              />
              <p className="text-[10px] text-slate-500 mt-1.5 italic">
                Gambar KOP sekolah ini otomatis langsung terpasang di lembar dokumen cetak, preview, dan file Word (.docx).
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-600">
              Dokumen saat ini menggunakan format teks kedinasan standar. Anda dapat mengunggah gambar KOP surat satuan pendidikan pada menu <strong>Data Master Sekolah</strong> agar langsung terpasang.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 02. LATAR BELAKANG
   * ----------------------------------------------------------- */
  if (sectionKey === 'latar_belakang') {
    const rawParagraphs = (program.latarBelakang || '')
      .split(/\n{2,}|\r\n\r\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const paragraphCount = rawParagraphs.length;
    const isThreeOrMore = paragraphCount >= 3;

    const handleAuto3Paragraf = () => {
      const formatted = formatLatarBelakangMinimal3Paragraf(
        program.latarBelakang,
        program,
        school
      );
      onChange({ latarBelakang: formatted.join('\n\n') });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">B. Latar Belakang</h3>
            <p className="text-xs text-slate-500">
              Uraian komprehensif kondisi ideal, masalah nyata sekolah, dan urgensi intervensi program (standar minimal 3 paragraf).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAuto3Paragraf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Susun teks menjadi 3 paragraf utuh berstandar kedinasan"
            >
              <span>📄 Susun 3 Paragraf Standar</span>
            </button>
            <button
              onClick={() => onRequestAi('buat_awal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ Bantu AI</span>
            </button>
          </div>
        </div>

        {/* Status Verifikasi Minimal 3 Paragraf */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isThreeOrMore
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isThreeOrMore ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>
                  {isThreeOrMore
                    ? `Status: ${paragraphCount} Paragraf Terdeteksi (Memenuhi Standar Minimal 3 Paragraf)`
                    : `Status: ${paragraphCount} / 3 Paragraf Terdeteksi (Disarankan Minimal 3 Paragraf)`}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Struktur resmi kedinasan SD: <strong>Paragraf 1</strong> (Kondisi Ideal & Kurikulum Merdeka) • <strong>Paragraf 2</strong> (Kondisi Nyata & Rapor Pendidikan) • <strong>Paragraf 3</strong> (Solusi & Urgensi Program).
              </p>
            </div>
          </div>

          {!isThreeOrMore && (
            <button
              onClick={handleAuto3Paragraf}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 self-start sm:self-auto shadow-xs"
            >
              Formatkan 3 Paragraf Otomatis
            </button>
          )}
        </div>

        {/* Input Konteks Sekolah untuk AI */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 block">
            Konteks Pendukung Pembuatan Latar Belakang:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Masalah / Kondisi Nyata Sekolah
              </label>
              <input
                type="text"
                value={program.masalahKondisi || ''}
                onChange={(e) => onChange({ masalahKondisi: e.target.value })}
                placeholder="Contoh: Minat baca siswa masih rendah pada kelas awal..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Data Rapor Pendidikan / Evaluasi
              </label>
              <input
                type="text"
                value={program.raporPendidikan || ''}
                onChange={(e) => onChange({ raporPendidikan: e.target.value })}
                placeholder="Contoh: Indikator Literasi Rapor Pendidikan warna kuning..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Editor Teks Utama */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Narasi Latar Belakang Lengkap (Pisahkan antar paragraf dengan dua kali enter)
          </label>
          <textarea
            rows={12}
            value={program.latarBelakang}
            onChange={(e) => onChange({ latarBelakang: e.target.value })}
            placeholder="Tuliskan latar belakang program di sini atau klik 'Bantu AI' untuk menyusun draft otomatis..."
            className="w-full text-xs p-3.5 border border-slate-300 rounded-xl leading-relaxed focus:ring-2 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* Quick AI Action Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onRequestAi('perbaiki')}
              className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer"
            >
              ✏️ Perbaiki Tulisan
            </button>
            <button
              type="button"
              onClick={() => onRequestAi('persingkat')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 cursor-pointer"
            >
              📌 Persingkat
            </button>
            <button
              type="button"
              onClick={() => onRequestAi('perpanjang')}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 cursor-pointer"
            >
              📖 Perpanjang / Uraikan
            </button>
            <button
              type="button"
              onClick={() => onRequestAi('formal')}
              className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 cursor-pointer"
            >
              🧹 Buat Lebih Formal
            </button>
          </div>

          {program.latarBelakang && (
            <button
              type="button"
              onClick={() => onChange({ latarBelakang: '' })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors cursor-pointer"
              title="Hapus / kosongkan isi narasi latar belakang"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Teks</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 03. DASAR HUKUM
   * ----------------------------------------------------------- */
  if (sectionKey === 'dasar_hukum') {
    const handleAddDasarHukum = () => {
      const newItem: DasarHukumItem = {
        id: `dh-${Date.now()}`,
        text: '',
        perluDiverifikasi: false,
      };
      onChange({ dasarHukum: [...program.dasarHukum, newItem] });
    };

    const handleUpdateDasarHukum = (
      id: string,
      field: keyof DasarHukumItem,
      value: any
    ) => {
      const updated = program.dasarHukum.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      onChange({ dasarHukum: updated });
    };

    const handleRemoveDasarHukum = (id: string) => {
      onChange({ dasarHukum: program.dasarHukum.filter((d) => d.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">C. Dasar Hukum</h3>
            <p className="text-xs text-slate-500">
              Landasan regulasi perundang-undangan pendidikan nasional yang relevan.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Bantu AI Rekomendasi Regulasi</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Dasar Hukum"
          pengantarValue={program.pengantarDasarHukum}
          penjelasValue={program.penjelasDasarHukum}
          defaultPengantar={getSectionNarrative('dasarHukum', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('dasarHukum', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarDasarHukum: val })}
          onPenjelasChange={(val) => onChange({ penjelasDasarHukum: val })}
        />

        <div className="space-y-3">
          {program.dasarHukum.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="font-bold text-xs text-indigo-700 mt-2 shrink-0">
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={item.text}
                  onChange={(e) =>
                    handleUpdateDasarHukum(item.id, 'text', e.target.value)
                  }
                  placeholder="Contoh: Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional"
                  className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDasarHukum(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg mt-1 transition-colors cursor-pointer shrink-0"
                  title="Hapus dasar hukum ini"
                  aria-label="Hapus dasar hukum"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pl-6">
                <label className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.perluDiverifikasi}
                    onChange={(e) =>
                      handleUpdateDasarHukum(
                        item.id,
                        'perluDiverifikasi',
                        e.target.checked
                      )
                    }
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Tandai sebagai: <strong>(Perlu diverifikasi)</strong></span>
                </label>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddDasarHukum}
              className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dasar Hukum Manual</span>
            </button>
            {program.dasarHukum.length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ dasarHukum: [] })}
                className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Hapus semua daftar dasar hukum"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 04. TUJUAN
   * ----------------------------------------------------------- */
  if (sectionKey === 'tujuan') {
    const handleAddTujuan = () => {
      onChange({ tujuan: [...program.tujuan, ''] });
    };

    const handleUpdateTujuan = (idx: number, val: string) => {
      const copy = [...program.tujuan];
      copy[idx] = val;
      onChange({ tujuan: copy });
    };

    const handleRemoveTujuan = (idx: number) => {
      const copy = program.tujuan.filter((_, i) => i !== idx);
      onChange({ tujuan: copy });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">D. Tujuan Program</h3>
            <p className="text-xs text-slate-500">
              Hasil spesifik yang ingin dicapai melalui pelaksanaan program kerja di SD.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Buat Tujuan dengan AI</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Tujuan Program"
          pengantarValue={program.pengantarTujuan}
          penjelasValue={program.penjelasTujuan}
          defaultPengantar={getSectionNarrative('tujuan', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('tujuan', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarTujuan: val })}
          onPenjelasChange={(val) => onChange({ penjelasTujuan: val })}
        />

        <div className="space-y-3">
          {program.tujuan.map((tuj, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="font-bold text-xs text-indigo-700 w-6 mt-2 text-right shrink-0">
                {idx + 1}.
              </span>
              <textarea
                rows={2}
                value={tuj}
                onChange={(e) => handleUpdateTujuan(idx, e.target.value)}
                placeholder="Tuliskan tujuan program..."
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveTujuan(idx)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg mt-1 transition-colors cursor-pointer shrink-0"
                title="Hapus butir tujuan ini"
                aria-label="Hapus butir tujuan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddTujuan}
              className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Tujuan Baru</span>
            </button>
            {program.tujuan.length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ tujuan: [] })}
                className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Hapus semua butir tujuan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 05. SASARAN
   * ----------------------------------------------------------- */
  if (sectionKey === 'sasaran') {
    const handleToggleKelas = (kls: string) => {
      const current = program.sasaran?.kelasPilihan || [];
      if (kls === 'Semua kelas') {
        const next = current.includes('Semua kelas') ? [] : ['Semua kelas'];
        onChange({ sasaran: { ...program.sasaran, kelasPilihan: next } });
        return;
      }

      let next = current.filter((c) => c !== 'Semua kelas');
      if (next.includes(kls)) {
        next = next.filter((c) => c !== kls);
      } else {
        next.push(kls);
      }
      onChange({ sasaran: { ...program.sasaran, kelasPilihan: next } });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">E. Sasaran Program</h3>
            <p className="text-xs text-slate-500">
              Pihak-pihak yang menjadi penerima manfaat atau target kegiatan di sekolah.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Bantu AI Menentukan Sasaran</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Sasaran Program"
          pengantarValue={program.pengantarSasaran}
          penjelasValue={program.penjelasSasaran}
          defaultPengantar={getSectionNarrative('sasaran', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('sasaran', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarSasaran: val })}
          onPenjelasChange={(val) => onChange({ penjelasSasaran: val })}
        />

        {/* Pilihan Kelas */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">
            Target Kelas Siswa:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleToggleKelas('Semua kelas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                program.sasaran?.kelasPilihan?.includes('Semua kelas')
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Semua kelas (I - VI)
            </button>
            {classesList.map((k) => {
              const isChecked = program.sasaran?.kelasPilihan?.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleToggleKelas(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isChecked
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Stakeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Peserta Didik (Siswa)
            </label>
            <input
              type="text"
              value={program.sasaran?.pesertaDidik || ''}
              onChange={(e) =>
                onChange({
                  sasaran: { ...program.sasaran, pesertaDidik: e.target.value },
                })
              }
              placeholder="Contoh: Seluruh siswa kelas I s.d. VI (320 anak)"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Guru / Pendidik
            </label>
            <input
              type="text"
              value={program.sasaran?.guru || ''}
              onChange={(e) =>
                onChange({
                  sasaran: { ...program.sasaran, guru: e.target.value },
                })
              }
              placeholder="Contoh: Seluruh Guru Kelas dan Guru Mata Pelajaran"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tenaga Kependidikan (Tendik)
            </label>
            <input
              type="text"
              value={program.sasaran?.tenagaKependidikan || ''}
              onChange={(e) =>
                onChange({
                  sasaran: {
                    ...program.sasaran,
                    tenagaKependidikan: e.target.value,
                  },
                })
              }
              placeholder="Contoh: Tenaga Administrasi Sekolah & Pengelola Perpustakaan"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Orang Tua / Wali Murid
            </label>
            <input
              type="text"
              value={program.sasaran?.orangTua || ''}
              onChange={(e) =>
                onChange({
                  sasaran: { ...program.sasaran, orangTua: e.target.value },
                })
              }
              placeholder="Contoh: Paguyuban orang tua murid setiap rombel"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Komite Sekolah
            </label>
            <input
              type="text"
              value={program.sasaran?.komite || ''}
              onChange={(e) =>
                onChange({
                  sasaran: { ...program.sasaran, komite: e.target.value },
                })
              }
              placeholder="Contoh: Pengurus Komite SD"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masyarakat / Mitra Luar
            </label>
            <input
              type="text"
              value={program.sasaran?.masyarakat || ''}
              onChange={(e) =>
                onChange({
                  sasaran: { ...program.sasaran, masyarakat: e.target.value },
                })
              }
              placeholder="Contoh: Puskesmas, Kwarran, Tokoh Masyarakat"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              onChange({
                sasaran: {
                  pesertaDidik: '',
                  kelasPilihan: [],
                  guru: '',
                  tenagaKependidikan: '',
                  orangTua: '',
                  komite: '',
                  masyarakat: '',
                  lainnya: '',
                },
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
            title="Kosongkan seluruh isian sasaran"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Isian Sasaran</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 06. RANGKAIAN KEGIATAN (TABEL REORDERABLE)
   * ----------------------------------------------------------- */
  if (sectionKey === 'kegiatan') {
    const handleAddRow = () => {
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        tahapan: 'Pelaksanaan',
        uraian: '',
        penanggungJawab: school.kepalaSekolah,
      };
      onChange({ kegiatan: [...program.kegiatan, newAct] });
    };

    const handleUpdate = (id: string, field: keyof ActivityItem, val: string) => {
      onChange({
        kegiatan: program.kegiatan.map((k) =>
          k.id === id ? { ...k, [field]: val } : k
        ),
      });
    };

    const handleRemove = (id: string) => {
      onChange({ kegiatan: program.kegiatan.filter((k) => k.id !== id) });
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
      const copy = [...program.kegiatan];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      onChange({ kegiatan: copy });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              F. Bentuk / Rangkaian Kegiatan
            </h3>
            <p className="text-xs text-slate-500">
              Tahapan operasional pelaksanaan program (Persiapan, Pelaksanaan, Evaluasi).
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Buat Rangkaian Kegiatan dengan AI</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Rangkaian Kegiatan"
          pengantarValue={program.pengantarKegiatan}
          penjelasValue={program.penjelasKegiatan}
          defaultPengantar={getSectionNarrative('kegiatan', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('kegiatan', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarKegiatan: val })}
          onPenjelasChange={(val) => onChange({ penjelasKegiatan: val })}
        />

        {/* Tabel Kegiatan */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-2.5 text-center w-12">No</th>
                  <th className="p-2.5 text-left w-44">Tahapan / Kegiatan</th>
                  <th className="p-2.5 text-left">Uraian Pelaksanaan</th>
                  <th className="p-2.5 text-left w-48">Penanggung Jawab</th>
                  <th className="p-2.5 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {program.kegiatan.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-2.5 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.tahapan}
                        onChange={(e) =>
                          handleUpdate(item.id, 'tahapan', e.target.value)
                        }
                        placeholder="Contoh: Persiapan / Workshop"
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold text-xs"
                      />
                    </td>
                    <td className="p-2.5">
                      <textarea
                        rows={2}
                        value={item.uraian}
                        onChange={(e) =>
                          handleUpdate(item.id, 'uraian', e.target.value)
                        }
                        placeholder="Rincian kegiatan..."
                        className="w-full p-1.5 border border-slate-300 rounded text-xs leading-relaxed"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.penanggungJawab}
                        onChange={(e) =>
                          handleUpdate(item.id, 'penanggungJawab', e.target.value)
                        }
                        placeholder="Nama/Peran"
                        className="w-full p-1.5 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === program.kegiatan.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          title="Hapus baris kegiatan ini"
                          aria-label="Hapus baris kegiatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baris Kegiatan</span>
          </button>
          {program.kegiatan.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ kegiatan: [] })}
              className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Hapus semua baris kegiatan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 07. WAKTU DAN TEMPAT
   * ----------------------------------------------------------- */
  if (sectionKey === 'waktu') {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            G. Waktu dan Tempat Pelaksanaan
          </h3>
          <p className="text-xs text-slate-500">
            Jadwal operasional, durasi, dan lokasi kegiatan program di sekolah.
          </p>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Waktu & Tempat"
          pengantarValue={program.pengantarWaktuTempat}
          penjelasValue={program.penjelasWaktuTempat}
          defaultPengantar={getSectionNarrative('waktuTempat', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('waktuTempat', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarWaktuTempat: val })}
          onPenjelasChange={(val) => onChange({ penjelasWaktuTempat: val })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hari Pelaksanaan
            </label>
            <input
              type="text"
              value={program.waktuTempat?.hari || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, hari: e.target.value },
                })
              }
              placeholder="Contoh: Senin s.d. Jumat"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal / Rentang Tanggal
            </label>
            <input
              type="text"
              value={program.waktuTempat?.tanggal || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, tanggal: e.target.value },
                })
              }
              placeholder="Contoh: 18 Juli 2026 s.d. 18 Desember 2026"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Waktu Pelaksanaan
            </label>
            <input
              type="text"
              value={program.waktuTempat?.waktu || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, waktu: e.target.value },
                })
              }
              placeholder="Contoh: Pukul 07.00 - 07.15 WIB (15 Menit Pagi)"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tempat Pelaksanaan
            </label>
            <input
              type="text"
              value={program.waktuTempat?.tempat || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, tempat: e.target.value },
                })
              }
              placeholder="Contoh: Ruang Perpustakaan & Sudut Baca Kelas I-VI"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Durasi Program
            </label>
            <input
              type="text"
              value={program.waktuTempat?.durasi || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, durasi: e.target.value },
                })
              }
              placeholder="Contoh: 1 Semester"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Periode / Tahun Ajaran
            </label>
            <input
              type="text"
              value={program.waktuTempat?.periode || ''}
              onChange={(e) =>
                onChange({
                  waktuTempat: { ...program.waktuTempat, periode: e.target.value },
                })
              }
              placeholder="Contoh: Semester Ganjil 2026/2027"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              onChange({
                waktuTempat: {
                  hari: '',
                  tanggal: '',
                  waktu: '',
                  tempat: '',
                  durasi: '',
                  periode: '',
                },
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
            title="Kosongkan seluruh isian waktu dan tempat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Waktu & Tempat</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 08. PENANGGUNG JAWAB & PELAKSANA (TABEL)
   * ----------------------------------------------------------- */
  if (sectionKey === 'pelaksana') {
    const handleAddRow = () => {
      const newP: PelaksanaItem = {
        id: `pel-${Date.now()}`,
        jabatan: 'Anggota Panitia',
        nama: '',
        tugas: '',
      };
      onChange({ pelaksana: [...program.pelaksana, newP] });
    };

    const handleUpdate = (id: string, field: keyof PelaksanaItem, val: string) => {
      onChange({
        pelaksana: program.pelaksana.map((p) =>
          p.id === id ? { ...p, [field]: val } : p
        ),
      });
    };

    const handleRemove = (id: string) => {
      onChange({ pelaksana: program.pelaksana.filter((p) => p.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              H. Penanggung Jawab dan Pelaksana
            </h3>
            <p className="text-xs text-slate-500">
              Struktur panitia kerja dan pembagian tugas pendidik/tendik di sekolah.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Bantu AI Membagi Tugas</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Pelaksana & Kepanitiaan"
          pengantarValue={program.pengantarPelaksana}
          penjelasValue={program.penjelasPelaksana}
          defaultPengantar={getSectionNarrative('pelaksana', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('pelaksana', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarPelaksana: val })}
          onPenjelasChange={(val) => onChange({ penjelasPelaksana: val })}
        />

        {/* Tabel Pelaksana */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-2.5 text-center w-12">No</th>
                  <th className="p-2.5 text-left w-48">Jabatan / Peran</th>
                  <th className="p-2.5 text-left w-56">Nama Personil</th>
                  <th className="p-2.5 text-left">Uraian Tugas Pokok</th>
                  <th className="p-2.5 text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {program.pelaksana.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-2.5 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.jabatan}
                        onChange={(e) =>
                          handleUpdate(item.id, 'jabatan', e.target.value)
                        }
                        placeholder="Contoh: Ketua Pelaksana"
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold text-xs"
                      />
                    </td>
                    <td className="p-2.5">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={item.nama}
                          onChange={(e) =>
                            handleUpdate(item.id, 'nama', e.target.value)
                          }
                          placeholder="Nama personil"
                          className="w-full p-1.5 border border-slate-300 rounded text-xs"
                        />
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const t = teachers.find((x) => x.nama === e.target.value);
                              handleUpdate(item.id, 'nama', e.target.value);
                              if (t && !item.tugas) {
                                handleUpdate(item.id, 'tugas', t.tugas);
                              }
                            }
                          }}
                          className="w-full text-[10px] p-1 bg-slate-50 border border-slate-200 rounded text-slate-600"
                        >
                          <option value="">Pilih dari Master Guru</option>
                          {teachers.map((t) => (
                            <option key={t.id} value={t.nama}>
                              {t.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <textarea
                        rows={2}
                        value={item.tugas}
                        onChange={(e) =>
                          handleUpdate(item.id, 'tugas', e.target.value)
                        }
                        placeholder="Uraian tanggung jawab..."
                        className="w-full p-1.5 border border-slate-300 rounded text-xs leading-relaxed"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Hapus personil ini"
                        aria-label="Hapus personil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Susunan Panitia</span>
          </button>
          {program.pelaksana.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ pelaksana: [] })}
              className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Hapus semua susunan panitia"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 09. INDIKATOR KEBERHASILAN (TABEL)
   * ----------------------------------------------------------- */
  if (sectionKey === 'indikator') {
    const handleAddRow = () => {
      const newInd: IndikatorItem = {
        id: `ind-${Date.now()}`,
        indikator: '',
        target: '',
      };
      onChange({ indikator: [...program.indikator, newInd] });
    };

    const handleUpdate = (id: string, field: keyof IndikatorItem, val: string) => {
      onChange({
        indikator: program.indikator.map((item) =>
          item.id === id ? { ...item, [field]: val } : item
        ),
      });
    };

    const handleRemove = (id: string) => {
      onChange({ indikator: program.indikator.filter((item) => item.id !== id) });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              I. Indikator Keberhasilan Program
            </h3>
            <p className="text-xs text-slate-500">
              Tolak ukur pencapaian yang jelas, dapat diamati, dan terukur.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Buat Indikator dengan AI</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Indikator Keberhasilan"
          pengantarValue={program.pengantarIndikator}
          penjelasValue={program.penjelasIndikator}
          defaultPengantar={getSectionNarrative('indikator', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('indikator', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarIndikator: val })}
          onPenjelasChange={(val) => onChange({ penjelasIndikator: val })}
        />

        {/* Tabel Indikator */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-2.5 text-center w-12">No</th>
                  <th className="p-2.5 text-left">Indikator Keberhasilan (Teramati)</th>
                  <th className="p-2.5 text-left w-64">Target Pencapaian (Terukur)</th>
                  <th className="p-2.5 text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {program.indikator.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-2.5 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.indikator}
                        onChange={(e) =>
                          handleUpdate(item.id, 'indikator', e.target.value)
                        }
                        placeholder="Contoh: Keterlaksanaan kegiatan 15 menit membaca rutin"
                        className="w-full p-2 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.target}
                        onChange={(e) =>
                          handleUpdate(item.id, 'target', e.target.value)
                        }
                        placeholder="Contoh: Minimal 90% hari efektif"
                        className="w-full p-2 border border-slate-300 rounded font-semibold text-xs text-indigo-950"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Hapus baris indikator ini"
                        aria-label="Hapus indikator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Indikator Baru</span>
          </button>
          {program.indikator.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ indikator: [] })}
              className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Hapus semua indikator keberhasilan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 10. PEMBIAYAAN (TABEL OTOMATIS)
   * ----------------------------------------------------------- */
  if (sectionKey === 'pembiayaan') {
    const handleAddRow = () => {
      const newItem: BudgetItem = {
        id: `bg-${Date.now()}`,
        kebutuhan: '',
        volume: 1,
        satuan: 'Paket',
        hargaSatuan: 0,
        jumlah: 0,
        keterangan: '',
      };
      const items = [...(program.pembiayaan?.items || []), newItem];
      onChange({ pembiayaan: { ...program.pembiayaan, items } });
    };

    const handleUpdate = (id: string, field: keyof BudgetItem, val: any) => {
      const items = (program.pembiayaan?.items || []).map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'volume' || field === 'hargaSatuan') {
            const vol = field === 'volume' ? Number(val) || 0 : item.volume;
            const price = field === 'hargaSatuan' ? Number(val) || 0 : item.hargaSatuan;
            updated.jumlah = vol * price;
          }
          return updated;
        }
        return item;
      });
      onChange({ pembiayaan: { ...program.pembiayaan, items } });
    };

    const handleRemove = (id: string) => {
      const items = (program.pembiayaan?.items || []).filter((item) => item.id !== id);
      onChange({ pembiayaan: { ...program.pembiayaan, items } });
    };

    const totalBiaya = (program.pembiayaan?.items || []).reduce(
      (sum, item) => sum + (item.volume * item.hargaSatuan || 0),
      0
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              J. Rencana Pembiayaan & Anggaran
            </h3>
            <p className="text-xs text-slate-500">
              Perhitungan kebutuhan biaya belanja operasional program kegiatan sekolah.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Bantu AI Rencana Kebutuhan</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Pembiayaan & Anggaran"
          pengantarValue={program.pengantarPembiayaan}
          penjelasValue={program.penjelasPembiayaan}
          defaultPengantar={getSectionNarrative('pembiayaan', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('pembiayaan', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarPembiayaan: val })}
          onPenjelasChange={(val) => onChange({ penjelasPembiayaan: val })}
        />

        {/* Input Sumber Dana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sumber Dana Program
            </label>
            <input
              type="text"
              value={program.pembiayaan?.sumberDana || ''}
              onChange={(e) =>
                onChange({
                  pembiayaan: { ...program.pembiayaan, sumberDana: e.target.value },
                })
              }
              placeholder="Contoh: BOS Reguler (Komponen Pengembangan Literasi) / RKAS"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keterangan Penggunaan
            </label>
            <input
              type="text"
              value={program.pembiayaan?.keterangan || ''}
              onChange={(e) =>
                onChange({
                  pembiayaan: { ...program.pembiayaan, keterangan: e.target.value },
                })
              }
              placeholder="Contoh: Digunakan secara akuntabel sesuai juknis BOS"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Tabel Pembiayaan */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <tr>
                  <th className="p-2.5 text-center w-10">No</th>
                  <th className="p-2.5 text-left">Kebutuhan Belanja</th>
                  <th className="p-2.5 text-center w-16">Volume</th>
                  <th className="p-2.5 text-center w-20">Satuan</th>
                  <th className="p-2.5 text-right w-32">Harga Satuan</th>
                  <th className="p-2.5 text-right w-32">Jumlah</th>
                  <th className="p-2.5 text-left w-36">Keterangan</th>
                  <th className="p-2.5 text-center w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(program.pembiayaan?.items || []).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-2 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.kebutuhan}
                        onChange={(e) =>
                          handleUpdate(item.id, 'kebutuhan', e.target.value)
                        }
                        placeholder="Nama barang / jasa"
                        className="w-full p-1.5 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.volume || ''}
                        onChange={(e) =>
                          handleUpdate(item.id, 'volume', Number(e.target.value))
                        }
                        className="w-full p-1.5 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.satuan}
                        onChange={(e) =>
                          handleUpdate(item.id, 'satuan', e.target.value)
                        }
                        placeholder="Rim/Pkt/Buku"
                        className="w-full p-1.5 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.hargaSatuan || ''}
                        onChange={(e) =>
                          handleUpdate(item.id, 'hargaSatuan', Number(e.target.value))
                        }
                        className="w-full p-1.5 border border-slate-300 rounded text-right text-xs"
                      />
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      {exportService.formatRupiah(item.volume * item.hargaSatuan)}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.keterangan}
                        onChange={(e) =>
                          handleUpdate(item.id, 'keterangan', e.target.value)
                        }
                        placeholder="Ket. tambahan"
                        className="w-full p-1.5 border border-slate-300 rounded text-xs text-slate-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Hapus pos belanja ini"
                        aria-label="Hapus pos belanja"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={5} className="p-3 text-right uppercase text-xs">
                    Total Anggaran Pembiayaan:
                  </td>
                  <td className="p-3 text-right text-indigo-950 font-black text-sm">
                    {exportService.formatRupiah(totalBiaya)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex-1 py-2.5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pos Kebutuhan Belanja</span>
          </button>
          {(program.pembiayaan?.items || []).length > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  pembiayaan: {
                    ...program.pembiayaan,
                    items: [],
                  },
                })
              }
              className="py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Hapus semua pos belanja"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 11. MONITORING DAN EVALUASI
   * ----------------------------------------------------------- */
  if (sectionKey === 'evaluasi') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              K. Monitoring dan Evaluasi
            </h3>
            <p className="text-xs text-slate-500">
              Mekanisme pengawasan keterlaksanaan dan penilaian hasil capaian kegiatan.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Bantu AI Format Monev</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Monitoring & Evaluasi"
          pengantarValue={program.pengantarMonev}
          penjelasValue={program.penjelasMonev}
          defaultPengantar={getSectionNarrative('monitoringEvaluasi', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('monitoringEvaluasi', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarMonev: val })}
          onPenjelasChange={(val) => onChange({ penjelasMonev: val })}
        />

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Mekanisme Monitoring (Pemantauan Saat Berlangsung)
            </label>
            <textarea
              rows={4}
              value={program.monitoringEvaluasi?.monitoring || ''}
              onChange={(e) =>
                onChange({
                  monitoringEvaluasi: {
                    ...program.monitoringEvaluasi,
                    monitoring: e.target.value,
                  },
                })
              }
              placeholder="Contoh: Pemantauan berkala dilakukan oleh Kepala Sekolah setiap pekan saat kegiatan berlangsung..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Mekanisme Evaluasi (Penilaian di Akhir Kegiatan)
            </label>
            <textarea
              rows={4}
              value={program.monitoringEvaluasi?.evaluasi || ''}
              onChange={(e) =>
                onChange({
                  monitoringEvaluasi: {
                    ...program.monitoringEvaluasi,
                    evaluasi: e.target.value,
                  },
                })
              }
              placeholder="Contoh: Evaluasi dilakukan pada akhir semester melalui rapat refleksi dewan guru dan analisis ketercapaian target..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Instrumen Monitoring dan Evaluasi yang Digunakan
            </label>
            <textarea
              rows={3}
              value={program.monitoringEvaluasi?.instrumen || ''}
              onChange={(e) =>
                onChange({
                  monitoringEvaluasi: {
                    ...program.monitoringEvaluasi,
                    instrumen: e.target.value,
                  },
                })
              }
              placeholder="Contoh: Lembar observasi keterlaksanaan kegiatan, jurnal baca harian, angket respon siswa/guru..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              onChange({
                monitoringEvaluasi: {
                  monitoring: '',
                  evaluasi: '',
                  instrumen: '',
                },
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
            title="Kosongkan seluruh isian monitoring & evaluasi"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Isian Monev</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 12. TINDAK LANJUT
   * ----------------------------------------------------------- */
  if (sectionKey === 'tindak_lanjut') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              L. Rencana Tindak Lanjut
            </h3>
            <p className="text-xs text-slate-500">
              Langkah konkret keberlanjutan atau perbaikan berdasarkan temuan monitoring dan evaluasi.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Buat Tindak Lanjut dengan AI</span>
          </button>
        </div>

        {/* Narasi Paragraf Awal & Penjelas */}
        <NarrativeSectionFields
          sectionTitle="Rencana Tindak Lanjut"
          pengantarValue={program.pengantarTindakLanjut}
          penjelasValue={program.penjelasTindakLanjut}
          defaultPengantar={getSectionNarrative('tindakLanjut', program, school).pengantar}
          defaultPenjelas={getSectionNarrative('tindakLanjut', program, school).penjelas}
          onPengantarChange={(val) => onChange({ pengantarTindakLanjut: val })}
          onPenjelasChange={(val) => onChange({ penjelasTindakLanjut: val })}
        />

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Uraian Rencana Tindak Lanjut
          </label>
          <textarea
            rows={8}
            value={program.tindakLanjut}
            onChange={(e) => onChange({ tindakLanjut: e.target.value })}
            placeholder="Tuliskan rencana tindak lanjut perbaikan program..."
            className="w-full text-xs p-3.5 border border-slate-300 rounded-xl leading-relaxed focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRequestAi('perbaiki')}
              className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer"
            >
              ✏️ Perbaiki Tulisan
            </button>
            <button
              type="button"
              onClick={() => onRequestAi('kondisi_sekolah')}
              className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 cursor-pointer"
            >
              🏫 Sesuaikan Konteks SD
            </button>
          </div>

          {program.tindakLanjut && (
            <button
              type="button"
              onClick={() => onChange({ tindakLanjut: '' })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors cursor-pointer"
              title="Kosongkan uraian rencana tindak lanjut"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Tindak Lanjut</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 13. PENUTUP
   * ----------------------------------------------------------- */
  if (sectionKey === 'penutup') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">M. Penutup</h3>
            <p className="text-xs text-slate-500">
              Paragraf penutup formal dokumen program sekolah kedinasan.
            </p>
          </div>
          <button
            onClick={() => onRequestAi('buat_awal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>✨ Buat Penutup dengan AI</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Paragraf Penutup Formal
          </label>
          <textarea
            rows={8}
            value={program.penutup}
            onChange={(e) => onChange({ penutup: e.target.value })}
            placeholder="Tuliskan kalimat penutup formal..."
            className="w-full text-xs p-3.5 border border-slate-300 rounded-xl leading-relaxed focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRequestAi('formal')}
              className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 cursor-pointer"
            >
              🧹 Buat Lebih Formal
            </button>
          </div>

          {program.penutup && (
            <button
              type="button"
              onClick={() => onChange({ penutup: '' })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors cursor-pointer"
              title="Kosongkan narasi penutup"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Penutup</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return <div>Pilih bagian dokumen dari daftar di sebelah kiri.</div>;
};

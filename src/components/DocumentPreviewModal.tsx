import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  Square,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { ProgramData, SchoolData } from '../types/program';
import { validateProgramSections } from '../utils/validation';
import { exportService } from '../services/exportService';
import {
  getSectionNarrative,
  formatLatarBelakangMinimal3Paragraf,
} from '../utils/documentNarratives';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ProgramData;
  school: SchoolData;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  program,
  school,
}) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [useKopImage, setUseKopImage] = useState<boolean>(
    Boolean(school.kopUrl && school.useKopImage !== false)
  );
  const [exportingDocx, setExportingDocx] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Sync useKopImage whenever school data updates or kopUrl exists
  React.useEffect(() => {
    if (school.kopUrl) {
      setUseKopImage(school.useKopImage !== false);
    }
  }, [school.kopUrl, school.useKopImage]);

  if (!isOpen) return null;

  const validations = validateProgramSections(program);
  const allComplete = validations.every((v) => v.isComplete);
  const incompleteCount = validations.filter((v) => !v.isComplete).length;

  const handleDownloadDocx = async () => {
    try {
      setExportError(null);
      setExportingDocx(true);
      await exportService.exportToDocx(program, { ...school, useKopImage });
    } catch (err) {
      console.error('Export docx failed:', err);
      setExportError('Gagal mendownload file Word (.docx). Silakan coba lagi.');
    } finally {
      setExportingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalBiaya =
    program.pembiayaan?.items?.reduce(
      (sum, item) => sum + (item.volume * item.hargaSatuan || 0),
      0
    ) || 0;

  // Formatting Narratives for Sections
  const latarParagraphs = formatLatarBelakangMinimal3Paragraf(
    program.latarBelakang,
    program,
    school
  );
  const narC = getSectionNarrative('dasarHukum', program, school);
  const narD = getSectionNarrative('tujuan', program, school);
  const narE = getSectionNarrative('sasaran', program, school);
  const narF = getSectionNarrative('kegiatan', program, school);
  const narG = getSectionNarrative('waktuTempat', program, school);
  const narH = getSectionNarrative('pelaksana', program, school);
  const narI = getSectionNarrative('indikator', program, school);
  const narJ = getSectionNarrative('pembiayaan', program, school);
  const narK = getSectionNarrative('monitoringEvaluasi', program, school);
  const narL = getSectionNarrative('tindakLanjut', program, school);

  const docYear = new Date(program.tanggalPengesahan || Date.now()).getFullYear();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Preview Dokumen Program (A4 Portrait)
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                allComplete
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {allComplete ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">100% Lengkap Siap Cetak</span>
                  <span className="sm:hidden">100% Lengkap</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{incompleteCount} Bagian Belum Lengkap</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Toggle Cover */}
            <button
              onClick={() => setShowCover(!showCover)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                showCover
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="Tampilkan / Sembunyikan Cover Dokumen"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showCover ? 'Cover: Aktif' : 'Cover: Mati'}</span>
            </button>

            {/* Toggle KOP Surat Gambar vs Teks */}
            {school.kopUrl && (
              <button
                onClick={() => setUseKopImage(!useKopImage)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                  useKopImage
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
                title="Ganti tampilan KOP antara Gambar Banner atau Teks Baku + Logo"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{useKopImage ? 'KOP: Gambar' : 'KOP: Teks+Logo'}</span>
              </button>
            )}

            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Checklist Dokumen</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={exportingDocx}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{exportingDocx ? 'Membuat Word...' : 'Download Word (.docx)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Validation Checklist Drawer / Banner */}
        {(!allComplete || showChecklist) && (
          <div className="p-4 bg-amber-50/90 border-b border-amber-200 text-xs shrink-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>CHECKLIST KELENGKAPAN PROGRAM SEKOLAH</span>
              </div>
              {!allComplete && (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                  Dokumen belum lengkap. Periksa bagian yang bertanda merah sebelum diarsipkan.
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-[11px]">
              {validations.map((v) => (
                <div
                  key={v.key}
                  className={`flex items-center gap-1.5 p-1.5 rounded-md ${
                    v.isComplete
                      ? 'bg-emerald-100/60 text-emerald-900'
                      : 'bg-red-100/80 text-red-900 font-bold border border-red-200'
                  }`}
                >
                  {v.isComplete ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  )}
                  <span className="truncate" title={v.notes}>
                    {v.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printable Sheet Viewport */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 flex justify-center bg-slate-200/70">
          <div
            id="printable-a4-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl p-[18mm] sm:p-[25mm] text-slate-900 text-[13px] leading-relaxed font-sans"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {/* =========================================================
             * HALAMAN COVER (SAMPUL DEPAN RESMI KEDINASAN SD)
             * ======================================================= */}
            {showCover && (
              <div className="cover-page mb-8 pb-8">
                <div className="border-4 border-double border-slate-900 p-8 sm:p-12 flex flex-col justify-between text-center min-h-[240mm]">
                  {/* Bagian Kop Cover Atas */}
                  <div>
                    {school.logoUrl ? (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={school.logoUrl}
                          alt={`Logo ${school.namaSekolah}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xs select-none"
                        />
                      </div>
                    ) : null}
                    <div className="text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-800">
                      Pemerintah Kabupaten / Kota {school.kabupaten.toUpperCase()}
                    </div>
                    <div className="text-sm sm:text-base uppercase tracking-wide font-extrabold text-slate-900">
                      Dinas Pendidikan
                    </div>
                    <div className="text-xl sm:text-2xl uppercase tracking-wide font-black my-1 text-slate-950">
                      {school.namaSekolah.toUpperCase()}
                    </div>
                    <div className="w-32 h-1 bg-slate-900 mx-auto my-3" />
                  </div>

                  {/* Judul Utama Tengah */}
                  <div className="my-8">
                    <div className="text-xs uppercase tracking-widest font-bold text-indigo-900 mb-2">
                      Dokumen Program Kerja dan Kegiatan Sekolah
                    </div>
                    <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                      Bidang: {program.bidang}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 max-w-xl mx-auto leading-tight">
                      {program.namaProgram}
                    </h1>
                    <div className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wide mt-3">
                      Tahun Pelajaran {program.tahunPelajaran}
                    </div>

                    <div className="my-6 text-slate-400 font-serif">
                      ◆ &nbsp; ◆ &nbsp; ◆
                    </div>
                  </div>

                  {/* Bagian Bawah Cover: Penyusun & Satuan Pendidikan */}
                  <div className="mt-8 pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      Disusun Oleh:
                    </div>
                    <div className="text-sm font-bold text-slate-900 uppercase">
                      {program.penanggungJawab || school.kepalaSekolah || 'Tim Pengembang Sekolah'}
                    </div>

                    <div className="mt-8 text-xs text-slate-700 leading-relaxed">
                      <div className="font-extrabold text-sm uppercase text-slate-950">
                        {school.namaSekolah}
                      </div>
                      <div>
                        NPSN: {school.npsn} {school.nss ? `| NSS: ${school.nss}` : ''}
                      </div>
                      <div>
                        {school.alamat}, Kec. {school.kecamatan}, {school.kabupaten}, {school.provinsi}
                      </div>
                      <div className="font-bold text-slate-900 mt-2">
                        Tahun {docYear}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pemisah Halaman untuk Cetak & Preview */}
                <div
                  className="hidden print:block"
                  style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
                />
                <div className="my-8 py-2 border-y-2 border-dashed border-slate-300 text-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 print:hidden">
                  --- Batas Halaman 1 (Cover Dokumen) ---
                </div>
              </div>
            )}

            {/* =========================================================
             * KOP SURAT RESMI (HALAMAN ISI DOKUMEN)
             * ======================================================= */}
            {useKopImage && school.kopUrl ? (
              <div className="kop-surat-banner mb-6 text-center border-b-2 border-slate-900 pb-2.5">
                <img
                  src={school.kopUrl}
                  alt={`Kop Surat Resmi ${school.namaSekolah}`}
                  className="w-full h-auto max-h-[145px] sm:max-h-[165px] object-contain mx-auto block select-none"
                />
              </div>
            ) : (
              <div className="kop-surat-text flex items-center justify-between gap-4 border-b-2 border-double border-slate-900 pb-3 mb-6">
                {school.logoUrl ? (
                  <img
                    src={school.logoUrl}
                    alt="Logo Sekolah"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 select-none"
                  />
                ) : (
                  <div className="w-16 sm:w-20 shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 text-center">
                  <div className="text-xs uppercase tracking-wider font-bold">
                    Pemerintah Kabupaten / Kota {school.kabupaten.toUpperCase()}
                  </div>
                  <div className="text-sm uppercase tracking-wide font-extrabold">
                    Dinas Pendidikan
                  </div>
                  <div className="text-lg uppercase tracking-wide font-black my-0.5 text-slate-950">
                    {school.namaSekolah.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-slate-700 italic">
                    {school.alamat}, Kec. {school.kecamatan}, {school.kabupaten}, {school.provinsi}{' '}
                    {school.kodePos ? `Kode Pos ${school.kodePos}` : ''} • NPSN: {school.npsn}
                  </div>
                </div>
                {school.logoUrl ? (
                  <div className="w-16 sm:w-20 shrink-0 hidden sm:block" />
                ) : null}
              </div>
            )}

            {/* JUDUL DOKUMEN */}
            <div className="text-center mb-8">
              <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                Program Kegiatan Sekolah
              </h1>
              <h2 className="text-lg font-black uppercase text-indigo-950 my-1">
                {program.namaProgram}
              </h2>
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tahun Pelajaran {program.tahunPelajaran}
              </div>
            </div>

            {/* A. IDENTITAS */}
            <section className="mb-6">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                A. Identitas Program
              </h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold w-48">1. Nama Satuan Pendidikan</td>
                    <td className="py-1 w-4">:</td>
                    <td className="py-1">{school.namaSekolah}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold">2. Tahun Pelajaran</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.tahunPelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold">3. Nama Program / Kegiatan</td>
                    <td className="py-1">:</td>
                    <td className="py-1 font-bold text-slate-900">{program.namaProgram}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 font-semibold">4. Bidang Program</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.bidang}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">5. Penanggung Jawab</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.penanggungJawab}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* B. LATAR BELAKANG (MINIMAL 3 PARAGRAF) */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                B. Latar Belakang
              </h3>
              {latarParagraphs.length > 0 ? (
                latarParagraphs.map((par, i) => (
                  <p key={i} className="mb-3 indent-8 leading-relaxed">
                    {par}
                  </p>
                ))
              ) : (
                <p className="italic text-slate-400">[Latar belakang belum diisi]</p>
              )}
            </section>

            {/* C. DASAR HUKUM */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                C. Dasar Hukum
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narC.pengantar}
              </p>

              {program.dasarHukum && program.dasarHukum.length > 0 ? (
                <ol className="list-decimal pl-6 space-y-1 text-xs mb-2">
                  {program.dasarHukum.map((dh, i) => (
                    <li key={i}>
                      <span>{dh.text}</span>
                      {dh.perluDiverifikasi && (
                        <span className="ml-1.5 text-[10px] font-semibold text-amber-700 italic bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                          (Perlu diverifikasi)
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="italic text-slate-400 text-xs mb-2">[Dasar hukum belum diisi]</p>
              )}

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narC.penjelas}
              </p>
            </section>

            {/* D. TUJUAN */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                D. Tujuan Program
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narD.pengantar}
              </p>

              {program.tujuan && program.tujuan.length > 0 ? (
                <ol className="list-decimal pl-6 space-y-1 text-xs mb-2">
                  {program.tujuan.map((tuj, i) => (
                    <li key={i}>{tuj}</li>
                  ))}
                </ol>
              ) : (
                <p className="italic text-slate-400 text-xs mb-2">[Tujuan program belum diisi]</p>
              )}

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narD.penjelas}
              </p>
            </section>

            {/* E. SASARAN */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                E. Sasaran Program
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narE.pengantar}
              </p>

              <table className="w-full text-xs mb-2">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-48">• Sasaran Kelas</td>
                    <td className="py-1 w-4">:</td>
                    <td className="py-1">{program.sasaran?.kelasPilihan?.join(', ') || 'Semua kelas'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Peserta Didik</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.sasaran?.pesertaDidik || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Pendidik (Guru)</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.sasaran?.guru || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Tenaga Kependidikan</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.sasaran?.tenagaKependidikan || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Orang Tua Murid / Komite</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{`${program.sasaran?.orangTua || '-'} / ${program.sasaran?.komite || '-'}`}</td>
                  </tr>
                </tbody>
              </table>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narE.penjelas}
              </p>
            </section>

            {/* F. RANGKAIAN KEGIATAN */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                F. Bentuk / Rangkaian Kegiatan
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2.5 leading-relaxed indent-6 text-slate-800">
                {narF.pengantar}
              </p>

              <div className="overflow-x-auto mb-2.5">
                <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-10">No</th>
                      <th className="border border-slate-300 p-2 text-left w-48">Tahapan / Kegiatan</th>
                      <th className="border border-slate-300 p-2 text-left">Uraian Pelaksanaan</th>
                      <th className="border border-slate-300 p-2 text-left w-44">Penanggung Jawab</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.kegiatan && program.kegiatan.length > 0 ? (
                      program.kegiatan.map((k, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-2 font-semibold">{k.tahapan}</td>
                          <td className="border border-slate-300 p-2 leading-relaxed">{k.uraian}</td>
                          <td className="border border-slate-300 p-2">{k.penanggungJawab}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="border border-slate-300 p-2 text-center italic text-slate-400">
                          [Rangkaian kegiatan belum diisi]
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narF.penjelas}
              </p>
            </section>

            {/* G. WAKTU DAN TEMPAT */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                G. Waktu dan Tempat Pelaksanaan
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narG.pengantar}
              </p>

              <table className="w-full text-xs mb-2">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-48">• Hari Pelaksanaan</td>
                    <td className="py-1 w-4">:</td>
                    <td className="py-1">{program.waktuTempat?.hari || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Tanggal Pelaksanaan</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.waktuTempat?.tanggal || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Waktu Pelaksanaan</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.waktuTempat?.waktu || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Tempat Pelaksanaan</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{program.waktuTempat?.tempat || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">• Durasi & Periode</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{`${program.waktuTempat?.durasi || '-'} (${program.waktuTempat?.periode || '-'})`}</td>
                  </tr>
                </tbody>
              </table>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narG.penjelas}
              </p>
            </section>

            {/* H. PENANGGUNG JAWAB & PELAKSANA */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                H. Penanggung Jawab dan Pelaksana
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2.5 leading-relaxed indent-6 text-slate-800">
                {narH.pengantar}
              </p>

              <div className="overflow-x-auto mb-2.5">
                <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-10">No</th>
                      <th className="border border-slate-300 p-2 text-left w-44">Jabatan / Peran</th>
                      <th className="border border-slate-300 p-2 text-left w-48">Nama Personil</th>
                      <th className="border border-slate-300 p-2 text-left">Tugas Pokok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.pelaksana && program.pelaksana.length > 0 ? (
                      program.pelaksana.map((p, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-2 font-semibold">{p.jabatan}</td>
                          <td className="border border-slate-300 p-2">{p.nama}</td>
                          <td className="border border-slate-300 p-2 leading-relaxed">{p.tugas}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="border border-slate-300 p-2 text-center italic text-slate-400">
                          [Pelaksana belum diisi]
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narH.penjelas}
              </p>
            </section>

            {/* I. INDIKATOR KEBERHASILAN */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                I. Indikator Keberhasilan
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2.5 leading-relaxed indent-6 text-slate-800">
                {narI.pengantar}
              </p>

              <div className="overflow-x-auto mb-2.5">
                <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-10">No</th>
                      <th className="border border-slate-300 p-2 text-left">Indikator Keberhasilan</th>
                      <th className="border border-slate-300 p-2 text-left w-56">Target Pencapaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.indikator && program.indikator.length > 0 ? (
                      program.indikator.map((ind, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-2">{ind.indikator}</td>
                          <td className="border border-slate-300 p-2 font-semibold text-slate-900">{ind.target}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="border border-slate-300 p-2 text-center italic text-slate-400">
                          [Indikator belum diisi]
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narI.penjelas}
              </p>
            </section>

            {/* J. PEMBIAYAAN */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                J. Rencana Anggaran dan Pembiayaan
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narJ.pengantar}
              </p>

              <div className="text-xs mb-2">
                <span className="font-semibold">• Sumber Dana : </span>
                <span>{program.pembiayaan?.sumberDana || 'BOS Reguler / RKAS Sekolah'}</span>
                {program.pembiayaan?.keterangan && (
                  <span className="text-slate-500 italic ml-2">({program.pembiayaan.keterangan})</span>
                )}
              </div>

              <div className="overflow-x-auto mb-2.5">
                <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-8">No</th>
                      <th className="border border-slate-300 p-2 text-left">Kebutuhan Belanja</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Vol</th>
                      <th className="border border-slate-300 p-2 text-center w-16">Satuan</th>
                      <th className="border border-slate-300 p-2 text-right w-24">Harga Satuan</th>
                      <th className="border border-slate-300 p-2 text-right w-28">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.pembiayaan?.items && program.pembiayaan.items.length > 0 ? (
                      program.pembiayaan.items.map((item, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-2">{item.kebutuhan}</td>
                          <td className="border border-slate-300 p-2 text-center">{item.volume}</td>
                          <td className="border border-slate-300 p-2 text-center">{item.satuan}</td>
                          <td className="border border-slate-300 p-2 text-right">{exportService.formatRupiah(item.hargaSatuan)}</td>
                          <td className="border border-slate-300 p-2 text-right font-medium">
                            {exportService.formatRupiah(item.volume * item.hargaSatuan)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="border border-slate-300 p-2 text-center italic text-slate-400">
                          Tidak memerlukan pembiayaan khusus / terintegrasi operasional umum
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={5} className="border border-slate-300 p-2 text-right uppercase">
                        Total Estimasi Anggaran
                      </td>
                      <td className="border border-slate-300 p-2 text-right text-indigo-950 font-black">
                        {exportService.formatRupiah(totalBiaya)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narJ.penjelas}
              </p>
            </section>

            {/* K. MONITORING DAN EVALUASI */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                K. Monitoring dan Evaluasi
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narK.pengantar}
              </p>

              <div className="space-y-2 text-xs mb-2">
                <div>
                  <strong className="block mb-0.5">1. Monitoring :</strong>
                  <p className="indent-6">{program.monitoringEvaluasi?.monitoring || '-'}</p>
                </div>
                <div>
                  <strong className="block mb-0.5">2. Evaluasi :</strong>
                  <p className="indent-6">{program.monitoringEvaluasi?.evaluasi || '-'}</p>
                </div>
                <div>
                  <strong className="block mb-0.5">3. Instrumen Monitoring & Evaluasi :</strong>
                  <p className="indent-6">{program.monitoringEvaluasi?.instrumen || '-'}</p>
                </div>
              </div>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narK.penjelas}
              </p>
            </section>

            {/* L. TINDAK LANJUT */}
            <section className="mb-6 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                L. Rencana Tindak Lanjut
              </h3>
              {/* Paragraf Pengantar */}
              <p className="text-xs mb-2 leading-relaxed indent-6 text-slate-800">
                {narL.pengantar}
              </p>

              <p className="text-xs indent-6 whitespace-pre-wrap mb-2">{program.tindakLanjut || '-'}</p>

              {/* Paragraf Penjelas */}
              <p className="text-xs leading-relaxed indent-6 text-slate-800">
                {narL.penjelas}
              </p>
            </section>

            {/* M. PENUTUP */}
            <section className="mb-10 text-justify">
              <h3 className="font-bold text-sm text-slate-950 border-b border-slate-300 pb-1 mb-2 font-sans uppercase">
                M. Penutup
              </h3>
              <p className="text-xs indent-6 whitespace-pre-wrap">{program.penutup || '-'}</p>
            </section>

            {/* LEMBAR PENGESAHAN / TANDA TANGAN */}
            <div className="grid grid-cols-2 gap-8 text-xs pt-4 font-sans break-inside-avoid">
              <div>
                <div>Disahkan di : {program.tempatPenyusunan || school.kabupaten}</div>
                <div>Pada tanggal : {program.tanggalPengesahan || '...'}</div>
                <div className="mt-3 font-semibold">Mengetahui,</div>
                <div className="font-bold">Kepala {school.namaSekolah}</div>
                <div className="h-20"></div>
                <div className="font-bold underline text-slate-950">
                  {school.kepalaSekolah}
                </div>
                <div>NIP. {school.nipKepalaSekolah || '-'}</div>
              </div>

              <div>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                <div className="mt-3 font-semibold">Penanggung Jawab Kegiatan,</div>
                <div className="font-bold">Ketua Pelaksana Program</div>
                <div className="h-20"></div>
                <div className="font-bold underline text-slate-950">
                  {program.penanggungJawab || '[Nama Penanggung Jawab]'}
                </div>
                <div>NIP. ........................................</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

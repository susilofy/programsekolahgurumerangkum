import { ProgramData, SectionKey } from '../types/program';

export interface SectionValidationStatus {
  key: SectionKey;
  label: string;
  isComplete: boolean;
  notes: string;
}

export const SECTIONS_META: {
  key: SectionKey;
  stepNumber: string;
  title: string;
  shortTitle: string;
}[] = [
  { key: 'identitas', stepNumber: '01', title: 'Identitas Program', shortTitle: 'Identitas' },
  { key: 'latar_belakang', stepNumber: '02', title: 'Latar Belakang', shortTitle: 'Latar Belakang' },
  { key: 'dasar_hukum', stepNumber: '03', title: 'Dasar Hukum', shortTitle: 'Dasar Hukum' },
  { key: 'tujuan', stepNumber: '04', title: 'Tujuan Program', shortTitle: 'Tujuan' },
  { key: 'sasaran', stepNumber: '05', title: 'Sasaran Program', shortTitle: 'Sasaran' },
  { key: 'kegiatan', stepNumber: '06', title: 'Rangkaian Kegiatan', shortTitle: 'Kegiatan' },
  { key: 'waktu', stepNumber: '07', title: 'Waktu dan Tempat', shortTitle: 'Waktu & Tempat' },
  { key: 'pelaksana', stepNumber: '08', title: 'Penanggung Jawab & Pelaksana', shortTitle: 'Pelaksana' },
  { key: 'indikator', stepNumber: '09', title: 'Indikator Keberhasilan', shortTitle: 'Indikator' },
  { key: 'pembiayaan', stepNumber: '10', title: 'Rencana Pembiayaan', shortTitle: 'Anggaran' },
  { key: 'evaluasi', stepNumber: '11', title: 'Monitoring & Evaluasi', shortTitle: 'Monev' },
  { key: 'tindak_lanjut', stepNumber: '12', title: 'Rencana Tindak Lanjut', shortTitle: 'Tindak Lanjut' },
  { key: 'penutup', stepNumber: '13', title: 'Penutup', shortTitle: 'Penutup' },
];

export function validateProgramSections(program: ProgramData): SectionValidationStatus[] {
  return [
    {
      key: 'identitas',
      label: 'Identitas Lengkap',
      isComplete: Boolean(program.namaProgram?.trim() && program.bidang?.trim() && program.penanggungJawab?.trim()),
      notes: program.namaProgram?.trim() ? 'Terisi lengkap' : 'Nama program belum diisi',
    },
    {
      key: 'latar_belakang',
      label: 'Latar Belakang Tersedia',
      isComplete: Boolean(program.latarBelakang?.trim() && program.latarBelakang.length >= 30),
      notes: program.latarBelakang?.trim() ? 'Sudah memadai' : 'Latar belakang masih kosong',
    },
    {
      key: 'dasar_hukum',
      label: 'Dasar Hukum Tersedia',
      isComplete: Boolean(program.dasarHukum && program.dasarHukum.length > 0),
      notes: program.dasarHukum?.length ? `${program.dasarHukum.length} peraturan dicantumkan` : 'Belum ada dasar hukum',
    },
    {
      key: 'tujuan',
      label: 'Tujuan Program Tersedia',
      isComplete: Boolean(program.tujuan && program.tujuan.length > 0 && program.tujuan.some((t) => t.trim())),
      notes: program.tujuan?.length ? `${program.tujuan.length} butir tujuan` : 'Tujuan belum diuraikan',
    },
    {
      key: 'sasaran',
      label: 'Sasaran Program Terdefinisi',
      isComplete: Boolean(
        (program.sasaran?.kelasPilihan && program.sasaran.kelasPilihan.length > 0) ||
        Boolean(program.sasaran?.pesertaDidik?.trim())
      ),
      notes: program.sasaran?.pesertaDidik ? 'Sasaran jelas' : 'Sasaran belum lengkap',
    },
    {
      key: 'kegiatan',
      label: 'Rangkaian Kegiatan Tersedia',
      isComplete: Boolean(program.kegiatan && program.kegiatan.length > 0),
      notes: program.kegiatan?.length ? `${program.kegiatan.length} tahapan kegiatan` : 'Tabel kegiatan masih kosong',
    },
    {
      key: 'waktu',
      label: 'Waktu dan Tempat Tersedia',
      isComplete: Boolean(program.waktuTempat?.hari?.trim() || program.waktuTempat?.tempat?.trim() || program.waktuTempat?.periode?.trim()),
      notes: program.waktuTempat?.tempat ? 'Waktu & lokasi ditentukan' : 'Waktu/tempat belum diisi',
    },
    {
      key: 'pelaksana',
      label: 'Penanggung Jawab & Pelaksana Tersedia',
      isComplete: Boolean(program.pelaksana && program.pelaksana.length > 0),
      notes: program.pelaksana?.length ? `${program.pelaksana.length} personil tercatat` : 'Susunan panitia belum ada',
    },
    {
      key: 'indikator',
      label: 'Indikator Keberhasilan Tersedia',
      isComplete: Boolean(program.indikator && program.indikator.length > 0),
      notes: program.indikator?.length ? `${program.indikator.length} indikator terukur` : 'Belum ada indikator ketercapaian',
    },
    {
      key: 'pembiayaan',
      label: 'Pembiayaan Tersedia / Sesuai',
      isComplete: Boolean(program.pembiayaan?.sumberDana?.trim()),
      notes: program.pembiayaan?.items?.length ? `${program.pembiayaan.items.length} rincian pos anggaran` : 'Sumber dana tercatat (Opsional tanpa item)',
    },
    {
      key: 'evaluasi',
      label: 'Monitoring dan Evaluasi Tersedia',
      isComplete: Boolean(program.monitoringEvaluasi?.monitoring?.trim() || program.monitoringEvaluasi?.evaluasi?.trim()),
      notes: program.monitoringEvaluasi?.monitoring ? 'Mekanisme monev terisi' : 'Monitoring/evaluasi belum ada',
    },
    {
      key: 'tindak_lanjut',
      label: 'Rencana Tindak Lanjut Tersedia',
      isComplete: Boolean(program.tindakLanjut?.trim()),
      notes: program.tindakLanjut?.trim() ? 'Rencana aksi lanjutan terisi' : 'Tindak lanjut belum dirumuskan',
    },
    {
      key: 'penutup',
      label: 'Penutup Tersedia',
      isComplete: Boolean(program.penutup?.trim() && program.penutup.length >= 20),
      notes: program.penutup?.trim() ? 'Penutup formal terisi' : 'Paragraf penutup belum ada',
    },
  ];
}

export function calculateProgramProgress(program: ProgramData): number {
  const validations = validateProgramSections(program);
  const completed = validations.filter((v) => v.isComplete).length;
  return Math.round((completed / validations.length) * 100);
}

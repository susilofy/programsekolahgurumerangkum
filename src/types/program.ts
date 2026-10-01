export interface SchoolData {
  namaSekolah: string;
  npsn: string;
  nss?: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  logoUrl?: string;
  kopUrl?: string;
  useKopImage?: boolean;
  tahunPelajaran: string;
}

export interface Teacher {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  tugas: string;
}

export interface DasarHukumItem {
  id: string;
  text: string;
  perluDiverifikasi: boolean;
}

export interface ActivityItem {
  id: string;
  tahapan: string;
  uraian: string;
  penanggungJawab: string;
}

export interface PelaksanaItem {
  id: string;
  jabatan: string;
  nama: string;
  tugas: string;
}

export interface IndikatorItem {
  id: string;
  indikator: string;
  target: string;
}

export interface BudgetItem {
  id: string;
  kebutuhan: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  jumlah: number;
  keterangan: string;
}

export interface SasaranData {
  kelasPilihan: string[]; // e.g. ['Kelas I', 'Kelas II', ...] or ['Semua kelas']
  pesertaDidik: string;
  guru: string;
  tenagaKependidikan: string;
  orangTua: string;
  komite: string;
  masyarakat: string;
  lainnya: string;
}

export interface WaktuTempatData {
  hari: string;
  tanggal: string;
  waktu: string;
  tempat: string;
  durasi: string;
  periode: string;
}

export interface MonitoringEvaluasiData {
  monitoring: string;
  evaluasi: string;
  instrumen: string;
}

export interface ProgramData {
  id: string;
  namaProgram: string;
  tahunPelajaran: string;
  bidang: string;
  penanggungJawab: string;
  tempatPenyusunan: string;
  tanggalPengesahan: string;
  status: 'draft' | 'review' | 'final';
  createdAt: string;
  updatedAt: string;

  // Section B
  latarBelakang: string;
  masalahKondisi?: string;
  kebutuhanSiswa?: string;
  hasilEvaluasi?: string;
  raporPendidikan?: string;
  tujuanSekolah?: string;

  // Section C
  dasarHukum: DasarHukumItem[];
  pengantarDasarHukum?: string;
  penjelasDasarHukum?: string;

  // Section D
  tujuan: string[];
  pengantarTujuan?: string;
  penjelasTujuan?: string;

  // Section E
  sasaran: SasaranData;
  pengantarSasaran?: string;
  penjelasSasaran?: string;

  // Section F
  kegiatan: ActivityItem[];
  pengantarKegiatan?: string;
  penjelasKegiatan?: string;

  // Section G
  waktuTempat: WaktuTempatData;
  pengantarWaktuTempat?: string;
  penjelasWaktuTempat?: string;

  // Section H
  pelaksana: PelaksanaItem[];
  pengantarPelaksana?: string;
  penjelasPelaksana?: string;

  // Section I
  indikator: IndikatorItem[];
  pengantarIndikator?: string;
  penjelasIndikator?: string;

  // Section J
  pembiayaan: {
    sumberDana: string;
    keterangan: string;
    items: BudgetItem[];
  };
  pengantarPembiayaan?: string;
  penjelasPembiayaan?: string;

  // Section K
  monitoringEvaluasi: MonitoringEvaluasiData;
  pengantarMonev?: string;
  penjelasMonev?: string;

  // Section L
  tindakLanjut: string;
  pengantarTindakLanjut?: string;
  penjelasTindakLanjut?: string;

  // Section M
  penutup: string;

  // Snapshots for Undo / Versions
  history?: {
    timestamp: string;
    description: string;
    snapshot: string;
  }[];
}

export interface ProgramAnalysis {
  skorKeseluruhan: number;
  statusKeseluruhan: '🟢 Sudah sesuai' | '🟡 Perlu diperbaiki' | '🔴 Belum lengkap';
  ringkasanEksekutif: string;
  analisisItem: {
    aspek: string;
    status: '🟢 Sesuai' | '🟡 Perlu Perbaikan' | '🔴 Belum Lengkap';
    catatan: string;
    saranPerbaikan: string;
  }[];
  usulanPerbaikanAI?: {
    latarBelakang?: string | null;
    tujuan?: string[] | null;
    kegiatanTambahan?: string | null;
    indikatorSaran?: string | null;
  };
}

export type SectionKey =
  | 'identitas'
  | 'latar_belakang'
  | 'dasar_hukum'
  | 'tujuan'
  | 'sasaran'
  | 'kegiatan'
  | 'waktu'
  | 'pelaksana'
  | 'indikator'
  | 'pembiayaan'
  | 'evaluasi'
  | 'tindak_lanjut'
  | 'penutup';

export interface SectionMeta {
  key: SectionKey;
  stepNumber: string;
  title: string;
  shortTitle: string;
  iconName: string;
}

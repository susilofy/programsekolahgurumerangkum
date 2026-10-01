import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  BookOpen,
  Calculator,
  Smile,
  Users,
  Compass,
  HeartHandshake,
  Shield,
  Palette,
  Loader2,
  FileText,
  Clock,
  School,
} from 'lucide-react';
import { PROGRAM_FIELDS } from '../data/initialData';
import { ProgramData, SchoolData } from '../types/program';
import { aiService } from '../services/aiService';

interface CreateProgramWizardProps {
  school: SchoolData;
  onProgramCreated: (program: ProgramData) => void;
  onCancel: () => void;
}

export const CreateProgramWizard: React.FC<CreateProgramWizardProps> = ({
  school,
  onProgramCreated,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bidang, setBidang] = useState('Literasi');
  const [namaProgram, setNamaProgram] = useState('');
  const [masalahKondisi, setMasalahKondisi] = useState('');
  const [sasaranRingkas, setSasaranRingkas] = useState('Peserta didik kelas I - VI');
  const [waktuPeriode, setWaktuPeriode] = useState('Semester Ganjil 2026/2027');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Field suggestions
  const getFieldIcon = (f: string) => {
    switch (f) {
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
      case 'Kesiswaan':
        return HeartHandshake;
      case 'UKS':
        return Shield;
      default:
        return Layers;
    }
  };

  const getExampleProgramName = (field: string) => {
    switch (field) {
      case 'Literasi':
        return 'Program Gerakan Literasi 15 Menit & Sudut Baca Kelas';
      case 'Numerasi':
        return 'Program Penguatan Numerasi Melalui Permainan Matematika Kontekstual';
      case 'Karakter':
        return 'Program Budaya Positif 5S & Projek Penguatan Profil Pelajar Pancasila';
      case 'PTK (Pendidik & Tendik)':
        return 'Program Komunitas Belajar (Kombel) Guru & Berbagi Praktik Baik';
      case 'Kurikulum':
        return 'Program Supervisi Akademik & Pembelajaran Berdiferensiasi';
      case 'Ekstrakurikuler':
        return 'Program Ekstrakurikuler Wajib Gerakan Pramuka Siaga dan Penggalang';
      case 'Perpustakaan':
        return 'Program Revitalisasi Layanan Perpustakaan Ramah Anak & Digitalisasi Sirkulasi';
      case 'UKS':
        return 'Program Trias UKS, Gerakan Sekolah Sehat & Kader Dokter Cilik';
      case 'Lingkungan Sekolah':
        return 'Program Sekolah Adiwiyata & Gerakan Peduli Lingkungan Hidup (PBLHS)';
      case 'Kesiswaan':
        return 'Program Tim Pencegahan dan Penanganan Kekerasan (TPPK) & Disiplin Positif';
      case 'Pembelajaran':
        return 'Program Digitalisasi Pembelajaran & Pemanfaatan Chromebook';
      case 'Kemitraan':
        return 'Program Kemitraan Keluarga, Kelas Parenting & Kelas Inspirasi Profesi';
      case 'Sarana Prasarana':
        return 'Program Pemeliharaan Sarana Prasarana & Keamanan Fasilitas Sekolah';
      case 'Manajemen Sekolah':
        return 'Program Perencanaan Berbasis Data (PBD) & Rapor Pendidikan';
      default:
        return `Program Peningkatan Mutu ${field}`;
    }
  };

  const handleSelectBidang = (f: string) => {
    setBidang(f);
    if (!namaProgram || namaProgram.startsWith('Program')) {
      setNamaProgram(getExampleProgramName(f));
    }
  };

  const handleCreateEmptyDraft = () => {
    const newProg: ProgramData = {
      id: `prog-${Date.now()}`,
      namaProgram: namaProgram.trim() || `Program ${bidang} Sekolah`,
      tahunPelajaran: school.tahunPelajaran,
      bidang,
      penanggungJawab: school.kepalaSekolah,
      tempatPenyusunan: school.kabupaten || 'Nusantara',
      tanggalPengesahan: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      latarBelakang: masalahKondisi
        ? `Program ini disusun dilatarbelakangi oleh kondisi: ${masalahKondisi}`
        : '',
      masalahKondisi: masalahKondisi,
      kebutuhanSiswa: '',
      dasarHukum: [
        {
          id: 'dh-1',
          text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
          perluDiverifikasi: false,
        },
      ],
      tujuan: ['Meningkatkan mutu capaian program di lingkungan satuan pendidikan.'],
      sasaran: {
        kelasPilihan: ['Semua kelas'],
        pesertaDidik: sasaranRingkas || 'Peserta Didik SD',
        guru: 'Dewan Guru',
        tenagaKependidikan: 'Staf Administrasi',
        orangTua: 'Orang Tua / Wali Murid',
        komite: 'Pengurus Komite Sekolah',
        masyarakat: '-',
        lainnya: '-',
      },
      kegiatan: [
        {
          id: 'act-1',
          tahapan: 'Persiapan',
          uraian: 'Rapat koordinasi dan sosialisasi program kerja.',
          penanggungJawab: school.kepalaSekolah,
        },
      ],
      waktuTempat: {
        hari: 'Senin - Sabtu',
        tanggal: 'Awal Tahun Pelajaran',
        waktu: '08.00 - 12.00 WIB',
        tempat: school.namaSekolah,
        durasi: '1 Semester',
        periode: waktuPeriode || school.tahunPelajaran,
      },
      pelaksana: [
        {
          id: 'pel-1',
          jabatan: 'Penanggung Jawab',
          nama: school.kepalaSekolah,
          tugas: 'Pengarah umum dan penanggung jawab kebijakan',
        },
      ],
      indikator: [
        {
          id: 'ind-1',
          indikator: 'Tingkat keterlaksanaan program',
          target: 'Minimal 85% terealisasi',
        },
      ],
      pembiayaan: {
        sumberDana: 'BOS Reguler / RKAS',
        keterangan: 'Rencana anggaran operasional',
        items: [],
      },
      monitoringEvaluasi: {
        monitoring: 'Pemantauan berkala oleh Kepala Sekolah.',
        evaluasi: 'Evaluasi ketercapaian target di akhir semester.',
        instrumen: 'Lembar observasi dan ceklis keterlaksanaan.',
      },
      tindakLanjut: 'Refleksi hasil kegiatan untuk perbaikan di periode berikutnya.',
      penutup: 'Demikian dokumen program kerja ini disusun sebagai pedoman operasional di sekolah.',
    };

    onProgramCreated(newProg);
  };

  const handleGenerateFullWithAi = async () => {
    setIsGenerating(true);
    setGenError(null);

    try {
      const generated = await aiService.generateFullProgram({
        namaProgram: namaProgram.trim() || `Program ${bidang} Sekolah`,
        bidang,
        masalahKondisi: masalahKondisi.trim() || 'Peningkatan kompetensi dan kualitas belajar siswa SD',
        sasaran: sasaranRingkas,
        waktuPeriode,
        namaSekolah: school.namaSekolah,
        tahunPelajaran: school.tahunPelajaran,
        kepalaSekolah: school.kepalaSekolah,
      });

      const newProg: ProgramData = {
        id: `prog-${Date.now()}`,
        namaProgram: namaProgram.trim() || `Program ${bidang} Sekolah`,
        tahunPelajaran: school.tahunPelajaran,
        bidang,
        penanggungJawab: school.kepalaSekolah,
        tempatPenyusunan: school.kabupaten || 'Nusantara',
        tanggalPengesahan: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latarBelakang: generated.latarBelakang || '',
        masalahKondisi: masalahKondisi,
        kebutuhanSiswa: '',
        dasarHukum:
          generated.dasarHukum?.map((text: string, i: number) => ({
            id: `dh-gen-${i}`,
            text,
            perluDiverifikasi: text.toLowerCase().includes('verifikasi'),
          })) || [],
        tujuan: generated.tujuan || [],
        sasaran: {
          kelasPilihan: ['Semua kelas'],
          pesertaDidik: generated.sasaran?.pesertaDidik || sasaranRingkas,
          guru: generated.sasaran?.guru || 'Seluruh Dewan Guru',
          tenagaKependidikan: generated.sasaran?.tenagaKependidikan || 'Staf Tata Usaha & Pustakawan',
          orangTua: generated.sasaran?.orangTua || 'Paguyuban Orang Tua Siswa',
          komite: generated.sasaran?.komite || 'Komite Sekolah',
          masyarakat: generated.sasaran?.masyarakat || '-',
          lainnya: generated.sasaran?.lainnya || '-',
        },
        kegiatan:
          generated.kegiatan?.map((k: any, i: number) => ({
            id: `act-gen-${i}`,
            tahapan: k.tahapan || 'Tahap Kegiatan',
            uraian: k.uraian || '',
            penanggungJawab: k.penanggungJawab || school.kepalaSekolah,
          })) || [],
        waktuTempat: {
          hari: generated.waktuTempat?.hari || 'Senin - Sabtu',
          tanggal: generated.waktuTempat?.tanggal || 'Awal Semester',
          waktu: generated.waktuTempat?.waktu || '08.00 - 12.00 WIB',
          tempat: generated.waktuTempat?.tempat || school.namaSekolah,
          durasi: generated.waktuTempat?.durasi || '1 Semester',
          periode: generated.waktuTempat?.periode || waktuPeriode,
        },
        pelaksana:
          generated.pelaksana?.map((p: any, i: number) => ({
            id: `pel-gen-${i}`,
            jabatan: p.jabatan || 'Panitia',
            nama: p.nama || '[Nama Guru]',
            tugas: p.tugas || '',
          })) || [],
        indikator:
          generated.indikator?.map((ind: any, i: number) => ({
            id: `ind-gen-${i}`,
            indikator: ind.indikator || '',
            target: ind.target || '85% tercapai',
          })) || [],
        pembiayaan: {
          sumberDana: generated.pembiayaan?.sumberDana || 'BOS Reguler',
          keterangan: generated.pembiayaan?.keterangan || 'Efisiensi sesuai RKAS',
          items:
            generated.pembiayaan?.items?.map((item: any, i: number) => ({
              id: `bg-gen-${i}`,
              kebutuhan: item.kebutuhan || '',
              volume: Number(item.volume) || 1,
              satuan: item.satuan || 'Paket',
              hargaSatuan: Number(item.hargaSatuan) || 0,
              jumlah: (Number(item.volume) || 1) * (Number(item.hargaSatuan) || 0),
              keterangan: item.keterangan || '',
            })) || [],
        },
        monitoringEvaluasi: {
          monitoring: generated.monitoringEvaluasi?.monitoring || '',
          evaluasi: generated.monitoringEvaluasi?.evaluasi || '',
          instrumen: generated.monitoringEvaluasi?.instrumen || '',
        },
        tindakLanjut: generated.tindakLanjut || '',
        penutup: generated.penutup || '',
      };

      onProgramCreated(newProg);
    } catch (err: any) {
      console.warn('Wizard AI generation note:', err?.message || err);
      setGenError(err.message || 'Gagal membuat program otomatis dengan AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      {/* Wizard Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {[
            { stepNum: 1, label: 'Bidang' },
            { stepNum: 2, label: 'Nama Program' },
            { stepNum: 3, label: 'Masalah & Sasaran' },
            { stepNum: 4, label: 'Penyusunan AI' },
          ].map((s) => (
            <div key={s.stepNum} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === s.stepNum
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-4 ring-indigo-100'
                    : step > s.stepNum
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s.stepNum ? '✓' : s.stepNum}
              </div>
              <span
                className={`text-xs hidden sm:inline font-semibold ${
                  step === s.stepNum ? 'text-indigo-900 font-bold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* STEP 1: PILIH BIDANG */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Langkah 1 dari 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Pilih Bidang Program Kegiatan Sekolah
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih rumpun bidang kegiatan yang akan disusun untuk jenjang Sekolah Dasar.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROGRAM_FIELDS.map((f) => {
                const Icon = getFieldIcon(f);
                const isSelected = bidang === f;
                return (
                  <button
                    key={f}
                    onClick={() => handleSelectBidang(f)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs">{f}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={onCancel}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <span>Lanjut: Nama Program</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MASUKKAN NAMA PROGRAM */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Langkah 2 dari 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Tentukan Judul Program Kegiatan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Bidang terpilih: <span className="font-bold text-indigo-600">{bidang}</span>. Berikan judul yang jelas dan mencerminkan tujuan.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Program / Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaProgram}
                  onChange={(e) => setNamaProgram(e.target.value)}
                  placeholder="Contoh: Program Penguatan Literasi Awal Melalui Sudut Baca Ramah Anak"
                  className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Suggestions */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-semibold text-slate-700">Contoh Judul Populer:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    `Program Optimalisasi ${bidang} Sekolah`,
                    `Program Pembiasaan & Peningkatan ${bidang}`,
                    `Program Inovasi ${bidang} Ramah Anak`,
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNamaProgram(sug)}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors text-[11px]"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                disabled={!namaProgram.trim()}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-xs"
              >
                <span>Lanjut: Masalah & Sasaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MASUKKAN MASALAH / KEBUTUHAN & SASARAN */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Langkah 3 dari 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Latar Masalah, Kebutuhan, & Sasaran
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Informasi ini menjadi dasar AI dalam menyusun seluruh bagian (Latar Belakang, Tujuan, Rangkaian Kegiatan, dan Indikator).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Masalah / Kondisi / Data Rapor Pendidikan yang Dihadapi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={masalahKondisi}
                  onChange={(e) => setMasalahKondisi(e.target.value)}
                  placeholder="Contoh: Berdasarkan rapor pendidikan, kemampuan literasi siswa masih di bawah rata-rata. Buku non-teks di sudut baca masih terbatas dan minat baca belum merata..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sasaran Peserta
                  </label>
                  <input
                    type="text"
                    value={sasaranRingkas}
                    onChange={(e) => setSasaranRingkas(e.target.value)}
                    placeholder="Contoh: Siswa kelas I s.d. VI"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Waktu / Periode Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={waktuPeriode}
                    onChange={(e) => setWaktuPeriode(e.target.value)}
                    placeholder="Contoh: Semester Ganjil 2026/2027"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <span>Lanjut ke Opsi Penyusunan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PILIHAN PENYUSUNAN (AUTO AI VS MANUAL) */}
        {step === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Langkah 4 dari 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Pilih Cara Memulai Program
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                AI siap membantu menyusun draf 13 bagian secara menyeluruh berdasarkan data yang telah Anda masukkan.
              </p>
            </div>

            {/* Error Message if AI generation failed */}
            {genError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800">Pemberitahuan Sistem:</span>
                  <button
                    onClick={handleGenerateFullWithAi}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Coba Generate Lagi
                  </button>
                </div>
                <p>{genError}</p>
              </div>
            )}

            {isGenerating ? (
              <div className="py-12 text-center space-y-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-950 text-base">
                    AI Sedang Menyusun Draf Lengkap Program SD...
                  </h4>
                  <p className="text-xs text-indigo-700 max-w-md mx-auto leading-relaxed">
                    Merumuskan Latar Belakang, Dasar Hukum valid, Tujuan bernomor, Rangkaian Kegiatan, Penanggung Jawab, Indikator terukur, dan Rencana Anggaran.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Auto AI Draft */}
                <div className="p-5 rounded-2xl border-2 border-indigo-600 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/30 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      ✨ Buat Draf Program dengan AI
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      AI akan mengisi seluruh 13 bagian secara otomatis dan saling sinkron. Anda tetap dapat memeriksa, mengedit, dan menyempurnakan setiap bagian sebelum dianggap final.
                    </p>
                    <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                      <li>✓ Otomatis isi 13 sistematika program SD</li>
                      <li>✓ Indikator terukur dan tahapan kegiatan logis</li>
                      <li>✓ Paling cepat dan tidak perlu ketik dari nol</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleGenerateFullWithAi}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Buat Draf Otomatis Sekarang</span>
                  </button>
                </div>

                {/* Option B: Empty Draft / Manual */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">
                      Mulai dari Draf Kosong
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Buka dokumen baru dan gunakan tombol <strong>"✨ Bantu AI"</strong> secara mandiri pada setiap bagian yang Anda inginkan satu demi satu.
                    </p>
                    <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                      <li>✓ Cocok jika sudah memiliki catatan sendiri</li>
                      <li>✓ Tetap dapat memanggil AI di tiap bagian</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleCreateEmptyDraft}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all"
                  >
                    Buka Editor Kosong
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-start items-center pt-4 border-t border-slate-100">
              <button
                disabled={isGenerating}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Langkah Sebelumnya</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

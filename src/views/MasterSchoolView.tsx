import React, { useState, useRef } from 'react';
import {
  School,
  Save,
  CheckCircle2,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Info,
  Check,
  BookmarkCheck,
  Download,
  UploadCloud,
  Database,
} from 'lucide-react';
import { SchoolData, Teacher, ProgramData } from '../types/program';
import { DEFAULT_SCHOOL } from '../data/initialData';
import { storageService } from '../services/storageService';
import {
  fileToOptimizedDataUrl,
  TUT_WURI_HANDAYANI_SVG,
} from '../utils/imageUtils';
import { ConfirmModal } from '../components/ConfirmModal';

interface MasterSchoolViewProps {
  school: SchoolData;
  onSaveSchool: (data: SchoolData) => void;
  onSetAsDefault?: () => Promise<void> | void;
  onRestoreDefaults?: () => void;
  onImportBackup?: (school: SchoolData, teachers: Teacher[], programs: ProgramData[]) => void;
  teachers?: Teacher[];
  programs?: ProgramData[];
}

export const MasterSchoolView: React.FC<MasterSchoolViewProps> = ({
  school,
  onSaveSchool,
  onSetAsDefault,
  onRestoreDefaults,
  onImportBackup,
  teachers = [],
  programs = [],
}) => {
  const [formData, setFormData] = useState<SchoolData>({ ...school });
  const [savedAlert, setSavedAlert] = useState(false);
  const [defaultAlert, setDefaultAlert] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const [isProcessingKop, setIsProcessingKop] = useState(false);
  const [isSavingDefault, setIsSavingDefault] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isConfirmSetDefaultOpen, setIsConfirmSetDefaultOpen] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const kopInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  const handleResetDefault = () => {
    setIsConfirmResetOpen(true);
  };

  const handleConfirmReset = () => {
    if (onRestoreDefaults) {
      onRestoreDefaults();
      setFormData(storageService.getSchoolData());
    } else {
      setFormData(DEFAULT_SCHOOL);
      onSaveSchool(DEFAULT_SCHOOL);
    }
    setIsConfirmResetOpen(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  // Set current data as application factory default
  const handleConfirmSetDefault = async () => {
    setIsSavingDefault(true);
    try {
      // First save current form changes
      onSaveSchool(formData);

      if (onSetAsDefault) {
        await onSetAsDefault();
      } else {
        const res = await storageService.saveAsFactoryDefaults(formData, teachers, programs);
        setDefaultAlert(res.message);
      }
      setDefaultAlert('Data sekolah, gambar logo/kop, guru, dan program berhasil dijadikan bawaan aplikasi!');
      setTimeout(() => setDefaultAlert(null), 5000);
    } catch (err: any) {
      setErrorMessage('Gagal menyimpan sebagai data bawaan: ' + (err?.message || ''));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSavingDefault(false);
      setIsConfirmSetDefaultOpen(false);
    }
  };

  // Export full backup JSON
  const handleDownloadBackup = () => {
    try {
      // Ensure form data is synced first
      onSaveSchool(formData);
      const jsonStr = storageService.exportAllDataAsJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (formData.namaSekolah || 'SEKOLAH').replace(/[^a-zA-Z0-9]/g, '_');
      a.href = url;
      a.download = `CADANGAN_PROGRAMKU_SD_${safeName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDefaultAlert('File cadangan JSON berhasil diunduh!');
      setTimeout(() => setDefaultAlert(null), 4000);
    } catch (err: any) {
      setErrorMessage('Gagal membuat file cadangan: ' + err?.message);
    }
  };

  // Restore backup from JSON
  const handleBackupFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await storageService.importAllDataFromJson(text, true);
      if (res.success && res.data) {
        setFormData(res.data.school);
        if (onImportBackup) {
          onImportBackup(res.data.school, res.data.teachers, res.data.programs);
        } else {
          onSaveSchool(res.data.school);
        }
        setDefaultAlert(res.message);
        setTimeout(() => setDefaultAlert(null), 5000);
      } else {
        setErrorMessage(res.message || 'Format cadangan tidak sesuai.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage('Gagal membaca file cadangan: ' + (err?.message || 'File rusak'));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      if (backupFileInputRef.current) backupFileInputRef.current.value = '';
    }
  };

  // Upload Logo handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage(null);
      setIsProcessingLogo(true);
      // Max 400x400 for logo to maintain small storage & high clarity
      const dataUrl = await fileToOptimizedDataUrl(file, 400, 400);
      setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
    } catch (err) {
      console.error('Failed to process logo:', err);
      setErrorMessage('Gagal memproses gambar logo. Silakan gunakan format PNG atau JPG.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsProcessingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Upload Kop Surat handler
  const handleKopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage(null);
      setIsProcessingKop(true);
      // Max 1400x400 for kop header banner
      const dataUrl = await fileToOptimizedDataUrl(file, 1400, 400);
      setFormData((prev) => ({
        ...prev,
        kopUrl: dataUrl,
        useKopImage: true, // Default to true when newly uploaded
      }));
    } catch (err) {
      console.error('Failed to process kop surat:', err);
      setErrorMessage('Gagal memproses gambar kop surat. Silakan coba lagi.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsProcessingKop(false);
      if (kopInputRef.current) kopInputRef.current.value = '';
    }
  };

  const handleUseTutWuriLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: TUT_WURI_HANDAYANI_SVG,
    }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: '',
    }));
  };

  const handleRemoveKop = () => {
    setFormData((prev) => ({
      ...prev,
      kopUrl: '',
      useKopImage: false,
    }));
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <School className="w-6 h-6 text-indigo-600" />
            <span>Data Master Satuan Pendidikan</span>
          </h1>
          <p className="text-xs text-slate-500">
            Data identitas, logo, dan KOP surat ini otomatis disematkan pada seluruh dokumen program sekolah (Cover, KOP Surat, Lembar Pengesahan, dan Ekspor Word).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsConfirmSetDefaultOpen(true)}
            disabled={isSavingDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            title="Jadikan data dan gambar saat ini sebagai data baku/bawaan aplikasi"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>⭐ Jadikan Bawaan</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            title="Unduh seluruh data (sekolah, logo, guru, program) dalam file cadangan JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Cadangkan</span>
          </button>

          <button
            type="button"
            onClick={() => backupFileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            title="Pulihkan data dari file cadangan JSON"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Pulihkan</span>
          </button>

          <input
            ref={backupFileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleBackupFileSelect}
          />

          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {defaultAlert && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{defaultAlert}</span>
        </div>
      )}

      {savedAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Data identitas dan logo/kop sekolah berhasil disimpan serta diterapkan pada seluruh dokumen!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-7">
        {/* =========================================================
         * 1. IDENTITAS UTAMA
         * ======================================================= */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            <span>Identitas Satuan Pendidikan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) =>
                  setFormData({ ...formData, namaSekolah: e.target.value })
                }
                placeholder="Contoh: SD Negeri 01 Teladan"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                placeholder="Contoh: 20101234"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NSS (Nomor Statistik Sekolah)
              </label>
              <input
                type="text"
                value={formData.nss || ''}
                onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                placeholder="Contoh: 101020304050"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Pelajaran Aktif <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tahunPelajaran}
                onChange={(e) =>
                  setFormData({ ...formData, tahunPelajaran: e.target.value })
                }
                placeholder="Contoh: 2026/2027"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
         * 2. ALAMAT & LOKASI SEKOLAH
         * ======================================================= */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>Alamat & Lokasi Satuan Pendidikan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Jalan & Nomor
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                placeholder="Contoh: Jl. Merdeka No. 45, Kompleks Pendidikan"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Desa / Kelurahan
              </label>
              <input
                type="text"
                value={formData.desaKelurahan || ''}
                onChange={(e) =>
                  setFormData({ ...formData, desaKelurahan: e.target.value })
                }
                placeholder="Contoh: Mekarsari"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) =>
                  setFormData({ ...formData, kecamatan: e.target.value })
                }
                placeholder="Contoh: Cempaka"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kabupaten / Kota
              </label>
              <input
                type="text"
                value={formData.kabupaten}
                onChange={(e) =>
                  setFormData({ ...formData, kabupaten: e.target.value })
                }
                placeholder="Contoh: Kota Nusantara"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) =>
                  setFormData({ ...formData, provinsi: e.target.value })
                }
                placeholder="Contoh: Jawa Barat"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.kodePos || ''}
                onChange={(e) =>
                  setFormData({ ...formData, kodePos: e.target.value })
                }
                placeholder="Contoh: 40123"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
         * 3. PIMPINAN SEKOLAH (KEPALA SEKOLAH)
         * ======================================================= */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span>Pejabat Pengesah (Kepala Sekolah)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Kepala Sekolah (Beserta Gelar) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kepalaSekolah}
                onChange={(e) =>
                  setFormData({ ...formData, kepalaSekolah: e.target.value })
                }
                placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) =>
                  setFormData({ ...formData, nipKepalaSekolah: e.target.value })
                }
                placeholder="Contoh: 197205141998032001"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* =========================================================
         * 4. UPLOAD LOGO & KOP SURAT SEKOLAH (FITUR BARU)
         * ======================================================= */}
        <div className="space-y-5 pt-2">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
                4
              </span>
              <span>Identitas Visual: Logo Sekolah & KOP Surat</span>
            </div>
            <span className="text-[10px] font-normal text-slate-500 lowercase">
              Otomatis dipasang pada Cover & KOP Dokumen
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kartu Upload Logo Sekolah */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Logo Satuan Pendidikan</span>
                  </span>
                  {formData.logoUrl ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Logo Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Belum Diunggah
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mb-3">
                  Logo sekolah akan disematkan di <strong>Sampul Depan (Cover)</strong> dan di sisi kiri <strong>KOP Surat resmi</strong>. Format disarankan PNG transparan atau JPG.
                </p>

                {/* Box Preview Logo */}
                <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center p-3 relative overflow-hidden">
                  {formData.logoUrl ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Sekolah"
                        className="max-h-24 max-w-full object-contain drop-shadow-xs"
                      />
                      <span className="text-[10px] text-slate-400">
                        Pratinjau Logo Sekolah
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-2 text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                      <span className="text-xs font-medium">Belum ada logo terpasang</span>
                      <span className="text-[10px]">Klik tombol unggah di bawah</span>
                    </div>
                  )}

                  {isProcessingLogo && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center text-xs font-semibold text-indigo-600">
                      Memproses gambar logo...
                    </div>
                  )}
                </div>
              </div>

              {/* Kontrol Upload Logo */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="upload-logo-input"
                />

                <div className="flex flex-wrap gap-2">
                  <label
                    htmlFor="upload-logo-input"
                    className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors shadow-2xs text-center"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.logoUrl ? 'Ganti Logo' : 'Upload Logo Sekolah'}</span>
                  </label>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-2.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                      title="Hapus Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Preset Logo Kemendikbud */}
                <button
                  type="button"
                  onClick={handleUseTutWuriLogo}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gunakan Logo Tut Wuri Handayani</span>
                </button>
              </div>
            </div>

            {/* Kartu Upload KOP Surat Sekolah */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Gambar Header KOP Surat (Banner)</span>
                  </span>
                  {formData.kopUrl ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> KOP Gambar Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Opsional (Gunakan Teks Baku)
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mb-3">
                  Jika sekolah memiliki file gambar KOP surat resmi hasil scan/desain (format lebar/banner), unggah di sini untuk langsung menggantikan kepala surat dokumen.
                </p>

                {/* Box Preview KOP Surat */}
                <div className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  {formData.kopUrl ? (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-1 p-1">
                      <img
                        src={formData.kopUrl}
                        alt="KOP Surat Sekolah"
                        className="max-h-24 max-w-full object-contain border border-slate-100 rounded"
                      />
                      <span className="text-[10px] text-slate-400">
                        Pratinjau KOP Surat Gambar
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-2 text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                      <span className="text-xs font-medium">Menggunakan KOP Teks Otomatis</span>
                      <span className="text-[10px]">Unggah gambar jika ingin memakai kop khusus</span>
                    </div>
                  )}

                  {isProcessingKop && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center text-xs font-semibold text-indigo-600">
                      Memproses gambar KOP surat...
                    </div>
                  )}
                </div>
              </div>

              {/* Kontrol Upload KOP & Pilihan Mode */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <input
                  ref={kopInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleKopUpload}
                  className="hidden"
                  id="upload-kop-input"
                />

                <div className="flex flex-wrap gap-2">
                  <label
                    htmlFor="upload-kop-input"
                    className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors shadow-2xs text-center"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.kopUrl ? 'Ganti Gambar KOP' : 'Upload Gambar KOP Sekolah'}</span>
                  </label>

                  {formData.kopUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveKop}
                      className="px-2.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                      title="Hapus KOP Gambar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Toggle Pilihan Mode KOP jika gambar KOP diunggah */}
                {formData.kopUrl && (
                  <div className="pt-2 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 text-[11px] space-y-1.5">
                    <span className="font-bold text-slate-700 block">
                      Tampilan KOP pada Dokumen:
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                      <input
                        type="radio"
                        name="kop_mode"
                        checked={formData.useKopImage === true}
                        onChange={() => setFormData({ ...formData, useKopImage: true })}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Gunakan Gambar KOP Penuh (Banner)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                      <input
                        type="radio"
                        name="kop_mode"
                        checked={formData.useKopImage === false}
                        onChange={() => setFormData({ ...formData, useKopImage: false })}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Gunakan KOP Teks Kedinasan + Logo</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Integrasi Otomatis ke Dokumen:</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Setelah disimpan, gambar logo sekolah akan otomatis menghiasi halaman cover dan kop surat. Saat dokumen diekspor ke Microsoft Word (.docx) atau dicetak/PDF, logo dan kop akan terpasang rapi sesuai kaidah tata naskah dinas pendidikan.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsConfirmSetDefaultOpen(true)}
            disabled={isSavingDefault}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <BookmarkCheck className="w-4 h-4 text-amber-600" />
            <span>⭐ Jadikan Data Ini Bawaan Aplikasi</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Data Sekolah</span>
          </button>
        </div>
      </form>

      {/* Modal Konfirmasi Jadikan Bawaan Aplikasi */}
      <ConfirmModal
        isOpen={isConfirmSetDefaultOpen}
        title="Jadikan Data Saat Ini Sebagai Bawaan Aplikasi?"
        message="Seluruh profil sekolah (termasuk logo dan KOP surat yang Anda unggah), daftar guru, dan program kegiatan saat ini akan disimpan sebagai data bawaan (factory default) aplikasi. Data ini akan selalu digunakan saat aplikasi dibuka atau direset."
        confirmText="Ya, Jadikan Bawaan Aplikasi"
        cancelText="Batal"
        isDanger={false}
        onConfirm={handleConfirmSetDefault}
        onClose={() => setIsConfirmSetDefaultOpen(false)}
      />

      {/* Modal Konfirmasi Reset Data Sekolah */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        title="Kembalikan ke Data Sekolah Standar?"
        message="Seluruh isian nama sekolah, NPSN, nama kepala sekolah, dan logo akan dikembalikan ke data default standar aplikasi."
        confirmText="Ya, Kembalikan Data"
        cancelText="Batal"
        isDanger={false}
        onConfirm={handleConfirmReset}
        onClose={() => setIsConfirmResetOpen(false)}
      />
    </div>
  );
};

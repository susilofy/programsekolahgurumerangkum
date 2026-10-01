import React, { useState, useRef } from 'react';
import {
  Users2,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  RotateCcw,
  X,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  AlertCircle,
  FileUp,
  FileDown,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Teacher } from '../types/program';
import { DEFAULT_TEACHERS } from '../data/initialData';
import { storageService } from '../services/storageService';
import {
  exportTeachersToExcel,
  downloadTeacherTemplateExcel,
  parseTeachersFromExcel,
  ParsedTeacherRow,
} from '../utils/excelTeacherUtils';
import { ConfirmModal } from '../components/ConfirmModal';

interface MasterTeachersViewProps {
  teachers: Teacher[];
  schoolName?: string;
  onSaveTeachers: (teachers: Teacher[]) => void;
}

export const MasterTeachersView: React.FC<MasterTeachersViewProps> = ({
  teachers,
  schoolName,
  onSaveTeachers,
}) => {
  const [list, setList] = useState<Teacher[]>([...teachers]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    nama: '',
    nip: '',
    jabatan: 'Guru Kelas',
    tugas: '',
  });

  // Excel Menu states
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ParsedTeacherRow[]>([]);
  const [uploadStats, setUploadStats] = useState<{ total: number; valid: number; skipped: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  // Notification banners
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveAll = (updatedList: Teacher[]) => {
    setList(updatedList);
    onSaveTeachers(updatedList);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.nama?.trim()) return;

    const created: Teacher = {
      id: `tch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nama: newTeacher.nama.trim(),
      nip: newTeacher.nip?.trim() || '-',
      jabatan: newTeacher.jabatan || 'Guru Kelas',
      tugas: newTeacher.tugas?.trim() || 'Pelaksana kegiatan operasional',
    };

    const updated = [...list, created];
    handleSaveAll(updated);
    setIsAddingNew(false);
    setNewTeacher({
      nama: '',
      nip: '',
      jabatan: 'Guru Kelas',
      tugas: '',
    });
    showNotification(`Guru/Tendik "${created.nama}" berhasil ditambahkan.`);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    const updated = list.map((t) =>
      t.id === editingTeacher.id ? editingTeacher : t
    );
    handleSaveAll(updated);
    showNotification(`Data "${editingTeacher.nama}" berhasil diperbarui.`);
    setEditingTeacher(null);
  };

  const handleDelete = (id: string) => {
    const target = list.find((t) => t.id === id);
    if (target) {
      setTeacherToDelete(target);
    }
  };

  const handleConfirmDeleteTeacher = () => {
    if (!teacherToDelete) return;
    const deletedName = teacherToDelete.nama;
    const updated = list.filter((t) => t.id !== teacherToDelete.id);
    handleSaveAll(updated);
    showNotification(`"${deletedName}" telah dihapus.`);
    setTeacherToDelete(null);
  };

  const handleReset = () => {
    setIsConfirmResetOpen(true);
  };

  const handleConfirmReset = () => {
    const cached = storageService.getCachedFactoryDefaults();
    const defs =
      cached?.teachers && cached.teachers.length > 0
        ? cached.teachers
        : DEFAULT_TEACHERS;
    handleSaveAll(defs);
    showNotification('Daftar dewan guru dikembalikan ke bawaan aplikasi.');
    setIsConfirmResetOpen(false);
  };

  const handleConfirmClearAll = () => {
    handleSaveAll([]);
    showNotification('Seluruh data personil berhasil dihapus.');
    setIsConfirmClearAllOpen(false);
  };

  // Excel Download handlers
  const handleExportDataExcel = () => {
    setIsDownloadMenuOpen(false);
    if (list.length === 0) {
      showNotification('Tidak ada data guru untuk diunduh.', 'error');
      return;
    }
    try {
      exportTeachersToExcel(list, schoolName);
      showNotification(`Berhasil mengunduh ${list.length} data guru ke file Excel (.xlsx).`);
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal mengekspor data ke Excel.', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    setIsDownloadMenuOpen(false);
    try {
      downloadTeacherTemplateExcel();
      showNotification('Template Excel berhasil diunduh. Silakan isi dan upload kembali.');
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal mengunduh template Excel.', 'error');
    }
  };

  // Excel Upload handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file: File) => {
    setUploadFile(file);
    setUploadError(null);
    setIsParsing(true);
    setParsedPreview([]);
    setUploadStats(null);

    const result = await parseTeachersFromExcel(file);
    setIsParsing(false);

    if (result.success && result.data.length > 0) {
      setParsedPreview(result.data);
      setUploadStats({
        total: result.totalRows,
        valid: result.validRows,
        skipped: result.skippedRows,
      });
    } else {
      setUploadError(result.error || 'Gagal memproses baris file Excel.');
    }
  };

  const handleApplyImport = () => {
    if (parsedPreview.length === 0) return;

    const importedTeachers: Teacher[] = parsedPreview.map((item, idx) => ({
      id: `tch-imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      nama: item.nama,
      nip: item.nip,
      jabatan: item.jabatan,
      tugas: item.tugas,
    }));

    let finalList: Teacher[];
    if (importMode === 'replace') {
      finalList = importedTeachers;
    } else {
      // Append mode - avoid identical names if possible, but keep all unique
      const existingNames = new Set(list.map((t) => t.nama.toLowerCase().trim()));
      const uniqueNew = importedTeachers.filter(
        (t) => !existingNames.has(t.nama.toLowerCase().trim())
      );
      finalList = [...list, ...uniqueNew];
    }

    handleSaveAll(finalList);
    showNotification(
      `Sukses mengimpor ${importedTeachers.length} data personil dari Excel (${
        importMode === 'replace' ? 'Mode ganti data' : 'Mode gabung data'
      }).`
    );

    // Reset upload modal state
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setParsedPreview([]);
    setUploadStats(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered teachers list based on search
  const filteredList = list.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.nama.toLowerCase().includes(q) ||
      t.nip.toLowerCase().includes(q) ||
      t.jabatan.toLowerCase().includes(q) ||
      t.tugas.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Master Data Guru & Tenaga Kependidikan
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola dewan guru & tendik untuk penugasan otomatis panitia di dokumen program kegiatan sekolah.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Excel Download, Excel Upload, Add New */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Menu Unduh Excel */}
          <div className="relative">
            <button
              onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs hover:border-slate-400 active:scale-95"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>Unduh Excel</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isDownloadMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDownloadMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilihan Ekspor Excel
                  </div>
                  <button
                    onClick={handleExportDataExcel}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-medium flex items-center gap-2.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Unduh Data Guru ({list.length})</div>
                      <div className="text-[10px] text-slate-400">File format .xlsx siap buka di Excel</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 font-medium flex items-center gap-2.5 transition-colors border-t border-slate-100"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Unduh Template Kosong</div>
                      <div className="text-[10px] text-slate-400">Format standar untuk isi data baru</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Tombol Upload Excel */}
          <button
            onClick={() => {
              setIsUploadModalOpen(true);
              setUploadFile(null);
              setParsedPreview([]);
              setUploadStats(null);
              setUploadError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-xl transition-all shadow-2xs active:scale-95"
          >
            <FileUp className="w-4 h-4 text-emerald-600" />
            <span>Upload dari Excel</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            title="Kembalikan ke data bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Clear All Button */}
          {list.length > 0 && (
            <button
              type="button"
              onClick={() => setIsConfirmClearAllOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
              title="Hapus semua personil dalam daftar"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          )}

          {/* Add Personil */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Personil</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari guru berdasarkan nama, NIP, atau jabatan..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
            Total: {list.length} Personil
          </span>
          {searchQuery && (
            <span className="text-slate-500 text-[11px]">
              (Ditemukan {filteredList.length} dari pencarian)
            </span>
          )}
        </div>
      </div>

      {/* Add New Personil Form Drawer */}
      {isAddingNew && (
        <form
          onSubmit={handleAdd}
          className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200 space-y-4 animate-in fade-in shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Tambah Guru / Tendik Baru</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newTeacher.nama}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, nama: e.target.value })
                }
                placeholder="Contoh: Budi Santoso, S.Pd."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={newTeacher.nip}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, nip: e.target.value })
                }
                placeholder="198501... atau -"
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan Pokok
              </label>
              <input
                type="text"
                value={newTeacher.jabatan}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, jabatan: e.target.value })
                }
                placeholder="Guru Kelas I / Guru PJOK / Pustakawan"
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tugas Utama
              </label>
              <input
                type="text"
                value={newTeacher.tugas}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, tugas: e.target.value })
                }
                placeholder="Koordinator Literasi / Bendahara"
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Simpan Personil
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      {editingTeacher && (
        <form
          onSubmit={handleUpdate}
          className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Edit2 className="w-4 h-4 text-amber-600" />
              <span>Edit Data Personil: {editingTeacher.nama}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingTeacher(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                required
                value={editingTeacher.nama}
                onChange={(e) =>
                  setEditingTeacher({ ...editingTeacher, nama: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP
              </label>
              <input
                type="text"
                value={editingTeacher.nip}
                onChange={(e) =>
                  setEditingTeacher({ ...editingTeacher, nip: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan Pokok
              </label>
              <input
                type="text"
                value={editingTeacher.jabatan}
                onChange={(e) =>
                  setEditingTeacher({ ...editingTeacher, jabatan: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tugas Utama
              </label>
              <input
                type="text"
                value={editingTeacher.tugas}
                onChange={(e) =>
                  setEditingTeacher({ ...editingTeacher, tugas: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingTeacher(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
              <tr>
                <th className="p-3 text-center w-12">No</th>
                <th className="p-3 text-left">Nama Personil</th>
                <th className="p-3 text-left w-48">NIP</th>
                <th className="p-3 text-left w-48">Jabatan</th>
                <th className="p-3 text-left">Uraian Tugas Utama</th>
                <th className="p-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Users2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">
                      {searchQuery
                        ? 'Tidak ada personil yang sesuai dengan kata kunci pencarian.'
                        : 'Belum ada data guru & tendik.'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {searchQuery
                        ? 'Coba ganti kata kunci atau hapus filter.'
                        : 'Klik tombol "+ Tambah Personil" atau "Upload dari Excel" untuk mengisi data.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {t.nama}
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">
                      {t.nip}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50/80 text-indigo-700 border border-indigo-100 font-medium text-[11px] inline-block">
                        {t.jabatan}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 leading-relaxed">
                      {t.tugas}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingTeacher(t)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit data personil"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus data guru ini"
                          aria-label="Hapus data guru"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Upload & Impor Data Guru dari File Excel
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mendukung file Excel (.xlsx, .xls) atau (.csv)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* File Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />

                {!uploadFile ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-2xl p-7 text-center cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm">
                        Klik untuk memilih file Excel
                      </span>{' '}
                      <span className="text-slate-500">atau seret file ke sini</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Format kolom yang dikenali: Nama / Nama Lengkap, NIP, Jabatan, dan Tugas Utama.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {uploadFile.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(uploadFile.size / 1024).toFixed(1)} KB • Siap diproses
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadFile(null);
                        setParsedPreview([]);
                        setUploadStats(null);
                        setUploadError(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Ganti File
                    </button>
                  </div>
                )}
              </div>

              {/* Parsing status */}
              {isParsing && (
                <div className="p-4 text-center text-slate-500 space-y-2">
                  <div className="inline-block animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                  <p className="font-medium text-xs">Membaca dan memvalidasi file Excel...</p>
                </div>
              )}

              {/* Error Box */}
              {uploadError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Format file tidak sesuai</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{uploadError}</p>
                </div>
              )}

              {/* Parsed Preview & Options */}
              {parsedPreview.length > 0 && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Summary Stats */}
                  {uploadStats && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">
                          Ditemukan {uploadStats.valid} personil valid dari file Excel!
                        </span>
                      </div>
                      {uploadStats.skipped > 0 && (
                        <span className="text-[10px] text-slate-500">
                          ({uploadStats.skipped} baris kosong dilewati)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Mode Import Options */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Metode Penggabungan Data:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                          importMode === 'append'
                            ? 'bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="append"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="mt-0.5 text-indigo-600"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">
                            Gabungkan (Tambahkan)
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            Menambahkan guru dari Excel tanpa menghapus data guru yang sudah ada saat ini.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                          importMode === 'replace'
                            ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5 text-amber-600"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">
                            Gantikan Seluruh Data
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            Menghapus seluruh daftar lama dan menggantinya dengan data baru dari file Excel ini.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Pratinjau Data yang Akan Diimpor:</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Menampilkan {parsedPreview.length} personil
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-[11px]">
                        <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                          <tr>
                            <th className="p-2 text-center w-8">No</th>
                            <th className="p-2 text-left">Nama</th>
                            <th className="p-2 text-left w-32">NIP</th>
                            <th className="p-2 text-left w-28">Jabatan</th>
                            <th className="p-2 text-left">Tugas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {parsedPreview.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400 font-bold">
                                {idx + 1}
                              </td>
                              <td className="p-2 font-semibold text-slate-800">
                                {row.nama}
                              </td>
                              <td className="p-2 text-slate-600 font-mono">
                                {row.nip}
                              </td>
                              <td className="p-2 text-slate-700">{row.jabatan}</td>
                              <td className="p-2 text-slate-500 truncate max-w-xs">
                                {row.tugas}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Template Download Help Link */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Butuh acuan format file yang tepat?</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh Template Excel</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={parsedPreview.length === 0}
                onClick={handleApplyImport}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Terapkan ke Master Guru ({parsedPreview.length} Personil)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Guru */}
      <ConfirmModal
        isOpen={Boolean(teacherToDelete)}
        title="Hapus Data Guru / Tendik?"
        message={`Apakah Anda yakin ingin menghapus "${teacherToDelete?.nama || ''}" (${teacherToDelete?.jabatan || ''}) dari daftar master guru & tendik?`}
        confirmText="Ya, Hapus Data"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmDeleteTeacher}
        onClose={() => setTeacherToDelete(null)}
      />

      {/* Modal Konfirmasi Reset Guru ke Standar */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        title="Kembalikan ke Daftar Guru Bawaan?"
        message="Daftar guru saat ini akan dikembalikan ke data bawaan aplikasi."
        confirmText="Ya, Kembalikan Data"
        cancelText="Batal"
        isDanger={false}
        onConfirm={handleConfirmReset}
        onClose={() => setIsConfirmResetOpen(false)}
      />

      {/* Modal Konfirmasi Hapus Semua Personil */}
      <ConfirmModal
        isOpen={isConfirmClearAllOpen}
        title="Hapus Seluruh Data Personil Guru & Tendik?"
        message="Seluruh personil guru dan tenaga kependidikan dalam daftar akan dikosongkan. Anda dapat menambahkan kembali personil atau mengunggah file Excel."
        confirmText="Ya, Kosongkan Semua"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmClearAll}
        onClose={() => setIsConfirmClearAllOpen(false)}
      />
    </div>
  );
};

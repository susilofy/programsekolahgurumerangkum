import * as XLSX from 'xlsx';
import { Teacher } from '../types/program';

export interface ParsedTeacherRow {
  nama: string;
  nip: string;
  jabatan: string;
  tugas: string;
}

export interface ParseResult {
  success: boolean;
  data: ParsedTeacherRow[];
  totalRows: number;
  validRows: number;
  skippedRows: number;
  warning?: string;
  error?: string;
}

/**
 * Downloads a binary blob as a file in browser
 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Exports current teacher list to an Excel (.xlsx) file
 */
export function exportTeachersToExcel(teachers: Teacher[], schoolName?: string): void {
  const data = teachers.map((t, index) => ({
    'No': index + 1,
    'Nama Lengkap & Gelar': t.nama,
    'NIP': t.nip && t.nip !== '-' ? t.nip : '-',
    'Jabatan': t.jabatan || '-',
    'Uraian Tugas Utama': t.tugas || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set friendly column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 32 }, // Nama
    { wch: 24 }, // NIP
    { wch: 26 }, // Jabatan
    { wch: 45 }, // Uraian Tugas
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Guru & Tendik');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const cleanSchool = schoolName ? schoolName.replace(/[^a-zA-Z0-9]/g, '_') : 'SD';
  const dateStr = new Date().toISOString().slice(0, 10);
  triggerDownload(blob, `Data_Guru_Tendik_${cleanSchool}_${dateStr}.xlsx`);
}

/**
 * Generates and downloads a clean Excel template with sample guidance
 */
export function downloadTeacherTemplateExcel(): void {
  const sampleData = [
    {
      'No': 1,
      'Nama Lengkap & Gelar': 'Drs. H. Ahmad Fauzi, M.Pd.',
      'NIP': '196805121992031004',
      'Jabatan': 'Kepala Sekolah',
      'Uraian Tugas Utama': 'Penanggung jawab umum seluruh program kegiatan sekolah',
    },
    {
      'No': 2,
      'Nama Lengkap & Gelar': 'Siti Rahmawati, S.Pd.SD.',
      'NIP': '198204152008012015',
      'Jabatan': 'Guru Kelas VI',
      'Uraian Tugas Utama': 'Koordinator tim literasi dan ketua pelaksana kegiatan',
    },
    {
      'No': 3,
      'Nama Lengkap & Gelar': 'Bambang Irawan, S.Pd.',
      'NIP': '198811202014021002',
      'Jabatan': 'Guru PJOK',
      'Uraian Tugas Utama': 'Koordinator sarana prasarana dan perlengkapan lapangan',
    },
    {
      'No': 4,
      'Nama Lengkap & Gelar': 'Nurul Hidayah, S.Pd.I.',
      'NIP': '-',
      'Jabatan': 'Guru PAI',
      'Uraian Tugas Utama': 'Seksi konsumsi dan pembinaan karakter religius',
    },
    {
      'No': 5,
      'Nama Lengkap & Gelar': 'Dewi Lestari, A.Md.Pust.',
      'NIP': '-',
      'Jabatan': 'Tenaga Perpustakaan',
      'Uraian Tugas Utama': 'Dokumentasi, publikasi, dan administrasi naskah',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 24 },
    { wch: 26 },
    { wch: 45 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  triggerDownload(blob, 'Template_Data_Guru_Tendik.xlsx');
}

/**
 * Intelligent header mapper to find the right column regardless of minor header variation
 */
function findColumnValue(row: Record<string, any>, possibleKeys: string[]): string {
  const rowKeys = Object.keys(row);
  for (const target of possibleKeys) {
    const foundKey = rowKeys.find((k) => {
      const normalizedKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedTarget = target.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedKey.includes(normalizedTarget) || normalizedTarget.includes(normalizedKey);
    });
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
      const val = String(row[foundKey]).trim();
      if (val) return val;
    }
  }
  return '';
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file
 */
export async function parseTeachersFromExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            success: false,
            data: [],
            totalRows: 0,
            validRows: 0,
            skippedRows: 0,
            error: 'Gagal membaca isi file. Pastikan file tidak rusak.',
          });
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          resolve({
            success: false,
            data: [],
            totalRows: 0,
            validRows: 0,
            skippedRows: 0,
            error: 'File Excel tidak memiliki lembar kerja (worksheet).',
          });
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          resolve({
            success: false,
            data: [],
            totalRows: 0,
            validRows: 0,
            skippedRows: 0,
            error: 'File Excel kosong atau tidak memiliki baris data.',
          });
          return;
        }

        const parsedRows: ParsedTeacherRow[] = [];
        let skippedCount = 0;

        for (const row of rawJson) {
          // Identify columns with smart matching
          const nama = findColumnValue(row, [
            'nama',
            'namalengkap',
            'namaguru',
            'namapersonil',
            'namapegawai',
          ]);

          const nip = findColumnValue(row, [
            'nip',
            'nuptk',
            'nomorinduk',
            'nomorpegawai',
          ]) || '-';

          const jabatan = findColumnValue(row, [
            'jabatan',
            'posisi',
            'jabatanpokok',
            'tugasguru',
            'status',
          ]) || 'Guru Kelas';

          const tugas = findColumnValue(row, [
            'tugas',
            'uraiantugas',
            'tugastambahan',
            'tugasutama',
            'keterangan',
          ]) || 'Pelaksana kegiatan operasional';

          // A valid row must at least have a person's name
          if (nama && nama.length > 1) {
            parsedRows.push({
              nama,
              nip: nip === '' ? '-' : nip,
              jabatan: jabatan === '' ? 'Guru Kelas' : jabatan,
              tugas: tugas === '' ? 'Pelaksana kegiatan operasional' : tugas,
            });
          } else {
            skippedCount++;
          }
        }

        if (parsedRows.length === 0) {
          resolve({
            success: false,
            data: [],
            totalRows: rawJson.length,
            validRows: 0,
            skippedRows: skippedCount,
            error:
              'Tidak ditemukan kolom nama guru yang sesuai. Pastikan file memiliki kolom dengan judul "Nama" atau "Nama Lengkap".',
          });
          return;
        }

        resolve({
          success: true,
          data: parsedRows,
          totalRows: rawJson.length,
          validRows: parsedRows.length,
          skippedRows: skippedCount,
        });
      } catch (err: any) {
        console.error('Error parsing excel:', err);
        resolve({
          success: false,
          data: [],
          totalRows: 0,
          validRows: 0,
          skippedRows: 0,
          error: `Gagal membaca format Excel: ${err?.message || 'Format tidak didukung'}`,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        totalRows: 0,
        validRows: 0,
        skippedRows: 0,
        error: 'Gagal memproses file pada peramban.',
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

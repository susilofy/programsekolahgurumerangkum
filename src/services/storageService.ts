import { ProgramData, SchoolData, Teacher } from '../types/program';
import {
  DEFAULT_SCHOOL,
  DEFAULT_TEACHERS,
  TEMPLATES,
  CUSTOM_DEFAULT_PROGRAMS,
} from '../data/initialData';

const STORAGE_KEYS = {
  SCHOOL: 'programku_school_data',
  TEACHERS: 'programku_teachers_data',
  PROGRAMS: 'programku_programs_data',
  ACTIVE_ID: 'programku_active_program_id',
  FACTORY_DEFAULTS: 'programku_factory_defaults',
};

export const storageService = {
  getSchoolData(): SchoolData {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    if (!raw) {
      // Check local factory defaults cache first, otherwise use DEFAULT_SCHOOL
      const localDefaults = this.getCachedFactoryDefaults();
      const initial = localDefaults?.school || DEFAULT_SCHOOL;
      if (!initial.kopUrl && DEFAULT_SCHOOL.kopUrl) {
        initial.kopUrl = DEFAULT_SCHOOL.kopUrl;
        initial.useKopImage = true;
      }
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(initial));
      return initial;
    }
    try {
      const parsed: SchoolData = JSON.parse(raw);
      let changed = false;

      // If stored data has old placeholder school name, update to application default
      if (parsed.namaSekolah === 'SD Negeri 01 Teladan' && DEFAULT_SCHOOL.namaSekolah !== 'SD Negeri 01 Teladan') {
        Object.assign(parsed, DEFAULT_SCHOOL);
        changed = true;
      }

      // If stored data does not yet have kopUrl or has empty kopUrl, inherit from DEFAULT_SCHOOL
      if ((!parsed.kopUrl || parsed.kopUrl.trim() === '') && DEFAULT_SCHOOL.kopUrl) {
        parsed.kopUrl = DEFAULT_SCHOOL.kopUrl;
        parsed.useKopImage = true;
        changed = true;
      }

      // If kopUrl exists, ensure useKopImage is active
      if (parsed.kopUrl && (parsed.useKopImage === undefined || parsed.useKopImage === false)) {
        parsed.useKopImage = true;
        changed = true;
      }

      // If stored data does not have logoUrl, inherit from DEFAULT_SCHOOL
      if ((!parsed.logoUrl || parsed.logoUrl.trim() === '') && DEFAULT_SCHOOL.logoUrl) {
        parsed.logoUrl = DEFAULT_SCHOOL.logoUrl;
        changed = true;
      }

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(parsed));
      }

      return parsed;
    } catch {
      return DEFAULT_SCHOOL;
    }
  },

  saveSchoolData(data: SchoolData): void {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(data));
  },

  getTeachers(): Teacher[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    if (!raw) {
      const localDefaults = this.getCachedFactoryDefaults();
      const initial = (localDefaults?.teachers && localDefaults.teachers.length > 0)
        ? localDefaults.teachers
        : DEFAULT_TEACHERS;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TEACHERS;
    }
  },

  saveTeachers(teachers: Teacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getPrograms(): ProgramData[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    if (!raw) {
      const localDefaults = this.getCachedFactoryDefaults();
      if (localDefaults?.programs && localDefaults.programs.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(localDefaults.programs));
        return localDefaults.programs;
      }

      if (CUSTOM_DEFAULT_PROGRAMS && CUSTOM_DEFAULT_PROGRAMS.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(CUSTOM_DEFAULT_PROGRAMS));
        return CUSTOM_DEFAULT_PROGRAMS;
      }

      // Seed with initial starter programs converted from templates
      const seeded: ProgramData[] = TEMPLATES.slice(0, 3).map((tmpl, idx) => ({
        id: `prog-seed-${idx + 1}`,
        namaProgram: tmpl.namaProgram || 'Program Kegiatan Sekolah',
        tahunPelajaran: DEFAULT_SCHOOL.tahunPelajaran,
        bidang: tmpl.bidang || 'Kurikulum',
        penanggungJawab: DEFAULT_SCHOOL.kepalaSekolah,
        tempatPenyusunan: DEFAULT_SCHOOL.kabupaten || 'Nusantara',
        tanggalPengesahan: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latarBelakang: tmpl.latarBelakang || '',
        masalahKondisi: tmpl.masalahKondisi || '',
        kebutuhanSiswa: tmpl.kebutuhanSiswa || '',
        hasilEvaluasi: tmpl.hasilEvaluasi || '',
        raporPendidikan: tmpl.raporPendidikan || '',
        tujuanSekolah: tmpl.tujuanSekolah || '',
        dasarHukum: tmpl.dasarHukum || [],
        tujuan: tmpl.tujuan || [],
        sasaran: tmpl.sasaran || {
          kelasPilihan: ['Semua kelas'],
          pesertaDidik: 'Peserta didik SD',
          guru: 'Dewan Guru',
          tenagaKependidikan: 'Tenaga Kependidikan',
          orangTua: 'Orang Tua Siswa',
          komite: 'Komite Sekolah',
          masyarakat: '-',
          lainnya: '-',
        },
        kegiatan: tmpl.kegiatan || [],
        waktuTempat: tmpl.waktuTempat || {
          hari: 'Senin - Sabtu',
          tanggal: 'Semester Ganjil',
          waktu: '08.00 - 12.00 WIB',
          tempat: 'Lingkungan Sekolah',
          durasi: '1 Semester',
          periode: 'Tahun Pelajaran 2026/2027',
        },
        pelaksana: tmpl.pelaksana || [],
        indikator: tmpl.indikator || [],
        pembiayaan: tmpl.pembiayaan || {
          sumberDana: 'BOS Reguler',
          keterangan: 'Rencana anggaran biaya kegiatan',
          items: [],
        },
        monitoringEvaluasi: tmpl.monitoringEvaluasi || {
          monitoring: '',
          evaluasi: '',
          instrumen: '',
        },
        tindakLanjut: tmpl.tindakLanjut || '',
        penutup: tmpl.penutup || '',
        history: [],
      }));

      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(seeded));
      return seeded;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveProgram(program: ProgramData): void {
    const list = this.getPrograms();
    const idx = list.findIndex((p) => p.id === program.id);
    const updated = {
      ...program,
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(list));
  },

  deleteProgram(id: string): void {
    const list = this.getPrograms().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(list));
  },

  duplicateProgram(id: string): ProgramData | null {
    const list = this.getPrograms();
    const target = list.find((p) => p.id === id);
    if (!target) return null;

    const copy: ProgramData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      namaProgram: `${target.namaProgram} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      history: [
        {
          timestamp: new Date().toISOString(),
          description: `Disalin dari program: ${target.namaProgram}`,
          snapshot: JSON.stringify(target),
        },
      ],
    };

    list.unshift(copy);
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(list));
    return copy;
  },

  createNewProgram(initialData?: Partial<ProgramData>): ProgramData {
    const school = this.getSchoolData();
    const newProg: ProgramData = {
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      namaProgram: initialData?.namaProgram || 'Program Kegiatan Sekolah Baru',
      tahunPelajaran: initialData?.tahunPelajaran || school.tahunPelajaran,
      bidang: initialData?.bidang || 'Pembelajaran',
      penanggungJawab: initialData?.penanggungJawab || school.kepalaSekolah,
      tempatPenyusunan: school.kabupaten || 'Nusantara',
      tanggalPengesahan: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      latarBelakang: initialData?.latarBelakang || '',
      masalahKondisi: initialData?.masalahKondisi || '',
      kebutuhanSiswa: initialData?.kebutuhanSiswa || '',
      hasilEvaluasi: initialData?.hasilEvaluasi || '',
      raporPendidikan: initialData?.raporPendidikan || '',
      tujuanSekolah: initialData?.tujuanSekolah || '',
      dasarHukum: initialData?.dasarHukum || [
        {
          id: 'dh-init-1',
          text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
          perluDiverifikasi: false,
        },
        {
          id: 'dh-init-2',
          text: 'Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Standar Nasional Pendidikan',
          perluDiverifikasi: false,
        },
      ],
      tujuan: initialData?.tujuan || [],
      sasaran: initialData?.sasaran || {
        kelasPilihan: ['Semua kelas'],
        pesertaDidik: 'Peserta Didik Kelas I - VI',
        guru: 'Dewan Guru',
        tenagaKependidikan: 'Tenaga Kependidikan',
        orangTua: 'Orang Tua / Wali Murid',
        komite: 'Komite Sekolah',
        masyarakat: '-',
        lainnya: '-',
      },
      kegiatan: initialData?.kegiatan || [],
      waktuTempat: initialData?.waktuTempat || {
        hari: 'Senin - Sabtu',
        tanggal: 'Semester Ganjil 2026/2027',
        waktu: '08.00 - 12.00 WIB',
        tempat: `${school.namaSekolah}`,
        durasi: '1 Semester',
        periode: school.tahunPelajaran,
      },
      pelaksana: initialData?.pelaksana || [
        {
          id: 'pel-init-1',
          jabatan: 'Penanggung Jawab',
          nama: school.kepalaSekolah,
          tugas: 'Penanggung jawab umum dan pengarah kebijakan program',
        },
      ],
      indikator: initialData?.indikator || [],
      pembiayaan: initialData?.pembiayaan || {
        sumberDana: 'BOS Reguler / RKAS Sekolah',
        keterangan: 'Anggaran belanja operasional program',
        items: [],
      },
      monitoringEvaluasi: initialData?.monitoringEvaluasi || {
        monitoring: '',
        evaluasi: '',
        instrumen: '',
      },
      tindakLanjut: initialData?.tindakLanjut || '',
      penutup: initialData?.penutup || '',
      history: [
        {
          timestamp: new Date().toISOString(),
          description: 'Program dibuat pertama kali',
          snapshot: '',
        },
      ],
    };

    this.saveProgram(newProg);
    return newProg;
  },

  getCachedFactoryDefaults(): {
    school?: SchoolData;
    teachers?: Teacher[];
    programs?: ProgramData[];
  } | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FACTORY_DEFAULTS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse cached factory defaults:', e);
    }
    return null;
  },

  /**
   * Permanently sets the provided (or current) school, teachers, and programs
   * as the application's default data across client sessions and server restarts.
   */
  async saveAsFactoryDefaults(
    customSchool?: SchoolData,
    customTeachers?: Teacher[],
    customPrograms?: ProgramData[]
  ): Promise<{ success: boolean; message: string }> {
    const schoolToSave = customSchool || this.getSchoolData();
    const teachersToSave = customTeachers || this.getTeachers();
    const programsToSave = customPrograms || this.getPrograms();

    const payload = {
      school: schoolToSave,
      teachers: teachersToSave,
      programs: programsToSave,
      updatedAt: new Date().toISOString(),
    };

    // 1. Cache immediately in client localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.FACTORY_DEFAULTS, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not cache factory defaults in localStorage:', e);
    }

    // 2. Transmit to server to write to src/data/customDefaults.json
    try {
      const res = await fetch('/api/save-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      if (resData.success) {
        return {
          success: true,
          message: 'Data sekolah, guru, program, dan gambar logo/KOP berhasil disimpan sebagai bawaan aplikasi!',
        };
      }
    } catch (e) {
      console.warn('Server save-defaults endpoint not reachable, cached locally:', e);
    }

    return {
      success: true,
      message: 'Data berhasil disimpan sebagai bawaan aplikasi di browser Anda!',
    };
  },

  /**
   * Resets the active application state to the factory defaults.
   */
  resetToFactoryDefaults(): {
    school: SchoolData;
    teachers: Teacher[];
    programs: ProgramData[];
  } {
    const cached = this.getCachedFactoryDefaults();
    const targetSchool: SchoolData = {
      ...DEFAULT_SCHOOL,
      ...(cached?.school || {}),
      kopUrl: cached?.school?.kopUrl || DEFAULT_SCHOOL.kopUrl,
      logoUrl: cached?.school?.logoUrl || DEFAULT_SCHOOL.logoUrl,
      useKopImage: true,
    };
    const targetTeachers =
      cached?.teachers && cached.teachers.length > 0
        ? cached.teachers
        : DEFAULT_TEACHERS;
    const targetPrograms =
      cached?.programs && cached.programs.length > 0
        ? cached.programs
        : (CUSTOM_DEFAULT_PROGRAMS || []);

    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(targetSchool));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(targetTeachers));
    if (targetPrograms.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(targetPrograms));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    }

    return {
      school: targetSchool,
      teachers: targetTeachers,
      programs: this.getPrograms(),
    };
  },

  /**
   * Exports full application snapshot (including images as base64) to a JSON string.
   */
  exportAllDataAsJson(): string {
    const school = this.getSchoolData();
    const teachers = this.getTeachers();
    const programs = this.getPrograms();

    const snapshot = {
      app: 'PROGRAMKU SD',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      school,
      teachers,
      programs,
    };

    return JSON.stringify(snapshot, null, 2);
  },

  /**
   * Imports application snapshot from a JSON string and optionally sets as defaults.
   */
  async importAllDataFromJson(
    jsonContent: string,
    setAsDefault = true
  ): Promise<{
    success: boolean;
    message: string;
    data?: { school: SchoolData; teachers: Teacher[]; programs: ProgramData[] };
  }> {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Format file JSON tidak valid');
      }

      if (!parsed.school && !parsed.namaSekolah) {
        throw new Error('Data sekolah tidak ditemukan dalam file');
      }

      const importedSchool: SchoolData = parsed.school || {
        namaSekolah: parsed.namaSekolah,
        npsn: parsed.npsn || '',
        nss: parsed.nss || '',
        alamat: parsed.alamat || '',
        desaKelurahan: parsed.desaKelurahan || '',
        kecamatan: parsed.kecamatan || '',
        kabupaten: parsed.kabupaten || '',
        provinsi: parsed.provinsi || '',
        kodePos: parsed.kodePos || '',
        kepalaSekolah: parsed.kepalaSekolah || '',
        nipKepalaSekolah: parsed.nipKepalaSekolah || '',
        tahunPelajaran: parsed.tahunPelajaran || '2026/2027',
        logoUrl: parsed.logoUrl || '',
        kopUrl: parsed.kopUrl || '',
        useKopImage: !!parsed.useKopImage,
      };

      const importedTeachers: Teacher[] = Array.isArray(parsed.teachers)
        ? parsed.teachers
        : this.getTeachers();

      const importedPrograms: ProgramData[] = Array.isArray(parsed.programs)
        ? parsed.programs
        : this.getPrograms();

      this.saveSchoolData(importedSchool);
      this.saveTeachers(importedTeachers);
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(importedPrograms));

      if (setAsDefault) {
        await this.saveAsFactoryDefaults(importedSchool, importedTeachers, importedPrograms);
      }

      return {
        success: true,
        message: 'Data sekolah, guru, dan program berhasil dipulihkan dari cadangan!',
        data: {
          school: importedSchool,
          teachers: importedTeachers,
          programs: importedPrograms,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Gagal mengimpor file cadangan JSON.',
      };
    }
  },
};

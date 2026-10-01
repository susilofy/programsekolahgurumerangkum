import { ProgramAnalysis, ProgramData, SectionKey } from '../types/program';

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2, delayMs = 1000): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err: any) {
      lastErr = err;
      if (i < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastErr;
}

export interface AiAssistParams {
  sectionKey: SectionKey;
  actionType:
    | 'buat_awal'
    | 'perbaiki'
    | 'persingkat'
    | 'perpanjang'
    | 'formal'
    | 'kondisi_sekolah'
    | 'alternatif'
    | 'custom';
  currentContent: any;
  program: ProgramData;
  userInstruction?: string;
}

export const aiService = {
  async requestSectionAssist(params: AiAssistParams): Promise<string> {
    const { sectionKey, actionType, currentContent, program, userInstruction } = params;

    const programContext = {
      namaProgram: program.namaProgram,
      bidang: program.bidang,
      tahunPelajaran: program.tahunPelajaran,
      penanggungJawab: program.penanggungJawab,
      namaSekolah: program.tempatPenyusunan,
      masalahKondisi: program.masalahKondisi || program.latarBelakang?.slice(0, 200),
      kebutuhanSiswa: program.kebutuhanSiswa,
      raporPendidikan: program.raporPendidikan,
      tujuanText: program.tujuan?.join('; '),
      sasaranRingkas: `${program.sasaran?.pesertaDidik || 'Siswa SD'} (Kelas: ${program.sasaran?.kelasPilihan?.join(', ') || 'Semua'})`,
      sasaranText: JSON.stringify(program.sasaran),
      waktuText: `${program.waktuTempat?.hari}, ${program.waktuTempat?.durasi}`,
    };

    const res = await fetchWithRetry('/api/ai/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionKey,
        actionType,
        currentContent,
        programContext,
        userInstruction,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }

    const data = await res.json();
    return data.result || '';
  },

  async generateFullProgram(params: {
    namaProgram: string;
    bidang: string;
    masalahKondisi: string;
    sasaran: string;
    waktuPeriode: string;
    namaSekolah?: string;
    tahunPelajaran?: string;
    kepalaSekolah?: string;
  }): Promise<any> {
    const res = await fetchWithRetry('/api/ai/generate-full-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }

    const data = await res.json();
    return data.programDraft;
  },

  async analyzeProgram(program: ProgramData): Promise<ProgramAnalysis> {
    const res = await fetchWithRetry('/api/ai/analyze-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }

    const data = await res.json();
    return data.analysis;
  },
};

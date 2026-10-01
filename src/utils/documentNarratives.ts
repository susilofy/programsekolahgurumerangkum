import { ProgramData, SchoolData } from '../types/program';

export interface SectionNarrative {
  pengantar: string;
  penjelas: string;
}

/**
 * Provides contextual introductory and synthesis/explanatory paragraphs
 * for each document sub-section in Indonesian SD formal documents.
 */
export function getSectionNarrative(
  sectionKey:
    | 'dasarHukum'
    | 'tujuan'
    | 'sasaran'
    | 'kegiatan'
    | 'waktuTempat'
    | 'pelaksana'
    | 'indikator'
    | 'pembiayaan'
    | 'monitoringEvaluasi'
    | 'tindakLanjut',
  program: ProgramData,
  school: SchoolData
): SectionNarrative {
  const schoolName = school.namaSekolah || program.tempatPenyusunan || 'Sekolah Dasar';
  const progName = program.namaProgram || 'Program Kegiatan Sekolah';
  const fieldName = program.bidang || 'Peningkatan Mutu Pendidikan';

  switch (sectionKey) {
    case 'dasarHukum':
      return {
        pengantar:
          program.pengantarDasarHukum ||
          `Penyusunan dan pelaksanaan ${progName} di ${schoolName} berlandaskan pada ketentuan perundang-undangan dan peraturan kedinasan yang berlaku di lingkungan Kementerian Pendidikan Dasar dan Menengah Republik Indonesia sebagai payung hukum yuridis dan operasional berikut ini:`,
        penjelas:
          program.penjelasDasarHukum ||
          `Seluruh rangkaian kegiatan dalam program ini dirancang dan dilaksanakan dengan senantiasa berpedoman pada asas kepatuhan terhadap regulasi di atas, guna menjamin kepastian hukum, transparansi tata kelola, dan akuntabilitas kinerja satuan pendidikan.`,
      };

    case 'tujuan':
      return {
        pengantar:
          program.pengantarTujuan ||
          `Tujuan pelaksanaan ${progName} dirumuskan secara terarah dan terukur guna menjawab kebutuhan riil peserta didik serta mendukung pencapaian visi dan misi ${schoolName} pada bidang ${fieldName}, yang meliputi:`,
        penjelas:
          program.penjelasTujuan ||
          `Tercapainya tujuan-tujuan tersebut diharapkan mampu memberikan dampak transformatif yang bermakna bagi peningkatan kualitas pembelajaran dan penguatan karakter Profil Pelajar Pancasila di lingkungan sekolah.`,
      };

    case 'sasaran':
      return {
        pengantar:
          program.pengantarSasaran ||
          `Sasaran pelaksanaan program ini dirancang secara inklusif dengan melibatkan berbagai unsur warga sekolah dan pemangku kepentingan terkait guna menjamin keberhasilan dan keberlanjutan kegiatan:`,
        penjelas:
          program.penjelasSasaran ||
          `Pelibatan aktif dari seluruh sasaran di atas diarahkan untuk membangun sinergi tripusat pendidikan (sekolah, keluarga, dan masyarakat) secara harmonis dan berkesinambungan.`,
      };

    case 'kegiatan':
      return {
        pengantar:
          program.pengantarKegiatan ||
          `Rangkaian kegiatan ${progName} disusun secara sistematis dan bertahap melalui tiga fase utama, yaitu tahap persiapan (sosialisasi dan konsolidasi), tahap pelaksanaan inti kegiatan, dan tahap evaluasi ketercapaian, sebagaimana tertuang dalam rincian berikut:`,
        penjelas:
          program.penjelasKegiatan ||
          `Setiap tahapan kegiatan di atas dilaksanakan secara konsisten dengan mengedepankan prinsip kolaboratif, ketepatan waktu, dan pemanfaatan sumber daya sekolah secara efektif serta bertanggung jawab.`,
      };

    case 'waktuTempat':
      return {
        pengantar:
          program.pengantarWaktuTempat ||
          `Agar seluruh rangkaian program dapat terlaksana dengan tertib dan tidak mengganggu jam belajar efektif, jadwal dan lokasi kegiatan diatur secara proporsional sebagai berikut:`,
        penjelas:
          program.penjelasWaktuTempat ||
          `Penetapan waktu dan lokasi kegiatan tersebut telah dikoordinasikan bersama dewan guru dan pihak terkait agar tercipta suasana belajar yang aman, nyaman, dan ramah anak.`,
      };

    case 'pelaksana':
      return {
        pengantar:
          program.pengantarPelaksana ||
          `Untuk menjamin kelancaran, efektivitas, dan kejelasan pembagian tugas, dibentuk susunan tim pelaksana/kepanitiaan ${progName} di ${schoolName} dengan rincian peran sebagai berikut:`,
        penjelas:
          program.penjelasPelaksana ||
          `Setiap personil pelaksana bertanggung jawab penuh terhadap pelaksanaan tugas masing-masing dan secara berkala berkoordinasi dengan penanggung jawab program demi kesuksesan kegiatan bersama.`,
      };

    case 'indikator':
      return {
        pengantar:
          program.pengantarIndikator ||
          `Keberhasilan pelaksanaan ${progName} diukur secara kuantitatif maupun kualitatif menggunakan indikator kinerja utama dan target ketercapaian yang telah ditetapkan sebagai berikut:`,
        penjelas:
          program.penjelasIndikator ||
          `Indikator-indikator ini menjadi acuan objektif dalam melakukan monitoring berkala sekaligus tolok ukur penentuan efektivitas dampak program terhadap peningkatan mutu sekolah.`,
      };

    case 'pembiayaan':
      return {
        pengantar:
          program.pengantarPembiayaan ||
          `Rencana Anggaran Biaya (RAB) disusun berdasarkan prinsip efisiensi, efektivitas, transparansi, dan akuntabilitas sesuai alokasi pendanaan yang sah (BOS/RKAS) dengan rincian kebutuhan belanja sebagai berikut:`,
        penjelas:
          program.penjelasPembiayaan ||
          `Seluruh pengeluaran anggaran diverifikasi dan didokumentasikan dengan bukti kuitansi resmi sesuai dengan petunjuk teknis pengelolaan keuangan yang berlaku di satuan pendidikan.`,
      };

    case 'monitoringEvaluasi':
      return {
        pengantar:
          program.pengantarMonev ||
          `Monitoring dan evaluasi (monev) diselenggarakan sebagai instrumen pengendalian mutu untuk memastikan keterlaksanaan program sesuai rencana serta mendeteksi kendala operasional sedini mungkin:`,
        penjelas:
          program.penjelasMonev ||
          `Hasil monev dianalisis secara objektif sebagai bahan refleksi bersama seluruh dewan guru dan menjadi dasar pijakan perbaikan mutu berkelanjutan (*continuous quality improvement*).`,
      };

    case 'tindakLanjut':
      return {
        pengantar:
          program.pengantarTindakLanjut ||
          `Sebagai bentuk komitmen terhadap keberlanjutan hasil program, disusun langkah-langkah strategis rencana tindak lanjut (RTL) pasca-pelaksanaan sebagai berikut:`,
        penjelas:
          program.penjelasTindakLanjut ||
          `Rencana tindak lanjut ini akan dikawal secara berkelanjutan dan diintegrasikan ke dalam Rencana Kerja Tahunan (RKT) sekolah pada periode berikutnya.`,
      };

    default:
      return { pengantar: '', penjelas: '' };
  }
}

/**
 * Ensures Latar Belakang has at least 3 well-formed, rich paragraphs.
 * If raw text only has 1 or 2 paragraphs, it expands or splits them cleanly into 3 distinct paragraphs:
 * 1. Kondisi Ideal, Kebijakan Kurikulum Merdeka & Standar Nasional Pendidikan
 * 2. Kondisi Faktual, Tantangan Nyata, Rapor Pendidikan & Kebutuhan Siswa SD
 * 3. Solusi Terarah, Urgensi Program & Harapan Dampak Positif
 */
export function formatLatarBelakangMinimal3Paragraf(
  latarBelakang: string,
  program: Partial<ProgramData> = {},
  school: Partial<SchoolData> = {}
): string[] {
  const schoolName = school.namaSekolah || program.tempatPenyusunan || 'Sekolah Dasar';
  const progName = program.namaProgram || 'Program Kegiatan Sekolah';
  const fieldName = program.bidang || 'Peningkatan Mutu Sekolah';

  const raw = (latarBelakang || '').trim();
  const rawParts = raw
    ? raw
        .split(/\n{2,}|\r\n\r\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    : [];

  if (rawParts.length >= 3) {
    return rawParts;
  }

  if (rawParts.length === 2) {
    // We need a 3rd paragraph (urgensi/solusi konkrit)
    const p1 = rawParts[0];
    const p2 = rawParts[1];
    const p3 = `Berdasarkan urgensi permasalahan tersebut, ${schoolName} berinisiatif menyusun dan melaksanakan "${progName}" pada bidang ${fieldName}. Program ini dirancang secara komprehensif, partisipatif, dan terstruktur sebagai intervensi strategis untuk memberikan pengalaman belajar yang bermakna bagi seluruh peserta didik serta memperkuat tata kelola program sekolah yang akuntabel dan berkelanjutan.`;
    return [p1, p2, p3];
  }

  if (rawParts.length === 1 && rawParts[0].length > 100) {
    const single = rawParts[0];
    // Split into sentences
    const sentences = single.split(/(?<=[.!?])\s+/);
    if (sentences.length >= 6) {
      const part1 = sentences.slice(0, Math.floor(sentences.length / 3)).join(' ');
      const part2 = sentences
        .slice(Math.floor(sentences.length / 3), Math.floor((sentences.length * 2) / 3))
        .join(' ');
      const part3 = sentences.slice(Math.floor((sentences.length * 2) / 3)).join(' ');
      return [part1, part2, part3];
    } else {
      const p1 = `Pendidikan pada jenjang Sekolah Dasar memegang peranan fundamental dalam meletakkan fondasi literasi, numerasi, dan karakter luhur peserta didik sesuai dengan tujuan Standar Nasional Pendidikan dan nilai-nilai luhur Profil Pelajar Pancasila. Satuan pendidikan dituntut untuk terus berinovasi dalam menghadirkan lingkungan belajar yang aman, nyaman, dan berpihak kepada murid sejalan dengan semangat implementasi Kurikulum Merdeka.`;
      const p2 = single;
      const p3 = `Menyikapi dinamika dan kebutuhan tersebut, ${schoolName} menetapkan "${progName}" sebagai langkah nyata perbaikan mutu berkelanjutan. Melalui kolaborasi aktif antara kepala sekolah, dewan guru, orang tua, dan masyarakat, program ini diharapkan mampu menjadi wadah intervensi yang efektif demi mewujudkan pembelajaran berkualitas dan berkesinambungan.`;
      return [p1, p2, p3];
    }
  }

  // If empty or very short
  return [
    `Pendidikan pada jenjang Sekolah Dasar memegang peranan penting dan strategis dalam meletakkan fondasi kecerdasan intelektual, emosional, sosial, dan spiritual peserta didik. Sesuai dengan amanat Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional dan arah kebijakan Kurikulum Merdeka, satuan pendidikan berkewajiban menyelenggarakan proses pembelajaran yang interaktif, inspiratif, menyenangkan, menantang, serta memotivasi peserta didik untuk berpartisipasi aktif sesuai bakat dan minatnya.`,
    `Berdasarkan hasil evaluasi diri sekolah dan analisis capaian Rapor Pendidikan di ${schoolName}, masih ditemukan berbagai tantangan nyata yang memerlukan perhatian khusus, terutama dalam penguatan bidang ${fieldName}. Kondisi faktual di lapangan menunjukkan perlunya pembiasaan terstruktur, penguatan kompetensi pendidik, serta penyediaan fasilitas pendukung yang memadai agar kesenjangan capaian belajar siswa dapat diatasi secara tuntas.`,
    `Menjawab tantangan objektif tersebut, ${schoolName} memandang sangat mendesak untuk menyusun dan mengimplementasikan "${progName}". Program ini diharapkan menjadi solusi strategis dan aplikatif yang melibatkan partisipasi aktif seluruh warga sekolah dan pemangku kepentingan, sekaligus menjadi panduan baku pelaksanaan kegiatan sekolah yang terencana, terukur, dan akuntabel sepanjang Tahun Pelajaran ${program.tahunPelajaran || '2026/2027'}.`,
  ];
}

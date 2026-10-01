import { SchoolData, Teacher, ProgramData } from '../types/program';
import customDefaults from './customDefaults.json';

const customData = customDefaults as {
  school?: SchoolData | null;
  teachers?: Teacher[] | null;
  programs?: ProgramData[] | null;
  updatedAt?: string | null;
};

const BASE_FALLBACK_SCHOOL: SchoolData = {
  namaSekolah: 'SD Negeri 3 Loloan Timur',
  npsn: '50100938',
  nss: '101220202026',
  alamat: 'Jl. Krakau. ',
  desaKelurahan: 'Loloan Timur',
  kecamatan: 'Jembrana',
  kabupaten: 'Jembrana',
  provinsi: 'Bali',
  kodePos: '82216',
  kepalaSekolah: 'Susilo Fitri Yatmoko, M.Pd.',
  nipKepalaSekolah: '198805212011011010',
  tahunPelajaran: '2026/2027',
  logoUrl: customData?.school?.logoUrl || '',
  kopUrl: customData?.school?.kopUrl || '',
  useKopImage: true,
};

export const DEFAULT_SCHOOL: SchoolData = {
  ...BASE_FALLBACK_SCHOOL,
  ...(customData?.school || {}),
  logoUrl: customData?.school?.logoUrl || BASE_FALLBACK_SCHOOL.logoUrl,
  kopUrl: customData?.school?.kopUrl || BASE_FALLBACK_SCHOOL.kopUrl,
  useKopImage: true,
};

export const CUSTOM_DEFAULT_PROGRAMS: ProgramData[] | null =
  customData?.programs && customData.programs.length > 0 ? customData.programs : null;

const BASE_FALLBACK_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    nama: 'Dra. Hj. Siti Aminah, M.Pd.',
    nip: '197205141998032001',
    jabatan: 'Kepala Sekolah',
    tugas: 'Penanggung jawab umum seluruh program dan kebijakan sekolah',
  },
  {
    id: 't-2',
    nama: 'Budi Santoso, S.Pd., Gr.',
    nip: '198503122010011015',
    jabatan: 'Guru Kelas VI / Koordinator Kurikulum',
    tugas: 'Menyusun perencanaan akademik dan koordinator kegiatan pembelajaran',
  },
  {
    id: 't-3',
    nama: 'Dewi Lestari, S.Pd.SD.',
    nip: '198907202014022003',
    jabatan: 'Guru Kelas I / Pembina Literasi',
    tugas: 'Pelaksana program literasi awal dan transisi PAUD-SD',
  },
  {
    id: 't-4',
    nama: 'Ahmad Fauzi, S.Pd.I.',
    nip: '199104052019031008',
    jabatan: 'Guru PAI & BP / Pembina Keagamaan',
    tugas: 'Penanggung jawab pembiasaan ibadah dan penguatan karakter',
  },
  {
    id: 't-5',
    nama: 'Rian Pratama, S.Pd.',
    nip: '199311102020121004',
    jabatan: 'Guru PJOK / Pembina Pramuka & UKS',
    tugas: 'Koordinator ekstrakurikuler kepramukaan dan kesehatan fisik siswa',
  },
  {
    id: 't-6',
    nama: 'Nurlina Sari, S.Kom.',
    nip: '199508182022212011',
    jabatan: 'Tenaga Administrasi / Operator Sekolah',
    tugas: 'Dokumentasi, pengelolaan administrasi, dan pelaporan program',
  },
  {
    id: 't-7',
    nama: 'Ratna Wulandari, S.Pd.',
    nip: '198709152011012012',
    jabatan: 'Guru Kelas IV / Pengelola Perpustakaan',
    tugas: 'Penanggung jawab sarana baca dan sudut literasi kelas',
  },
];

export const DEFAULT_TEACHERS: Teacher[] =
  customData?.teachers && customData.teachers.length > 0
    ? customData.teachers
    : BASE_FALLBACK_TEACHERS;

export const PROGRAM_FIELDS = [
  'Kurikulum',
  'Pembelajaran',
  'Literasi',
  'Numerasi',
  'Kesiswaan',
  'Karakter',
  'Ekstrakurikuler',
  'PTK (Pendidik & Tendik)',
  'Sarana Prasarana',
  'Perpustakaan',
  'UKS',
  'Lingkungan Sekolah',
  'Manajemen Sekolah',
  'Kemitraan',
  'Lainnya',
];

export const TEMPLATES: Partial<ProgramData>[] = [
  {
    id: 'template-literasi',
    namaProgram: 'Program Gerakan Literasi Sekolah (GLS) Terpadu',
    bidang: 'Literasi',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '15 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Berdasarkan rapor pendidikan sekolah tahun sebelumnya, indikator kompetensi literasi siswa kelas awal hingga kelas tinggi masih memerlukan penguatan intensif. Minat baca siswa perlu distimulasi secara konsisten melalui lingkungan kaya teks, pembiasaan membaca 15 menit sebelum pembelajaran, serta pemanfaatan pojok baca kelas yang menarik dan ramah anak.',
    masalahKondisi:
      'Capaian literasi siswa belum merata dan pemanfaatan pojok baca kelas belum optimal.',
    kebutuhanSiswa:
      'Ketersediaan buku bacaan non-pelajaran bermutu dan pendampingan membaca berjenjang.',
    dasarHukum: [
      {
        id: 'dh-1',
        text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-2',
        text: 'Permendikbud Nomor 23 Tahun 2015 tentang Penumbuhan Budi Pekerti',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-3',
        text: 'Panduan Gerakan Literasi Sekolah di Sekolah Dasar Kemendikbudristek (Perlu diverifikasi)',
        perluDiverifikasi: true,
      },
    ],
    tujuan: [
      'Menumbuhkembangkan budaya membaca dan menulis di lingkungan sekolah bagi seluruh siswa.',
      'Meningkatkan keterampilan berpikir kritis dan kemampuan memahami teks bacaan secara komprehensif.',
      'Mengoptimalkan peran perpustakaan sekolah dan sudut baca kelas sebagai pusat sumber belajar interaktif.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik kelas I sampai kelas VI (320 siswa)',
      guru: 'Seluruh wali kelas I - VI dan guru mata pelajaran',
      tenagaKependidikan: 'Pustakawan dan Tenaga Administrasi Sekolah',
      orangTua: 'Paguyuban orang tua murid setiap rombel',
      komite: 'Pengurus Komite Sekolah',
      masyarakat: 'Pegiat literasi daerah dan penerbit buku anak',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-1',
        tahapan: 'Persiapan',
        uraian:
          'Rapat koordinasi dewan guru, pembentukan Tim Literasi Sekolah (TLS), dan penataan ulang sudut baca di setiap kelas.',
        penanggungJawab: 'Koordinator Literasi / Ibu Dewi Lestari',
      },
      {
        id: 'act-2',
        tahapan: 'Pelaksanaan',
        uraian:
          'Pembiasaan membaca 15 menit sebelum pelajaran dimulai, program "Jumat Membaca Hening", serta pengisian Jurnal Harian Literasi.',
        penanggungJawab: 'Seluruh Guru Wali Kelas I-VI',
      },
      {
        id: 'act-3',
        tahapan: 'Pengembangan & Kreasi',
        uraian:
          'Pekan Kreasi Literasi: mading kelas, pameran pohon geulis, lomba membaca puisi dan bercerita fabel bagi siswa.',
        penanggungJawab: 'Tim Literasi & Pengelola Perpustakaan',
      },
      {
        id: 'act-4',
        tahapan: 'Evaluasi & Refleksi',
        uraian:
          'Pemeriksaan rekap jurnal membaca siswa dan pemberian penghargaan Duta Literasi Cilik.',
        penanggungJawab: 'Kepala Sekolah & Guru Kelas',
      },
    ],
    waktuTempat: {
      hari: 'Senin s.d. Jumat (Berkelanjutan)',
      tanggal: '18 Juli 2026 s.d. 18 Desember 2026',
      waktu: '07.00 - 07.15 WIB (15 Menit Pagi)',
      tempat: 'Pojok Baca Kelas & Ruang Perpustakaan Sekolah',
      durasi: '1 Semester (Tahun Pelajaran 2026/2027)',
      periode: 'Semester Ganjil 2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Mengarahkan kebijakan dan memfasilitasi kebutuhan sarana literasi sekolah',
      },
      {
        id: 'pel-2',
        jabatan: 'Ketua Tim Literasi',
        nama: 'Dewi Lestari, S.Pd.SD.',
        tugas: 'Mengkoordinasi jadwal kegiatan, monitoring pojok baca, dan seleksi karya siswa',
      },
      {
        id: 'pel-3',
        jabatan: 'Sekretaris & Dokumentasi',
        nama: 'Ratna Wulandari, S.Pd.',
        tugas: 'Mendata inventaris buku bacaan dan menyusun laporan triwulan literasi',
      },
      {
        id: 'pel-4',
        jabatan: 'Anggota / Tim Pendamping',
        nama: 'Wali Kelas I s.d. VI',
        tugas: 'Mendampingi anak membaca dan memvalidasi jurnal bacaan harian',
      },
    ],
    indikator: [
      {
        id: 'ind-1',
        indikator: 'Keterlaksanaan pembiasaan membaca 15 menit setiap hari kerja',
        target: 'Tercapai 95% hari efektif kegiatan',
      },
      {
        id: 'ind-2',
        indikator: 'Rata-rata buku cerita/bacaan yang selesai dibaca tiap siswa per bulan',
        target: 'Minimal 2 buku tuntas per siswa per bulan',
      },
      {
        id: 'ind-3',
        indikator: 'Ketersediaan dan keaktifan pojok baca di setiap rombel',
        target: '100% rombel memiliki pojok baca aktif dan terisi buku layak',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Komponen Pengembangan Perpustakaan/Literasi)',
      keterangan: 'Alokasi pembiayaan untuk pengadaan buku non-teks dan sarana pojok baca kelas',
      items: [
        {
          id: 'bg-1',
          kebutuhan: 'Pengadaan Buku Pengayaan/Cerita Bergambar Ramah Anak',
          volume: 60,
          satuan: 'Eksemplar',
          hargaSatuan: 45000,
          jumlah: 2700000,
          keterangan: 'Buku berjenjang untuk pojok baca kelas I-VI',
        },
        {
          id: 'bg-2',
          kebutuhan: 'Buku Jurnal Membaca Siswa',
          volume: 320,
          satuan: 'Buku',
          hargaSatuan: 5000,
          jumlah: 1600000,
          keterangan: 'Pencatatan judul & ringkasan bacaan mandiri',
        },
        {
          id: 'bg-3',
          kebutuhan: 'Sertifikat & Hadiah Apresiasi Duta Literasi Cilik',
          volume: 12,
          satuan: 'Paket',
          hargaSatuan: 75000,
          jumlah: 900000,
          keterangan: 'Piagam dan paket alat tulis siswa berprestasi',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring:
        'Pemantauan harian oleh wali kelas melalui jurnal membaca dan supervisi berkala tiap bulan oleh Kepala Sekolah terhadap kondisi pojok baca.',
      evaluasi:
        'Evaluasi tengah semester dan akhir semester untuk menganalisis perkembangan kelancaran membaca, pemahaman makna bacaan, dan keterlibatan orang tua.',
      instrumen:
        'Format ceklis sudut baca kelas, rekapitulasi buku terselesaikan per rombel, serta angket kepuasan siswa terhadap buku yang tersedia.',
    },
    tindakLanjut:
      '1. Menambah variasi judul buku melalui program "Satu Siswa Sumbang Satu Buku Bekas Layak".\n2. Melatih guru dalam teknik membacakan nyaring (read aloud) bagi siswa kelas awal.\n3. Mengikutsertakan siswa berbakat dalam lomba literasi dan cipta pantun/cerpen tingkat gugus.',
    penutup:
      'Demikian Program Gerakan Literasi Sekolah ini disusun sebagai acuan kerja terstruktur dalam rangka mewujudkan ekosistem sekolah yang literat dan berkarakter mulia. Keberhasilan program ini bertumpu pada kolaborasi sinergis antara kepala sekolah, guru, komite, dan orang tua siswa.',
  },
  {
    id: 'template-numerasi',
    namaProgram: 'Program Penguatan Numerasi dan Math Corner Berbasis Masalah Nyata',
    bidang: 'Numerasi',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '20 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Numerasi merupakan salah satu kecakapan fundamental yang dinilai dalam Asesmen Nasional. Hasil evaluasi berkala menunjukkan siswa masih kesulitan menerapkan konsep matematika dalam situasi kehidupan sehari-hari dan memecahkan soal berbasis penalaran. Melalui program ini, matematika didekatkan secara ramah dan konkret melalui Math Corner, manipulasi alat peraga sederhana, dan permainan numerasi menyenangkan.',
    masalahKondisi:
      'Siswa menganggap matematika momok menakutkan dan kesulitan pada soal penalaran/cerita kontekstual.',
    kebutuhanSiswa:
      'Alat peraga manipulatif, media konkret hitung, dan pendekatan belajar menyenangkan.',
    dasarHukum: [
      {
        id: 'dh-1',
        text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-2',
        text: 'Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Standar Nasional Pendidikan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-3',
        text: 'Panduan Penguatan Numerasi di Sekolah Dasar Dirjen Dikdasmen Kemendikbudristek',
        perluDiverifikasi: true,
      },
    ],
    tujuan: [
      'Meningkatkan kompetensi nalar numerasi dan pemecahan masalah kontekstual bagi siswa SD.',
      'Menghadirkan lingkungan belajar yang kaya numerasi di setiap ruang kelas melalui Math Corner.',
      'Meningkatkan keterampilan guru dalam merancang asesmen numerasi autentik dan ramah anak.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Peserta didik kelas I s.d. VI',
      guru: 'Guru Kelas I - VI',
      tenagaKependidikan: 'Guru Penggerak & Tim Pembelajaran',
      orangTua: 'Orang tua siswa (pendampingan belajar numerasi di rumah)',
      komite: 'Komite Sekolah',
      masyarakat: '-',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-n1',
        tahapan: 'Perencanaan',
        uraian:
          'Workshop penyusunan media manipulatif numerasi dari bahan bekas dan desain Math Corner kelas.',
        penanggungJawab: 'Budi Santoso, S.Pd., Gr.',
      },
      {
        id: 'act-n2',
        tahapan: 'Implementasi',
        uraian:
          'Penerapan 10 menit tantangan hitung cepat mental math tiap awal jam matematika dan praktik jual beli "Market Day Mini".',
        penanggungJawab: 'Wali Kelas & Guru Mapel',
      },
      {
        id: 'act-n3',
        tahapan: 'Festival Numerasi',
        uraian:
          'Penyelenggaraan Lomba Teka-Teki Logika Numerasi dan Pameran Alat Peraga Matematika hasil karya siswa.',
        penanggungJawab: 'Tim Kurikulum',
      },
    ],
    waktuTempat: {
      hari: 'Setiap Hari Efektif Belajar',
      tanggal: 'Agustus s.d. November 2026',
      waktu: 'Jam Pelajaran Tematik/Matematika',
      tempat: 'Ruang Kelas & Halaman Sekolah',
      durasi: '4 Bulan',
      periode: 'Tahun Pelajaran 2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-n1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Kebijakan program & fasilitasi sarana',
      },
      {
        id: 'pel-n2',
        jabatan: 'Koordinator Numerasi',
        nama: 'Budi Santoso, S.Pd., Gr.',
        tugas: 'Penyusunan modul kegiatan dan pendampingan guru',
      },
    ],
    indikator: [
      {
        id: 'ind-n1',
        indikator: 'Peningkatan nilai rata-rata asesmen formatif numerasi siswa',
        target: 'Minimal 80% siswa tuntas kriteria ketercapaian tujuan pembelajaran (KKTP)',
      },
      {
        id: 'ind-n2',
        indikator: 'Terwujudnya Math Corner aktif di setiap kelas',
        target: '6 kelas memiliki sudut numerasi mandiri dengan alat peraga lengkap',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Kegiatan Pembelajaran & Ekstrakurikuler)',
      keterangan: 'Belanja bahan peraga manipulatif matematika',
      items: [
        {
          id: 'bg-n1',
          kebutuhan: 'Paket Alat Peraga Matematika Sederhana (Bangun ruang, papan pecahan, timbangan mini)',
          volume: 6,
          satuan: 'Paket Rombel',
          hargaSatuan: 250000,
          jumlah: 1500000,
          keterangan: 'Untuk 6 ruang kelas',
        },
        {
          id: 'bg-n2',
          kebutuhan: 'ATK Media Hitung Cepat & Kartu Angka Bergambar',
          volume: 1,
          satuan: 'Paket Sekolah',
          hargaSatuan: 500000,
          jumlah: 500000,
          keterangan: 'Kertas manila, spidol, laminasi kartu soal',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring:
        'Observasi keterlaksanaan pemanfaatan alat peraga saat supervisi klinis oleh Kepala Sekolah.',
      evaluasi:
        'Analisis capaian asesmen sumatif lingkup materi matematika dan kuis interaktif.',
      instrumen: 'Rubrik unjuk kerja nalar siswa dan instrumen observasi kelas.',
    },
    tindakLanjut:
      'Mengadakan klinik bimbingan remedial bagi siswa yang belum lancar hitung dasar serta melatih guru menyusun soal AKM numerasi.',
    penutup:
      'Program ini dirancang demi menciptakan pengalaman belajar matematika yang tidak menegangkan, relevan dengan keseharian anak, dan bermakna bagi masa depan peserta didik.',
  },
  {
    id: 'template-karakter',
    namaProgram: 'Program Pembiasaan Budaya Positif & Projek Penguatan Profil Pelajar Pancasila (P5)',
    bidang: 'Karakter',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '22 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Pendidikan karakter merupakan pondasi utama dalam membentengi moral generasi muda dari dampak negatif gawai dan krisis sopan santun. Penerapan budaya 5S (Senyum, Salam, Sapa, Sopan, Santun), disiplin positif, serta internalisasi nilai Pancasila harus diimplementasikan secara konsisten dalam rutinitas harian sekolah.',
    masalahKondisi:
      'Masih ditemukan sikap acuh, kurang disiplin waktu, dan degradasi etika berbicara antar peserta didik.',
    kebutuhanSiswa:
      'Teladan nyata dari guru dan lingkungan sekolah yang aman, nyaman, serta bebas dari perundungan (bullying).',
    dasarHukum: [
      {
        id: 'dh-k1',
        text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-k2',
        text: 'Permendikbudristek Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP)',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Membentuk profil peserta didik yang beriman, bertakwa, berakhlak mulia, mandiri, dan gotong royong.',
      'Mencegah dan meniadakan segala bentuk tindakan perundungan dan kekerasan di sekolah.',
      'Membiasakan budaya tertib, antre, dan peduli kebersihan lingkungan secara mandiri.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Semua siswa kelas I-VI',
      guru: 'Seluruh tenaga pendidik',
      tenagaKependidikan: 'Seluruh staf dan penjaga sekolah',
      orangTua: 'Wali murid',
      komite: 'Komite Sekolah',
      masyarakat: 'Warga sekitar sekolah',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-k1',
        tahapan: 'Pembiasaan Pagi',
        uraian:
          'Penyambutan siswa oleh guru piket di gerbang sekolah (5S), doa bersama, dan menyanyikan Lagu Kebangsaan Indonesia Raya.',
        penanggungJawab: 'Guru Piket Harian & Guru Agama',
      },
      {
        id: 'act-k2',
        tahapan: 'Pelaksanaan P5',
        uraian:
          'Projek P5 Tema "Gaya Hidup Berkelanjutan: Pilah Sampah Jadi Berkah" dan Tema "Bhinneka Tunggal Ika".',
        penanggungJawab: 'Koordinator Fasilitator P5',
      },
      {
        id: 'act-k3',
        tahapan: 'Kampanye Ramah Anak',
        uraian:
          'Deklarasi Sekolah Ramah Anak dan pembentukan Tim Duta Sahabat Anti-Bullying tingkat siswa.',
        penanggungJawab: 'Tim PPKSP Sekolah',
      },
    ],
    waktuTempat: {
      hari: 'Senin - Sabtu',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: 'Pukul 06.45 WIB - Selesai',
      tempat: 'Gerbang Sekolah, Lapangan, dan Kelas',
      durasi: '1 Tahun Ajaran Penuh',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-k1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Pengarah utama disiplin positif sekolah',
      },
      {
        id: 'pel-k2',
        jabatan: 'Koordinator Karakter & PAI',
        nama: 'Ahmad Fauzi, S.Pd.I.',
        tugas: 'Mengkoordinasi pembiasaan ibadah dan penanganan perilaku siswa',
      },
    ],
    indikator: [
      {
        id: 'ind-k1',
        indikator: 'Zero insiden kasus kekerasan dan perundungan yang tidak tertangani',
        target: '100% kasus tertangani dengan pendekatan mediasi positif',
      },
      {
        id: 'ind-k2',
        indikator: 'Kehadiran siswa tepat waktu sebelum bel masuk sekolah berbunyi',
        target: 'Mencapai 98% kehadiran tepat waktu',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Penyelenggaraan Kegiatan Kesiswaan & PPKSP)',
      keterangan: 'Spanduk kampanye, stiker komitmen, dan sarana projek P5',
      items: [
        {
          id: 'bg-k1',
          kebutuhan: 'Spanduk & Banner Kampanye Sekolah Ramah Anak dan Disiplin Positif',
          volume: 4,
          satuan: 'Buah',
          hargaSatuan: 125000,
          jumlah: 500000,
          keterangan: 'Dipasang di gerbang, lorong, dan kantin sekolah',
        },
        {
          id: 'bg-k2',
          kebutuhan: 'Bahan Habis Pakai Projek P5 (Kantung pilah, wadah kompos, cat akrilik kreasi)',
          volume: 1,
          satuan: 'Paket',
          hargaSatuan: 1200000,
          jumlah: 1200000,
          keterangan: 'Untuk praktik daur ulang ramah lingkungan',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring:
        'Catatan jurnal piket harian guru dan laporan berkala kotak saran ramah anak.',
      evaluasi:
        'Rapat evaluasi bulanan dewan guru untuk memetakan perkembangan perilaku peserta didik.',
      instrumen: 'Lembar observasi sikap sosial dan sosiometri interaksi antarsiswa.',
    },
    tindakLanjut:
      'Memberikan apresiasi pin penghargaan "Bintang Kebaikan" setiap bulan dan konseling ramah bagi siswa yang membutuhkan perhatian khusus.',
    penutup:
      'Dokumen ini menjadi komitmen bersama seluruh pemangku kepentingan untuk melahirkan generasi yang cerdas pikirannya dan mulia pekertinya.',
  },
  {
    id: 'template-kombel',
    namaProgram: 'Program Komunitas Belajar (Kombel) Guru & Peningkatan Kompetensi Pendidik',
    bidang: 'PTK (Pendidik & Tendik)',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '25 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Transformasi pembelajaran menuntut guru untuk terus mengasah kemampuannya dalam pembelajaran berdiferensiasi, pemanfaatan PMM (Platform Merdeka Mengajar), dan penyusunan asesmen bermakna. Komunitas Belajar dalam sekolah menjadi wadah kolaboratif saling berbagi praktik baik antar guru tanpa rasa sungkan.',
    masalahKondisi:
      'Guru memerlukan ruang refleksi rutin bersama untuk memecahkan kesulitan belajar siswa di kelas masing-masing.',
    kebutuhanSiswa:
      'Mendapatkan pembelajaran yang semakin interaktif, menyenangkan, dan sesuai gaya belajar murid.',
    dasarHukum: [
      {
        id: 'dh-kb1',
        text: 'Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-kb2',
        text: 'Surat Edaran Dirjen GTK Kemendikbudristek tentang Optimalisasi Komunitas Belajar (Perlu diverifikasi)',
        perluDiverifikasi: true,
      },
    ],
    tujuan: [
      'Memfasilitasi forum diskusi dan berbagi praktik baik pembelajaran antar guru secara teratur.',
      'Meningkatkan pemahaman guru terkait pembelajaran berdiferensiasi dan asesmen formatif.',
      'Menyelesaikan permasalahan pembelajaran yang dihadapi siswa melalui pendekatan riset aksi kelas kolaboratif.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Dampak tidak langsung kepada seluruh siswa',
      guru: 'Seluruh Guru Kelas dan Guru Mapel (12 Pendidik)',
      tenagaKependidikan: 'Kepala Sekolah dan Tenaga Kependidikan',
      orangTua: '-',
      komite: '-',
      masyarakat: 'Narasumber ahli jika diperlukan',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-kb1',
        tahapan: 'Persiapan',
        uraian:
          'Penyusunan jadwal rutin pertemuan Kombel setiap hari Sabtu pukul 11.30 WIB dan pemetaan topik kebutuhan belajar guru.',
        penanggungJawab: 'Ketua Kombel / Budi Santoso',
      },
      {
        id: 'act-kb2',
        tahapan: 'Sesi Berbagi Praktik Baik',
        uraian:
          'Presentasi bergilir modul ajar inspiratif, simulasi media belajar berbasis IT, dan bedah rapor pendidikan.',
        penanggungJawab: 'Seluruh Anggota Guru',
      },
      {
        id: 'act-kb3',
        tahapan: 'Refleksi & Rencana Aksi',
        uraian:
          'Evaluasi dampak implementasi modul hasil Kombel ke dalam kelas masing-masing.',
        penanggungJawab: 'Kepala Sekolah',
      },
    ],
    waktuTempat: {
      hari: 'Sabtu (Dua Minggu Sekali)',
      tanggal: 'Agustus - Desember 2026',
      waktu: '11.30 - 13.00 WIB',
      tempat: 'Ruang Guru / Perpustakaan Sekolah',
      durasi: '1 Semester',
      periode: 'Semester Ganjil 2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-kb1',
        jabatan: 'Pembina Kombel',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Memberikan bimbingan, supervisi, dan umpan balik reflektif',
      },
      {
        id: 'pel-kb2',
        jabatan: 'Ketua Kombel',
        nama: 'Budi Santoso, S.Pd., Gr.',
        tugas: 'Memfasilitasi jalannya forum dan mencatat risalah pertemuan',
      },
    ],
    indikator: [
      {
        id: 'ind-kb1',
        indikator: 'Tingkat kehadiran dan keaktifan guru dalam forum Kombel',
        target: 'Minimal 90% kehadiran aktif setiap sesi',
      },
      {
        id: 'ind-kb2',
        indikator: 'Jumlah modul ajar/praktik baik yang diunggah dan dibagikan',
        target: 'Minimal 1 modul praktik baik per guru per semester',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Pengembangan Profesi Pendidik)',
      keterangan: 'Konsumsi kegiatan dan penggandaan materi diskusi',
      items: [
        {
          id: 'bg-kb1',
          kebutuhan: 'Snack/Konsumsi Ringan Sesi Diskusi Guru',
          volume: 8,
          satuan: 'Pertemuan (x12 Orang)',
          hargaSatuan: 180000,
          jumlah: 1440000,
          keterangan: '8 kali pertemuan per semester',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Daftar hadir, notula pertemuan, dan dokumentasi foto kegiatan.',
      evaluasi: 'Survei dampak terhadap peningkatan mutu pembelajaran di kelas.',
      instrumen: 'Lembar refleksi guru 3-2-1 dan instrumen observasi rekan sejawat.',
    },
    tindakLanjut:
      'Mendokumentasikan karya inovasi guru ke dalam e-Portofolio sekolah dan mengajukan guru berprestasi ke tingkat kabupaten.',
    penutup:
      'Melalui semangat kebersamaan di Komunitas Belajar, kita wujudkan guru yang terus bertumbuh demi masa depan anak-anak kita.',
  },
  {
    id: 'template-supervisi',
    namaProgram: 'Program Supervisi Akademik & Observasi Pembelajaran Berdiferensiasi',
    bidang: 'Kurikulum',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '28 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Supervisi akademik bukan ajang penghakiman atau mencari kesalahan guru, melainkan upaya kemitraan profesional antara Kepala Sekolah dan Guru untuk meningkatkan kualitas pembelajaran. Melalui pendekatan coaching, guru diajak merefleksikan proses mengajar di kelas agar semakin adaptif terhadap kebutuhan murid.',
    masalahKondisi:
      'Guru terkadang masih canggung saat diobservasi dan membutuhkan penguatan pada teknik asesmen formatif.',
    kebutuhanSiswa: 'Menerima perlakuan belajar yang adil sesuai potensi uniknya.',
    dasarHukum: [
      {
        id: 'dh-s1',
        text: 'Permendikbud Nomor 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-s2',
        text: 'Perdirjen GTK tentang Pengelolaan Kinerja Guru dan Kepala Sekolah (Perlu diverifikasi)',
        perluDiverifikasi: true,
      },
    ],
    tujuan: [
      'Membantu guru mengidentifikasi kekuatan dan area pengembangan dalam mengelola kelas.',
      'Memastikan terlaksananya pembelajaran yang berpusat pada peserta didik.',
      'Menyusun rencana pengembangan keprofesian berkelanjutan berbasis data observasi riil.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Siswa kelas I-VI pada saat observasi kelas berlangsung',
      guru: 'Seluruh guru kelas dan guru mapel yang disupervisi',
      tenagaKependidikan: 'Kepala Sekolah & Tim Penilai Kinerja',
      orangTua: '-',
      komite: '-',
      masyarakat: '-',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-s1',
        tahapan: 'Pra-Observasi',
        uraian:
          'Diskusi kesiapan dokumen perencanaan pembelajaran (Modul Ajar) dan menyepakati fokus observasi kelas.',
        penanggungJawab: 'Kepala Sekolah & Guru Sasaran',
      },
      {
        id: 'act-s2',
        tahapan: 'Observasi Kelas',
        uraian:
          'Pengamatan langsung interaksi belajar mengajar menggunakan instrumen observasi terstandar tanpa menginterupsi kelas.',
        penanggungJawab: 'Kepala Sekolah',
      },
      {
        id: 'act-s3',
        tahapan: 'Pasca-Observasi (Refleksi)',
        uraian:
          'Sesi percakapan coaching untuk menemukan solusi atas kendala yang muncul dan menetapkan langkah perbaikan.',
        penanggungJawab: 'Kepala Sekolah & Guru Sasaran',
      },
    ],
    waktuTempat: {
      hari: 'Senin - Kamis (Sesuai Jadwal Roster)',
      tanggal: 'September - November 2026',
      waktu: 'Sesuai jam mengajar guru',
      tempat: 'Ruang Kelas I s.d. VI',
      durasi: '3 Bulan',
      periode: 'Semester Ganjil 2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-s1',
        jabatan: 'Supervisor Utama',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Melakukan observasi dan coaching refleksi',
      },
    ],
    indikator: [
      {
        id: 'ind-s1',
        indikator: '100% guru kelas dan mata pelajaran terlaksana supervisi akademik lengkap (3 tahap)',
        target: 'Tercapai 100% dari target pendidik',
      },
      {
        id: 'ind-s2',
        indikator: 'Peningkatan skor rata-rata kualitas pembelajaran berpusat pada siswa',
        target: 'Mencapai predikat "Baik" (skor > 85)',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Pengelolaan Sekolah/Administrasi)',
      keterangan: 'Penggandaan instrumen supervisi dan pelaporan',
      items: [
        {
          id: 'bg-s1',
          kebutuhan: 'Penggandaan Dokumen Instrumen & Portofolio Hasil Supervisi',
          volume: 1,
          satuan: 'Paket',
          hargaSatuan: 250000,
          jumlah: 250000,
          keterangan: 'Kertas, map ordner, dan cetak laporan hasil',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Jadwal supervisi terintegrasi dan lembar catatan pra/pasca observasi.',
      evaluasi: 'Analisis rekapitulasi nilai instrumen dan kesepakatan tindak lanjut.',
      instrumen: 'Rubrik observasi kinerja guru Kemendikbudristek.',
    },
    tindakLanjut:
      'Menindaklanjuti rekomendasi supervisi melalui penugasan workshop spesifik atau pendampingan teman sejawat pada forum Komunitas Belajar.',
    penutup:
      'Dengan supervisi akademik berjiwa coaching, tercipta ekosistem pendidikan yang saling percaya, terbuka, dan berfokus pada kemajuan murid.',
  },
  {
    id: 'template-pramuka',
    namaProgram: 'Program Ekstrakurikuler Gerakan Pramuka Gugus Depan SD',
    bidang: 'Ekstrakurikuler',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '30 Juli 2026',
    status: 'draft',
    latarBelakang:
      'Gerakan Pramuka merupakan wadah utama pembinaan kedisiplinan, kemandirian, dan kepemimpinan generasi muda. Melalui aktivitas kepramukaan golongan Siaga dan Penggalang yang gembira, mendidik, dan teratur, siswa dilatih mencintai tanah air, terampil dalam tali-temali, sandi, serta tanggap darurat pertolongan pertama.',
    masalahKondisi:
      'Perlu revitalisasi materi latihan pramuka agar tidak monoton dan tetap menarik bagi generasi kekinian.',
    kebutuhanSiswa: 'Kegiatan luar ruangan (outdoor) yang menantang dan melatih kekompakan beregu.',
    dasarHukum: [
      {
        id: 'dh-p1',
        text: 'Undang-Undang Nomor 12 Tahun 2010 tentang Gerakan Pramuka',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-p2',
        text: 'Permendikbud Nomor 63 Tahun 2014 tentang Pendidikan Kepramukaan sebagai Ekstrakurikuler Wajib',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menanamkan nilai Dasa Darma dan Tri Satya dalam kehidupan sehari-hari.',
      'Melatih keterampilan kepanduan, kemandirian, dan pertolongan pertama.',
      'Mempersiapkan anggota pramuka yang cakap untuk mencapai tingkat SKU Siaga Tata dan Penggalang Ramu.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Siswa Kelas I - IV (Siaga) dan Kelas V - VI (Penggalang)',
      guru: 'Guru yang memiliki ijazah KMD / Pembina Gugus Depan',
      tenagaKependidikan: 'Staf sarpras',
      orangTua: 'Orang tua siswa',
      komite: 'Komite Gugus Depan',
      masyarakat: 'Kwartir Ranting Pramuka setempat',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-pr1',
        tahapan: 'Latihan Rutin Mingguan',
        uraian:
          'Latihan kepramukaan setiap hari Jumat sore (upacara pembukaan, materi SKU, permainan ketangkasan, dan refleksi).',
        penanggungJawab: 'Rian Pratama, S.Pd. (Pembina Pramuka)',
      },
      {
        id: 'act-pr2',
        tahapan: 'Pelantikan Tingkat & Uji SKU',
        uraian:
          'Ujian Syarat Kecakapan Umum (SKU) berkala dan penyematan tanda kecakapan khusus.',
        penanggungJawab: 'Tim Pembina Gugus Depan',
      },
      {
        id: 'act-pr3',
        tahapan: 'Perkemahan Satu Hari (Persari) / Persami',
        uraian:
          'Kegiatan api unggun, penjelajahan halang rintang, dan pentas seni kepanduan.',
        penanggungJawab: 'Panitia Perkemahan',
      },
    ],
    waktuTempat: {
      hari: 'Setiap Hari Jumat Sore',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '14.00 - 16.30 WIB',
      tempat: 'Halaman dan Lapangan Olahraga Sekolah',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-pr1',
        jabatan: 'Ka. Mabigus (Ketua Majelis Pembimbing)',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Penanggung jawab tertinggi perindukan & pasukan',
      },
      {
        id: 'pel-pr2',
        jabatan: 'Pembina Putra',
        nama: 'Rian Pratama, S.Pd.',
        tugas: 'Memimpin latihan pasukan penggalang dan siaga putra',
      },
    ],
    indikator: [
      {
        id: 'ind-pr1',
        indikator: 'Tingkat kehadiran latihan rutin pramuka',
        target: 'Minimal 85% siswa hadir aktif',
      },
      {
        id: 'ind-pr2',
        indikator: 'Jumlah peserta didik yang lulus uji SKU',
        target: 'Minimal 80% siswa mencapai kenaikan tingkat SKU',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Kegiatan Ekstrakurikuler Kepramukaan)',
      keterangan: 'Peralatan tenda, tali temali, tongkat, dan konsumsi perkemahan',
      items: [
        {
          id: 'bg-pr1',
          kebutuhan: 'Pengadaan Tongkat Pramuka & Tali Pandu',
          volume: 20,
          satuan: 'Set',
          hargaSatuan: 35000,
          jumlah: 700000,
          keterangan: 'Inventaris regu latihan',
        },
        {
          id: 'bg-pr2',
          kebutuhan: 'Tanda Pelantikan SKU dan Piagam Kenaikan Tingkat',
          volume: 150,
          satuan: 'Set',
          hargaSatuan: 8000,
          jumlah: 1200000,
          keterangan: 'Lencana bordir SKU & piagam',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku presensi regu dan buku catatan kemajuan uji SKU.',
      evaluasi: 'Evaluasi kesiapan regu menjelang lomba tingkat ranting.',
      instrumen: 'Lembar ceklis SKU resmi Kwarnas.',
    },
    tindakLanjut:
      'Mengirimkan regu terbaik untuk mewakili gugus depan dalam Lomba Tingkat (LT) di tingkat Kwartir Ranting/Cabang.',
    penutup:
      'Satyaku kudarmakan, darmaku kubaktikan. Semoga program ini menumbuhkan pribadi tangguh dan berjiwa ksatria.',
  },
  {
    id: 'template-uks',
    namaProgram: 'Program Trias Usaha Kesehatan Sekolah (UKS) & Gerakan Sekolah Sehat (GSS)',
    bidang: 'UKS',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '1 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Kesehatan peserta didik adalah prasyarat mutlak keberhasilan belajar. Penerapan Trias UKS (Pendidikan Kesehatan, Pelayanan Kesehatan, dan Pembinaan Lingkungan Sekolah Sehat) yang dipadukan dengan Gerakan Sekolah Sehat (GSS) Kemendikbudristek berfokus pada 5 pilar: Sehat Bergizi, Sehat Fisik, Sehat Imunisasi, Sehat Jiwa, dan Sehat Lingkungan guna mewujudkan generasi sehat, cerdas, dan berkarakter.',
    masalahKondisi:
      'Kebiasaan konsumsi jajan berpemanis dan makanan cepat saji masih tinggi, serta kesadaran mencuci tangan pakai sabun dan kebersihan gigi perlu ditingkatkan.',
    kebutuhanSiswa:
      'Layanan pertolongan pertama yang higienis, penyuluhan gizi seimbang, dan pembiasaan aktivitas fisik yang menyenangkan.',
    dasarHukum: [
      {
        id: 'dh-u1',
        text: 'Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-u2',
        text: 'SKB 4 Menteri tentang Pembinaan dan Pengembangan Usaha Kesehatan Sekolah/Madrasah',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-u3',
        text: 'Panduan Gerakan Sekolah Sehat (GSS) Kemendikbudristek',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Meningkatkan derajat kesehatan fisik, gizi, dan mental peserta didik di lingkungan sekolah.',
      'Membentuk kader Dokter Cilik yang cakap memberikan edukasi hidup bersih dan sehat kepada teman sebaya.',
      'Memastikan kantin sekolah dan sarana sanitasi memenuhi standar kebersihan dan keamanan pangan.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik kelas I - VI (320 siswa)',
      guru: 'Seluruh guru kelas dan pembina UKS',
      tenagaKependidikan: 'Pengelola kantin dan penjaga sekolah',
      orangTua: 'Komite sekolah dan orang tua murid',
      komite: 'Pengurus Komite Sekolah',
      masyarakat: 'Petugas Puskesmas setempat',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-u1',
        tahapan: 'Sosialisasi & Skrining',
        uraian:
          'Penjaringan kesehatan berkala bersama tim Puskesmas (pemeriksaan mata, telinga, gigi, dan status gizi/IMT) serta edukasi gizi seimbang.',
        penanggungJawab: 'Pembina UKS & Tim Medis Puskesmas',
      },
      {
        id: 'act-u2',
        tahapan: 'Pelatihan Dokter Cilik',
        uraian:
          'Pelatihan kader kesehatan cilik perwakilan kelas IV & V mengenai P3K dasar, pengukuran tinggi/berat badan, dan pemantauan jentik nyamuk.',
        penanggungJawab: 'Rian Pratama, S.Pd. & Bidan Pembina',
      },
      {
        id: 'act-u3',
        tahapan: 'Gerakan Sarapan Sehat & Senam',
        uraian:
          'Program "Rabu Sehat": Sarapan bersama bekal gizi seimbang, minum air putih cukup, dan Senam Kebugaran Jasmani (SKJ) serentak.',
        penanggungJawab: 'Seluruh Guru Kelas & Pembina Olahraga',
      },
      {
        id: 'act-u4',
        tahapan: 'Inspeksi Sanitasi & Kantin',
        uraian:
          'Pemeriksaan mutu higienitas makanan jajanan kantin sekolah, ketersediaan sabun di wastafel, dan kebersihan toilet sekolah.',
        penanggungJawab: 'Tim Pembina UKS & Pengelola Kantin',
      },
    ],
    waktuTempat: {
      hari: 'Senin s.d. Jumat (Puncak Rabu Sehat)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '07.00 - 07.45 WIB & Jam Istirahat',
      tempat: 'Ruang UKS, Kantin, dan Halaman Sekolah',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-u1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Penanggung jawab umum kebijakan Sekolah Sehat',
      },
      {
        id: 'pel-u2',
        jabatan: 'Ketua Tim Pembina UKS',
        nama: 'Rian Pratama, S.Pd.',
        tugas: 'Pengelolaan operasional ruang UKS dan koordinasi lintas sektor dengan Puskesmas',
      },
      {
        id: 'pel-u3',
        jabatan: 'Koordinator Dokter Cilik',
        nama: 'Dewi Lestari, S.Pd.SD.',
        tugas: 'Membina 20 siswa kader kesehatan sekolah',
      },
    ],
    indikator: [
      {
        id: 'ind-u1',
        indikator: 'Cakupan siswa yang menjalani skrining kesehatan berkala',
        target: '100% siswa kelas I-VI terdata status kesehatannya',
      },
      {
        id: 'ind-u2',
        indikator: 'Ketersediaan sarana cuci tangan pakai sabun (CTPS) yang berfungsi',
        target: 'Tersedia di setiap depan kelas dengan air mengalir dan sabun',
      },
      {
        id: 'ind-u3',
        indikator: 'Kepatuhan jajanan kantin bebas pengawet/pewarna berbahaya',
        target: '100% kantin lolos uji kelayakan higienitas pangan',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Komponen Pemeliharaan Kesehatan & Sanitasi)',
      keterangan: 'Obat-obatan P3K, peralatan UKS, dan pembinaan kader',
      items: [
        {
          id: 'bg-u1',
          kebutuhan: 'Paket Obat P3K, Antiseptik, Kasa Steril, & Minyak Kayu Putih',
          volume: 4,
          satuan: 'Paket Triwulan',
          hargaSatuan: 300000,
          jumlah: 1200000,
          keterangan: 'Penyediaan obat pertolongan pertama',
        },
        {
          id: 'bg-u2',
          kebutuhan: 'Timbangan Digital & Microtoise Pengukur Tinggi Badan Presisi',
          volume: 2,
          satuan: 'Unit',
          hargaSatuan: 250000,
          jumlah: 500000,
          keterangan: 'Alat ukur antropometri siswa',
        },
        {
          id: 'bg-u3',
          kebutuhan: 'Rompi & Topi Dokter Cilik Kader Kesehatan',
          volume: 20,
          satuan: 'Set',
          hargaSatuan: 55000,
          jumlah: 1100000,
          keterangan: 'Seragam duta kesehatan teman sebaya',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku rekapitulasi kunjungan harian UKS dan ceklis kebersihan wastafel.',
      evaluasi: 'Rapat koordinasi triwulanan bersama Kepala Puskesmas Pembantu.',
      instrumen: 'Formulir inspeksi sanitasi lingkungan dan rekap indeks massa tubuh (IMT).',
    },
    tindakLanjut:
      'Melakukan rujukan tepat waktu bagi siswa dengan indikasi gangguan penglihatan/gigi serta mengusulkan sekolah ke ajang Lomba Sekolah Sehat (LSS).',
    penutup:
      'Program UKS dan GSS ini diharapkan melahirkan anak-anak yang tangguh, bergizi cukup, dan siap menerima pelajaran dengan stamina prima.',
  },
  {
    id: 'template-adiwiyata',
    namaProgram: 'Program Sekolah Adiwiyata & Gerakan Peduli Lingkungan Hidup di Sekolah (PBLHS)',
    bidang: 'Lingkungan Sekolah',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '5 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Krisis iklim global menuntut penanaman literasi ekologis sejak usia sekolah dasar. Melalui Gerakan Peduli dan Berbudaya Lingkungan Hidup di Sekolah (PBLHS) menuju Sekolah Adiwiyata, peserta didik diajarkan aksi nyata pemilahan sampah 3R (Reduce, Reuse, Recycle), konservasi air dan energi, pembuatan lubang resapan biopori, serta pemeliharaan taman apotek hidup sekolah.',
    masalahKondisi:
      'Masih banyak timbulan sampah plastik sekali pakai dan tanaman penghijauan sekolah belum terawat teratur oleh siswa.',
    kebutuhanSiswa:
      'Media praktik berkebun organik, bank sampah sekolah, dan kebiasaan membawa botol minum (tumbler) sendiri.',
    dasarHukum: [
      {
        id: 'dh-ad1',
        text: 'Undang-Undang Nomor 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-ad2',
        text: 'Permen LHK Nomor P.52/MENLHK/SETJEN/KUM.1/9/2019 tentang Gerakan PBLHS',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-ad3',
        text: 'Permen LHK Nomor P.53/MENLHK/SETJEN/KUM.1/9/2019 tentang Penghargaan Adiwiyata',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Membiasakan perilaku ramah lingkungan hidup (PRLH) pada seluruh warga sekolah.',
      'Mengurangi timbulan sampah plastik di lingkungan sekolah hingga 50%.',
      'Mengembangkan kebun apotek hidup dan sarana kompos sebagai media belajar sains kontekstual.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Semua siswa kelas I s.d. VI',
      guru: 'Dewan Guru dan Karyawan',
      tenagaKependidikan: 'Petugas kebersihan dan keamanan',
      orangTua: 'Paguyuban orang tua murid',
      komite: 'Komite Sekolah',
      masyarakat: 'Dinas Lingkungan Hidup dan bank sampah induk',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-ad1',
        tahapan: 'Kampanye Zero Plastic & Tumbler',
        uraian:
          'Gerakan wajib membawa tumbler dan kotak makan siang sendiri dari rumah serta larangan menjual air mineral kemasan plastik sekali pakai di kantin.',
        penanggungJawab: 'Tim Adiwiyata & Guru Piket',
      },
      {
        id: 'act-ad2',
        tahapan: 'Operasional Bank Sampah Cilik',
        uraian:
          'Pemilahan sampah kertas dan botol plastik per kelas setiap hari Jumat untuk ditimbang dan disetorkan ke Bank Sampah Sekolah.',
        penanggungJawab: 'Kader Adiwiyata Siswa & Koordinator Bank Sampah',
      },
      {
        id: 'act-ad3',
        tahapan: 'Kebun Toga & Lubang Biopori',
        uraian:
          'Penanaman tanaman obat keluarga (TOGA), sayur hidroponik mini, serta pengeboran 15 titik lubang resapan biopori di area resapan air.',
        penanggungJawab: 'Guru PJOK & Petugas Kebun',
      },
      {
        id: 'act-ad4',
        tahapan: 'Jumat Bersih & Konservasi Energi',
        uraian:
          'Kerja bakti pembersihan saluran air, pembiasaan mematikan lampu/kipas saat ruangan kosong, dan audit energi sederhana oleh siswa.',
        penanggungJawab: 'Seluruh Wali Kelas & Petugas Sarpras',
      },
    ],
    waktuTempat: {
      hari: 'Senin - Sabtu (Aksi Rutin & Jumat Bersih)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '06.45 - 07.30 WIB & 11.00 - 11.30 WIB',
      tempat: 'Taman Sekolah, Bank Sampah, dan Lingkungan Rombel',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-ad1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Penentu kebijakan program Adiwiyata sekolah',
      },
      {
        id: 'pel-ad2',
        jabatan: 'Ketua Tim PBLHS / Adiwiyata',
        nama: 'Dewi Lestari, S.Pd.SD.',
        tugas: 'Mengkoordinasikan dokumen portofolio Adiwiyata dan aksi lingkungan warga sekolah',
      },
      {
        id: 'pel-ad3',
        jabatan: 'Koordinator Konservasi Air & Sarpras',
        nama: 'Rian Pratama, S.Pd.',
        tugas: 'Pengawasan lubang biopori, penampung air hujan, dan pemilahan sampah',
      },
    ],
    indikator: [
      {
        id: 'ind-ad1',
        indikator: 'Persentase pengurangan sampah plastik sekali pakai di sekolah',
        target: 'Penurunan minimal 50% dibanding baseline awal semester',
      },
      {
        id: 'ind-ad2',
        indikator: 'Jumlah lubang resapan biopori aktif dan terisi sampah daun',
        target: 'Minimal 15 titik lubang biopori terpelihara',
      },
      {
        id: 'ind-ad3',
        indikator: 'Keikutsertaan rombel dalam Bank Sampah Sekolah',
        target: '100% rombel aktif menyetor sampah anorganik terpilah',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Pemeliharaan Sarana Kebersihan & Lingkungan)',
      keterangan: 'Tempat sampah pilah, alat biopori, dan bibit tanaman',
      items: [
        {
          id: 'bg-ad1',
          kebutuhan: 'Tempat Sampah Pilah 3 Warna (Organik, Anorganik, Residu)',
          volume: 6,
          satuan: 'Set Rombel',
          hargaSatuan: 280000,
          jumlah: 1680000,
          keterangan: 'Untuk ditempatkan di teras depan tiap kelas',
        },
        {
          id: 'bg-ad2',
          kebutuhan: 'Bibit Tanaman TOGA, Pot Tanaman, & Media Tanam Pupuk Kompos',
          volume: 1,
          satuan: 'Paket Sekolah',
          hargaSatuan: 650000,
          jumlah: 650000,
          keterangan: 'Penataan kebun sekolah ramah lingkungan',
        },
        {
          id: 'bg-ad3',
          kebutuhan: 'Mata Bor Biopori Besi & Pipa Pori Berlubang',
          volume: 2,
          satuan: 'Set',
          hargaSatuan: 225000,
          jumlah: 450000,
          keterangan: 'Pembuatan lubang resapan air tanah',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku catatan timbangan bank sampah dan lembar pantau kebersihan kelas harian.',
      evaluasi: 'Audit lingkungan sekolah per semester bersama Komite Sekolah.',
      instrumen: 'Rubrik pemenuhan standar kriteria Calon Sekolah Adiwiyata Kabupaten/Kota.',
    },
    tindakLanjut:
      'Menyusun dokumen CSAP (Calon Sekolah Adiwiyata Provinsi) dan menjalin kemitraan dengan pegiat lingkungan bank sampah daerah.',
    penutup:
      'Bumi yang lestari berawal dari langkah kecil anak-anak kita. Program ini menumbuhkan rasa syukur dan cinta ciptaan Tuhan Yang Maha Esa.',
  },
  {
    id: 'template-perpustakaan',
    namaProgram: 'Program Revitalisasi Perpustakaan Sekolah Ramah Anak & Digitalisasi Koleksi',
    bidang: 'Perpustakaan',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '10 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Perpustakaan sekolah abad-21 bukan sekadar gudang buku pelajaran, melainkan jantung kegiatan akademis dan wahana imajinasi ramah anak. Program revitalisasi ini menitikberatkan pada penataan ruangan berkonsep lesehan nyaman (kids-friendly), digitalisasi katalog sirkulasi berbasis barcode, pengadaan buku bacaan fiksi berkualitas, serta integrasi dengan jam kunjung wajib kelas.',
    masalahKondisi:
      'Sistem pencatatan peminjaman masih konvensional pada buku tulis, tata letak buku kurang menarik, dan rasio buku non-teks belum sebanding dengan jumlah siswa.',
    kebutuhanSiswa:
      'Ruang baca berkarpet bersih, buku bergambar yang kaya visual, dan sistem peminjaman mandiri yang mudah digunakan.',
    dasarHukum: [
      {
        id: 'dh-per1',
        text: 'Undang-Undang Nomor 43 Tahun 2007 tentang Perpustakaan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-per2',
        text: 'Peraturan Kepala Perpusnas Nomor 10 Tahun 2017 tentang Standar Nasional Perpustakaan SD/MI',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Meningkatkan frekuensi kunjungan siswa ke perpustakaan minimal 3 kali lipat.',
      'Menerapkan sistem otomasi sirkulasi dan katalogisasi buku yang tertib berbasis komputer.',
      'Menjadikan ruang perpustakaan sebagai laboratorium membaca yang rekreatif dan inklusif.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Semua siswa kelas I-VI (320 siswa)',
      guru: 'Dewan Guru Kelas & Mapel',
      tenagaKependidikan: 'Pengelola Perpustakaan dan Operator',
      orangTua: 'Orang tua siswa (donasi buku pengayaan)',
      komite: 'Komite Sekolah',
      masyarakat: 'Perpustakaan Daerah Kabupaten/Kota (Mobil Perpus Keliling)',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-per1',
        tahapan: 'Penataan & Otomasi',
        uraian:
          'Pengelompokan koleksi buku dengan stiker warna jenjang baca (klasifikasi ramah anak) dan input data buku ke aplikasi otomasi perpustakaan.',
        penanggungJawab: 'Ratna Wulandari, S.Pd. & Operator',
      },
      {
        id: 'act-per2',
        tahapan: 'Jadwal Kunjung Wajib',
        uraian:
          'Alokasi 1 jam pelajaran per minggu per rombel untuk "Library Time" (membaca hening, story telling guru, dan peminjaman buku mandiri).',
        penanggungJawab: 'Pustakawan & Wali Kelas',
      },
      {
        id: 'act-per3',
        tahapan: 'Festival & Bedah Buku Anak',
        uraian:
          'Lomba resensi buku bergambar, bedah cerita fabel nusantara, dan pemilihan "Sahabat Perpustakaan Teladan".',
        penanggungJawab: 'Tim Literasi & Perpustakaan',
      },
      {
        id: 'act-per4',
        tahapan: 'Layanan Perpusling Kemitraan',
        uraian:
          'Menghadirkan layanan Mobil Perpustakaan Keliling Daerah setiap bulan sekali ke halaman sekolah.',
        penanggungJawab: 'Kepala Sekolah & Dispusip Daerah',
      },
    ],
    waktuTempat: {
      hari: 'Senin s.d. Jumat (Buka Penuh)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '07.30 - 14.00 WIB',
      tempat: 'Ruang Perpustakaan Sekolah "Pelangi Ilmu"',
      durasi: '1 Tahun Ajaran Penuh',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-per1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Pengambil kebijakan dan pengalokasian anggaran perpustakaan',
      },
      {
        id: 'pel-per2',
        jabatan: 'Kepala Perpustakaan',
        nama: 'Ratna Wulandari, S.Pd.',
        tugas: 'Pengelolaan teknis koleksi, sirkulasi, dan pelayanan pemustaka',
      },
      {
        id: 'pel-per3',
        jabatan: 'Petugas Teknis & Otomasi',
        nama: 'Nurlina Sari, S.Kom.',
        tugas: 'Pencetakan kartu barcode anggota, barcode buku, dan pemeliharaan sistem',
      },
    ],
    indikator: [
      {
        id: 'ind-per1',
        indikator: 'Rata-rata jumlah peminjaman buku per siswa dalam satu semester',
        target: 'Minimal 8 judul buku dibaca tuntas per siswa',
      },
      {
        id: 'ind-per2',
        indikator: 'Persentase koleksi yang telah terdata dalam sistem barcode digital',
        target: 'Mencapai 100% judul buku terindeks',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Komponen Pengembangan Perpustakaan)',
      keterangan: 'Pengadaan barcode scanner, peremajaan karpet, dan buku bacaan',
      items: [
        {
          id: 'bg-per1',
          kebutuhan: 'Barcode Scanner USB & Kertas Label Barcode Buku',
          volume: 2,
          satuan: 'Unit',
          hargaSatuan: 275000,
          jumlah: 550000,
          keterangan: 'Untuk loket sirkulasi peminjaman cepat',
        },
        {
          id: 'bg-per2',
          kebutuhan: 'Karpet Busa Tebal Anti Selip & Bantal Duduk Baca Lesehan',
          volume: 4,
          satuan: 'Gulung/Set',
          hargaSatuan: 350000,
          jumlah: 1400000,
          keterangan: 'Kenyamanan area membaca santai anak',
        },
        {
          id: 'bg-per3',
          kebutuhan: 'Pengadaan Buku Pengayaan Cerita Anak & Ensiklopedia Bergambar',
          volume: 35,
          satuan: 'Eksemplar',
          hargaSatuan: 55000,
          jumlah: 1925000,
          keterangan: 'Buku pilihan ramah anak ber-ISBN',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Laporan statistik harian peminjaman dan grafik kunjungan kelas.',
      evaluasi: 'Survei kepuasan pemustaka dan stock opname fisik buku akhir semester.',
      instrumen: 'Lembar ceklis standar akreditasi perpustakaan sekolah dasar.',
    },
    tindakLanjut:
      'Mengajukan akreditasi perpustakaan sekolah ke Perpustakaan Nasional dan menambah pojok literasi digital berbasis tablet.',
    penutup:
      'Perpustakaan yang hidup adalah jendela dunia bagi siswa. Melalui program ini, benih kecintaan terhadap ilmu pengetahuan ditanamkan sedini mungkin.',
  },
  {
    id: 'template-tppk',
    namaProgram: 'Program Tim Pencegahan dan Penanganan Kekerasan (TPPK) & Sekolah Ramah Anak',
    bidang: 'Kesiswaan',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '12 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Setiap anak berhak mendapatkan rasa aman dari segala bentuk kekerasan fisik, psikis, perundungan (bullying), kekerasan seksual, maupun diskriminasi di satuan pendidikan. Menindaklanjuti Permendikbudristek No. 46 Tahun 2023, sekolah membentuk TPPK yang berfungsi preventif dan kuratif dengan mengedepankan pendekatan perlindungan anak, pemulihan korban, dan penegakan disiplin positif.',
    masalahKondisi:
      'Adanya potensi konflik antarsiswa saat jam istirahat tanpa pengawasan serta belum tersedianya kanal pengaduan rahasia yang ramah anak.',
    kebutuhanSiswa:
      'Rasa aman di sekolah tanpa takut dirundung, kanal aduan yang terlindungi kerahasiaannya, dan bimbingan konseling yang empatik.',
    dasarHukum: [
      {
        id: 'dh-tp1',
        text: 'Undang-Undang Nomor 35 Tahun 2014 tentang Perubahan atas UU Perlindungan Anak',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-tp2',
        text: 'Permendikbudristek Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan (PPKSP)',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-tp3',
        text: 'Pedoman Tata Kelola TPPK Puspeka Kemendikbudristek',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menciptakan lingkungan belajar yang aman, inklusif, dan bebas dari segala bentuk tindak kekerasan.',
      'Membangun mekanisme pelaporan, investigasi ramah anak, dan mediasi yang adil serta transparan.',
      'Melatih guru dan tenaga kependidikan dalam menerapkan disiplin positif tanpa kekerasan fisik atau verbal.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik kelas I s.d. VI',
      guru: 'Dewan Guru Kelas & Guru Mapel',
      tenagaKependidikan: 'Staf Administrasi, Penjaga, dan Pengemudi',
      orangTua: 'Seluruh orang tua/wali murid',
      komite: 'Pengurus Komite Sekolah',
      masyarakat: 'UPTD PPA & Dinas Sosial / Perlindungan Anak',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-tp1',
        tahapan: 'Pengukuhan & Sosialisasi Komitmen',
        uraian:
          'Pengesahan SK TPPK Sekolah, penandatanganan Pakta Integritas Anti-Kekerasan bersama Komite, dan deklarasi bersama di hadapan siswa.',
        penanggungJawab: 'Kepala Sekolah & Tim TPPK',
      },
      {
        id: 'act-tp2',
        tahapan: 'Penyediaan Kanal Aduan Ramah Anak',
        uraian:
          'Pemasangan "Kotak Peduli Teman" terkunci di sudut strategis yang tidak terpantau CCTV serta nomor WhatsApp hotline khusus konseling TPPK.',
        penanggungJawab: 'Sekretaris TPPK & Guru BP/PAI',
      },
      {
        id: 'act-tp3',
        tahapan: 'Pelatihan Duta Sahabat Damai',
        uraian:
          'Pemilihan dan pembinaan siswa wakil tiap rombel untuk menjadi agen pencegahan bullying dan mediator teman sebaya.',
        penanggungJawab: 'Ahmad Fauzi, S.Pd.I. & Guru Kelas',
      },
      {
        id: 'act-tp4',
        tahapan: 'Workshop Disiplin Positif Guru',
        uraian:
          'Pelatihan guru dalam mengelola kelas tanpa membentak, memberi konsekuensi logis, dan restitusi kesalahan peserta didik.',
        penanggungJawab: 'Koordinator Kurikulum & Narasumber Puspeka',
      },
    ],
    waktuTempat: {
      hari: 'Senin - Sabtu (Siaga 24 Jam Hotline)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: 'Jam Sekolah & Respons Cepat Hotline',
      tempat: 'Ruang Konseling Khusus & Seluruh Area Sekolah',
      durasi: '1 Tahun Penuh',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-tp1',
        jabatan: 'Pengarah / Kepala Sekolah',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Menetapkan SK, menindaklanjuti rekomendasi penanganan, dan pelaporan ke Kemendikbudristek',
      },
      {
        id: 'pel-tp2',
        jabatan: 'Ketua TPPK (Unsur Guru)',
        nama: 'Budi Santoso, S.Pd., Gr.',
        tugas: 'Mengoordinasikan investigasi, konseling awal, dan perlindungan saksi/korban',
      },
      {
        id: 'pel-tp3',
        jabatan: 'Anggota TPPK (Unsur Orang Tua / Komite)',
        nama: 'Perwakilan Komite Sekolah',
        tugas: 'Menjembatani mediasi kekeluargaan yang objektif antara orang tua',
      },
    ],
    indikator: [
      {
        id: 'ind-tp1',
        indikator: 'Persentase laporan kekerasan yang ditangani sesuai SOP TPPK',
        target: '100% aduan tertangani dalam tempo maksimal 7x24 jam',
      },
      {
        id: 'ind-tp2',
        indikator: 'Indeks Iklim Keamanan Sekolah pada Rapor Pendidikan',
        target: 'Mencapai predikat "Baik / Sangat Aman" (skor > 80)',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Kegiatan PPKSP & Kesiswaan)',
      keterangan: 'Kotak aduan akrilik, banner deklarasi, dan buku panduan saku',
      items: [
        {
          id: 'bg-tp1',
          kebutuhan: 'Kotak Pengaduan Rahasia Akrilik dengan Kunci Gembok',
          volume: 3,
          satuan: 'Unit',
          hargaSatuan: 160000,
          jumlah: 480000,
          keterangan: 'Dipasang di lokasi privat dekat ruang BK dan perpustakaan',
        },
        {
          id: 'bg-tp2',
          kebutuhan: 'Spanduk Deklarasi Sekolah Ramah Anak & Poster Edukasi Anti-Bullying',
          volume: 8,
          satuan: 'Lembar',
          hargaSatuan: 85000,
          jumlah: 680000,
          keterangan: 'Media kampanye visual di lorong dan ruang kelas',
        },
        {
          id: 'bg-tp3',
          kebutuhan: 'Buku Saku Disiplin Positif untuk Pendidik & Tendik',
          volume: 15,
          satuan: 'Buku',
          hargaSatuan: 25000,
          jumlah: 375000,
          keterangan: 'Panduan teknis restitusi tanpa hukuman fisik',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku register laporan kasus TPPK dan pengecekan kotak aduan tiap Jumat sore.',
      evaluasi: 'Rapat evaluasi triwulan efektivitas penanganan kasus bersama Komite Sekolah.',
      instrumen: 'Format verifikasi laporan kekerasan Puspeka dan angket rasa aman siswa.',
    },
    tindakLanjut:
      'Mendaftarkan profil TPPK ke portal resmi Kemendikbudristek dan menyelenggarakan sesi konseling berkala bagi siswa yang rentan tertekan.',
    penutup:
      'Tidak ada ruang bagi kekerasan di sekolah kita. Setiap anak berhak pulang ke rumah dengan senyuman dan hati yang tenteram.',
  },
  {
    id: 'template-inklusi',
    namaProgram: 'Program Layanan Pendidikan Inklusif & Klinik Belajar Pendampingan Siswa Berkesulitan Belajar',
    bidang: 'Pembelajaran',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '15 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Filosofi Kurikulum Merdeka menegaskan bahwa tidak ada anak yang bodoh, melainkan setiap murid memiliki kecepatan, gaya belajar, dan keunikan tumbuh kembang yang berbeda. Sekolah menyelenggarakan layanan pendidikan inklusif dan Klinik Belajar untuk mendampingi peserta didik dengan hambatan belajar (slow learner, disleksia permulaan, kesulitan konsentrasi) melalui asesmen diagnostik dan Program Pembelajaran Individual (PPI).',
    masalahKondisi:
      'Sejumlah siswa tertinggal jauh dalam penguasaan membaca permulaan dan berhitung dasar tanpa pendampingan berdiferensiasi yang intensif.',
    kebutuhanSiswa:
      'Pendampingan personal bebas stigma, materi ajar multimodal sederhana, dan tutor sebaya yang sabar.',
    dasarHukum: [
      {
        id: 'dh-in1',
        text: 'Permendiknas Nomor 70 Tahun 2009 tentang Pendidikan Inklusif bagi Peserta Didik yang Memiliki Kelainan dan Potensi Kecerdasan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-in2',
        text: 'Panduan Penyelenggaraan Pendidikan Inklusif Kemendikbudristek',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menjamin pemenuhan hak belajar yang setara dan adil bagi seluruh murid tanpa diskriminasi.',
      'Membantu siswa berkesulitan belajar menguasai keterampilan fondasi calistung sesuai kemampuannya.',
      'Melengkapi guru dengan kompetensi penyusunan Program Pembelajaran Individual (PPI) adaptif.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Siswa yang teridentifikasi membutuhkan intervensi belajar khusus (15-20 siswa)',
      guru: 'Guru Kelas I - VI dan Guru Pendamping Khusus (GPK)',
      tenagaKependidikan: 'Tim Penjamin Mutu Pembelajaran',
      orangTua: 'Orang tua siswa sasaran klinik belajar',
      komite: 'Komite Sekolah',
      masyarakat: 'Psikolog Pendidikan / SLB Mitra Terdekat',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-in1',
        tahapan: 'Identifikasi & Asesmen Awal',
        uraian:
          'Pelaksanaan asesmen diagnostik kognitif dan non-kognitif awal tahun untuk memetakan jenis hambatan belajar peserta didik.',
        penanggungJawab: 'Tim Guru Inklusif & Guru Kelas',
      },
      {
        id: 'act-in2',
        tahapan: 'Penyusunan PPI Adaptif',
        uraian:
          'Perumusan Program Pembelajaran Individual (PPI) berkolaborasi dengan orang tua untuk menetapkan target belajar yang realistis.',
        penanggungJawab: 'Wali Kelas & Guru Khusus',
      },
      {
        id: 'act-in3',
        tahapan: 'Klinik Belajar Siang',
        uraian:
          'Sesi pendampingan remedial intensif 45 menit setelah jam pulang sekolah, 2 kali seminggu, menggunakan media kartu fonik dan balok hitung.',
        penanggungJawab: 'Guru Relawan Pembimbing',
      },
      {
        id: 'act-in4',
        tahapan: 'Tutor Sebaya Empatik',
        uraian:
          'Pembentukan pasangan teman sebaya di kelas yang bertugas membantu memahami instruksi tugas secara bersahabat tanpa mengejek.',
        penanggungJawab: 'Wali Kelas',
      },
    ],
    waktuTempat: {
      hari: 'Selasa & Kamis (Klinik Belajar)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '12.30 - 13.15 WIB',
      tempat: 'Ruang Sumber / Ruang Remedial Sekolah',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-in1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Pengambil kebijakan dan penyedia ruang sumber inklusif',
      },
      {
        id: 'pel-in2',
        jabatan: 'Koordinator Inklusi & Remedial',
        nama: 'Dewi Lestari, S.Pd.SD.',
        tugas: 'Penyusunan jadwal klinik dan koordinasi konsultasi wali murid',
      },
    ],
    indikator: [
      {
        id: 'ind-in1',
        indikator: 'Tingkat kemajuan calistung fondasi siswa peserta klinik belajar',
        target: 'Minimal 80% siswa mengalami peningkatan level kemampuan fonik/angka',
      },
      {
        id: 'ind-in2',
        indikator: 'Tersedianya dokumen PPI bagi setiap anak yang teridentifikasi',
        target: '100% siswa berkebutuhan belajar khusus memiliki dokumen PPI',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Kegiatan Pembelajaran Berdiferensiasi & Inklusi)',
      keterangan: 'Alat peraga sensori, buku fonik berjenjang, dan lembar kerja khusus',
      items: [
        {
          id: 'bg-in1',
          kebutuhan: 'Kartu Huruf Timbul Fonik & Papan Magnet Angka Manipulatif',
          volume: 4,
          satuan: 'Set',
          hargaSatuan: 175000,
          jumlah: 700000,
          keterangan: 'Media konkret stimulasi membaca dan hitung dasar',
        },
        {
          id: 'bg-in2',
          kebutuhan: 'Modul Pembelajaran Individual Berjenjang (Cetak Warna)',
          volume: 20,
          satuan: 'Paket Siswa',
          hargaSatuan: 40000,
          jumlah: 800000,
          keterangan: 'Buku latihan adaptif berjenjang',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku jurnal perkembangan mingguan siswa di klinik belajar.',
      evaluasi: 'Evaluasi berkala bulanan bersama orang tua murid sasaran.',
      instrumen: 'Rubrik asesmen capaian belajar berjenjang dan lembar portofolio hasil karya anak.',
    },
    tindakLanjut:
      'Meningkatkan kompleksitas tugas secara bertahap dan merekomendasikan layanan psikolog ahli jika terindikasi hambatan neurologis berat.',
    penutup:
      'Setiap anak berhak mekar sesuai musimnya. Program ini membuktikan komitmen sekolah untuk tidak meninggalkan satu anak pun di belakang.',
  },
  {
    id: 'template-parenting',
    namaProgram: 'Program Kemitraan Tripusat Pendidikan: Kelas Parenting & Kelas Inspirasi Profesi',
    bidang: 'Kemitraan',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '18 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Pendidikan anak adalah tanggung jawab bersama antara sekolah, keluarga, dan masyarakat (Tripusat Pendidikan Ki Hajar Dewantara). Sering kali terjadi ketidaksinkronan pola asuh di rumah dan pembiasaan di sekolah. Melalui Program Kemitraan, sekolah menyelenggarakan Kelas Parenting tematik dan Kelas Inspirasi yang mengundang orang tua murid berbagi pengalaman profesi serta mempererat kolaborasi paguyuban kelas.',
    masalahKondisi:
      'Interaksi sekolah dengan orang tua masih didominasi urusan finansial atau pemanggilan siswa bermasalah, bukan kemitraan edukatif yang memberdayakan.',
    kebutuhanSiswa:
      'Penyelarasan pola asuh yang penuh kasih dan wawasan inspiratif mengenai beragam profesi masa depan.',
    dasarHukum: [
      {
        id: 'dh-par1',
        text: 'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-par2',
        text: 'Permendikbud Nomor 30 Tahun 2017 tentang Pelibatan Keluarga pada Penyelenggaraan Pendidikan',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menyamakan persepsi pola pengasuhan positif antara orang tua dan dewan guru di sekolah.',
      'Memperluas wawasan cita-cita peserta didik melalui kehadiran narasumber orang tua dari beragam profesi.',
      'Mengoptimalkan peran Paguyuban Rombel dalam mendukung sarana belajar ramah anak di kelas.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik SD',
      guru: 'Dewan Guru Kelas & Mapel',
      tenagaKependidikan: 'Kepala Sekolah dan Staf TU',
      orangTua: 'Seluruh Orang Tua / Wali Murid Kelas I - VI',
      komite: 'Pengurus Komite Sekolah',
      masyarakat: 'Praktisi parenting dan alumni berprestasi',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-par1',
        tahapan: 'Temu Awal Tahun Paguyuban Rombel',
        uraian:
          'Musyawarah pembentukan pengurus paguyuban rombel kelas I-VI dan pemaparan program tahunan sekolah secara terbuka.',
        penanggungJawab: 'Kepala Sekolah & Seluruh Wali Kelas',
      },
      {
        id: 'act-par2',
        tahapan: 'Seminar Kelas Parenting Semester 1',
        uraian:
          'Seminar interaktif: "Mendampingi Anak di Era Digital, Batasan Screen Time, dan Pencegahan Bahaya Gawai bagi Otak Anak".',
        penanggungJawab: 'Komite Sekolah & Narasumber Psikolog',
      },
      {
        id: 'act-par3',
        tahapan: 'Kelas Inspirasi Profesi (Orang Tua Mengajar)',
        uraian:
          'Pekan khusus di mana para orang tua (dokter, polisi, petani modern, wirausahawan, seniman, teknisi) masuk ke kelas selama 1 jam mengajar anak-anak.',
        penanggungJawab: 'Koordinator Kemitraan & Paguyuban Kelas',
      },
      {
        id: 'act-par4',
        tahapan: 'Pameran Karya & Konsultasi Rapor Edukatif',
        uraian:
          'Pameran portofolio karya anak dan sesi percakapan mendalam antara guru dan orang tua saat pembagian laporan hasil belajar.',
        penanggungJawab: 'Seluruh Wali Kelas',
      },
    ],
    waktuTempat: {
      hari: 'Sabtu Pagi (Berkala Sesuai Jadwal)',
      tanggal: 'September, November 2026 & Maret 2027',
      waktu: '08.30 - 11.30 WIB',
      tempat: 'Aula Sekolah dan Ruang Kelas Masing-Masing',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-par1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Pengarah program kemitraan dan pembina komite sekolah',
      },
      {
        id: 'pel-par2',
        jabatan: 'Ketua Komite Sekolah',
        nama: 'Drs. H. Mulyono',
        tugas: 'Mengoordinasikan perwakilan paguyuban kelas dan narasumber parenting',
      },
      {
        id: 'pel-par3',
        jabatan: 'Sekretaris Kemitraan',
        nama: 'Ratna Wulandari, S.Pd.',
        tugas: 'Administrasi undangan, presensi, dan publikasi kegiatan orang tua',
      },
    ],
    indikator: [
      {
        id: 'ind-par1',
        indikator: 'Tingkat kehadiran orang tua dalam seminar parenting semesteran',
        target: 'Minimal 85% perwakilan orang tua murid hadir',
      },
      {
        id: 'ind-par2',
        indikator: 'Keterlaksanaan Kelas Inspirasi di setiap rombel',
        target: '100% kelas terlaksana sesi orang tua mengajar minimal 2 kali per semester',
      },
    ],
    pembiayaan: {
      sumberDana: 'Swadaya Paguyuban Komite & BOS Reguler (Kegiatan Kemitraan)',
      keterangan: 'Konsumsi seminar, spanduk kegiatan, dan plakat apresiasi narasumber',
      items: [
        {
          id: 'bg-par1',
          kebutuhan: 'Spanduk Banner Seminar Parenting & Piagam Penghargaan Narasumber',
          volume: 4,
          satuan: 'Paket',
          hargaSatuan: 150000,
          jumlah: 600000,
          keterangan: 'Publikasi dan apresiasi relawan inspirasi',
        },
        {
          id: 'bg-par2',
          kebutuhan: 'Snack Konsumsi Ringan Temu Orang Tua Murid',
          volume: 2,
          satuan: 'Sesi (x150 Orang)',
          hargaSatuan: 600000,
          jumlah: 1200000,
          keterangan: 'Pertemuan pleno awal semester dan akhir semester',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Daftar hadir per kelas dan dokumentasi interaksi di media sosial sekolah.',
      evaluasi: 'Kuesioner umpan balik orang tua mengenai kepuasan kemitraan sekolah.',
      instrumen: 'Lembar survei kepuasan orang tua dan catatan refleksi wali kelas.',
    },
    tindakLanjut:
      'Membentuk grup komunikasi paguyuban yang positif dan menyusun buletin digital karya siswa untuk orang tua setiap akhir bulan.',
    penutup:
      'Ketika sekolah dan orang tua melangkah seirama dalam satu irama, tumbuh kembang anak akan mencapai puncak tertingginya.',
  },
  {
    id: 'template-sarpras',
    namaProgram: 'Program Pemeliharaan dan Perawatan Rutin Sarana Prasarana Sekolah Ramah Anak & Aman Bencana',
    bidang: 'Sarana Prasarana',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '20 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Sarana dan prasarana yang layak, aman, dan bersih adalah syarat utama terciptanya iklim belajar yang kondusif. Kerusakan kecil yang diabaikan dapat membahayakan keselamatan anak dan merusak aset berharga sekolah. Program ini mengatur pemeliharaan preventif berkala terhadap instalasi kelistrikan, plafon, sanitasi toilet terpisah, alat pemadam api ringan (APAR), serta penataan inventaris Kartu Inventaris Ruangan (KIR).',
    masalahKondisi:
      'Kran air wastafel sering bocor, beberapa titik cat dinding mulai kusam berlumut, dan pemeriksaan masa kedaluwarsa tabung APAR perlu diperbarui.',
    kebutuhanSiswa:
      'Toilet yang wangi dan bersih, ruang kelas yang sejuk terang benderang, serta lingkungan sekolah yang bebas bahaya fisik.',
    dasarHukum: [
      {
        id: 'dh-sp1',
        text: 'Permendiknas Nomor 24 Tahun 2007 tentang Standar Sarana dan Prasarana SD/MI',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-sp2',
        text: 'Permendikbudristek Nomor 33 Tahun 2019 tentang Penyelenggaraan Program Satuan Pendidikan Aman Bencana (SPAB)',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Memastikan seluruh ruang kelas, toilet, dan fasilitas sekolah dalam kondisi laik fungsi dan aman bagi siswa.',
      'Mencegah kerusakan sarana pembelajaran melalui inspeksi berkala terencana.',
      'Memenuhi kesiapsiagaan keselamatan darurat bencana (jalur evakuasi, titik kumpul, dan APAR aktif).',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik pengguna fasilitas sekolah',
      guru: 'Dewan Guru dan Tendik',
      tenagaKependidikan: 'Petugas Sarpras, Penjaga Sekolah, dan Teknisi',
      orangTua: 'Komite Sekolah Bidang Sarpras',
      komite: 'Komite Sekolah',
      masyarakat: 'Dinas Pemadam Kebakaran / BPBD setempat',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-sp1',
        tahapan: 'Inspeksi & Audit Kelaikan Ruang',
        uraian:
          'Pemeriksaan rutin mingguan instalasi sakelar listrik, kawat pengaman, kaca jendela, engsel pintu, dan kondisi atap ruang belajar.',
        penanggungJawab: 'Koordinator Sarpras & Teknisi Sekolah',
      },
      {
        id: 'act-sp2',
        tahapan: 'Pemeliharaan Sanitasi & Toilet Bersih',
        uraian:
          'Pengurasan berkala toren penampung air, penggantian kran rusak dengan kran putar hemat air, dan penyediaan kapur barus desinfektan.',
        penanggungJawab: 'Petugas Kebersihan & Pembina UKS',
      },
      {
        id: 'act-sp3',
        tahapan: 'Peremajaan Cat & Perbaikan Meja Kursi',
        uraian:
          'Pengecatan ulang dinding teras yang kusam dan perbaikan bangku belajar siswa yang goyang menggunakan paku/sekrup kayu penguat.',
        penanggungJawab: 'Tim Sarpras & Penjaga Sekolah',
      },
      {
        id: 'act-sp4',
        tahapan: 'Uji APAR & Pemasangan Jalur Evakuasi',
        uraian:
          'Isi ulang serbuk pemadam tabung APAR 3kg serta pembaruan stiker hijau penunjuk jalur evakuasi bencana gempa bumi menuju titik kumpul.',
        penanggungJawab: 'Tim SPAB Sekolah & BPBD',
      },
    ],
    waktuTempat: {
      hari: 'Sabtu Siang (Perawatan Berkala)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '11.30 - 15.00 WIB',
      tempat: 'Seluruh Kompleks Gedung SD',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-sp1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Pengalokasian anggaran pemeliharaan sarana prasarana sekolah',
      },
      {
        id: 'pel-sp2',
        jabatan: 'Koordinator Sarana & Prasarana',
        nama: 'Rian Pratama, S.Pd.',
        tugas: 'Mendata inventaris KIP/KIR, menjadwalkan perbaikan, dan verifikasi hasil kerja teknisi',
      },
      {
        id: 'pel-sp3',
        jabatan: 'Tenaga Kebersihan & Pemeliharaan Fisik',
        nama: 'Petugas Kebersihan Sekolah',
        tugas: 'Pelaksana harian kebersihan toilet, sanitasi, dan keamanan sarana',
      },
    ],
    indikator: [
      {
        id: 'ind-sp1',
        indikator: 'Persentase toilet sekolah yang berfungsi optimal dan berair bersih',
        target: '100% toilet putra dan putri berfungsi tanpa kendala mampet',
      },
      {
        id: 'ind-sp2',
        indikator: 'Kesiapan tabung APAR dan rambu keselamatan titik kumpul',
        target: '100% tabung APAR aktif (jarum di zona hijau) dan tanda evakuasi terpasang jelas',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Komponen Pemeliharaan Sarana dan Prasarana Sekolah)',
      keterangan: 'Belanja cat, kran air, sekrup perbaikan mebeler, dan isi ulang APAR',
      items: [
        {
          id: 'bg-sp1',
          kebutuhan: 'Cat Tembok Ramah Lingkungan & Kuas Roll Peremajaan Dinding',
          volume: 4,
          satuan: 'Pail (20kg)',
          hargaSatuan: 550000,
          jumlah: 2200000,
          keterangan: 'Peremajaan dinding teras dan lorong sekolah',
        },
        {
          id: 'bg-sp2',
          kebutuhan: 'Perlengkapan Sanitasi (Kran Air Putar, Selang Fleksibel, Pembersih Porselen)',
          volume: 1,
          satuan: 'Paket Semester',
          hargaSatuan: 650000,
          jumlah: 650000,
          keterangan: 'Cadangan suku cadang perbaikan cepat',
        },
        {
          id: 'bg-sp3',
          kebutuhan: 'Jasa Isi Ulang Dry Chemical Powder Tabung APAR 3kg',
          volume: 4,
          satuan: 'Tabung',
          hargaSatuan: 125000,
          jumlah: 500000,
          keterangan: 'Kesiapsiagaan pemadaman api darurat',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku rekam laporan kerusakan sarana dari guru piket dan rekapitulasi kartu KIR.',
      evaluasi: 'Audit fisik sarana tiap akhir semester bersama pengurus Komite Sarpras.',
      instrumen: 'Ceklis instrumen pemeliharaan gedung Permendiknas No. 24/2007.',
    },
    tindakLanjut:
      'Memprioritaskan usulan renovasi sedang/berat ke dalam usulan DAK Fisik dinas pendidikan bagi kerusakan struktural di luar BOS.',
    penutup:
      'Sarana yang terawat mencerminkan budaya disiplin dan kepedulian. Sekolah yang aman adalah hak setiap anak Indonesia.',
  },
  {
    id: 'template-digital',
    namaProgram: 'Program Digitalisasi Pembelajaran: Pemanfaatan Chromebook, Akun Belajar.id & Literasi Digital',
    bidang: 'Pembelajaran',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '22 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Transformasi teknologi dalam pendidikan dasar membuka peluang besar untuk menyajikan pembelajaran yang interaktif dan kaya visual. Sekolah mengoptimalkan bantuan perangkat Chromebook Kemendikbudristek dan Akun Belajar.id. Melalui program ini, siswa dilatih literasi digital dasar, etika internet sehat, pengerjaan kuis gamifikasi pembelajaran, serta persiapan simulasi Asesmen Nasional Berbasis Komputer (ANBK).',
    masalahKondisi:
      'Perangkat Chromebook kerap hanya dipakai saat ANBK dan belum diintegrasikan dalam jam belajar reguler di ruang kelas.',
    kebutuhanSiswa:
      'Pengalaman belajar interaktif dengan video edukatif, pengetikan dasar pada keyboard, dan wawasan keamanan data pribadi.',
    dasarHukum: [
      {
        id: 'dh-dg1',
        text: 'Permendikbudristek Nomor 16 Tahun 2022 tentang Standar Proses pada Pendidikan Dasar dan Menengah',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-dg2',
        text: 'Surat Edaran Dirjen Pauddikdasmen tentang Pemanfaatan Akun Pembelajaran (Belajar.id) dan Bantuan TIK',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Mengintegrasikan perangkat Chromebook dan platform digital ke dalam materi tematik/IPAS/Matematika mingguan.',
      'Meningkatkan keterampilan mengetik 10 jari dan literasi digital dasar bagi siswa kelas tinggi (IV-VI).',
      'Mempersiapkan kemahiran teknis peserta didik menghadapi gladi bersih dan pelaksanaan ANBK.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Peserta didik kelas III s.d. VI (Fokus utama)',
      guru: 'Seluruh dewan guru kelas dan guru mapel',
      tenagaKependidikan: 'Proktor ANBK dan Teknisi TIK',
      orangTua: 'Wali murid (pendampingan gawai ramah anak di rumah)',
      komite: 'Komite Sekolah',
      masyarakat: '-',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-dg1',
        tahapan: 'Jadwal Roster Kelas Digital',
        uraian:
          'Penyusunan jadwal bergilir pemakaian 15 unit Chromebook bagi rombel kelas IV, V, dan VI setiap hari Selasa hingga Kamis.',
        penanggungJawab: 'Operator Sekolah & Tim Kurikulum',
      },
      {
        id: 'act-dg2',
        tahapan: 'Praktik Gamifikasi Pembelajaran',
        uraian:
          'Pemanfaatan aplikasi kuis Quizizz, Canva for Education, dan simulasi sains interaktif PhET dalam pembelajaran IPA/IPS.',
        penanggungJawab: 'Dewan Guru Kelas IV, V, VI',
      },
      {
        id: 'act-dg3',
        tahapan: 'Simulasi ANBK & Tes Diagnostik Digital',
        uraian:
          'Pelaksanaan gladi kotor dan gladi bersih Asesmen Nasional Berbasis Komputer bagi siswa kelas V untuk melatih navigasi soal AKM.',
        penanggungJawab: 'Proktor & Teknisi ANBK',
      },
      {
        id: 'act-dg4',
        tahapan: 'Edukasi Etika Internet Sehat (Netiket)',
        uraian:
          'Penyuluhan bahaya kecanduan game online, pencegahan cyberbullying, dan cara menjaga kerahasiaan kata sandi akun Belajar.id.',
        penanggungJawab: 'Guru TIK & Guru PAI',
      },
    ],
    waktuTempat: {
      hari: 'Selasa s.d. Kamis (Jadwal Terintegrasi)',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: 'Sesuai Jam Roster Pelajaran & 13.00 WIB (Simulasi ANBK)',
      tempat: 'Laboratorium Komputer / Ruang Kelas Siswa',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-dg1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Kebijakan digitalisasi dan penyediaan infrastruktur internet sekolah',
      },
      {
        id: 'pel-dg2',
        jabatan: 'Proktor & Koordinator TIK',
        nama: 'Nurlina Sari, S.Kom.',
        tugas: 'Manajemen charging cart Chromebook, pembaruan ChromeOS, dan pendampingan teknis',
      },
      {
        id: 'pel-dg3',
        jabatan: 'Fasilitator Pembelajaran Digital',
        nama: 'Budi Santoso, S.Pd., Gr.',
        tugas: 'Pengembangan materi modul ajar digital berbasis Belajar.id',
      },
    ],
    indikator: [
      {
        id: 'ind-dg1',
        indikator: 'Persentase siswa kelas V yang terampil mengoperasikan Chromebook untuk asesmen',
        target: '100% siswa kelas V tuntas simulasi ANBK tanpa kendala teknis',
      },
      {
        id: 'ind-dg2',
        indikator: 'Tingkat aktivasi akun Belajar.id siswa dan guru',
        target: 'Mencapai minimal 95% akun teraktivasi dan aktif digunakan',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Langganan Daya & Jasa Internet / Pemeliharaan TIK)',
      keterangan: 'Peningkatan bandwidth WiFi, mouse optik eksternal, dan stopkontak',
      items: [
        {
          id: 'bg-dg1',
          kebutuhan: 'Mouse Optik USB Kabel untuk Kenyamanan Latihan Siswa',
          volume: 15,
          satuan: 'Unit',
          hargaSatuan: 45000,
          jumlah: 675000,
          keterangan: 'Mempermudah anak kelas bawah mengoperasikan kuis',
        },
        {
          id: 'bg-dg2',
          kebutuhan: 'Kabel Roll Stopkontak Pengaman & Pembersih Layar Elektronik',
          volume: 2,
          satuan: 'Set',
          hargaSatuan: 150000,
          jumlah: 300000,
          keterangan: 'Stasiun pengisian daya bergerak',
        },
        {
          id: 'bg-dg3',
          kebutuhan: 'Biaya Tambahan Bandwidth Internet Saat Pelaksanaan ANBK',
          volume: 2,
          satuan: 'Bulan',
          hargaSatuan: 350000,
          jumlah: 700000,
          keterangan: 'Memastikan koneksi ujian stabil tanpa jeda',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku log peminjaman Chromebook dan laporan utilisasi kuota akun Belajar.id.',
      evaluasi: 'Analisis kecepatan respons siswa dalam menyelesaikan asesmen formatif online.',
      instrumen: 'Ceklis kemahiran literasi komputer siswa dan lembar evaluasi proktor ANBK.',
    },
    tindakLanjut:
      'Mengikutsertakan siswa berbakat dalam lomba olimpiade sains/matematika berbasis komputer dan pelatihan Canva bagi guru.',
    penutup:
      'Teknologi di tangan guru yang tepat adalah katalisator masa depan gemilang anak-anak bangsa.',
  },
  {
    id: 'template-seni-budaya',
    namaProgram: 'Program Pembinaan Ekstrakurikuler Seni Musik Tradisional, Tari Daerah & Olahraga Prestasi',
    bidang: 'Ekstrakurikuler',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '25 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Penguatan profil Pelajar Pancasila berakar kuat pada pelestarian kearifan lokal dan pengembangan bakat kinestetik anak. Melalui ekstrakurikuler seni tari kreasi daerah, ansambel musik tradisional (angklung/karawitan), dan cabang olahraga atletik/bulutangkis, sekolah membina sportivitas, daya cipta estetika, serta mempersiapkan bibit unggul perwakilan sekolah dalam ajang FLS2N dan O2SN tingkat kecamatan hingga nasional.',
    masalahKondisi:
      'Bakat non-akademik siswa di bidang seni dan olahraga belum terbina secara terprogram dengan pelatih yang kompeten.',
    kebutuhanSiswa:
      'Wadah menyalurkan minat berkesenian dan berolahraga secara kompetitif dan menggembirakan.',
    dasarHukum: [
      {
        id: 'dh-sn1',
        text: 'Undang-Undang Nomor 11 Tahun 2022 tentang Keolahragaan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-sn2',
        text: 'Permendikbud Nomor 62 Tahun 2014 tentang Kegiatan Ekstrakurikuler pada Pendidikan Dasar dan Menengah',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-sn3',
        text: 'Pedoman Pelaksanaan FLS2N dan O2SN Balai Pengembangan Talenta Indonesia (BPTI)',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menumbuhkan kecintaan peserta didik pada seni budaya tradisional daerah nusantara.',
      'Melatih kebugaran fisik, disiplin bertanding, dan sportivitas melalui cabang olahraga pilihan.',
      'Meraih prestasi kejuaraan pada ajang FLS2N dan O2SN tingkat gugus/kecamatan.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Peserta didik kelas II s.d. VI peminat bakat seni dan olahraga (60 siswa)',
      guru: 'Guru Pembina Seni Budaya & PJOK',
      tenagaKependidikan: 'Staf sarpras sekolah',
      orangTua: 'Orang tua siswa peserta ekstrakurikuler',
      komite: 'Komite Sekolah',
      masyarakat: 'Pelatih seni sanggar lokal dan persatuan olahraga daerah',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-sn1',
        tahapan: 'Perekrutan & Seleksi Minat',
        uraian:
          'Audisi minat bakat awal tahun ajaran untuk memetakan peminatan: Tari Tradisional, Musik Angklung, Atletik Kid, dan Bulutangkis.',
        penanggungJawab: 'Pembina Seni & PJOK',
      },
      {
        id: 'act-sn2',
        tahapan: 'Latihan Rutin Terjadwal',
        uraian:
          'Latihan terstruktur setiap hari Selasa dan Kamis sore (14.30 - 16.30 WIB) dengan materi teknik gerak tari, harmonisasi nada, dan kelincahan fisik.',
        penanggungJawab: 'Pelatih Sanggar & Rian Pratama, S.Pd.',
      },
      {
        id: 'act-sn3',
        tahapan: 'Gelar Karya Seni Tutup Semester',
        uraian:
          'Pementasan karya seni tari dan mini konser angklung di hadapan seluruh siswa dan wali murid saat pembagian rapor.',
        penanggungJawab: 'Tim Kreatif Sekolah & Dewan Guru',
      },
      {
        id: 'act-sn4',
        tahapan: 'Partisipasi Ajang FLS2N & O2SN',
        uraian:
          'Pemberangkatan kontingen delegasi sekolah dalam seleksi lomba seni dan olahraga tingkat kecamatan/kabupaten.',
        penanggungJawab: 'Kepala Sekolah & Tim Pembina',
      },
    ],
    waktuTempat: {
      hari: 'Selasa & Kamis Sore',
      tanggal: 'Tahun Pelajaran 2026/2027',
      waktu: '14.30 - 16.30 WIB',
      tempat: 'Ruang Aula Kesenian & Lapangan Olahraga Sekolah',
      durasi: '1 Tahun Ajaran',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-sn1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Kebijakan program pengembangan talenta siswa',
      },
      {
        id: 'pel-sn2',
        jabatan: 'Koordinator Olahraga & Prestasi',
        nama: 'Rian Pratama, S.Pd.',
        tugas: 'Melatih fisik atlet dan mengurus administrasi pendaftaran O2SN',
      },
      {
        id: 'pel-sn3',
        jabatan: 'Koordinator Seni & Budaya',
        nama: 'Dewi Lestari, S.Pd.SD.',
        tugas: 'Koreografi tari tradisional dan persiapan kostum lomba FLS2N',
      },
    ],
    indikator: [
      {
        id: 'ind-sn1',
        indikator: 'Tingkat keaktifan kehadiran siswa dalam sesi latihan ekstrakurikuler',
        target: 'Minimal 90% presensi hadir rutin',
      },
      {
        id: 'ind-sn2',
        indikator: 'Pencapaian prestasi dalam lomba FLS2N / O2SN tingkat kecamatan',
        target: 'Meraih minimal 2 gelar juara pada nomor cabang yang diikuti',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Pengembangan Kegiatan Ekstrakurikuler & Pembinaan Bakat)',
      keterangan: 'Honor pelatih ahli luar, sewa kostum pentas, dan shuttlecock',
      items: [
        {
          id: 'bg-sn1',
          kebutuhan: 'Honorarium Pelatih Tari Tradisional & Angklung Profesional',
          volume: 8,
          satuan: 'Bulan (x4 Pertemuan)',
          hargaSatuan: 250000,
          jumlah: 2000000,
          keterangan: 'Pelatih berkompeten dari sanggar seni mitra',
        },
        {
          id: 'bg-sn2',
          kebutuhan: 'Perlengkapan Olahraga (Shuttlecock Slazenger & Matras Senam)',
          volume: 1,
          satuan: 'Paket Sarana',
          hargaSatuan: 600000,
          jumlah: 600000,
          keterangan: 'Penunjang latihan intensif atlet',
        },
        {
          id: 'bg-sn3',
          kebutuhan: 'Sewa Kostum Tari Daerah & Tata Rias Pementasan FLS2N',
          volume: 5,
          satuan: 'Set Anak',
          hargaSatuan: 120000,
          jumlah: 600000,
          keterangan: 'Kostum tari kreasi nusantara',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Buku jurnal perkembangan teknik gerak/nada dan presensi harian.',
      evaluasi: 'Simulasi uji tanding dan pentas gladi resik sebelum lomba resmi.',
      instrumen: 'Rubrik penilaian bakat seni dan lembar catatan waktu/skor olahraga.',
    },
    tindakLanjut:
      'Memberikan beasiswa piagam apresiasi bebas iuran paguyuban bagi siswa peraih medali kejuaraan dan mendokumentasikan penampilan di kanal YouTube sekolah.',
    penutup:
      'Di balik gemulainya gerak tari dan derap lari anak-anak tersimpan kebanggaan dan martabat budaya bangsa.',
  },
  {
    id: 'template-pbd-rapor',
    namaProgram: 'Program Perencanaan Berbasis Data (PBD) & Tindak Lanjut Pembenahan Rapor Pendidikan',
    bidang: 'Manajemen Sekolah',
    penanggungJawab: 'Dra. Hj. Siti Aminah, M.Pd.',
    tempatPenyusunan: 'Nusantara',
    tanggalPengesahan: '28 Agustus 2026',
    status: 'draft',
    latarBelakang:
      'Perencanaan Berbasis Data (PBD) merupakan ruh transformasi manajemen sekolah modern di era Kurikulum Merdeka. Pengambilan keputusan anggaran dan program kerja tidak lagi bertumpu pada kebiasaan lama (rutinitas tahunan), melainkan berangkat dari fakta empiris profil indikator Rapor Pendidikan sekolah. Melalui siklus IRB (Identifikasi, Refleksi, Benahi), sekolah merumuskan Rencana Kerja Tahunan (RKT) dan RKAS yang terukur dampaknya pada peningkatan mutu hasil belajar murid.',
    masalahKondisi:
      'Penyusunan RKT/RKAS sebelumnya belum sepenuhnya sinkron dengan rekomendasi prioritas pembenahan rapor pendidikan.',
    kebutuhanSiswa:
      'Program sekolah yang tepat sasaran menjawab akar masalah rendahnya literasi membaca dan iklim keamanan belajar.',
    dasarHukum: [
      {
        id: 'dh-pbd1',
        text: 'Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-pbd2',
        text: 'Permendikbudristek Nomor 9 Tahun 2022 tentang Evaluasi Sistem Pendidikan oleh Pemerintah Pusat dan Daerah',
        perluDiverifikasi: false,
      },
      {
        id: 'dh-pbd3',
        text: 'Panduan Perencanaan Berbasis Data Satuan Pendidikan Kemendikbudristek',
        perluDiverifikasi: false,
      },
    ],
    tujuan: [
      'Menganalisis indikator capaian Rapor Pendidikan (Literasi, Numerasi, Karakter, Iklim Keamanan, Inklusivitas, dan Kualitas Pembelajaran).',
      'Menetapkan 3 program prioritas benahi yang terintegrasi langsung ke dalam dokumen RKT dan RKAS ARKAS 4.0.',
      'Mewujudkan tata kelola anggaran sekolah yang transparan, akuntabel, dan berdampak nyata bagi murid.',
    ],
    sasaran: {
      kelasPilihan: ['Semua kelas'],
      pesertaDidik: 'Seluruh peserta didik penerima manfaat program sekolah',
      guru: 'Seluruh Dewan Guru Kelas & Mapel',
      tenagaKependidikan: 'Bendahara BOS dan Operator Sekolah',
      orangTua: 'Perwakilan Orang Tua Siswa',
      komite: 'Pengurus Komite Sekolah',
      masyarakat: 'Pengawas Pembina Dinas Pendidikan',
      lainnya: '-',
    },
    kegiatan: [
      {
        id: 'act-pbd1',
        tahapan: 'Eksplorasi Rapor Pendidikan',
        uraian:
          'Lokakarya unduh dan telaah bersama dokumen Rapor Pendidikan versi terbaru oleh dewan guru untuk membedah skor dan indikator merah/kuning.',
        penanggungJawab: 'Tim Pengembang Kurikulum & Operator',
      },
      {
        id: 'act-pbd2',
        tahapan: 'Perumusan Akar Masalah (Identifikasi & Refleksi)',
        uraian:
          'Diskusi kelompok terpumpun (FGD) mencari akar masalah kenapa kompetensi numerasi dan iklim kebhinekaan masih memerlukan peningkatan.',
        penanggungJawab: 'Kepala Sekolah & Guru Senior',
      },
      {
        id: 'act-pbd3',
        tahapan: 'Penyusunan Program Benahi & RKT',
        uraian:
          'Memilih rekomendasi langkah Benahi resmi Kemendikbudristek dan memasukkannya ke dalam draf RKT serta rincian kode rekening ARKAS.',
        penanggungJawab: 'Bendahara BOS & Koordinator Kurikulum',
      },
      {
        id: 'act-pbd4',
        tahapan: 'Uji Publik & Penandatanganan Pengawas',
        uraian:
          'Rapat pleno pemaparan dokumen RKT/RKAS di hadapan Komite Sekolah dan Pengawas Pembina untuk mendapatkan pengesahan resmi.',
        penanggungJawab: 'Kepala Sekolah & Komite',
      },
    ],
    waktuTempat: {
      hari: 'Sabtu (FGD & Lokakarya Terjadwal)',
      tanggal: 'Awal Tahun Pelajaran 2026/2027',
      waktu: '08.00 - 15.00 WIB',
      tempat: 'Ruang Rapat Guru SD',
      durasi: '1 Bulan Intensif (Penyusunan RKT)',
      periode: '2026/2027',
    },
    pelaksana: [
      {
        id: 'pel-pbd1',
        jabatan: 'Penanggung Jawab',
        nama: 'Dra. Hj. Siti Aminah, M.Pd.',
        tugas: 'Memimpin lokakarya PBD dan menandatangani dokumen RKT/RKAS',
      },
      {
        id: 'pel-pbd2',
        jabatan: 'Ketua Tim PBD Sekolah',
        nama: 'Budi Santoso, S.Pd., Gr.',
        tugas: 'Memfasilitasi analisis instrumen akar masalah dan integrasi ke modul ajar',
      },
      {
        id: 'pel-pbd3',
        jabatan: 'Bendahara BOS / ARKAS',
        nama: 'Nurlina Sari, S.Kom.',
        tugas: 'Sinkronisasi usulan benahi ke dalam menu kegiatan aplikasi ARKAS 4.0',
      },
    ],
    indikator: [
      {
        id: 'ind-pbd1',
        indikator: 'Tersusunnya dokumen RKT berbasis data yang disahkan Pengawas Pembina',
        target: '100% dokumen RKT tersusun tuntas sebelum batas cut-off tahun ajaran',
      },
      {
        id: 'ind-pbd2',
        indikator: 'Kesesuaian alokasi belanja ARKAS dengan indikator prioritas Benahi',
        target: 'Minimal 80% belanja peningkatan mutu mengarah ke akar masalah rapor',
      },
    ],
    pembiayaan: {
      sumberDana: 'BOS Reguler (Pengelolaan Sekolah/Evaluasi Diri Sekolah)',
      keterangan: 'Konsumsi lokakarya dewan guru, penggandaan dokumen RKT, dan penjilidan buku kerja',
      items: [
        {
          id: 'bg-pbd1',
          kebutuhan: 'Penggandaan Dokumen Rapor Pendidikan & Instrumen Analisis IRB',
          volume: 1,
          satuan: 'Paket Sekolah',
          hargaSatuan: 350000,
          jumlah: 350000,
          keterangan: 'Bahan telaah bersama dewan guru',
        },
        {
          id: 'bg-pbd2',
          kebutuhan: 'Snack Konsumsi Rapat Kerja PBD & Uji Publik Bersama Komite & Pengawas',
          volume: 2,
          satuan: 'Sesi (x20 Orang)',
          hargaSatuan: 300000,
          jumlah: 600000,
          keterangan: 'Konsumsi lokakarya perencanaan anggaran',
        },
        {
          id: 'bg-pbd3',
          kebutuhan: 'Cetak & Penjilidan Hardcover Dokumen RKT/RKAS Resmi Sekolah',
          volume: 4,
          satuan: 'Buku',
          hargaSatuan: 75000,
          jumlah: 300000,
          keterangan: 'Arsip sekolah, komite, dan dinas pendidikan',
        },
      ],
    },
    monitoringEvaluasi: {
      monitoring: 'Ceklis realisasi belanja bulanan pada aplikasi ARKAS dibandingkan matriks RKT.',
      evaluasi: 'Refleksi capaian rapor pendidikan tahun berikutnya untuk mengukur kenaikan skor indikator.',
      instrumen: 'Lembar instrumen monitoring PBD Ditjen PAUD Dikdasmen.',
    },
    tindakLanjut:
      'Melaporkan kemajuan pelaksanaan RKT kepada Dinas Pendidikan dan mengunggah praktik baik pembenahan ke Platform Merdeka Mengajar (PMM).',
    penutup:
      'Dengan perencanaan berbasis data yang cermat, setiap rupiah anggaran pendidikan berbuah manfaat nyata bagi kemajuan dan kesejahteraan belajar murid.',
  },
];


import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun,
} from 'docx';
import { ProgramData, SchoolData } from '../types/program';
import {
  getSectionNarrative,
  formatLatarBelakangMinimal3Paragraf,
} from '../utils/documentNarratives';
import { dataUrlToImageRunData, getSafeImageForDocx } from '../utils/imageUtils';

export const exportService = {
  // Format Indonesian Rupiah
  formatRupiah(num: number): string {
    return 'Rp ' + (num || 0).toLocaleString('id-ID');
  },

  async exportToDocx(program: ProgramData, school: SchoolData): Promise<void> {
    const borders = {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    };

    const schoolName = school.namaSekolah || 'Sekolah Dasar';
    const districtName = (school.kabupaten || 'Kabupaten').toUpperCase();
    const docYear = new Date(program.tanggalPengesahan || Date.now()).getFullYear();

    // Prepare Logo and Kop image runs if available with natural aspect ratio
    const logoImageInfo = school.logoUrl ? await getSafeImageForDocx(school.logoUrl) : null;
    const kopImageInfo = school.kopUrl ? await getSafeImageForDocx(school.kopUrl) : null;

    // ==========================================
    // 0. HALAMAN COVER / SAMPUL DEPAN KEDINASAN
    // ==========================================
    const coverParagraphs = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 40 },
        children: [
          new TextRun({
            text: `PEMERINTAH KABUPATEN / KOTA ${districtName}`,
            bold: true,
            size: 24,
            font: 'Arial',
            color: '1E293B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'DINAS PENDIDIKAN',
            bold: true,
            size: 26,
            font: 'Arial',
            color: '0F172A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: schoolName.toUpperCase(),
            bold: true,
            size: 28,
            font: 'Arial',
            color: '1E3A8A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: '═════════════════════════════════════════════════',
            bold: true,
            size: 18,
            color: 'CBD5E1',
          }),
        ],
      }),

      // Logo Sekolah pada Cover jika tersedia
      ...(logoImageInfo
        ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 160, after: 200 },
              children: [
                new ImageRun({
                  data: logoImageInfo.data,
                  transformation: {
                    width: 95,
                    height: 95,
                  },
                  type: logoImageInfo.type,
                }),
              ],
            }),
          ]
        : []),

      // Judul Utama Dokumen
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 80 },
        children: [
          new TextRun({
            text: 'DOKUMEN PROGRAM KERJA DAN KEGIATAN SEKOLAH',
            bold: true,
            size: 28,
            font: 'Arial',
            color: '0F172A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `BIDANG: ${(program.bidang || 'PENDIDIKAN').toUpperCase()}`,
            bold: true,
            size: 20,
            font: 'Arial',
            color: '4338CA',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 140 },
        children: [
          new TextRun({
            text: program.namaProgram.toUpperCase(),
            bold: true,
            size: 32,
            font: 'Arial',
            color: '1E3A8A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `TAHUN PELAJARAN ${program.tahunPelajaran}`,
            bold: true,
            size: 24,
            font: 'Arial',
            color: '334155',
          }),
        ],
      }),

      // Lambang Pembatas Tengah
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 400 },
        children: [
          new TextRun({
            text: '◆  STANDAR NASIONAL PENDIDIKAN SD  ◆',
            bold: true,
            size: 18,
            color: '64748B',
          }),
        ],
      }),

      // Identitas Penyusun & Unit Sekolah di Bawah Cover
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 360, after: 60 },
        children: [
          new TextRun({
            text: 'Disusun Oleh:',
            bold: true,
            size: 20,
            font: 'Arial',
            color: '475569',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: program.penanggungJawab || school.kepalaSekolah || 'Tim Pengembang Sekolah',
            bold: true,
            size: 22,
            font: 'Arial',
            color: '0F172A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 40 },
        children: [
          new TextRun({
            text: schoolName.toUpperCase(),
            bold: true,
            size: 26,
            font: 'Arial',
            color: '1E3A8A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: `NPSN: ${school.npsn} ${school.nss ? `| NSS: ${school.nss}` : ''}`,
            size: 18,
            font: 'Arial',
            color: '475569',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: `${school.alamat}, Kec. ${school.kecamatan}`,
            size: 18,
            font: 'Arial',
            color: '475569',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `${school.kabupaten.toUpperCase()}, ${school.provinsi.toUpperCase()}`,
            bold: true,
            size: 18,
            font: 'Arial',
            color: '1E293B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `Tahun ${docYear}`,
            bold: true,
            size: 20,
            font: 'Arial',
            color: '334155',
          }),
        ],
      }),
    ];

    // ==========================================
    // 1. KOP SURAT RESMI PADA ISI DOKUMEN
    // ==========================================
    const borderNone = { style: BorderStyle.NONE, size: 0, color: 'auto' };
    const noTableBorders = {
      top: borderNone,
      bottom: borderNone,
      left: borderNone,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    };

    let kopElements: (Paragraph | Table)[] = [];

    if (kopImageInfo && school.useKopImage !== false) {
      // Opsi A: Banner gambar KOP penuh dengan proporsi gambar asli
      const targetWidth = 550; // Lebar standar printable area A4 di Word
      const ratio = kopImageInfo.height / kopImageInfo.width;
      const targetHeight = Math.round(Math.min(Math.max(targetWidth * ratio, 45), 165));

      kopElements = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 180 },
          children: [
            new ImageRun({
              data: kopImageInfo.data,
              transformation: {
                width: targetWidth,
                height: targetHeight,
              },
              type: kopImageInfo.type,
            }),
          ],
        }),
      ];
    } else if (logoImageInfo) {
      // Opsi B: KOP Surat Kedinasan dengan Logo Sekolah di sisi kiri
      const kopTable = new Table({
        width: { size: 9600, type: WidthType.DXA },
        borders: noTableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 1600, type: WidthType.DXA },
                borders: noTableBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: logoImageInfo.data,
                        transformation: {
                          width: 75,
                          height: 75,
                        },
                        type: logoImageInfo.type,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 8000, type: WidthType.DXA },
                borders: noTableBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 30 },
                    children: [
                      new TextRun({
                        text: `PEMERINTAH KABUPATEN / KOTA ${school.kabupaten.toUpperCase()}`,
                        bold: true,
                        size: 22,
                        font: 'Arial',
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 30 },
                    children: [
                      new TextRun({
                        text: 'DINAS PENDIDIKAN',
                        bold: true,
                        size: 24,
                        font: 'Arial',
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 30 },
                    children: [
                      new TextRun({
                        text: school.namaSekolah.toUpperCase(),
                        bold: true,
                        size: 26,
                        font: 'Arial',
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 40 },
                    children: [
                      new TextRun({
                        text: `${school.alamat}, Kec. ${school.kecamatan}, ${school.kabupaten} ${school.provinsi} | NPSN: ${school.npsn}`,
                        italics: true,
                        size: 17,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      kopElements = [
        kopTable,
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 240 },
          children: [
            new TextRun({
              text: '═════════════════════════════════════════════════════════════════',
              bold: true,
              size: 18,
            }),
          ],
        }),
      ];
    } else {
      // Opsi C: KOP Teks Baku Standar Tanpa Gambar
      kopElements = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `PEMERINTAH KABUPATEN / KOTA ${school.kabupaten.toUpperCase()}`,
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: 'DINAS PENDIDIKAN',
              bold: true,
              size: 26,
              font: 'Arial',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: school.namaSekolah.toUpperCase(),
              bold: true,
              size: 28,
              font: 'Arial',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: `${school.alamat}, Kec. ${school.kecamatan}, ${school.kabupaten} ${school.provinsi} | NPSN: ${school.npsn}`,
              italics: true,
              size: 18,
              font: 'Arial',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: '═════════════════════════════════════════════════════════════════',
              bold: true,
              size: 18,
            }),
          ],
        }),
      ];
    }

    // Document Title
    const titleParagraphs = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'DOKUMEN PROGRAM KEGIATAN SEKOLAH',
            bold: true,
            size: 28,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: program.namaProgram.toUpperCase(),
            bold: true,
            size: 26,
            color: '1E3A8A',
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 280 },
        children: [
          new TextRun({
            text: `TAHUN PELAJARAN ${program.tahunPelajaran}`,
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
    ];

    // SECTION A: IDENTITAS
    const sectionA = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'A. IDENTITAS PROGRAM',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '1. Nama Satuan Pendidikan : ', bold: true }),
          new TextRun({ text: school.namaSekolah }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '2. Tahun Pelajaran : ', bold: true }),
          new TextRun({ text: program.tahunPelajaran }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '3. Nama Program / Kegiatan : ', bold: true }),
          new TextRun({ text: program.namaProgram }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '4. Bidang Program : ', bold: true }),
          new TextRun({ text: program.bidang }),
        ],
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: '5. Penanggung Jawab : ', bold: true }),
          new TextRun({ text: program.penanggungJawab }),
        ],
      }),
    ];

    // SECTION B: LATAR BELAKANG (MINIMAL 3 PARAGRAF)
    const latarBelakangParagraphs = formatLatarBelakangMinimal3Paragraf(
      program.latarBelakang,
      program,
      school
    );
    const sectionB = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'B. LATAR BELAKANG',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      ...latarBelakangParagraphs.map(
        (par) =>
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            indent: { firstLine: 400 },
            children: [new TextRun({ text: par, font: 'Arial' })],
          })
      ),
    ];

    // SECTION C: DASAR HUKUM (PENGANTAR + DAFTAR + PENJELAS)
    const narC = getSectionNarrative('dasarHukum', program, school);
    const sectionC = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'C. DASAR HUKUM',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narC.pengantar, font: 'Arial' })],
      }),
      ...program.dasarHukum.map(
        (dh, i) =>
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: `${i + 1}. `, bold: true }),
              new TextRun({
                text: `${dh.text}${dh.perluDiverifikasi ? ' [Perlu diverifikasi]' : ''}`,
                font: 'Arial',
              }),
            ],
          })
      ),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narC.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION D: TUJUAN (PENGANTAR + DAFTAR + PENJELAS)
    const narD = getSectionNarrative('tujuan', program, school);
    const sectionD = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'D. TUJUAN PROGRAM',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narD.pengantar, font: 'Arial' })],
      }),
      ...program.tujuan.map(
        (tuj, i) =>
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: `${i + 1}. `, bold: true }),
              new TextRun({ text: tuj, font: 'Arial' }),
            ],
          })
      ),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narD.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION E: SASARAN (PENGANTAR + DAFTAR + PENJELAS)
    const narE = getSectionNarrative('sasaran', program, school);
    const sectionE = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'E. SASARAN PROGRAM',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narE.pengantar, font: 'Arial' })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Sasaran Kelas : ', bold: true }),
          new TextRun({ text: program.sasaran.kelasPilihan?.join(', ') || 'Semua kelas' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Peserta Didik : ', bold: true }),
          new TextRun({ text: program.sasaran.pesertaDidik || '-' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Pendidik (Guru) : ', bold: true }),
          new TextRun({ text: program.sasaran.guru || '-' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Tenaga Kependidikan : ', bold: true }),
          new TextRun({ text: program.sasaran.tenagaKependidikan || '-' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Orang Tua / Wali Siswa : ', bold: true }),
          new TextRun({ text: program.sasaran.orangTua || '-' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: '• Komite / Masyarakat : ', bold: true }),
          new TextRun({
            text: `${program.sasaran.komite || '-'} / ${program.sasaran.masyarakat || '-'}`,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 140 },
        children: [new TextRun({ text: narE.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION F: BENTUK / RANGKAIAN KEGIATAN (TABLE + PENGANTAR + PENJELAS)
    const narF = getSectionNarrative('kegiatan', program, school);
    const kegiatanRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 600, type: WidthType.DXA },
            borders,
            children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })],
          }),
          new TableCell({
            width: { size: 2500, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Tahapan / Kegiatan', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Uraian Pelaksanaan', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Penanggung Jawab', bold: true })] }),
            ],
          }),
        ],
      }),
      ...program.kegiatan.map(
        (k, i) =>
          new TableRow({
            children: [
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}` })] })],
              }),
              new TableCell({
                borders,
                children: [
                  new Paragraph({ children: [new TextRun({ text: k.tahapan, bold: true })] }),
                ],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: k.uraian })] })],
              }),
              new TableCell({
                borders,
                children: [
                  new Paragraph({ children: [new TextRun({ text: k.penanggungJawab })] }),
                ],
              }),
            ],
          })
      ),
    ];

    const kegiatanTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      rows: kegiatanRows,
    });

    const sectionF = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'F. BENTUK / RANGKAIAN KEGIATAN',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narF.pengantar, font: 'Arial' })],
      }),
      kegiatanTable,
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narF.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION G: WAKTU DAN TEMPAT
    const narG = getSectionNarrative('waktuTempat', program, school);
    const sectionG = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'G. WAKTU DAN TEMPAT PELAKSANAAN',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narG.pengantar, font: 'Arial' })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Hari Pelaksanaan : ', bold: true }),
          new TextRun({ text: program.waktuTempat.hari }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Tanggal Pelaksanaan : ', bold: true }),
          new TextRun({ text: program.waktuTempat.tanggal }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Waktu : ', bold: true }),
          new TextRun({ text: program.waktuTempat.waktu }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Tempat : ', bold: true }),
          new TextRun({ text: program.waktuTempat.tempat }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: '• Durasi & Periode : ', bold: true }),
          new TextRun({
            text: `${program.waktuTempat.durasi} (${program.waktuTempat.periode})`,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 140 },
        children: [new TextRun({ text: narG.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION H: PELAKSANA (TABLE)
    const narH = getSectionNarrative('pelaksana', program, school);
    const pelaksanaRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 600, type: WidthType.DXA },
            borders,
            children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })],
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Jabatan / Peran', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Nama Personil', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 3400, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Uraian Tugas', bold: true })] }),
            ],
          }),
        ],
      }),
      ...program.pelaksana.map(
        (p, i) =>
          new TableRow({
            children: [
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}` })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: p.jabatan, bold: true })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: p.nama })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: p.tugas })] })],
              }),
            ],
          })
      ),
    ];

    const pelaksanaTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      rows: pelaksanaRows,
    });

    const sectionH = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'H. PENANGGUNG JAWAB DAN PELAKSANA',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narH.pengantar, font: 'Arial' })],
      }),
      pelaksanaTable,
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narH.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION I: INDIKATOR KEBERHASILAN (TABLE)
    const narI = getSectionNarrative('indikator', program, school);
    const indikatorRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 600, type: WidthType.DXA },
            borders,
            children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })],
          }),
          new TableCell({
            width: { size: 5500, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Indikator Keberhasilan', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 3500, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Target Pencapaian', bold: true })] }),
            ],
          }),
        ],
      }),
      ...program.indikator.map(
        (ind, i) =>
          new TableRow({
            children: [
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}` })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: ind.indikator })] })],
              }),
              new TableCell({
                borders,
                children: [
                  new Paragraph({ children: [new TextRun({ text: ind.target, bold: true })] }),
                ],
              }),
            ],
          })
      ),
    ];

    const indikatorTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      rows: indikatorRows,
    });

    const sectionI = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'I. INDIKATOR KEBERHASILAN',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narI.pengantar, font: 'Arial' })],
      }),
      indikatorTable,
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narI.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION J: PEMBIAYAAN (TABLE)
    const narJ = getSectionNarrative('pembiayaan', program, school);
    const totalBiaya = program.pembiayaan.items.reduce(
      (sum, item) => sum + (item.volume * item.hargaSatuan || 0),
      0
    );

    const budgetRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 500, type: WidthType.DXA },
            borders,
            children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })],
          }),
          new TableCell({
            width: { size: 3500, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Uraian Kebutuhan Belanja', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 800, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Vol', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 1000, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Satuan', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 1800, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Harga Satuan', bold: true })] }),
            ],
          }),
          new TableCell({
            width: { size: 2000, type: WidthType.DXA },
            borders,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Jumlah', bold: true })] }),
            ],
          }),
        ],
      }),
      ...program.pembiayaan.items.map(
        (b, i) =>
          new TableRow({
            children: [
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}` })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: b.kebutuhan })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: `${b.volume}` })] })],
              }),
              new TableCell({
                borders,
                children: [new Paragraph({ children: [new TextRun({ text: b.satuan })] })],
              }),
              new TableCell({
                borders,
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: this.formatRupiah(b.hargaSatuan) })],
                  }),
                ],
              }),
              new TableCell({
                borders,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: this.formatRupiah(b.volume * b.hargaSatuan),
                        bold: true,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 5,
            borders,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'TOTAL ESTIMASI ANGGARAN : ', bold: true })],
              }),
            ],
          }),
          new TableCell({
            borders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: this.formatRupiah(totalBiaya),
                    bold: true,
                    color: '1E3A8A',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];

    const budgetTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      rows: budgetRows,
    });

    const sectionJ = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'J. RENCANA ANGGARAN DAN PEMBIAYAAN',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narJ.pengantar, font: 'Arial' })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: '• Sumber Dana : ', bold: true }),
          new TextRun({ text: program.pembiayaan.sumberDana || 'BOS Reguler / RKAS' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: '• Keterangan : ', bold: true }),
          new TextRun({ text: program.pembiayaan.keterangan || '-' }),
        ],
      }),
      budgetTable,
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 140 },
        children: [new TextRun({ text: narJ.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION K: MONITORING DAN EVALUASI
    const narK = getSectionNarrative('monitoringEvaluasi', program, school);
    const sectionK = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'K. MONITORING DAN EVALUASI',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narK.pengantar, font: 'Arial' })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: '1. Pelaksanaan Monitoring :', bold: true })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        indent: { left: 400 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: program.monitoringEvaluasi.monitoring || '-' })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: '2. Evaluasi Program :', bold: true })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        indent: { left: 400 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: program.monitoringEvaluasi.evaluasi || '-' })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: '3. Instrumen Monitoring & Evaluasi :', bold: true })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        indent: { left: 400 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: program.monitoringEvaluasi.instrumen || '-' })],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 140 },
        children: [new TextRun({ text: narK.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION L: TINDAK LANJUT
    const narL = getSectionNarrative('tindakLanjut', program, school);
    const sectionL = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'L. RENCANA TINDAK LANJUT',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 100 },
        children: [new TextRun({ text: narL.pengantar, font: 'Arial' })],
      }),
      ...program.tindakLanjut.split('\n').map(
        (tl) =>
          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 400 },
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: tl, font: 'Arial' })],
          })
      ),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 140 },
        children: [new TextRun({ text: narL.penjelas, font: 'Arial' })],
      }),
    ];

    // SECTION M: PENUTUP
    const sectionM = [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'M. PENUTUP',
            bold: true,
            size: 22,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 160 },
        indent: { firstLine: 400 },
        children: [new TextRun({ text: program.penutup, font: 'Arial' })],
      }),
    ];

    // LEMBAR PENGESAHAN / TANDA TANGAN
    const signatureRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4800, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Disahkan di : ${program.tempatPenyusunan || school.kabupaten}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Pada tanggal : ${program.tanggalPengesahan}`,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 100 },
                children: [new TextRun({ text: 'Mengetahui,' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `Kepala ${school.namaSekolah}`, bold: true })],
              }),
              new Paragraph({ spacing: { before: 600, after: 40 }, children: [] }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: school.kepalaSekolah,
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `NIP. ${school.nipKepalaSekolah || '-'}`,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 4800, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({ children: [new TextRun({ text: ' ' })] }),
              new Paragraph({ children: [new TextRun({ text: ' ' })] }),
              new Paragraph({
                spacing: { before: 100 },
                children: [new TextRun({ text: 'Penanggung Jawab Kegiatan,' })],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Ketua Pelaksana Program', bold: true })],
              }),
              new Paragraph({ spacing: { before: 600, after: 40 }, children: [] }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: program.penanggungJawab || '[Nama Penanggung Jawab]',
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'NIP. ........................................' })],
              }),
            ],
          }),
        ],
      }),
    ];

    const signatureTable = new Table({
      width: { size: 9600, type: WidthType.DXA },
      rows: signatureRows,
    });

    const doc = new Document({
      sections: [
        // SEKSI 1: HALAMAN COVER (SAMPUL DEPAN RESMI)
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: coverParagraphs,
        },
        // SEKSI 2: ISI DOKUMEN PROGRAM LENGKAP
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: [
            ...kopElements,
            ...titleParagraphs,
            ...sectionA,
            ...sectionB,
            ...sectionC,
            ...sectionD,
            ...sectionE,
            ...sectionF,
            ...sectionG,
            ...sectionH,
            ...sectionI,
            ...sectionJ,
            ...sectionK,
            ...sectionL,
            ...sectionM,
            new Paragraph({ spacing: { before: 240, after: 120 }, children: [] }),
            signatureTable,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const filename = `Program_${program.namaProgram.replace(/[^a-zA-Z0-9]/g, '_')}_${program.tahunPelajaran.replace('/', '-')}.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  printDocument(): void {
    window.print();
  },
};

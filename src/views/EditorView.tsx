import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  FileDown,
  Printer,
  FileSearch,
} from 'lucide-react';
import { ProgramData, SchoolData, Teacher, SectionKey } from '../types/program';
import { SECTIONS_META } from '../utils/validation';
import { SectionNav } from '../components/SectionNav';
import { SectionEditors } from '../components/SectionEditors';
import { AiAssistantPanel } from '../components/AiAssistantPanel';

interface EditorViewProps {
  program: ProgramData;
  school: SchoolData;
  teachers: Teacher[];
  onUpdateProgram: (updated: ProgramData) => void;
  onOpenAnalysis: () => void;
  onOpenPreview: () => void;
  onExportDocx: () => void;
  onPrint: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  program,
  school,
  teachers,
  onUpdateProgram,
  onOpenAnalysis,
  onOpenPreview,
  onExportDocx,
  onPrint,
}) => {
  const [currentSection, setCurrentSection] = useState<SectionKey>('identitas');
  const [previousSnapshots, setPreviousSnapshots] = useState<Record<string, any>>({});

  const currentIndex = SECTIONS_META.findIndex((s) => s.key === currentSection);
  const currentMeta = SECTIONS_META[currentIndex] || SECTIONS_META[0];

  // Save current version snapshot before significant AI change
  const saveSnapshot = (sectionKey: SectionKey, content: any) => {
    setPreviousSnapshots((prev) => ({
      ...prev,
      [sectionKey]: JSON.parse(JSON.stringify(content)),
    }));
  };

  const handleSectionChange = (updatedPartial: Partial<ProgramData>) => {
    const updated: ProgramData = {
      ...program,
      ...updatedPartial,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProgram(updated);
  };

  const handleApplyAiResult = (newContent: any) => {
    // Save snapshot of current section content before replacing
    const currentVal = (program as any)[currentSection];
    saveSnapshot(currentSection, currentVal);

    if (currentSection === 'dasar_hukum') {
      if (Array.isArray(newContent)) {
        handleSectionChange({
          dasarHukum: newContent.map((item: any, i: number) => ({
            id: `dh-ai-${Date.now()}-${i}`,
            text: typeof item === 'string' ? item : item.text || '',
            perluDiverifikasi:
              typeof item === 'object'
                ? Boolean(item.perluDiverifikasi)
                : item.toLowerCase().includes('verifikasi'),
          })),
        });
      } else if (typeof newContent === 'string') {
        const lines = newContent
          .split('\n')
          .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter(Boolean);
        handleSectionChange({
          dasarHukum: lines.map((text, i) => ({
            id: `dh-ai-${Date.now()}-${i}`,
            text,
            perluDiverifikasi: text.toLowerCase().includes('verifikasi'),
          })),
        });
      }
      return;
    }

    if (currentSection === 'tujuan') {
      if (Array.isArray(newContent)) {
        handleSectionChange({ tujuan: newContent });
      } else if (typeof newContent === 'string') {
        const lines = newContent
          .split('\n')
          .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter(Boolean);
        handleSectionChange({ tujuan: lines });
      }
      return;
    }

    if (currentSection === 'kegiatan') {
      if (Array.isArray(newContent)) {
        handleSectionChange({
          kegiatan: newContent.map((item: any, i: number) => ({
            id: `act-ai-${Date.now()}-${i}`,
            tahapan: item.tahapan || 'Pelaksanaan',
            uraian: item.uraian || '',
            penanggungJawab: item.penanggungJawab || school.kepalaSekolah,
          })),
        });
      }
      return;
    }

    if (currentSection === 'pelaksana') {
      if (Array.isArray(newContent)) {
        handleSectionChange({
          pelaksana: newContent.map((item: any, i: number) => ({
            id: `pel-ai-${Date.now()}-${i}`,
            jabatan: item.jabatan || 'Panitia',
            nama: item.nama || '[Nama Guru]',
            tugas: item.tugas || '',
          })),
        });
      }
      return;
    }

    if (currentSection === 'indikator') {
      if (Array.isArray(newContent)) {
        handleSectionChange({
          indikator: newContent.map((item: any, i: number) => ({
            id: `ind-ai-${Date.now()}-${i}`,
            indikator: item.indikator || '',
            target: item.target || '85%',
          })),
        });
      }
      return;
    }

    if (currentSection === 'pembiayaan') {
      if (Array.isArray(newContent)) {
        handleSectionChange({
          pembiayaan: {
            ...program.pembiayaan,
            items: newContent.map((item: any, i: number) => ({
              id: `bg-ai-${Date.now()}-${i}`,
              kebutuhan: item.kebutuhan || '',
              volume: Number(item.volume) || 1,
              satuan: item.satuan || 'Paket',
              hargaSatuan: Number(item.hargaSatuan) || 0,
              jumlah: (Number(item.volume) || 1) * (Number(item.hargaSatuan) || 0),
              keterangan: item.keterangan || '',
            })),
          },
        });
      }
      return;
    }

    // Default text fields: latar_belakang, tindak_lanjut, penutup, etc.
    handleSectionChange({ [currentSection]: newContent });
  };

  const handleRestorePrevious = () => {
    const prev = previousSnapshots[currentSection];
    if (prev !== undefined) {
      if (currentSection === 'pembiayaan') {
        handleSectionChange({ pembiayaan: prev });
      } else {
        handleSectionChange({ [currentSection]: prev });
      }
    }
  };

  const handleNextSection = () => {
    if (currentIndex < SECTIONS_META.length - 1) {
      setCurrentSection(SECTIONS_META[currentIndex + 1].key);
    }
  };

  const handlePrevSection = () => {
    if (currentIndex > 0) {
      setCurrentSection(SECTIONS_META[currentIndex - 1].key);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-61px)]">
      {/* 1. Left Sidebar: Sistematika Bagian Dokumen (01 - 13) */}
      <SectionNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        program={program}
      />

      {/* 2. Center Column: Editor Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Step Indicator Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              Langkah {currentMeta.stepNumber} dari 13
            </span>
            <span className="text-xs font-bold text-slate-800">
              {currentMeta.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrevSection}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <button
              disabled={currentIndex === SECTIONS_META.length - 1}
              onClick={handleNextSection}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-30 transition-colors shadow-xs"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
            <SectionEditors
              sectionKey={currentSection}
              program={program}
              school={school}
              teachers={teachers}
              onChange={handleSectionChange}
              onRequestAi={(actionType) => {
                // Focus AI Panel
              }}
            />

            {/* Bottom Nav inside form */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrevSection}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Bagian Sebelumnya</span>
              </button>

              {currentIndex < SECTIONS_META.length - 1 ? (
                <button
                  onClick={handleNextSection}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  <span>Lanjut ke Bagian {SECTIONS_META[currentIndex + 1].stepNumber}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onOpenAnalysis}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Selesai: Analisis Kualitas Program dengan AI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Right Column: Asisten AI Panel */}
      <AiAssistantPanel
        currentSection={currentSection}
        program={program}
        currentContent={(program as any)[currentSection]}
        onApplyAiResult={handleApplyAiResult}
        onRestorePrevious={handleRestorePrevious}
        hasPreviousVersion={previousSnapshots[currentSection] !== undefined}
      />
    </div>
  );
};

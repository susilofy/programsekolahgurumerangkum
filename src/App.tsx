/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ProgramData, SchoolData, Teacher } from './types/program';
import { storageService } from './services/storageService';
import { exportService } from './services/exportService';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { ProgramListView } from './views/ProgramListView';
import { TemplatesView } from './views/TemplatesView';
import { MasterSchoolView } from './views/MasterSchoolView';
import { MasterTeachersView } from './views/MasterTeachersView';
import { EditorView } from './views/EditorView';
import { CreateProgramWizard } from './components/CreateProgramWizard';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [activeProgram, setActiveProgram] = useState<ProgramData | null>(null);
  const [school, setSchool] = useState<SchoolData>(storageService.getSchoolData());
  const [teachers, setTeachers] = useState<Teacher[]>(storageService.getTeachers());

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(new Date());
  const [previewProgram, setPreviewProgram] = useState<ProgramData | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<ProgramData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sidebar toggle state (open by default, persisted in localStorage)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('programku_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('programku_sidebar_open', String(next));
      } catch {}
      return next;
    });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    try {
      localStorage.setItem('programku_sidebar_open', 'false');
    } catch {}
  };

  // Keyboard shortcut: Ctrl+B / Cmd+B to toggle sidebar, Escape to close on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === 'Escape' && isSidebarOpen && window.innerWidth < 768) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  const saveTimerRef = useRef<any>(null);

  // Initialize data on mount and auto-sync custom defaults
  useEffect(() => {
    const loadedPrograms = storageService.getPrograms();
    const loadedSchool = storageService.getSchoolData();
    const loadedTeachers = storageService.getTeachers();

    setPrograms(loadedPrograms);
    setSchool(loadedSchool);
    setTeachers(loadedTeachers);

    // Fetch server factory defaults to ensure any uploaded KOP/logo on server
    // is immediately synchronized into current active browser session
    fetch('/api/default-data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.school) {
          const srvSchool = res.data.school;
          const current = storageService.getSchoolData();
          let needsUpdate = false;
          const merged: SchoolData = { ...current };

          if (srvSchool.kopUrl && (!current.kopUrl || current.kopUrl.trim() === '')) {
            merged.kopUrl = srvSchool.kopUrl;
            merged.useKopImage = true;
            needsUpdate = true;
          }
          if (srvSchool.logoUrl && (!current.logoUrl || current.logoUrl.trim() === '')) {
            merged.logoUrl = srvSchool.logoUrl;
            needsUpdate = true;
          }
          if (current.namaSekolah === 'SD Negeri 01 Teladan' && srvSchool.namaSekolah) {
            Object.assign(merged, srvSchool);
            needsUpdate = true;
          }

          if (needsUpdate) {
            storageService.saveSchoolData(merged);
            setSchool(merged);
          }
        }
      })
      .catch((err) => console.warn('Sync /api/default-data error (safe to ignore):', err));

    // Auto-save existing client data to server custom defaults so whatever
    // the user filled in (school profile, logo, kop, teachers, programs)
    // becomes the permanent factory default of the codebase.
    if (
      loadedSchool &&
      (loadedSchool.logoUrl ||
        loadedSchool.kopUrl ||
        loadedSchool.namaSekolah !== 'SD Negeri 01 Teladan' ||
        (loadedTeachers && loadedTeachers.length > 0) ||
        (loadedPrograms && loadedPrograms.length > 0))
    ) {
      storageService
        .saveAsFactoryDefaults(loadedSchool, loadedTeachers, loadedPrograms)
        .catch((err) => console.warn('Auto-sync factory defaults notice:', err));
    }
  }, []);

  // Debounced auto-save for active program
  const handleUpdateActiveProgram = (updated: ProgramData) => {
    setActiveProgram(updated);
    setIsSaving(true);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      storageService.saveProgram(updated);
      setPrograms(storageService.getPrograms());
      setIsSaving(false);
      setLastSavedTime(new Date());
    }, 600);
  };

  // Open program in editor
  const handleSelectProgram = (prog: ProgramData) => {
    setActiveProgram(prog);
    setActiveTab('editor');
  };

  // Duplicate program
  const handleDuplicateProgram = (id: string) => {
    const dup = storageService.duplicateProgram(id);
    if (dup) {
      setPrograms(storageService.getPrograms());
    }
  };

  // Delete program: trigger confirmation modal
  const handleDeleteProgram = (id: string) => {
    const target = programs.find((p) => p.id === id);
    if (target) {
      setProgramToDelete(target);
    }
  };

  // Perform actual deletion after confirmation
  const handleConfirmDeleteProgram = () => {
    if (!programToDelete) return;
    const deletedName = programToDelete.namaProgram;
    const deletedId = programToDelete.id;

    storageService.deleteProgram(deletedId);
    setPrograms(storageService.getPrograms());

    if (activeProgram?.id === deletedId) {
      setActiveProgram(null);
      setActiveTab('programs');
    }

    setProgramToDelete(null);
    showToast(`Program "${deletedName}" berhasil dihapus.`);
  };

  // Create new program via wizard
  const handleProgramCreated = (newProg: ProgramData) => {
    storageService.saveProgram(newProg);
    setPrograms(storageService.getPrograms());
    setActiveProgram(newProg);
    setActiveTab('editor');
  };

  // Use pre-built template
  const handleUseTemplate = (tmpl: Partial<ProgramData>) => {
    const newProg = storageService.createNewProgram({
      ...tmpl,
      namaProgram: tmpl.namaProgram,
      tahunPelajaran: school.tahunPelajaran,
      penanggungJawab: school.kepalaSekolah,
    });
    setPrograms(storageService.getPrograms());
    setActiveProgram(newProg);
    setActiveTab('editor');
  };

  // Save school master data
  const handleSaveSchool = (updatedSchool: SchoolData) => {
    storageService.saveSchoolData(updatedSchool);
    setSchool(updatedSchool);
  };

  // Save teachers master data
  const handleSaveTeachers = (updatedTeachers: Teacher[]) => {
    storageService.saveTeachers(updatedTeachers);
    setTeachers(updatedTeachers);
  };

  // Preview Document Modal
  const handleOpenPreview = (prog?: ProgramData) => {
    setPreviewProgram(prog || activeProgram);
  };

  // Export Word docx
  const handleExportDocx = async () => {
    const target = activeProgram || previewProgram;
    if (!target) return;
    try {
      await exportService.exportToDocx(target, school);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor file Word.');
    }
  };

  // Print Document
  const handlePrint = () => {
    if (!previewProgram && activeProgram) {
      setPreviewProgram(activeProgram);
      setTimeout(() => {
        exportService.printDocument();
      }, 300);
    } else {
      exportService.printDocument();
    }
  };

  // Set current school, teachers, programs, and images as factory defaults
  const handleSetAsFactoryDefault = async () => {
    try {
      const res = await storageService.saveAsFactoryDefaults(school, teachers, programs);
      showToast(res.message || 'Data saat ini berhasil dijadikan bawaan utama aplikasi!');
    } catch (e: any) {
      showToast('Gagal menyimpan data bawaan: ' + (e?.message || 'Terjadi kesalahan'));
    }
  };

  // Restore to application default data
  const handleRestoreDefaults = () => {
    const restored = storageService.resetToFactoryDefaults();
    setSchool(restored.school);
    setTeachers(restored.teachers);
    setPrograms(restored.programs);
    if (activeProgram) {
      const found = restored.programs.find((p) => p.id === activeProgram.id);
      setActiveProgram(found || (restored.programs.length > 0 ? restored.programs[0] : null));
    }
    showToast('Aplikasi berhasil dipulihkan ke data bawaan.');
  };

  // Import full backup JSON
  const handleImportBackup = (
    newSchool: SchoolData,
    newTeachers: Teacher[],
    newPrograms: ProgramData[]
  ) => {
    setSchool(newSchool);
    setTeachers(newTeachers);
    setPrograms(newPrograms);
    if (newPrograms.length > 0) {
      setActiveProgram(newPrograms[0]);
    }
    showToast('Cadangan data berhasil dipulihkan!');
  };

  // Apply improvements from AI analysis
  const handleApplyAnalysisImprovement = (updates: Partial<ProgramData>) => {
    if (!activeProgram) return;
    const updated = {
      ...activeProgram,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateActiveProgram(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Main Sidebar (Bisa dibuka dan ditutup) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'editor' && !activeProgram && programs.length > 0) {
              setActiveProgram(programs[0]);
            }
            setActiveTab(tab);
          }}
          programCount={programs.length}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <Header
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            currentProgram={activeProgram}
            school={school}
            isSaving={isSaving}
            lastSavedTime={lastSavedTime}
            isEditorView={activeTab === 'editor'}
            onBackToList={() => setActiveTab('programs')}
            onOpenAnalysis={() => setIsAnalysisModalOpen(true)}
            onOpenPreview={() => handleOpenPreview()}
            onExportDocx={handleExportDocx}
            onPrint={handlePrint}
            onDeleteProgram={() => activeProgram && handleDeleteProgram(activeProgram.id)}
            onSetAsDefault={handleSetAsFactoryDefault}
          />

          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                programs={programs}
                school={school}
                onSelectProgram={handleSelectProgram}
                onStartNewWizard={() => setActiveTab('wizard')}
                onOpenTemplates={() => setActiveTab('templates')}
                onDuplicate={handleDuplicateProgram}
                onDelete={handleDeleteProgram}
                onPreview={handleOpenPreview}
              />
            )}

            {activeTab === 'programs' && (
              <ProgramListView
                programs={programs}
                school={school}
                onSelectProgram={handleSelectProgram}
                onStartNewWizard={() => setActiveTab('wizard')}
                onDuplicate={handleDuplicateProgram}
                onDelete={handleDeleteProgram}
                onPreview={handleOpenPreview}
              />
            )}

            {activeTab === 'wizard' && (
              <CreateProgramWizard
                school={school}
                onProgramCreated={handleProgramCreated}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesView
                school={school}
                onUseTemplate={handleUseTemplate}
              />
            )}

            {activeTab === 'school' && (
              <MasterSchoolView
                school={school}
                onSaveSchool={handleSaveSchool}
                onSetAsDefault={handleSetAsFactoryDefault}
                onRestoreDefaults={handleRestoreDefaults}
                onImportBackup={handleImportBackup}
                teachers={teachers}
                programs={programs}
              />
            )}

            {activeTab === 'teachers' && (
              <MasterTeachersView
                teachers={teachers}
                schoolName={school.namaSekolah}
                onSaveTeachers={handleSaveTeachers}
              />
            )}

            {activeTab === 'editor' && activeProgram && (
              <EditorView
                program={activeProgram}
                school={school}
                teachers={teachers}
                onUpdateProgram={handleUpdateActiveProgram}
                onOpenAnalysis={() => setIsAnalysisModalOpen(true)}
                onOpenPreview={() => handleOpenPreview()}
                onExportDocx={handleExportDocx}
                onPrint={handlePrint}
              />
            )}
          </main>
        </div>
      </div>

      {/* Document Preview Modal (A4 Print Ready & Checklist) */}
      {previewProgram && (
        <DocumentPreviewModal
          isOpen={Boolean(previewProgram)}
          onClose={() => setPreviewProgram(null)}
          program={previewProgram}
          school={school}
        />
      )}

      {/* AI Program Analysis Modal (10 Aspek Mutu & Persetujuan Perbaikan) */}
      {activeProgram && (
        <AiAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          program={activeProgram}
          onApplyImprovement={handleApplyAnalysisImprovement}
        />
      )}

      {/* Confirmation Modal for Deleting Program */}
      <ConfirmModal
        isOpen={Boolean(programToDelete)}
        title="Hapus Program Dokumen?"
        message={`Apakah Anda yakin ingin menghapus program "${programToDelete?.namaProgram || ''}"? Seluruh data 13 bab, jadwal, dan rincian pembiayaan pada dokumen ini akan dihapus secara permanen.`}
        confirmText="Ya, Hapus Program"
        cancelText="Batal"
        isDanger={true}
        onConfirm={handleConfirmDeleteProgram}
        onClose={() => setProgramToDelete(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

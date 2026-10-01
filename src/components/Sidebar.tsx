import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  Library,
  School,
  Users2,
  Sparkles,
  PanelLeftClose,
  ChevronLeft,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { TEMPLATES } from '../data/initialData';

export type NavTab =
  | 'dashboard'
  | 'programs'
  | 'wizard'
  | 'templates'
  | 'school'
  | 'teachers'
  | 'editor';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  programCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  programCount,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'school' as NavTab,
      label: 'Data Sekolah',
      icon: School,
      badge: null,
    },
    {
      id: 'teachers' as NavTab,
      label: 'Data Guru & Tendik',
      icon: Users2,
      badge: null,
    },
    {
      id: 'wizard' as NavTab,
      label: 'Buat Program',
      icon: FilePlus2,
      badge: 'Baru',
      highlight: true,
    },
    {
      id: 'programs' as NavTab,
      label: 'Program Saya',
      icon: FolderKanban,
      badge: programCount > 0 ? programCount : null,
    },
    {
      id: 'templates' as NavTab,
      label: 'Template Siap Pakai',
      icon: Library,
      badge: String(TEMPLATES.length),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 z-40 md:hidden backdrop-blur-xs transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-64 opacity-100 translate-x-0'
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 overflow-hidden pointer-events-none border-none'
        } fixed md:sticky`}
      >
        <div className="w-64 flex flex-col h-full overflow-hidden">
          {/* Brand Header with Close Button */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-900/30 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 truncate">
                  PROGRAMKU <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">SD</span>
                </h1>
                <p className="text-[10px] text-slate-400 truncate">Penyusun Program AI</p>
              </div>
            </div>

            {/* Close Toggle */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-1 cursor-pointer"
              title="Tutup Menu Bar (Ctrl+B)"
              aria-label="Tutup Menu Bar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Menu Utama
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${item.highlight && !isActive ? 'border border-indigo-500/40 bg-indigo-950/30 text-indigo-300' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : item.highlight
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sembunyikan Menu Action Button */}
          <div className="px-3 pt-2">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800 cursor-pointer"
              title="Tutup Menu Bar (Ctrl+B)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sembunyikan Menu Bar</span>
            </button>
          </div>

          {/* Target User Info & Guidance */}
          <div className="p-3.5 m-3 mb-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asisten Guru & Kepsek</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ketik masalah sekolah, klik <strong>✨ Bantu AI</strong>, dan perbaiki sesuai kondisi nyata SD Anda.
            </p>
          </div>

          {/* Pengembang Aplikasi Card & Link */}
          <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/90 border border-slate-700/70 text-xs">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Pengembang Aplikasi</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </div>
            <a
              href="https://www.gurumerangkum.com/?m=1"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
              title="Kunjungi Web Pengembang: Susilo Fitri Yatmoko, M.Pd"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors font-bold text-xs border border-indigo-500/30">
                SF
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                  Susilo Fitri Yatmoko, M.Pd
                </p>
                <p className="text-[10px] text-indigo-400 group-hover:underline truncate flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5 shrink-0" />
                  <span>gurumerangkum.com</span>
                </p>
              </div>
            </a>
          </div>

          {/* Version footer */}
          <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            Versi 2.4 Berbantuan AI • Standar SD
          </div>
        </div>
      </aside>
    </>
  );
};

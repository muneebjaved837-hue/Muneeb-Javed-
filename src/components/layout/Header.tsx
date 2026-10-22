import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  School as SchoolIcon, 
  Calendar,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  Bell,
  Users
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenJoinModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenJoinModal,
}) => {
  const { currentSchool, currentUser, switchRole, notifications } = useSchool();
  const [copied, setCopied] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSchool.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-tutor', label: 'LearnAI Tutor' },
    { id: 'subjects-notes', label: 'Notes & Study' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'report-card', label: 'Report Cards' },
    { id: 'calendar', label: 'Exams' },
    { id: 'teacher-ai', label: 'AI Quizzes' },
    { id: 'attendance', label: 'Attendance' },
  ];

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark with icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-1.5">
              <span>LearnAI Cloud</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                School
              </span>
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[190px]">
              {currentSchool.name}
            </span>
          </div>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 5-Role Switcher + School Code + User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* School Join Code Quick Copy Button */}
          <button
            onClick={handleCopyCode}
            title="Click to copy School Join Code"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
          >
            <span className="text-slate-400 font-sans text-[10px]">Code:</span>
            <span>{currentSchool.code}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* 5 Roles Switcher Dropdown */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            {(['super_admin', 'admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => {
              const isSelected = currentUser.role === r;
              const label =
                r === 'super_admin' ? 'Super Admin' : r === 'admin' ? 'Admin' : r === 'teacher' ? 'Teacher' : r === 'student' ? 'Student' : 'Parent';

              return (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    if (r === 'super_admin') {
                      setActiveTab('super-admin');
                    } else if (r === 'parent') {
                      setActiveTab('parent');
                    }
                  }}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all whitespace-nowrap ${
                    isSelected
                      ? r === 'super_admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : r === 'parent'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* In-app Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            title="Notifications"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Join / Switch School Button with OTP */}
          <button
            onClick={onOpenJoinModal}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>Join School</span>
          </button>

          {/* Current User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                currentUser.role === 'super_admin' ? 'bg-purple-700' : currentUser.role === 'parent' ? 'bg-indigo-700' : 'bg-slate-700'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out notification drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsNotifOpen(false);
        }}
      />
    </>
  );
};

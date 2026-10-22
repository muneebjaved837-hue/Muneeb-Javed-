import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  UserCheck,
  BookOpen,
  Bell,
  Video,
  CreditCard,
  Building,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  UserCheck2,
  GraduationCap,
  Clock,
  Award,
  FileText,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenJoinModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenJoinModal,
}) => {
  const {
    currentSchool,
    currentUser,
    schools,
    switchSchool,
    switchRole,
    resetAllData,
    liveClasses,
    notices,
    savedQuizzes,
    examEvents,
  } = useSchool();

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isParent = currentUser.role === 'parent';
  const liveCount = liveClasses.filter(c => c.schoolId === currentSchool.id && c.status === 'live').length;
  const examCount = examEvents.filter(e => e.schoolId === currentSchool.id).length;

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Role-based Dashboard',
    },
    {
      id: 'ai-tutor',
      label: 'LearnAI Interactive Tutor',
      icon: Sparkles,
      description: 'Urdu & English Doubt Solver',
      badge: 'AI Tutor',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'subjects-notes',
      label: 'Subjects & Chapter Notes',
      icon: FileText,
      description: 'Grade 5-12 Syllabus Notes',
    },
    {
      id: 'timetable',
      label: 'Timetable & Bell Schedule',
      icon: Clock,
      description: 'Daily Periods & Classes',
    },
    {
      id: 'report-card',
      label: 'Marks & Report Cards',
      icon: Award,
      description: 'Official Transcripts',
      badge: 'Results',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'parent',
      label: 'Parent / Guardian Portal',
      icon: Users,
      description: 'Child Progress & Fees',
      badge: isParent ? 'Active' : undefined,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'calendar',
      label: 'Exam & Event Calendar',
      icon: Calendar,
      description: 'Shared test schedules',
      badge: examCount > 0 ? `${examCount} scheduled` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'teacher-ai',
      label: 'AI Quiz & Paper Generator',
      icon: Sparkles,
      description: 'Teacher AI Quiz Engine',
      badge: 'Faculty',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'student-quiz',
      label: 'Practice & AI Doubts',
      icon: HelpCircle,
      description: 'Quiz solver & Bank',
    },
    {
      id: 'super-admin',
      label: 'Super Admin Controls',
      icon: ShieldAlert,
      description: 'Global quotas & schools',
      badge: isSuperAdmin ? 'Master' : undefined,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: UserCheck,
      description: 'Roll call register',
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: BookOpen,
      description: 'Coursework & grading',
    },
    {
      id: 'notices',
      label: 'Notice Board',
      icon: Bell,
      description: 'Broadcast notices',
    },
    {
      id: 'meet',
      label: 'Live Classes (Meet)',
      icon: Video,
      description: 'Virtual classrooms',
      badge: liveCount > 0 ? 'Live Now' : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'subscription',
      label: 'School Subscription',
      icon: CreditCard,
      description: 'Licensing & invoices',
    },
    {
      id: 'directory',
      label: 'Campus Directory',
      icon: Building,
      description: 'Faculty & Students',
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-57px)] sticky top-[57px] select-none">
      {/* School Header Box */}
      <div className="p-3.5 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Institution
          </span>
          <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
            {currentSchool.code}
          </span>
        </div>

        {/* School Dropdown Switcher */}
        <div className="relative group">
          <select
            value={currentSchool.id}
            onChange={(e) => switchSchool(e.target.value)}
            className="w-full text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md py-1.5 px-2 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-2 pointer-events-none text-slate-400">
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
          <button
            onClick={onOpenJoinModal}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            + Onboard / OTP
          </button>
          <span className="capitalize text-slate-400">
            Quota: <span className="font-mono text-slate-700">{currentSchool?.aiQuota?.quizzesGeneratedThisMonth ?? 0}/{currentSchool?.aiQuota?.monthlyQuizzesLimit ?? 150}</span>
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'super-admin' && currentUser.role !== 'super_admin') {
                  switchRole('super_admin');
                }
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded font-mono ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current Active Persona Strip */}
      <div className="p-3 mx-3 mb-2 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-1.5 mb-1">
          {currentUser.role === 'super_admin' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
          ) : currentUser.role === 'admin' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          ) : currentUser.role === 'teacher' ? (
            <UserCheck2 className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {currentUser.role === 'super_admin'
              ? 'Super Admin (You)'
              : currentUser.role === 'admin'
              ? 'School Admin'
              : currentUser.role === 'teacher'
              ? 'Teacher'
              : 'Student'}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-900 truncate">
          {currentUser.name}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          {currentUser.role === 'student'
            ? `${currentUser.grade || 'Grade 10-A'} · ${currentUser.isPaidStudent ? 'Paid (50 PKR)' : 'Free Plan'}`
            : currentUser.role === 'teacher'
            ? currentUser.subject || 'Faculty Lead'
            : currentUser.title || 'Platform Owner'}
        </div>
      </div>

      {/* Footer System Controls */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={resetAllData}
          title="Reset to default seeded demo state"
          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors py-1 px-1.5 rounded hover:bg-slate-100"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Data</span>
        </button>
        <span className="text-[10px] font-mono text-slate-400">EduPulse v3.0</span>
      </div>
    </aside>
  );
};

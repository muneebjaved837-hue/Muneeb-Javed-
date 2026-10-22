import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CAMPUS_IMAGE } from '../../data/mockData';
import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Video,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Sparkles,
  Zap,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface OverviewDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenJoinModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  setActiveTab,
  onOpenJoinModal,
}) => {
  const {
    currentSchool,
    currentUser,
    schools,
    users,
    savedQuizzes,
    examEvents,
    liveClasses,
    setActiveLiveModalClass,
    getStudentAttendanceStats,
  } = useSchool();

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSchool.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isStudent = currentUser.role === 'student';
  const isTeacher = currentUser.role === 'teacher';
  const isAdmin = currentUser.role === 'admin';
  const isParent = currentUser.role === 'parent';

  // Live class now
  const liveClassNow = liveClasses.find(
    (c) => c.schoolId === currentSchool.id && c.status === 'live'
  );

  // Next Upcoming Exam
  const upcomingExams = examEvents
    .filter((e) => e.schoolId === currentSchool.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = upcomingExams[0];

  // Student specific stats
  const studentStats = getStudentAttendanceStats(currentUser.id);

  // School Quota
  const quota = currentSchool?.aiQuota || {
    monthlyQuizzesLimit: 150,
    quizzesGeneratedThisMonth: 0,
  };

  return (
    <div className="space-y-6">
      {/* Hero Campus Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-6 sm:p-7">
        <img
          src={currentSchool.bannerUrl || CAMPUS_IMAGE}
          alt={currentSchool.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-blue-400">LearnAI School Cloud</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{currentSchool.code}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{currentSchool.plan} Tier</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              {currentSchool.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 italic">
              "{currentSchool.motto}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  School Invite Code
                </div>
                <div className="text-sm font-mono font-bold tracking-widest text-blue-400">
                  {currentSchool.code}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                title="Copy School Join Code"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              OTP Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* UPCOMING EXAM ALERT BANNER */}
      {nextExam && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Upcoming {nextExam.type.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-600">{nextExam.date} at {nextExam.startTime}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900">{nextExam.title} ({nextExam.room})</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('calendar')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Exam Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SUPER ADMIN OVERVIEW */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Total Enrolled Schools</span>
            <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums mt-1">
              {schools.length}
            </div>
            <button onClick={() => setActiveTab('super-admin')} className="text-[11px] text-purple-600 hover:underline">
              Manage schools &amp; quotas →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Database Quiz Bank</span>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
              {savedQuizzes.length}
            </div>
            <span className="text-[11px] text-slate-400">Curated by teachers</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Platform Users</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
              {users.length}
            </div>
            <span className="text-[11px] text-slate-400">Active accounts</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Free Access Overrides</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
              {schools.filter((s) => s.aiQuota?.freeAccessGranted).length}
            </div>
            <span className="text-[11px] text-slate-400">Extended campus passes</span>
          </div>
        </div>
      )}

      {/* SCHOOL ADMIN OVERVIEW */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Enrolled Students</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
              {currentSchool.stats.totalStudents}
            </div>
            <span className="text-[11px] text-slate-400">Active enrollment</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">School AI Quota</span>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
              {quota.quizzesGeneratedThisMonth} / {quota.monthlyQuizzesLimit}
            </div>
            <span className="text-[11px] text-slate-400">Quizzes generated this month</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Scheduled Exams</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
              {examEvents.filter((e) => e.schoolId === currentSchool.id).length}
            </div>
            <button onClick={() => setActiveTab('calendar')} className="text-[11px] text-blue-600 hover:underline block">
              Exam calendar →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Licensing Tier</span>
            <div className="text-2xl font-bold font-mono text-slate-900 capitalize mt-1">
              {currentSchool.plan}
            </div>
            <button onClick={() => setActiveTab('subscription')} className="text-[11px] text-blue-600 hover:underline block">
              Manage billing →
            </button>
          </div>
        </div>
      )}

      {/* PARENT / GUARDIAN OVERVIEW */}
      {isParent && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Child's Attendance</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
              96.5%
            </div>
            <button onClick={() => setActiveTab('parent')} className="text-[11px] text-blue-600 hover:underline block">
              View daily attendance →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Academic Standing</span>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
              A+ (2nd in Class)
            </div>
            <button onClick={() => setActiveTab('report-card')} className="text-[11px] text-blue-600 hover:underline block">
              View report card →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Monthly Tuition Fee</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
              3,500 PKR
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Status: Paid</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Class Teacher Contact</span>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate">
              Mrs. Sarah Jenkins
            </div>
            <button onClick={() => setActiveTab('parent')} className="text-[11px] text-purple-600 hover:underline block">
              Send direct message →
            </button>
          </div>
        </div>
      )}

      {/* TEACHER OVERVIEW */}
      {isTeacher && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">AI Quiz Generator</span>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
              Active
            </div>
            <button onClick={() => setActiveTab('teacher-ai')} className="text-[11px] text-blue-600 hover:underline block">
              Generate new test paper →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Saved Quizzes in Bank</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
              {savedQuizzes.filter((q) => q.schoolId === currentSchool.id).length}
            </div>
            <span className="text-[11px] text-slate-400">Zero-cost reusable bank</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Scheduled Tests / Exams</span>
            <div className="text-2xl font-bold font-mono text-purple-600 tabular-nums mt-1">
              {examEvents.filter((e) => e.schoolId === currentSchool.id).length}
            </div>
            <button onClick={() => setActiveTab('calendar')} className="text-[11px] text-blue-600 hover:underline block">
              Test calendar →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Google Meet Classes</span>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
              {liveClasses.length}
            </div>
            <button onClick={() => setActiveTab('meet')} className="text-[11px] text-blue-600 hover:underline block">
              Live timetable →
            </button>
          </div>
        </div>
      )}

      {/* STUDENT OVERVIEW */}
      {isStudent && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Chapter Quizzes Ready</span>
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
              {savedQuizzes.length}
            </div>
            <button onClick={() => setActiveTab('student-quiz')} className="text-[11px] text-blue-600 hover:underline block">
              Practice now →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Daily Live AI Quota</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
              {3 - (currentUser.liveAiDailyUsed || 0)} / 3
            </div>
            <span className="text-[11px] text-slate-400">Questions remaining today</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Next Scheduled Exam</span>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate">
              {nextExam ? nextExam.title : 'None this week'}
            </div>
            <button onClick={() => setActiveTab('calendar')} className="text-[11px] text-blue-600 hover:underline block">
              Check exam dates →
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Attendance Rating</span>
            <div className="text-2xl font-bold font-mono text-purple-600 tabular-nums mt-1">
              {studentStats.percentage}%
            </div>
            <span className="text-[11px] text-slate-400">Regular attendance</span>
          </div>
        </div>
      )}

      {/* 2-Column Split: AI Quiz Bank & Exam Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Quiz Bank Shortcut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Curated AI Chapter Quizzes</h2>
            </div>
            <button
              onClick={() => setActiveTab(isTeacher ? 'teacher-ai' : 'student-quiz')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>{isTeacher ? 'Generate with AI' : 'Solve Quizzes'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {savedQuizzes.slice(0, 3).map((quiz) => (
              <div
                key={quiz.id}
                className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{quiz.className}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{quiz.mcqs.length} MCQs</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-xs">{quiz.title}</h4>
                  <div className="text-[11px] text-slate-400 truncate">{quiz.chapterName}</div>
                </div>

                <button
                  onClick={() => setActiveTab(isTeacher ? 'teacher-ai' : 'student-quiz')}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg whitespace-nowrap"
                >
                  {isTeacher ? 'Inspect Paper' : 'Practice'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shared Exam Calendar Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Upcoming Test &amp; Event Timetable</h2>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingExams.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`font-bold text-[10px] uppercase ${
                        evt.type === 'exam' || evt.type === 'test' ? 'text-blue-700' : 'text-purple-700'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{evt.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.startTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-xs">{evt.title}</h4>
                  <div className="text-[11px] text-slate-400">Venue: {evt.room}</div>
                </div>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg whitespace-nowrap"
                >
                  View Syllabus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

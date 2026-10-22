/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ExamCalendarView } from './components/calendar/ExamCalendarView';
import { TeacherQuizGenerator } from './components/quiz/TeacherQuizGenerator';
import { StudentQuizView } from './components/quiz/StudentQuizView';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { AttendanceView } from './components/attendance/AttendanceView';
import { HomeworkView } from './components/homework/HomeworkView';
import { NoticeBoardView } from './components/notices/NoticeBoardView';
import { LiveClassView } from './components/meet/LiveClassView';
import { SubscriptionView } from './components/subscription/SubscriptionView';
import { DirectoryView } from './components/directory/DirectoryView';
import { SchoolJoinModal } from './components/school/SchoolJoinModal';
import { LearnAiTutorView } from './components/tutor/LearnAiTutorView';
import { SubjectsNotesView } from './components/subjects/SubjectsNotesView';
import { TimetableView } from './components/timetable/TimetableView';
import { ReportCardView } from './components/reportcard/ReportCardView';
import { ParentPortalView } from './components/parent/ParentPortalView';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Check URL query parameters for ?join=CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const joinParam = params.get('join');
      if (joinParam) {
        setIsJoinModalOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
        />

        {/* Viewport Content Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-full">
          {activeTab === 'overview' && (
            <OverviewDashboard
              setActiveTab={setActiveTab}
              onOpenJoinModal={() => setIsJoinModalOpen(true)}
            />
          )}
          {activeTab === 'ai-tutor' && <LearnAiTutorView />}
          {activeTab === 'subjects-notes' && (
            <SubjectsNotesView
              onStartQuizOnChapter={(subj, chap) => setActiveTab('student-quiz')}
              onAskTutorOnChapter={(subj, chap) => setActiveTab('ai-tutor')}
            />
          )}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'report-card' && <ReportCardView />}
          {activeTab === 'parent' && <ParentPortalView onNavigateToTab={setActiveTab} />}
          {activeTab === 'calendar' && <ExamCalendarView />}
          {activeTab === 'teacher-ai' && <TeacherQuizGenerator />}
          {activeTab === 'student-quiz' && <StudentQuizView />}
          {activeTab === 'super-admin' && <SuperAdminDashboard />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'homework' && <HomeworkView />}
          {activeTab === 'notices' && <NoticeBoardView />}
          {activeTab === 'meet' && <LiveClassView />}
          {activeTab === 'subscription' && <SubscriptionView />}
          {activeTab === 'directory' && <DirectoryView />}
        </main>
      </div>

      {/* School Join & OTP Authentication Modal */}
      <SchoolJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <MainApp />
    </SchoolProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  School,
  User,
  UserRole,
  AttendanceRecord,
  AttendanceStatus,
  Homework,
  HomeworkSubmission,
  Notice,
  LiveClass,
  LiveClassStatus,
  SubscriptionInvoice,
  ExamEvent,
  SavedQuiz,
  StudentQuizAttempt,
  SchoolAiQuota,
  TimetablePeriod,
  StudentReportCard,
  SubjectCurriculum,
  InAppNotification,
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTICES,
  INITIAL_LIVE_CLASSES,
  INITIAL_INVOICES,
  INITIAL_EXAM_EVENTS,
  INITIAL_SAVED_QUIZZES,
  INITIAL_TIMETABLE,
  INITIAL_REPORT_CARDS,
  INITIAL_CURRICULUM,
  INITIAL_NOTIFICATIONS,
  PLAN_CONFIGS,
} from '../data/mockData';

interface SchoolContextType {
  // Current session
  currentSchool: School;
  currentUser: User;
  schools: School[];
  users: User[];

  // Role & Session switching
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  switchSchool: (schoolId: string) => void;
  joinSchoolByCode: (code: string, role: UserRole, name?: string) => { success: boolean; message: string };
  createSchool: (data: { name: string; motto: string; address: string; logoColor?: string }) => School;

  // OTP Login Simulation
  generateOTP: (identifier: string) => string;
  verifyOTPLogin: (identifier: string, code: string, schoolCode: string, role: UserRole, name?: string) => { success: boolean; message: string };

  // Exam & Event Shared Calendar
  examEvents: ExamEvent[];
  createExamEvent: (event: Omit<ExamEvent, 'id' | 'schoolId' | 'createdBy'>) => ExamEvent;
  deleteExamEvent: (id: string) => void;

  // AI Quiz & Question Bank System (Very Important)
  savedQuizzes: SavedQuiz[];
  saveQuizToBank: (quiz: Omit<SavedQuiz, 'id' | 'schoolId' | 'createdAt' | 'timesSolved'>) => SavedQuiz;
  deleteQuizFromBank: (id: string) => void;
  quizAttempts: StudentQuizAttempt[];
  recordQuizAttempt: (attempt: Omit<StudentQuizAttempt, 'id' | 'completedAt'>) => void;

  // AI Doubts (Type A: Saved Database & Type B: Live AI with 3/day limit)
  askLiveAiDoubt: (question: string, subject: string, chapter: string, language?: 'en' | 'ur') => Promise<{ answer: string; remainingQuota: number; error?: string }>;
  searchSavedDatabaseDoubt: (query: string) => { question: string; answer: string; sourceQuiz: string }[];
  upgradeStudentToPaid: (studentId: string) => void;

  // Timetable
  timetable: TimetablePeriod[];
  // Official Report Cards
  reportCards: StudentReportCard[];
  // Subjects Curriculum & Study Notes
  curriculum: SubjectCurriculum[];
  // In-App Notifications
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Super Admin Platform Controls
  updateSchoolAiQuota: (schoolId: string, quota: Partial<SchoolAiQuota>) => void;
  toggleSchoolSuspension: (schoolId: string) => void;
  setSchoolFreeAccess: (schoolId: string, freeGranted: boolean, expiryDate: string) => void;
  addSchoolQuotaQuizzes: (schoolId: string, amount: number) => void;
  resetSchoolQuotaUsage: (schoolId: string) => void;
  deleteSchool: (schoolId: string) => void;
  updateSchoolPlan: (schoolId: string, plan: 'starter' | 'pro' | 'enterprise') => void;

  // Attendance
  attendance: AttendanceRecord[];
  markAttendance: (records: { studentId: string; status: AttendanceStatus; notes?: string }[], grade: string, date: string) => void;
  getAttendanceForDateAndGrade: (date: string, grade: string) => AttendanceRecord[];
  getStudentAttendanceStats: (studentId: string) => { total: number; present: number; absent: number; late: number; excused: number; percentage: number };

  // Homework
  homeworkList: Homework[];
  submissions: HomeworkSubmission[];
  createHomework: (data: Omit<Homework, 'id' | 'createdAt' | 'schoolId' | 'teacherId' | 'teacherName'>) => Homework;
  submitHomework: (homeworkId: string, notes?: string, fileName?: string, fileSize?: string) => void;
  gradeHomework: (submissionId: string, marks: number, feedback: string) => void;

  // Notices
  notices: Notice[];
  createNotice: (data: Omit<Notice, 'id' | 'date' | 'schoolId' | 'authorName' | 'authorRole'>) => void;
  togglePinNotice: (noticeId: string) => void;
  deleteNotice: (noticeId: string) => void;

  // Live Classes / Google Meet
  liveClasses: LiveClass[];
  createLiveClass: (data: Omit<LiveClass, 'id' | 'schoolId' | 'teacherId' | 'teacherName' | 'meetCode' | 'meetLink'>) => LiveClass;
  updateLiveClassStatus: (id: string, status: LiveClassStatus) => void;
  activeLiveModalClass: LiveClass | null;
  setActiveLiveModalClass: (cls: LiveClass | null) => void;

  // Subscription
  invoices: SubscriptionInvoice[];
  upgradeSubscription: (planId: 'starter' | 'pro' | 'enterprise', billing: 'monthly' | 'annual') => void;

  // System
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`edupulse_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`edupulse_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const DEFAULT_AI_QUOTA: SchoolAiQuota = {
  monthlyQuizzesLimit: 150,
  quizzesGeneratedThisMonth: 42,
  monthlyTokensLimit: 500000,
  tokensUsedThisMonth: 142000,
  freeTrialExpiry: '2027-01-01',
  isSuspended: false,
  freeAccessGranted: false,
};

export const normalizeSchool = (s: any): School => {
  if (!s) return INITIAL_SCHOOLS[0];
  return {
    ...s,
    stats: s.stats || { totalStudents: 348, totalTeachers: 28, totalClasses: 14 },
    aiQuota: {
      ...DEFAULT_AI_QUOTA,
      ...(s.aiQuota || {}),
    },
  };
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(() => {
    const stored = getStored('schools', INITIAL_SCHOOLS);
    return Array.isArray(stored) && stored.length > 0 ? stored.map(normalizeSchool) : INITIAL_SCHOOLS.map(normalizeSchool);
  });
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => getStored('currentSchoolId', INITIAL_SCHOOLS[0].id));
  const [users, setUsers] = useState<User[]>(() => {
    const stored = getStored('users', INITIAL_USERS);
    let userList: User[] = Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_USERS;
    const hasSuperAdmin = userList.some((u) => u.role === 'super_admin');
    if (!hasSuperAdmin) {
      const superUser = INITIAL_USERS.find((u) => u.role === 'super_admin') || {
        id: 'usr-super-admin',
        name: 'Zayd Al-Hassan',
        email: 'zayd.owner@edupulse.cloud',
        role: 'super_admin' as const,
        schoolId: 'school-oakridge',
        title: 'Platform Super Administrator & Owner',
        phone: '+1 (555) 000-1122',
        joinedAt: '2023-01-01',
      };
      userList = [superUser, ...userList];
    }
    const hasParent = userList.some((u) => u.role === 'parent');
    if (!hasParent) {
      const parentUser = INITIAL_USERS.find((u) => u.role === 'parent') || {
        id: 'usr-parent-1',
        name: 'Elena Rivera',
        email: 'elena.rivera@parents.oakridge.edu',
        role: 'parent' as const,
        schoolId: 'school-oakridge',
        title: 'Guardian (Parent of Alex Rivera)',
        childStudentId: 'usr-student-1',
        childStudentName: 'Alex Rivera',
        phone: '+1 (555) 902-1130',
        joinedAt: '2024-09-01',
      };
      userList = [parentUser, ...userList];
    }
    return userList;
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => getStored('currentUserId', INITIAL_USERS[0].id));

  // New Exam Events & Quizzes
  const [examEvents, setExamEvents] = useState<ExamEvent[]>(() => getStored('examEvents', INITIAL_EXAM_EVENTS));
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>(() => getStored('savedQuizzes', INITIAL_SAVED_QUIZZES));
  const [quizAttempts, setQuizAttempts] = useState<StudentQuizAttempt[]>(() => getStored('quizAttempts', []));

  // Timetable, Report Cards, Curriculum & Notifications
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(() => getStored('timetable', INITIAL_TIMETABLE));
  const [reportCards, setReportCards] = useState<StudentReportCard[]>(() => getStored('reportCards', INITIAL_REPORT_CARDS));
  const [curriculum, setCurriculum] = useState<SubjectCurriculum[]>(() => getStored('curriculum', INITIAL_CURRICULUM));
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => getStored('notifications', INITIAL_NOTIFICATIONS));

  // Core records
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStored('attendance', INITIAL_ATTENDANCE));
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => getStored('homework', INITIAL_HOMEWORK));
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => getStored('submissions', INITIAL_SUBMISSIONS));
  const [notices, setNotices] = useState<Notice[]>(() => getStored('notices', INITIAL_NOTICES));
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => getStored('liveClasses', INITIAL_LIVE_CLASSES));
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(() => getStored('invoices', INITIAL_INVOICES));

  const [activeLiveModalClass, setActiveLiveModalClass] = useState<LiveClass | null>(null);

  // Sync to localStorage
  useEffect(() => setStored('schools', schools), [schools]);
  useEffect(() => setStored('currentSchoolId', currentSchoolId), [currentSchoolId]);
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('currentUserId', currentUserId), [currentUserId]);
  useEffect(() => setStored('examEvents', examEvents), [examEvents]);
  useEffect(() => setStored('savedQuizzes', savedQuizzes), [savedQuizzes]);
  useEffect(() => setStored('quizAttempts', quizAttempts), [quizAttempts]);
  useEffect(() => setStored('timetable', timetable), [timetable]);
  useEffect(() => setStored('reportCards', reportCards), [reportCards]);
  useEffect(() => setStored('curriculum', curriculum), [curriculum]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('attendance', attendance), [attendance]);
  useEffect(() => setStored('homework', homeworkList), [homeworkList]);
  useEffect(() => setStored('submissions', submissions), [submissions]);
  useEffect(() => setStored('notices', notices), [notices]);
  useEffect(() => setStored('liveClasses', liveClasses), [liveClasses]);
  useEffect(() => setStored('invoices', invoices), [invoices]);

  const rawSchool = schools.find((s) => s.id === currentSchoolId) || schools[0] || INITIAL_SCHOOLS[0];
  const currentSchool = normalizeSchool(rawSchool);
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchSchool = (schoolId: string) => {
    const targetSchool = schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;
    setCurrentSchoolId(schoolId);
    const schoolUser = users.find((u) => u.schoolId === schoolId);
    if (schoolUser) {
      setCurrentUserId(schoolUser.id);
    }
  };

  const switchRole = (role: UserRole) => {
    if (role === 'super_admin') {
      let superAdmin = users.find((u) => u.role === 'super_admin');
      if (!superAdmin) {
        superAdmin = INITIAL_USERS.find((u) => u.role === 'super_admin') || {
          id: 'usr-super-admin',
          name: 'Zayd Al-Hassan',
          email: 'zayd.owner@edupulse.cloud',
          role: 'super_admin' as const,
          schoolId: 'school-oakridge',
          title: 'Platform Super Administrator & Owner',
          phone: '+1 (555) 000-1122',
          joinedAt: '2023-01-01',
        };
        setUsers((prev) => [superAdmin!, ...prev]);
      }
      setCurrentUserId(superAdmin.id);
      return;
    }

    if (role === 'parent') {
      let parentUser = users.find((u) => u.role === 'parent');
      if (!parentUser) {
        parentUser = INITIAL_USERS.find((u) => u.role === 'parent') || {
          id: 'usr-parent-1',
          name: 'Elena Rivera',
          email: 'elena.rivera@parents.oakridge.edu',
          role: 'parent' as const,
          schoolId: currentSchool.id,
          title: 'Guardian (Parent of Alex Rivera)',
          childStudentId: 'usr-student-1',
          childStudentName: 'Alex Rivera',
          phone: '+1 (555) 902-1130',
          joinedAt: '2024-09-01',
        };
        setUsers((prev) => [parentUser!, ...prev]);
      }
      setCurrentUserId(parentUser.id);
      return;
    }

    const matching = users.find((u) => u.schoolId === currentSchool.id && u.role === role);
    if (matching) {
      setCurrentUserId(matching.id);
    } else {
      const anyMatching = users.find((u) => u.role === role);
      if (anyMatching) {
        const updated = { ...anyMatching, schoolId: currentSchool.id };
        setUsers((prev) => prev.map((u) => (u.id === anyMatching.id ? updated : u)));
        setCurrentUserId(updated.id);
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const joinSchoolByCode = (code: string, role: UserRole, name?: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const foundSchool = schools.find((s) => s.code.toUpperCase() === cleanCode);
    if (!foundSchool) {
      return { success: false, message: `School with code "${cleanCode}" was not found.` };
    }

    const school = normalizeSchool(foundSchool);

    if (school.aiQuota?.isSuspended) {
      return { success: false, message: `Access to ${school.name} is currently suspended by Platform Administration.` };
    }

    const userName = name && name.trim() ? name.trim() : (role === 'student' ? 'Jordan Cole' : role === 'teacher' ? 'Prof. David Vance' : 'Administrator');
    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: userName,
      email: `${userName.toLowerCase().replace(/\s+/g, '.')}@${school.code.toLowerCase()}.edu`,
      role,
      schoolId: school.id,
      grade: role === 'student' ? 'Grade 10-A' : undefined,
      rollNumber: role === 'student' ? `${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      subject: role === 'teacher' ? 'General Curriculum' : undefined,
      title: role === 'admin' ? 'Campus Admin' : undefined,
      joinedAt: new Date().toISOString().split('T')[0],
      isPaidStudent: false,
      liveAiDailyUsed: 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentSchoolId(school.id);
    setCurrentUserId(newUserId);

    setSchools((prev) =>
      prev.map((s) =>
        s.id === school.id
          ? {
              ...s,
              stats: {
                ...s.stats,
                totalStudents: role === 'student' ? s.stats.totalStudents + 1 : s.stats.totalStudents,
                totalTeachers: role === 'teacher' ? s.stats.totalTeachers + 1 : s.stats.totalTeachers,
              },
            }
          : s
      )
    );

    return { success: true, message: `Successfully enrolled in ${school.name}!` };
  };

  // OTP Login Simulator
  const [activeOTPs, setActiveOTPs] = useState<Record<string, string>>({});

  const generateOTP = (identifier: string): string => {
    // Generate a clean 6-digit code e.g. "839201"
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOTPs((prev) => ({ ...prev, [identifier]: otp }));
    return otp;
  };

  const verifyOTPLogin = (
    identifier: string,
    code: string,
    schoolCode: string,
    role: UserRole,
    name?: string
  ): { success: boolean; message: string } => {
    const validOTP = activeOTPs[identifier] || '123456';
    if (code !== validOTP && code !== '123456') {
      return { success: false, message: 'Invalid OTP code. Please check and try again.' };
    }

    // Join or login
    return joinSchoolByCode(schoolCode, role, name || identifier);
  };

  const createSchool = (data: { name: string; motto: string; address: string; logoColor?: string }): School => {
    const id = `school-${Date.now()}`;
    const prefix = data.name.trim().replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'SCHL';
    const year = new Date().getFullYear();
    const code = `${prefix}-${year}`;

    const newSchool: School = {
      id,
      name: data.name.trim(),
      code,
      motto: data.motto.trim() || 'Inspiring Minds, Shaping Futures',
      address: data.address.trim() || 'Central Education Campus',
      plan: 'pro',
      planBilling: 'annual',
      createdAt: new Date().toISOString().split('T')[0],
      logoColor: data.logoColor || '#2563eb',
      stats: {
        totalStudents: 1,
        totalTeachers: 1,
        totalClasses: 3,
      },
      aiQuota: {
        monthlyQuizzesLimit: 150,
        quizzesGeneratedThisMonth: 0,
        monthlyTokensLimit: 500000,
        tokensUsedThisMonth: 0,
        freeTrialExpiry: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        isSuspended: false,
        freeAccessGranted: false,
      },
    };

    const adminUser: User = {
      id: `usr-admin-${Date.now()}`,
      name: 'Campus Administrator',
      email: `admin@${prefix.toLowerCase()}.edu`,
      role: 'admin',
      schoolId: id,
      title: 'Founding Director',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setSchools((prev) => [newSchool, ...prev]);
    setUsers((prev) => [adminUser, ...prev]);
    setCurrentSchoolId(id);
    setCurrentUserId(adminUser.id);

    return newSchool;
  };

  // -------------------------------------------------------------
  // Exam & Event Shared Calendar Operations
  // -------------------------------------------------------------
  const createExamEvent = (
    event: Omit<ExamEvent, 'id' | 'schoolId' | 'createdBy'>
  ): ExamEvent => {
    const newEvent: ExamEvent = {
      ...event,
      id: `cal-${Date.now()}`,
      schoolId: currentSchool.id,
      createdBy: currentUser.name,
    };
    setExamEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const deleteExamEvent = (id: string) => {
    setExamEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // -------------------------------------------------------------
  // AI Quiz & Question Bank System (Very Important)
  // -------------------------------------------------------------
  const saveQuizToBank = (
    quiz: Omit<SavedQuiz, 'id' | 'schoolId' | 'createdAt' | 'timesSolved'>
  ): SavedQuiz => {
    const newQuiz: SavedQuiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      schoolId: currentSchool.id,
      createdAt: new Date().toISOString().split('T')[0],
      timesSolved: 0,
    };

    // Update school AI quota
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== currentSchool.id) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: {
            ...currentQ,
            quizzesGeneratedThisMonth: (currentQ.quizzesGeneratedThisMonth || 0) + 1,
            tokensUsedThisMonth: (currentQ.tokensUsedThisMonth || 0) + 1500,
          },
        };
      })
    );

    setSavedQuizzes((prev) => [newQuiz, ...prev]);
    return newQuiz;
  };

  const deleteQuizFromBank = (id: string) => {
    setSavedQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const recordQuizAttempt = (attempt: Omit<StudentQuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: StudentQuizAttempt = {
      ...attempt,
      id: `att-${Date.now()}`,
      completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setQuizAttempts((prev) => [newAttempt, ...prev]);

    // Increment times solved
    setSavedQuizzes((prev) =>
      prev.map((q) => (q.id === attempt.quizId ? { ...q, timesSolved: q.timesSolved + 1 } : q))
    );
  };

  // -------------------------------------------------------------
  // AI Doubts: Type A (Saved Database) & Type B (Live AI)
  // -------------------------------------------------------------
  const searchSavedDatabaseDoubt = (query: string) => {
    if (!query.trim()) return [];
    const qLower = query.toLowerCase();
    const results: { question: string; answer: string; sourceQuiz: string }[] = [];

    savedQuizzes.forEach((sq) => {
      // Check MCQs
      sq.mcqs.forEach((m) => {
        if (m.question.toLowerCase().includes(qLower) || m.explanation.toLowerCase().includes(qLower)) {
          results.push({
            question: m.question,
            answer: `Correct Option: "${m.options[m.correctOptionIndex]}". Explanation: ${m.explanation}`,
            sourceQuiz: `${sq.title} (${sq.chapterName})`,
          });
        }
      });
      // Check short questions
      sq.shortQuestions.forEach((s) => {
        if (s.question.toLowerCase().includes(qLower) || s.modelAnswer.toLowerCase().includes(qLower)) {
          results.push({
            question: s.question,
            answer: s.modelAnswer,
            sourceQuiz: `${sq.title} (${sq.chapterName})`,
          });
        }
      });
      // Check difficult questions
      sq.difficultQuestions.forEach((d) => {
        if (d.question.toLowerCase().includes(qLower) || d.modelAnswer.toLowerCase().includes(qLower)) {
          results.push({
            question: d.question,
            answer: `Hint: ${d.solutionHint} | Solution: ${d.modelAnswer}`,
            sourceQuiz: `${sq.title} (${sq.chapterName})`,
          });
        }
      });
    });

    return results.slice(0, 5);
  };

  const askLiveAiDoubt = async (
    question: string,
    subject: string,
    chapter: string,
    language: 'en' | 'ur' = 'en'
  ): Promise<{ answer: string; remainingQuota: number; error?: string }> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentUsed = currentUser.lastAiDate === todayStr ? (currentUser.liveAiDailyUsed || 0) : 0;

    // Check if user is paid student
    if (!currentUser.isPaidStudent) {
      return {
        answer: '',
        remainingQuota: 0,
        error: 'Live AI is reserved for Paid Students (50 PKR plan). Free users have access to our entire Saved Database Question Bank!',
      };
    }

    // Check daily 3 questions limit
    if (currentUsed >= 3) {
      return {
        answer: '',
        remainingQuota: 0,
        error: 'Daily limit reached (3/3 questions used today). Please use our instant database questions or try tomorrow!',
      };
    }

    try {
      const res = await fetch('/api/ai/student-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          subject,
          chapter,
          grade: currentUser.grade || 'Grade 10',
          language,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to solve doubt');
      }

      // Increment student live AI usage
      const newUsed = currentUsed + 1;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, liveAiDailyUsed: newUsed, lastAiDate: todayStr }
            : u
        )
      );

      return {
        answer: data.answer,
        remainingQuota: 3 - newUsed,
      };
    } catch (err: any) {
      return {
        answer: '',
        remainingQuota: 3 - currentUsed,
        error: err.message || 'Connection error',
      };
    }
  };

  const upgradeStudentToPaid = (studentId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === studentId ? { ...u, isPaidStudent: true, liveAiDailyUsed: 0 } : u))
    );
  };

  // -------------------------------------------------------------
  // Super Admin Platform Controls
  // -------------------------------------------------------------
  const updateSchoolAiQuota = (schoolId: string, quota: Partial<SchoolAiQuota>) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: { ...currentQ, ...quota },
        };
      })
    );
  };

  const toggleSchoolSuspension = (schoolId: string) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: { ...currentQ, isSuspended: !currentQ.isSuspended },
        };
      })
    );
  };

  const setSchoolFreeAccess = (schoolId: string, freeGranted: boolean, expiryDate: string) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: {
            ...currentQ,
            freeAccessGranted: freeGranted,
            freeTrialExpiry: expiryDate,
          },
        };
      })
    );
  };

  const addSchoolQuotaQuizzes = (schoolId: string, amount: number) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: {
            ...currentQ,
            monthlyQuizzesLimit: Math.max(0, currentQ.monthlyQuizzesLimit + amount),
          },
        };
      })
    );
  };

  const resetSchoolQuotaUsage = (schoolId: string) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        const currentQ = s.aiQuota || DEFAULT_AI_QUOTA;
        return {
          ...s,
          aiQuota: {
            ...currentQ,
            quizzesGeneratedThisMonth: 0,
            tokensUsedThisMonth: 0,
          },
        };
      })
    );
  };

  const deleteSchool = (schoolId: string) => {
    setSchools((prev) => {
      const filtered = prev.filter((s) => s.id !== schoolId);
      return filtered.length > 0 ? filtered : INITIAL_SCHOOLS;
    });
    if (currentSchoolId === schoolId) {
      const fallback = schools.find((s) => s.id !== schoolId) || INITIAL_SCHOOLS[0];
      setCurrentSchoolId(fallback.id);
    }
  };

  const updateSchoolPlan = (schoolId: string, plan: 'starter' | 'pro' | 'enterprise') => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s;
        return {
          ...s,
          plan,
        };
      })
    );
  };

  // Attendance
  const markAttendance = (
    records: { studentId: string; status: AttendanceStatus; notes?: string }[],
    grade: string,
    date: string
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) => {
      const existingOther = prev.filter(
        (r) => !(r.schoolId === currentSchool.id && r.date === date && r.grade === grade)
      );

      const newRecords: AttendanceRecord[] = records.map((rec) => {
        const student = users.find((u) => u.id === rec.studentId);
        return {
          id: `att-${Date.now()}-${rec.studentId}`,
          schoolId: currentSchool.id,
          studentId: rec.studentId,
          studentName: student ? student.name : 'Unknown Student',
          rollNumber: student?.rollNumber || 'N/A',
          grade,
          date,
          status: rec.status,
          notes: rec.notes,
          markedBy: currentUser.name,
          timeMarked: nowTime,
        };
      });

      return [...newRecords, ...existingOther];
    });
  };

  const getAttendanceForDateAndGrade = (date: string, grade: string): AttendanceRecord[] => {
    return attendance.filter(
      (r) => r.schoolId === currentSchool.id && r.date === date && r.grade === grade
    );
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendance.filter(
      (r) => r.schoolId === currentSchool.id && r.studentId === studentId
    );
    const total = studentRecords.length;
    if (total === 0) {
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, percentage: 100 };
    }
    const present = studentRecords.filter((r) => r.status === 'present').length;
    const late = studentRecords.filter((r) => r.status === 'late').length;
    const excused = studentRecords.filter((r) => r.status === 'excused').length;
    const absent = studentRecords.filter((r) => r.status === 'absent').length;

    const effectivePresent = present + excused + late * 0.75;
    const percentage = Math.round((effectivePresent / total) * 100);

    return { total, present, absent, late, excused, percentage };
  };

  // Homework
  const createHomework = (
    data: Omit<Homework, 'id' | 'createdAt' | 'schoolId' | 'teacherId' | 'teacherName'>
  ): Homework => {
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now()}`,
      schoolId: currentSchool.id,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHomeworkList((prev) => [newHw, ...prev]);
    return newHw;
  };

  const submitHomework = (homeworkId: string, notes?: string, fileName?: string, fileSize?: string) => {
    const existingIndex = submissions.findIndex(
      (s) => s.homeworkId === homeworkId && s.studentId === currentUser.id
    );

    const submission: HomeworkSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      homeworkId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      grade: currentUser.grade || 'Grade 10-A',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: notes || 'Submitted by student via portal',
      fileName: fileName || `${currentUser.name.replace(/\s+/g, '_')}_Assignment.pdf`,
      fileSize: fileSize || '2.4 MB',
      fileUrl: '#',
      status: 'submitted',
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => prev.map((s, idx) => (idx === existingIndex ? submission : s)));
    } else {
      setSubmissions((prev) => [submission, ...prev]);
    }
  };

  const gradeHomework = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              marksObtained: marks,
              feedback,
              gradedBy: currentUser.name,
              gradedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              status: 'graded',
            }
          : s
      )
    );
  };

  // Notices
  const createNotice = (
    data: Omit<Notice, 'id' | 'date' | 'schoolId' | 'authorName' | 'authorRole'>
  ) => {
    const newNotice: Notice = {
      ...data,
      id: `not-${Date.now()}`,
      schoolId: currentSchool.id,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'admin' ? 'Principal / Admin' : 'Senior Teacher',
      date: new Date().toISOString().split('T')[0],
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const togglePinNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };

  // Live Classes
  const createLiveClass = (
    data: Omit<LiveClass, 'id' | 'schoolId' | 'teacherId' | 'teacherName' | 'meetCode' | 'meetLink'>
  ): LiveClass => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randPart = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const meetCode = `${randPart(3)}-${randPart(4)}-${randPart(3)}`;
    const meetLink = `https://meet.google.com/${meetCode}`;

    const newClass: LiveClass = {
      ...data,
      id: `live-${Date.now()}`,
      schoolId: currentSchool.id,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      meetCode,
      meetLink,
      attendeesCount: 0,
    };

    setLiveClasses((prev) => [newClass, ...prev]);
    return newClass;
  };

  const updateLiveClassStatus = (id: string, status: LiveClassStatus) => {
    setLiveClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Subscription
  const upgradeSubscription = (
    planId: 'starter' | 'pro' | 'enterprise',
    billing: 'monthly' | 'annual'
  ) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === currentSchool.id ? { ...s, plan: planId, planBilling: billing } : s))
    );

    const planConfig = PLAN_CONFIGS[planId];
    const amount = billing === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;

    if (amount > 0) {
      const newInvoice: SubscriptionInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        planName: `${planConfig.name} (${billing === 'annual' ? 'Annual' : 'Monthly'})`,
        status: 'paid',
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setSchools(INITIAL_SCHOOLS);
    setCurrentSchoolId(INITIAL_SCHOOLS[0].id);
    setUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setAttendance(INITIAL_ATTENDANCE);
    setHomeworkList(INITIAL_HOMEWORK);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotices(INITIAL_NOTICES);
    setLiveClasses(INITIAL_LIVE_CLASSES);
    setInvoices(INITIAL_INVOICES);
    setExamEvents(INITIAL_EXAM_EVENTS);
    setSavedQuizzes(INITIAL_SAVED_QUIZZES);
    setQuizAttempts([]);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentSchool,
        currentUser,
        schools,
        users,
        setCurrentUser: (u) => setCurrentUserId(u.id),
        switchRole,
        switchSchool,
        joinSchoolByCode,
        createSchool,
        generateOTP,
        verifyOTPLogin,

        examEvents,
        createExamEvent,
        deleteExamEvent,

        savedQuizzes,
        saveQuizToBank,
        deleteQuizFromBank,
        quizAttempts,
        recordQuizAttempt,

        askLiveAiDoubt,
        searchSavedDatabaseDoubt,
        upgradeStudentToPaid,

        timetable,
        reportCards,
        curriculum,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        updateSchoolAiQuota,
        toggleSchoolSuspension,
        setSchoolFreeAccess,
        addSchoolQuotaQuizzes,
        resetSchoolQuotaUsage,
        deleteSchool,
        updateSchoolPlan,

        attendance,
        markAttendance,
        getAttendanceForDateAndGrade,
        getStudentAttendanceStats,

        homeworkList,
        submissions,
        createHomework,
        submitHomework,
        gradeHomework,

        notices,
        createNotice,
        togglePinNotice,
        deleteNotice,

        liveClasses,
        createLiveClass,
        updateLiveClassStatus,
        activeLiveModalClass,
        setActiveLiveModalClass,

        invoices,
        upgradeSubscription,

        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent';

export interface SchoolAiQuota {
  monthlyQuizzesLimit: number;
  quizzesGeneratedThisMonth: number;
  monthlyTokensLimit: number;
  tokensUsedThisMonth: number;
  freeTrialExpiry: string; // YYYY-MM-DD
  isSuspended: boolean;
  freeAccessGranted: boolean;
}

export interface School {
  id: string;
  name: string;
  code: string; // e.g. "OAKR-2026"
  motto: string;
  address: string;
  plan: 'starter' | 'pro' | 'enterprise';
  planBilling: 'monthly' | 'annual';
  createdAt: string;
  logoColor: string;
  bannerUrl?: string;
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
  };
  aiQuota: SchoolAiQuota;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
  avatar?: string;
  grade?: string; // For students e.g. "Grade 10-A"
  rollNumber?: string; // For students
  subject?: string; // For teachers e.g. "Biology & AP Science"
  title?: string; // For admin e.g. "Principal / Academic Director"
  phone?: string;
  joinedAt: string;
  // Student AI subscription & daily live AI limit
  isPaidStudent?: boolean; // 50 PKR subscription
  liveAiDailyUsed?: number; // 0 to 3
  lastAiDate?: string; // YYYY-MM-DD
  // For parents / guardians
  childStudentId?: string;
  childStudentName?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
  timeMarked: string;
}

export interface HomeworkAttachment {
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface Homework {
  id: string;
  schoolId: string;
  title: string;
  subject: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // e.g. "23:59"
  description: string;
  maxMarks: number;
  attachments?: HomeworkAttachment[];
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  grade: string;
  submittedAt: string;
  notes?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded';
}

export type NoticePriority = 'urgent' | 'exam' | 'event' | 'general';
export type NoticeAudience = 'all' | 'teachers' | 'students';

export interface Notice {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  priority: NoticePriority;
  targetAudience: NoticeAudience;
  authorName: string;
  authorRole: string;
  date: string; // YYYY-MM-DD
  pinned: boolean;
  department?: string;
}

export type LiveClassStatus = 'live' | 'upcoming' | 'completed';

export interface LiveClass {
  id: string;
  schoolId: string;
  title: string;
  subject: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm e.g. "10:00"
  endTime: string; // HH:mm e.g. "10:45"
  durationMinutes: number;
  meetLink: string;
  meetCode: string;
  status: LiveClassStatus;
  description: string;
  agendaItems?: string[];
  attendeesCount?: number;
}

export interface SubscriptionInvoice {
  id: string;
  date: string;
  amount: number;
  planName: string;
  status: 'paid' | 'pending';
  invoiceNumber: string;
  downloadUrl?: string;
}

export interface PlanConfig {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  googleMeetEnabled: boolean;
  prioritySupport: boolean;
  attendanceReports: boolean;
  customDomain: boolean;
}

// -------------------------------------------------------------
// NEW: Exam & Event Shared Calendar System
// -------------------------------------------------------------
export type CalendarEventType = 'exam' | 'test' | 'quiz' | 'event' | 'holiday';

export interface ExamEvent {
  id: string;
  schoolId: string;
  title: string;
  type: CalendarEventType;
  subject?: string;
  grade: string; // e.g. "Grade 10-A" or "All Campus"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "11:30"
  room: string; // e.g. "Hall B" or "Main Auditorium"
  syllabus: string;
  maxMarks?: number;
  createdBy: string;
}

// -------------------------------------------------------------
// NEW: AI Quiz & Curriculum Bank System
// -------------------------------------------------------------
export interface MCQOption {
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ShortQuestion {
  id: string;
  question: string;
  modelAnswer: string;
  marks: number;
}

export interface LongQuestion {
  id: string;
  question: string;
  markingScheme: string[];
  marks: number;
}

export interface DifficultQuestion {
  id: string;
  question: string;
  solutionHint: string;
  modelAnswer: string;
  marks: number;
}

export interface SavedQuiz {
  id: string;
  schoolId: string;
  title: string;
  bookName: string;
  author: string;
  publisher: string;
  className: string;
  chapterName: string;
  createdByTeacherName: string;
  createdAt: string;
  mcqs: MCQQuestion[];
  shortQuestions: ShortQuestion[];
  longQuestions: LongQuestion[];
  difficultQuestions: DifficultQuestion[];
  timesSolved: number;
}

export interface StudentQuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  completedAt: string;
  selectedAnswers: Record<string, number>;
}

// -------------------------------------------------------------
// NEW: Timetable & Periods System
// -------------------------------------------------------------
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetablePeriod {
  id: string;
  schoolId: string;
  day: DayOfWeek;
  periodNumber: number;
  timeRange: string; // e.g. "08:30 - 09:15"
  subject: string;
  teacherName: string;
  room: string;
  grade: string;
}

// -------------------------------------------------------------
// NEW: Official Examination Marks & Report Card System
// -------------------------------------------------------------
export interface SubjectMark {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string; // "A+", "A", "B", etc.
  remarks: string;
}

export interface StudentReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  term: string; // e.g. "Mid-Term Examination 2026"
  issueDate: string;
  subjectMarks: SubjectMark[];
  totalMarks: number;
  totalObtained: number;
  percentage: number;
  overallGrade: string;
  rankInClass: number;
  totalStudentsInClass: number;
  attendancePercentage: number;
  principalRemarks: string;
  classTeacherRemarks: string;
}

// -------------------------------------------------------------
// NEW: Subjects & Notes Study Material System
// -------------------------------------------------------------
export interface StudyNoteChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  importantDefinitions: { term: string; definition: string }[];
  formulas?: string[];
  solvedQnAs: { question: string; answer: string; type: 'short' | 'long' }[];
  pdfAvailable?: boolean;
}

export interface SubjectCurriculum {
  id: string;
  code: string;
  name: string;
  urduName?: string;
  category: 'sciences' | 'humanities' | 'languages' | 'tech';
  iconName: string;
  color: string;
  chapters: StudyNoteChapter[];
}

// -------------------------------------------------------------
// NEW: In-App Notifications
// -------------------------------------------------------------
export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'homework' | 'exam' | 'attendance' | 'notice' | 'ai';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | 'all';
}

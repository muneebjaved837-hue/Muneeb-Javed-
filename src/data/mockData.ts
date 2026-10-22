import {
  School,
  User,
  AttendanceRecord,
  Homework,
  HomeworkSubmission,
  Notice,
  LiveClass,
  SubscriptionInvoice,
  PlanConfig,
  ExamEvent,
  SavedQuiz,
  TimetablePeriod,
  StudentReportCard,
  SubjectCurriculum,
  InAppNotification,
} from '../types';

export const CAMPUS_IMAGE = '/src/assets/images/school_campus_exterior_1792662153743.jpg';
export const ADMIN_AVATAR = '/src/assets/images/avatar_principal_admin_1792662153897.jpg';
export const TEACHER_AVATAR = '/src/assets/images/avatar_teacher_science_1792662154266.jpg';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-oakridge',
    name: 'Oakridge International Academy',
    code: 'OAKR-2026',
    motto: 'Excellence in Knowledge, Character, and Innovation',
    address: '440 Highland Parkway, Cambridge, MA',
    plan: 'pro',
    planBilling: 'annual',
    createdAt: '2023-08-15',
    logoColor: '#2563eb',
    bannerUrl: CAMPUS_IMAGE,
    stats: {
      totalStudents: 348,
      totalTeachers: 28,
      totalClasses: 14,
    },
    aiQuota: {
      monthlyQuizzesLimit: 150,
      quizzesGeneratedThisMonth: 42,
      monthlyTokensLimit: 500000,
      tokensUsedThisMonth: 142000,
      freeTrialExpiry: '2027-01-01',
      isSuspended: false,
      freeAccessGranted: false,
    },
  },
  {
    id: 'school-stjude',
    name: 'St. Jude Collegiate Institute',
    code: 'SJCA-9102',
    motto: 'Truth, Service, and Academic Distinction',
    address: '120 Cathedral Square, Boston, MA',
    plan: 'starter',
    planBilling: 'monthly',
    createdAt: '2024-01-10',
    logoColor: '#059669',
    stats: {
      totalStudents: 120,
      totalTeachers: 12,
      totalClasses: 6,
    },
    aiQuota: {
      monthlyQuizzesLimit: 25,
      quizzesGeneratedThisMonth: 18,
      monthlyTokensLimit: 100000,
      tokensUsedThisMonth: 82000,
      freeTrialExpiry: '2026-11-30',
      isSuspended: false,
      freeAccessGranted: true,
    },
  },
];

export const INITIAL_USERS: User[] = [
  // Super Admin (Platform Owner)
  {
    id: 'usr-super-admin',
    name: 'Zayd Al-Hassan',
    email: 'zayd.owner@edupulse.cloud',
    role: 'super_admin',
    schoolId: 'school-oakridge',
    title: 'Platform Super Administrator & Owner',
    phone: '+1 (555) 000-1122',
    joinedAt: '2023-01-01',
  },
  // School Admin
  {
    id: 'usr-admin-1',
    name: 'Dr. Evelyn Vance',
    email: 'principal.vance@oakridge.edu',
    role: 'admin',
    schoolId: 'school-oakridge',
    avatar: ADMIN_AVATAR,
    title: 'Principal & Executive Director',
    phone: '+1 (555) 234-9981',
    joinedAt: '2023-08-15',
  },
  // Teachers
  {
    id: 'usr-teacher-1',
    name: 'Mrs. Sarah Jenkins',
    email: 's.jenkins@oakridge.edu',
    role: 'teacher',
    schoolId: 'school-oakridge',
    avatar: TEACHER_AVATAR,
    subject: 'Biology & Advanced Life Sciences',
    phone: '+1 (555) 887-2194',
    joinedAt: '2023-09-01',
  },
  {
    id: 'usr-teacher-2',
    name: 'Mr. Marcus Vance',
    email: 'm.vance@oakridge.edu',
    role: 'teacher',
    schoolId: 'school-oakridge',
    subject: 'Pure Mathematics & Calculus',
    phone: '+1 (555) 341-9988',
    joinedAt: '2023-09-01',
  },
  // Students
  {
    id: 'usr-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.oakridge.edu',
    role: 'student',
    schoolId: 'school-oakridge',
    grade: 'Grade 10-A',
    rollNumber: '1042',
    phone: '+1 (555) 902-1132',
    joinedAt: '2024-09-01',
    isPaidStudent: true, // 50 PKR paid subscription
    liveAiDailyUsed: 1, // 1 used out of 3 today
    lastAiDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'usr-student-2',
    name: 'Maya Lin',
    email: 'maya.lin@student.oakridge.edu',
    role: 'student',
    schoolId: 'school-oakridge',
    grade: 'Grade 10-A',
    rollNumber: '1043',
    joinedAt: '2024-09-01',
    isPaidStudent: false, // Free user
    liveAiDailyUsed: 0,
  },
  {
    id: 'usr-student-3',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@student.oakridge.edu',
    role: 'student',
    schoolId: 'school-oakridge',
    grade: 'Grade 10-A',
    rollNumber: '1044',
    joinedAt: '2024-09-01',
    isPaidStudent: true,
    liveAiDailyUsed: 3,
  },
  {
    id: 'usr-student-4',
    name: 'Liam Chen',
    email: 'liam.chen@student.oakridge.edu',
    role: 'student',
    schoolId: 'school-oakridge',
    grade: 'Grade 10-A',
    rollNumber: '1045',
    joinedAt: '2024-09-01',
  },
  {
    id: 'usr-student-5',
    name: 'Sophia Morales',
    email: 'sophia.m@student.oakridge.edu',
    role: 'student',
    schoolId: 'school-oakridge',
    grade: 'Grade 10-A',
    rollNumber: '1046',
    joinedAt: '2024-09-01',
  },
  // Parent / Guardian
  {
    id: 'usr-parent-1',
    name: 'Elena Rivera',
    email: 'elena.rivera@parents.oakridge.edu',
    role: 'parent',
    schoolId: 'school-oakridge',
    title: 'Guardian (Parent of Alex Rivera)',
    childStudentId: 'usr-student-1',
    childStudentName: 'Alex Rivera',
    phone: '+1 (555) 902-1130',
    joinedAt: '2024-09-01',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoDate = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeekDate = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
const inTwoWeeksDate = new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0];

// -------------------------------------------------------------
// EXAM & EVENT CALENDAR SEEDED DATA
// -------------------------------------------------------------
export const INITIAL_EXAM_EVENTS: ExamEvent[] = [
  {
    id: 'cal-1',
    schoolId: 'school-oakridge',
    title: 'Mid-Term 1: Advanced Biology Examination',
    type: 'exam',
    subject: 'Biology',
    grade: 'Grade 10-A',
    date: tomorrowDate,
    startTime: '09:00',
    endTime: '11:00',
    room: 'Main Examination Hall A',
    syllabus: 'Chapters 4–7: Cellular Energetics, Glycolysis, Krebs Cycle, Photosystem II, Electron Transport Chain.',
    maxMarks: 100,
    createdBy: 'Mrs. Sarah Jenkins',
  },
  {
    id: 'cal-2',
    schoolId: 'school-oakridge',
    title: 'Class Diagnostic Test: Quadratic Equations',
    type: 'test',
    subject: 'Mathematics',
    grade: 'Grade 10-A',
    date: nextWeekDate,
    startTime: '10:30',
    endTime: '11:30',
    room: 'Room 204 (Math Wing)',
    syllabus: 'Discriminant analysis, vertex form transformation, parabolic trajectories in physics.',
    maxMarks: 40,
    createdBy: 'Mr. Marcus Vance',
  },
  {
    id: 'cal-3',
    schoolId: 'school-oakridge',
    title: 'Annual STEM Science Fair & Exhibition',
    type: 'event',
    grade: 'All Campus',
    date: inTwoWeeksDate,
    startTime: '08:30',
    endTime: '15:30',
    room: 'Campus Green & Quadrangle',
    syllabus: 'All student projects in robotics, hydroponics, environmental science, and bioengineering.',
    createdBy: 'Dr. Evelyn Vance',
  },
  {
    id: 'cal-4',
    schoolId: 'school-oakridge',
    title: 'Term 1 Parent-Teacher Academic Conference',
    type: 'event',
    grade: 'All Campus',
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '18:00',
    room: 'Auditorium & Classrooms',
    syllabus: 'Review of student attendance, midterm readiness, and personalized study feedback.',
    createdBy: 'Dr. Evelyn Vance',
  },
];

// -------------------------------------------------------------
// SAVED QUIZZES DATABASE (ZERO-COST REUSABLE QUIZ BANK)
// -------------------------------------------------------------
export const INITIAL_SAVED_QUIZZES: SavedQuiz[] = [
  {
    id: 'quiz-bio-ch9',
    schoolId: 'school-oakridge',
    title: 'Cellular Respiration & ATP Synthase Mastery',
    bookName: 'Campbell Biology (12th Edition)',
    author: 'Lisa A. Urry, Michael L. Cain',
    publisher: 'Pearson Education',
    className: 'Grade 10-A',
    chapterName: 'Chapter 9: Cellular Respiration and Fermentation',
    createdByTeacherName: 'Mrs. Sarah Jenkins',
    createdAt: '2026-10-18',
    timesSolved: 14,
    mcqs: [
      {
        id: 'q1',
        question: 'What is the primary role of NAD+ in glycolysis and the citric acid cycle?',
        options: [
          'It acts as an electron acceptor that gets reduced to NADH',
          'It phosphorylates ADP directly into ATP',
          'It hydrolyzes glucose into pyruvate without enzymes',
          'It buffers intracellular lactic acid accumulation',
        ],
        correctOptionIndex: 0,
        explanation: 'NAD+ serves as an essential oxidizing agent by accepting high-energy electrons and transferring them to the electron transport chain.',
        difficulty: 'medium',
      },
      {
        id: 'q2',
        question: 'Across which membrane is the proton gradient established during oxidative phosphorylation?',
        options: [
          'Inner mitochondrial membrane into the intermembrane space',
          'Outer mitochondrial membrane into the cytoplasm',
          'Nuclear envelope into the nucleoplasm',
          'Endoplasmic reticulum lumen',
        ],
        correctOptionIndex: 0,
        explanation: 'Complexes I, III, and IV pump H+ ions from the mitochondrial matrix into the intermembrane space, generating chemiosmotic potential.',
        difficulty: 'hard',
      },
      {
        id: 'q3',
        question: 'Under anaerobic conditions in yeast cells, pyruvate is converted into which primary end product?',
        options: [
          'Ethanol and Carbon Dioxide (CO2)',
          'Lactate and Water',
          'Acetyl-CoA directly',
          'Citrate and Malate',
        ],
        correctOptionIndex: 0,
        explanation: 'Alcoholic fermentation decarboxylates pyruvate to acetaldehyde, then reduces it to ethanol, regenerating NAD+.',
        difficulty: 'easy',
      },
    ],
    shortQuestions: [
      {
        id: 'sq1',
        question: 'Explain why the inner mitochondrial membrane is folded into cristae.',
        modelAnswer: 'The extensive folding of cristae dramatically increases surface area, accommodating thousands of electron transport complexes and ATP synthase enzymes to maximize ATP output.',
        marks: 3,
      },
      {
        id: 'sq2',
        question: 'Distinguish between substrate-level phosphorylation and oxidative phosphorylation.',
        modelAnswer: 'Substrate-level phosphorylation directly transfers a phosphate group from a phosphorylated substrate to ADP. Oxidative phosphorylation uses redox energy from the electron transport chain to power ATP synthase.',
        marks: 3,
      },
    ],
    longQuestions: [
      {
        id: 'lq1',
        question: 'Trace the path of two electrons originating from NADH through complexes I to IV of the electron transport chain. Explain how their movement drives ATP synthesis.',
        markingScheme: [
          'Identification of Complex I (NADH dehydrogenase) and Ubiquinone Q (1 mark)',
          'Progression to Complex III (Cytochrome bc1) and Cytochrome c (1 mark)',
          'Final transfer at Complex IV to molecular oxygen yielding H2O (1 mark)',
          'Explanation of proton motive force (PMF) across the inner membrane (1 mark)',
          'Chemiosmotic rotary mechanism of ATP synthase F0/F1 subunits (1 mark)',
        ],
        marks: 5,
      },
    ],
    difficultQuestions: [
      {
        id: 'dq1',
        question: 'A chemical compound (DNP) makes the inner mitochondrial membrane permeable to protons. Deduce its effect on oxygen consumption and ATP synthesis.',
        solutionHint: 'Analyze uncoupling of the proton gradient from ATP synthase.',
        modelAnswer: 'DNP dissipates the proton gradient without passing through ATP synthase. As a result, ATP synthesis drops precipitously while the electron transport chain operates at maximum velocity, consuming excess oxygen and releasing energy as heat.',
        marks: 4,
      },
    ],
  },
  {
    id: 'quiz-math-ch4',
    schoolId: 'school-oakridge',
    title: 'Quadratic Equations, Discriminants & Parabolas',
    bookName: 'Cambridge IGCSE Mathematics',
    author: 'Karen Morrison, Nick Hamshaw',
    publisher: 'Cambridge University Press',
    className: 'Grade 10-A',
    chapterName: 'Chapter 4: Quadratic Algebra and Graphs',
    createdByTeacherName: 'Mr. Marcus Vance',
    createdAt: '2026-10-19',
    timesSolved: 9,
    mcqs: [
      {
        id: 'mq1',
        question: 'For the quadratic equation ax^2 + bx + c = 0, what does a discriminant (b^2 - 4ac) < 0 indicate?',
        options: [
          'No real roots (two distinct complex roots)',
          'Two identical repeated real roots',
          'Two distinct rational roots',
          'A parabola whose vertex lies directly on the x-axis',
        ],
        correctOptionIndex: 0,
        explanation: 'When b^2 - 4ac is negative, the square root within the quadratic formula produces non-real complex conjugates, so the graph never intersects the x-axis.',
        difficulty: 'easy',
      },
      {
        id: 'mq2',
        question: 'What are the coordinates of the vertex for y = 2(x - 3)^2 + 8?',
        options: [
          '(3, 8)',
          '(-3, 8)',
          '(3, -8)',
          '(6, 8)',
        ],
        correctOptionIndex: 0,
        explanation: 'In vertex form y = a(x - h)^2 + k, the turning point (vertex) occurs at (h, k), which is (3, 8).',
        difficulty: 'medium',
      },
    ],
    shortQuestions: [
      {
        id: 'msq1',
        question: 'Find the axis of symmetry for the quadratic curve y = 3x^2 - 12x + 7.',
        modelAnswer: 'The axis of symmetry formula is x = -b / (2a). Here, x = -(-12) / (2 * 3) = 12 / 6 = 2. Therefore, x = 2.',
        marks: 2,
      },
    ],
    longQuestions: [
      {
        id: 'mlq1',
        question: 'A projectile launched vertically from ground level has height h(t) = -5t^2 + 40t meters. Find its maximum height, time to reach vertex, and total flight time.',
        markingScheme: [
          'Finding vertex time: t = -40 / (2 * -5) = 4 seconds (2 marks)',
          'Computing maximum altitude: h(4) = -5(16) + 40(4) = 80 meters (2 marks)',
          'Finding roots: -5t(t - 8) = 0 => total flight time is 8 seconds (1 mark)',
        ],
        marks: 5,
      },
    ],
    difficultQuestions: [
      {
        id: 'mdq1',
        question: 'Find the range of values of k for which the line y = 2x + k intersects the parabola y = x^2 - 4x + 7 at two distinct points.',
        solutionHint: 'Equate equations and set discriminant of the resulting quadratic > 0.',
        modelAnswer: 'x^2 - 4x + 7 = 2x + k => x^2 - 6x + (7 - k) = 0. For two distinct intersections, b^2 - 4ac > 0: (-6)^2 - 4(1)(7 - k) > 0 => 36 - 28 + 4k > 0 => 8 + 4k > 0 => k > -2.',
        marks: 4,
      },
    ],
  },
];

// Attendance
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-1',
    studentName: 'Alex Rivera',
    rollNumber: '1042',
    grade: 'Grade 10-A',
    date: today,
    status: 'present',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:30 AM',
  },
  {
    id: 'att-2',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-2',
    studentName: 'Maya Lin',
    rollNumber: '1043',
    grade: 'Grade 10-A',
    date: today,
    status: 'present',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:30 AM',
  },
  {
    id: 'att-3',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-3',
    studentName: 'Jordan Taylor',
    rollNumber: '1044',
    grade: 'Grade 10-A',
    date: today,
    status: 'late',
    notes: 'Bus transit delay - reported to office',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:45 AM',
  },
  {
    id: 'att-4',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-4',
    studentName: 'Liam Chen',
    rollNumber: '1045',
    grade: 'Grade 10-A',
    date: today,
    status: 'present',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:30 AM',
  },
  {
    id: 'att-5',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-5',
    studentName: 'Sophia Morales',
    rollNumber: '1046',
    grade: 'Grade 10-A',
    date: today,
    status: 'excused',
    notes: 'Medical appointment letter on file',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:30 AM',
  },
  {
    id: 'att-6',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-1',
    studentName: 'Alex Rivera',
    rollNumber: '1042',
    grade: 'Grade 10-A',
    date: yesterdayDate,
    status: 'present',
    markedBy: 'Mrs. Sarah Jenkins',
    timeMarked: '08:32 AM',
  },
];

export const INITIAL_HOMEWORK: Homework[] = [
  {
    id: 'hw-1',
    schoolId: 'school-oakridge',
    title: 'Cellular Respiration & ATP Synthesis Lab Report',
    subject: 'Biology',
    grade: 'Grade 10-A',
    teacherId: 'usr-teacher-1',
    teacherName: 'Mrs. Sarah Jenkins',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '23:59',
    description: 'Complete the written analysis of the yeast fermentation experiment conducted in Laboratory 3. Include hypothesis, quantitative observations, temperature vs CO2 production graphs, and error analysis.',
    maxMarks: 100,
    attachments: [
      { name: 'Lab_Protocol_Cellular_Respiration.pdf', size: '2.4 MB', url: '#', type: 'application/pdf' },
      { name: 'Data_Sheet_Template.xlsx', size: '420 KB', url: '#', type: 'application/excel' },
    ],
    createdAt: '2026-10-19',
  },
  {
    id: 'hw-2',
    schoolId: 'school-oakridge',
    title: 'Quadratic Functions & Parabolic Trajectories',
    subject: 'Mathematics',
    grade: 'Grade 10-A',
    teacherId: 'usr-teacher-2',
    teacherName: 'Mr. Marcus Vance',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    dueTime: '17:00',
    description: 'Solve problem set 4.3 from Chapter 4 (problems 12 through 34 even). Show full algebraic derivations for finding the vertex, discriminant value, and x-intercepts.',
    maxMarks: 50,
    attachments: [
      { name: 'Calculus_ProblemSet_4.3.pdf', size: '1.1 MB', url: '#', type: 'application/pdf' },
    ],
    createdAt: '2026-10-20',
  },
];

export const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    studentId: 'usr-student-1',
    studentName: 'Alex Rivera',
    grade: 'Grade 10-A',
    submittedAt: '2026-10-21 16:45',
    notes: 'Completed diagram with full color-coded proton concentration arrows and ATP gradient explanation.',
    fileName: 'AlexRivera_Thylakoid_Diagram.pdf',
    fileSize: '3.1 MB',
    fileUrl: '#',
    marksObtained: 38,
    feedback: 'Splendid structural fidelity and clear labeling of the cytochrome complex. Top tier work!',
    gradedBy: 'Mrs. Sarah Jenkins',
    gradedAt: '2026-10-22 09:15',
    status: 'graded',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    schoolId: 'school-oakridge',
    title: 'Mid-Term Examination Schedule & Hall Allocations Released',
    content: 'The official timetable for Term 1 Mid-Term examinations is now finalized. Examinations commence on November 3rd in the Main Auditorium and Science Wing. Please check the Exam Calendar tab.',
    priority: 'exam',
    targetAudience: 'all',
    authorName: 'Dr. Evelyn Vance',
    authorRole: 'Principal',
    date: '2026-10-21',
    pinned: true,
    department: 'Academic Office',
  },
  {
    id: 'not-2',
    schoolId: 'school-oakridge',
    title: 'URGENT: Campus Traffic & East Gate Construction Advisory',
    content: 'Due to municipal water main upgrades along Highland Parkway, the East Vehicle Gate will be strictly closed to drop-offs between 07:30 and 09:00 AM.',
    priority: 'urgent',
    targetAudience: 'all',
    authorName: 'Campus Security',
    authorRole: 'Administration',
    date: '2026-10-22',
    pinned: true,
    department: 'Operations',
  },
];

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    schoolId: 'school-oakridge',
    title: 'Molecular Genetics & CRISPR Gene Editing Seminar',
    subject: 'AP Biology',
    grade: 'Grade 10-A',
    teacherId: 'usr-teacher-1',
    teacherName: 'Mrs. Sarah Jenkins',
    scheduledDate: today,
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    meetLink: 'https://meet.google.com/qrx-ptnv-wmb',
    meetCode: 'qrx-ptnv-wmb',
    status: 'live',
    description: 'Live interactive session analyzing Cas9 nuclease mechanics, guide RNA targeting, and ethical bioengineering debate.',
    agendaItems: [
      'Overview of bacterial adaptive immune memory',
      'Cas9 enzyme active site kinematics',
      'Guide RNA synthesis and off-target cleavage prevention',
    ],
    attendeesCount: 24,
  },
];

export const INITIAL_INVOICES: SubscriptionInvoice[] = [
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0812',
    date: '2026-08-15',
    amount: 470,
    planName: 'Pro Academy (Annual)',
    status: 'paid',
  },
];

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Free Starter',
    tagline: 'Ideal for small schools, test pilots, and trial collectives.',
    monthlyPrice: 0,
    annualPrice: 0,
    maxStudents: 50,
    maxTeachers: 5,
    googleMeetEnabled: false,
    prioritySupport: false,
    attendanceReports: false,
    customDomain: false,
    features: [
      'Up to 50 active students',
      'Up to 5 certified teachers',
      '25 AI Quizzes per month quota',
      'Exam & Event Shared Calendar',
      'Student Practice Mode (Database bank)',
      'Community email support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Academy',
    tagline: 'Engineered for scaling private schools, modern K-12 campuses, and academies.',
    monthlyPrice: 49,
    annualPrice: 470,
    maxStudents: 500,
    maxTeachers: 50,
    googleMeetEnabled: true,
    prioritySupport: true,
    attendanceReports: true,
    customDomain: false,
    features: [
      'Up to 500 active students',
      'Up to 50 faculty accounts',
      '150 AI Quizzes / Question Banks per month',
      'PDF printable test paper export with answer keys',
      'Full Exam & Shared Calendar with admit slip preview',
      'Google Meet live classroom integration',
      'Priority SLA support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Campus',
    tagline: 'For district-wide networks, multi-campus institutions, and university collegiate systems.',
    monthlyPrice: 149,
    annualPrice: 1430,
    maxStudents: 5000,
    maxTeachers: 500,
    googleMeetEnabled: true,
    prioritySupport: true,
    attendanceReports: true,
    customDomain: true,
    features: [
      'Unlimited enrolled students across all branches',
      'Unlimited teachers & administrator seats',
      'Unlimited AI Quiz Generation & Custom syllabus parsing',
      'PDF test paper watermark & institutional branding',
      'Super Admin network federation and quota controls',
      'Dedicated 24/7 account manager',
    ],
  },
};

// -------------------------------------------------------------
// TIMETABLE SEEDED SCHEDULE (Grade 10-A)
// -------------------------------------------------------------
export const INITIAL_TIMETABLE: TimetablePeriod[] = [
  // Monday
  { id: 'tt-m1', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Mathematics', teacherName: 'Mr. Marcus Vance', room: 'Hall 3B', grade: 'Grade 10-A' },
  { id: 'tt-m2', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 2, timeRange: '09:20 - 10:05', subject: 'Biology', teacherName: 'Mrs. Sarah Jenkins', room: 'Bio Lab 2', grade: 'Grade 10-A' },
  { id: 'tt-m3', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 3, timeRange: '10:10 - 10:55', subject: 'Physics', teacherName: 'Dr. Tariq Mahmood', room: 'Science Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-m4', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 4, timeRange: '11:15 - 12:00', subject: 'English Language', teacherName: 'Ms. Clara Hughes', room: 'Room 102', grade: 'Grade 10-A' },
  { id: 'tt-m5', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 5, timeRange: '12:05 - 12:50', subject: 'Computer Science', teacherName: 'Engr. Bilal Khan', room: 'CS Lab 4', grade: 'Grade 10-A' },
  { id: 'tt-m6', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 6, timeRange: '01:20 - 02:00', subject: 'Urdu Literature', teacherName: 'Prof. Aslam Pervez', room: 'Room 104', grade: 'Grade 10-A' },
  { id: 'tt-m7', schoolId: 'school-oakridge', day: 'Monday', periodNumber: 7, timeRange: '02:05 - 02:45', subject: 'Pakistan Studies', teacherName: 'Mr. Zafar Iqbal', room: 'Room 105', grade: 'Grade 10-A' },

  // Tuesday
  { id: 'tt-t1', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Chemistry', teacherName: 'Dr. Evelyn Vance', room: 'Chem Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-t2', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 2, timeRange: '09:20 - 10:05', subject: 'Mathematics', teacherName: 'Mr. Marcus Vance', room: 'Hall 3B', grade: 'Grade 10-A' },
  { id: 'tt-t3', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 3, timeRange: '10:10 - 10:55', subject: 'Islamic Studies', teacherName: 'Maulana Hafiz Ahmed', room: 'Room 201', grade: 'Grade 10-A' },
  { id: 'tt-t4', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 4, timeRange: '11:15 - 12:00', subject: 'Computer Science', teacherName: 'Engr. Bilal Khan', room: 'CS Lab 4', grade: 'Grade 10-A' },
  { id: 'tt-t5', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 5, timeRange: '12:05 - 12:50', subject: 'Biology', teacherName: 'Mrs. Sarah Jenkins', room: 'Bio Lab 2', grade: 'Grade 10-A' },
  { id: 'tt-t6', schoolId: 'school-oakridge', day: 'Tuesday', periodNumber: 6, timeRange: '01:20 - 02:00', subject: 'English Literature', teacherName: 'Ms. Clara Hughes', room: 'Room 102', grade: 'Grade 10-A' },

  // Wednesday
  { id: 'tt-w1', schoolId: 'school-oakridge', day: 'Wednesday', periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Physics', teacherName: 'Dr. Tariq Mahmood', room: 'Science Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-w2', schoolId: 'school-oakridge', day: 'Wednesday', periodNumber: 2, timeRange: '09:20 - 10:05', subject: 'Chemistry', teacherName: 'Dr. Evelyn Vance', room: 'Chem Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-w3', schoolId: 'school-oakridge', day: 'Wednesday', periodNumber: 3, timeRange: '10:10 - 10:55', subject: 'Mathematics', teacherName: 'Mr. Marcus Vance', room: 'Hall 3B', grade: 'Grade 10-A' },
  { id: 'tt-w4', schoolId: 'school-oakridge', day: 'Wednesday', periodNumber: 4, timeRange: '11:15 - 12:00', subject: 'Urdu Literature', teacherName: 'Prof. Aslam Pervez', room: 'Room 104', grade: 'Grade 10-A' },
  { id: 'tt-w5', schoolId: 'school-oakridge', day: 'Wednesday', periodNumber: 5, timeRange: '12:05 - 12:50', subject: 'General Science', teacherName: 'Mrs. Sarah Jenkins', room: 'Room 103', grade: 'Grade 10-A' },

  // Thursday
  { id: 'tt-th1', schoolId: 'school-oakridge', day: 'Thursday', periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Mathematics', teacherName: 'Mr. Marcus Vance', room: 'Hall 3B', grade: 'Grade 10-A' },
  { id: 'tt-th2', schoolId: 'school-oakridge', day: 'Thursday', periodNumber: 2, timeRange: '09:20 - 10:05', subject: 'Computer Science', teacherName: 'Engr. Bilal Khan', room: 'CS Lab 4', grade: 'Grade 10-A' },
  { id: 'tt-th3', schoolId: 'school-oakridge', day: 'Thursday', periodNumber: 3, timeRange: '10:10 - 10:55', subject: 'Biology', teacherName: 'Mrs. Sarah Jenkins', room: 'Bio Lab 2', grade: 'Grade 10-A' },
  { id: 'tt-th4', schoolId: 'school-oakridge', day: 'Thursday', periodNumber: 4, timeRange: '11:15 - 12:00', subject: 'Physics', teacherName: 'Dr. Tariq Mahmood', room: 'Science Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-th5', schoolId: 'school-oakridge', day: 'Thursday', periodNumber: 5, timeRange: '12:05 - 12:50', subject: 'Pakistan Studies', teacherName: 'Mr. Zafar Iqbal', room: 'Room 105', grade: 'Grade 10-A' },

  // Friday
  { id: 'tt-f1', schoolId: 'school-oakridge', day: 'Friday', periodNumber: 1, timeRange: '08:30 - 09:15', subject: 'Islamic Studies', teacherName: 'Maulana Hafiz Ahmed', room: 'Room 201', grade: 'Grade 10-A' },
  { id: 'tt-f2', schoolId: 'school-oakridge', day: 'Friday', periodNumber: 2, timeRange: '09:20 - 10:05', subject: 'English Language', teacherName: 'Ms. Clara Hughes', room: 'Room 102', grade: 'Grade 10-A' },
  { id: 'tt-f3', schoolId: 'school-oakridge', day: 'Friday', periodNumber: 3, timeRange: '10:10 - 10:55', subject: 'Chemistry', teacherName: 'Dr. Evelyn Vance', room: 'Chem Lab 1', grade: 'Grade 10-A' },
  { id: 'tt-f4', schoolId: 'school-oakridge', day: 'Friday', periodNumber: 4, timeRange: '11:15 - 12:00', subject: 'Mathematics Tutorial', teacherName: 'Mr. Marcus Vance', room: 'Hall 3B', grade: 'Grade 10-A' },
];

// -------------------------------------------------------------
// OFFICIAL REPORT CARDS & EXAMINATION RESULTS
// -------------------------------------------------------------
export const INITIAL_REPORT_CARDS: StudentReportCard[] = [
  {
    id: 'rep-alex-midterm',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-1',
    studentName: 'Alex Rivera',
    rollNumber: '1042',
    grade: 'Grade 10-A',
    term: 'Mid-Term Examination 2026',
    issueDate: '2026-03-15',
    subjectMarks: [
      { subject: 'Mathematics', totalMarks: 100, obtainedMarks: 94, grade: 'A+', remarks: 'Outstanding analytical proofs and algebra mastery.' },
      { subject: 'Biology', totalMarks: 100, obtainedMarks: 91, grade: 'A+', remarks: 'Exceptional diagram illustrations and cellular respiration details.' },
      { subject: 'Physics', totalMarks: 100, obtainedMarks: 86, grade: 'A', remarks: 'Strong kinematics calculations; practice wave mechanics.' },
      { subject: 'Chemistry', totalMarks: 100, obtainedMarks: 88, grade: 'A', remarks: 'Good grasp of stoichiometry and acid-base titrations.' },
      { subject: 'Computer Science', totalMarks: 100, obtainedMarks: 96, grade: 'A+', remarks: 'Flawless algorithmic logic and database design.' },
      { subject: 'English Language', totalMarks: 100, obtainedMarks: 82, grade: 'A', remarks: 'Well-structured essays; expand critical vocabulary.' },
      { subject: 'Urdu Literature', totalMarks: 100, obtainedMarks: 79, grade: 'B+', remarks: 'Good poetic appreciation; polish creative prose.' },
      { subject: 'Pakistan Studies', totalMarks: 50, obtainedMarks: 44, grade: 'A', remarks: 'Insightful historical chronology and geography knowledge.' },
      { subject: 'Islamic Studies', totalMarks: 50, obtainedMarks: 46, grade: 'A+', remarks: 'Thorough knowledge of Hadith and moral ethics.' },
    ],
    totalMarks: 800,
    totalObtained: 706,
    percentage: 88.25,
    overallGrade: 'A+',
    rankInClass: 2,
    totalStudentsInClass: 38,
    attendancePercentage: 96.5,
    principalRemarks: 'Alex demonstrates academic excellence and an exemplary attitude toward continuous learning. Recommended for the Honors Science stream.',
    classTeacherRemarks: 'Diligent, proactive, and always actively participates in lab work and team discussions.',
  },
  {
    id: 'rep-maya-midterm',
    schoolId: 'school-oakridge',
    studentId: 'usr-student-2',
    studentName: 'Maya Lin',
    rollNumber: '1043',
    grade: 'Grade 10-A',
    term: 'Mid-Term Examination 2026',
    issueDate: '2026-03-15',
    subjectMarks: [
      { subject: 'Mathematics', totalMarks: 100, obtainedMarks: 82, grade: 'A', remarks: 'Solid understanding of quadratic formulas.' },
      { subject: 'Biology', totalMarks: 100, obtainedMarks: 85, grade: 'A', remarks: 'Good grasp of ecology and genetics.' },
      { subject: 'Physics', totalMarks: 100, obtainedMarks: 78, grade: 'B+', remarks: 'Needs more practice with vector diagrams.' },
      { subject: 'Chemistry', totalMarks: 100, obtainedMarks: 84, grade: 'A', remarks: 'Strong lab notebook work.' },
      { subject: 'Computer Science', totalMarks: 100, obtainedMarks: 89, grade: 'A', remarks: 'Great enthusiasm for web development.' },
      { subject: 'English Language', totalMarks: 100, obtainedMarks: 90, grade: 'A+', remarks: 'Creative writer with exceptional expression.' },
      { subject: 'Urdu Literature', totalMarks: 100, obtainedMarks: 86, grade: 'A', remarks: 'Good command over Urdu poetry.' },
      { subject: 'Pakistan Studies', totalMarks: 50, obtainedMarks: 41, grade: 'A', remarks: 'Satisfactory analytical responses.' },
      { subject: 'Islamic Studies', totalMarks: 50, obtainedMarks: 45, grade: 'A+', remarks: 'Very respectful and conscientious.' },
    ],
    totalMarks: 800,
    totalObtained: 680,
    percentage: 85.0,
    overallGrade: 'A',
    rankInClass: 5,
    totalStudentsInClass: 38,
    attendancePercentage: 94.0,
    principalRemarks: 'Maya has shown commendable academic improvement this term.',
    classTeacherRemarks: 'Always punctual, polite, and completes all projects ahead of deadlines.',
  },
];

// -------------------------------------------------------------
// SUBJECTS CURRICULUM & STUDY MATERIALS (Grade 5 to 12)
// -------------------------------------------------------------
export const INITIAL_CURRICULUM: SubjectCurriculum[] = [
  {
    id: 'subj-math',
    code: 'MATH-10',
    name: 'Mathematics',
    urduName: 'ریاضی',
    category: 'sciences',
    iconName: 'Calculator',
    color: '#2563eb',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Quadratic Equations & Complex Roots',
        summary: 'Standard form ax² + bx + c = 0, factorization, completing squares, and the quadratic discriminant formula.',
        importantDefinitions: [
          { term: 'Quadratic Equation', definition: 'An algebraic equation of second degree having at most two distinct roots.' },
          { term: 'Discriminant (Δ)', definition: 'Δ = b² - 4ac, which determines real, equal, or imaginary roots.' },
        ],
        formulas: ['x = (-b ± √(b² - 4ac)) / (2a)', 'Sum of roots: S = -b/a', 'Product of roots: P = c/a'],
        solvedQnAs: [
          { question: 'Solve x² - 5x + 6 = 0 by factorization.', answer: '(x - 2)(x - 3) = 0 => x = 2 or x = 3.', type: 'short' },
          { question: 'Derive the quadratic formula by completing square method.', answer: 'Divide by a, add (b/2a)² on both sides, and solve for x.', type: 'long' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 2,
        title: 'Matrices & Determinants',
        summary: 'Types of matrices, matrix addition, multiplication, determinant of 2x2 and 3x3 matrices, and Cramer\'s Rule.',
        importantDefinitions: [
          { term: 'Singular Matrix', definition: 'A square matrix whose determinant is equal to zero (|A| = 0).' },
          { term: 'Identity Matrix (I)', definition: 'A diagonal matrix where all main diagonal elements are 1.' },
        ],
        formulas: ['|A| = ad - bc for 2x2', 'A⁻¹ = (1/|A|) * Adj(A)', 'Cramer\'s Rule: x = |Ax|/|A|, y = |Ay|/|A|'],
        solvedQnAs: [
          { question: 'What is the condition for a matrix inverse to exist?', answer: 'The determinant of the matrix must be non-zero (|A| ≠ 0).', type: 'short' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 3,
        title: 'Logarithms & Scientific Notation',
        summary: 'Laws of logarithms, characteristic and mantissa, anti-logarithms, and solving exponential equations.',
        importantDefinitions: [
          { term: 'Characteristic', definition: 'The integral part of common logarithm obtained by inspection.' },
          { term: 'Mantissa', definition: 'The fractional part of common logarithm obtained from log tables, always positive.' },
        ],
        formulas: ['log_a(m * n) = log_a(m) + log_a(n)', 'log_a(m / n) = log_a(m) - log_a(n)', 'log_a(m^p) = p * log_a(m)'],
        solvedQnAs: [
          { question: 'State the quotient law of logarithms.', answer: 'The log of a quotient equals the difference of the logs of numerator and denominator.', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-phy',
    code: 'PHY-10',
    name: 'Physics',
    urduName: 'طبیعیات',
    category: 'sciences',
    iconName: 'Zap',
    color: '#0891b2',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Simple Harmonic Motion & Waves',
        summary: 'Kinematics of oscillating spring-mass systems, simple pendulum, wave characteristics, and sound frequency.',
        importantDefinitions: [
          { term: 'Simple Harmonic Motion (SHM)', definition: 'Periodic motion where acceleration is directly proportional to displacement and directed towards the mean position.' },
          { term: 'Resonance', definition: 'Phenomenon of dramatically increased amplitude when driving frequency matches natural frequency.' },
        ],
        formulas: ['T = 2π√(l / g) for simple pendulum', 'v = f * λ (Wave Equation)', 'F = -kx (Hooke\'s Law)'],
        solvedQnAs: [
          { question: 'Define time period and frequency.', answer: 'Time period T is seconds per complete cycle. Frequency f = 1/T measured in Hertz (Hz).', type: 'short' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 2,
        title: 'Geometrical Optics & Refraction',
        summary: 'Reflection, Snell\'s law, total internal reflection, convex/concave lenses, and optical instruments.',
        importantDefinitions: [
          { term: 'Critical Angle', definition: 'Angle of incidence in denser medium for which angle of refraction in rarer medium is 90°.' },
          { term: 'Refractive Index', definition: 'Ratio of speed of light in vacuum to speed of light in that medium (n = c / v).' },
        ],
        formulas: ['1/f = 1/p + 1/q (Mirror/Lens Formula)', 'n = sin(i) / sin(r) (Snell\'s Law)'],
        solvedQnAs: [
          { question: 'What is total internal reflection?', answer: 'When light travels from dense to rare medium at angle > critical angle, it reflects entirely back.', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-chem',
    code: 'CHEM-10',
    name: 'Chemistry',
    urduName: 'کیمیا',
    category: 'sciences',
    iconName: 'FlaskConical',
    color: '#7c3aed',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Chemical Equilibrium & Le Chatelier\'s Principle',
        summary: 'Reversible reactions, dynamic equilibrium, equilibrium constant Kc expressions, and shifting equilibria.',
        importantDefinitions: [
          { term: 'Dynamic Equilibrium', definition: 'State where rate of forward reaction equals rate of reverse reaction and concentrations remain constant.' },
          { term: 'Law of Mass Action', definition: 'Rate at which a substance reacts is directly proportional to its active mass.' },
        ],
        formulas: ['Kc = [Products]^coefficients / [Reactants]^coefficients', 'Qc < Kc (reaction shifts forward)'],
        solvedQnAs: [
          { question: 'Why does a catalyst not alter the value of Kc?', answer: 'A catalyst speeds up both forward and reverse reaction rates equally.', type: 'short' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 2,
        title: 'Acids, Bases & Salts',
        summary: 'Arrhenius, Bronsted-Lowry, and Lewis concepts of acids/bases, pH scale, indicators, and salt preparations.',
        importantDefinitions: [
          { term: 'Bronsted-Lowry Acid', definition: 'A chemical species that donates a proton (H+) to another substance.' },
          { term: 'pH', definition: 'Negative logarithm of the hydrogen ion concentration: pH = -log[H+].' },
        ],
        formulas: ['pH + pOH = 14 (at 25°C)', 'Kw = [H+][OH-] = 1.0 × 10⁻¹⁴'],
        solvedQnAs: [
          { question: 'Explain conjugate acid-base pairs with an example.', answer: 'Pair of species differing by a single proton: NH3 (base) and NH4+ (conjugate acid).', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-bio',
    code: 'BIO-10',
    name: 'Biology',
    urduName: 'حیاتیات',
    category: 'sciences',
    iconName: 'Dna',
    color: '#059669',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Gaseous Exchange & Respiratory System',
        summary: 'Human respiratory organs, alveoli mechanics, mechanism of breathing, and respiratory disorders.',
        importantDefinitions: [
          { term: 'Alveoli', definition: 'Microscopic sac-like structures where gas exchange between blood and air takes place.' },
          { term: 'Cellular Respiration', definition: 'Biochemical oxidation of glucose in cells to release energy stored in ATP.' },
        ],
        formulas: ['C6H12O6 + 6O2 -> 6CO2 + 6H2O + 36-38 ATP'],
        solvedQnAs: [
          { question: 'Differentiate between breathing and cellular respiration.', answer: 'Breathing is mechanical inhalation/exhalation; cellular respiration is biochemical energy release inside mitochondria.', type: 'short' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 2,
        title: 'Homeostasis & Kidney Function',
        summary: 'Osmoregulation, thermoregulation, structure of nephron, urine formation, and dialysis mechanics.',
        importantDefinitions: [
          { term: 'Homeostasis', definition: 'Maintenance of internal conditions of body within narrow tolerable limits despite external fluctuations.' },
          { term: 'Nephron', definition: 'The functional and structural microscopic filtering unit of the human kidney.' },
        ],
        formulas: ['Filtration -> Selective Reabsorption -> Secretion = Urine'],
        solvedQnAs: [
          { question: 'Name the three main steps of urine formation in nephron.', answer: '1. Ultrafiltration in Glomerulus, 2. Selective reabsorption in loop of Henle, 3. Tubular secretion.', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-cs',
    code: 'CS-10',
    name: 'Computer Science',
    urduName: 'کمپیوٹر سائنس',
    category: 'tech',
    iconName: 'Cpu',
    color: '#d97706',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Problem Solving & Flowcharts',
        summary: 'Problem analysis, algorithm design, symbols of flowcharts, trace tables, and dry runs.',
        importantDefinitions: [
          { term: 'Algorithm', definition: 'A finite set of step-by-step well-defined instructions to solve a particular problem.' },
          { term: 'Flowchart', definition: 'A graphical representation of an algorithm using standard geometric symbols.' },
        ],
        formulas: ['Start/Stop (Oval), Process (Rectangle), Decision (Diamond), I/O (Parallelogram)'],
        solvedQnAs: [
          { question: 'What is the difference between an algorithm and a program?', answer: 'An algorithm is language-independent logic; a program is code written in a specific programming language.', type: 'short' },
        ],
        pdfAvailable: true,
      },
      {
        chapterNumber: 2,
        title: 'C Programming & Control Structures',
        summary: 'Data types, variables, arithmetic operators, if-else conditional branches, and for/while loops.',
        importantDefinitions: [
          { term: 'Variable', definition: 'A named storage location in memory whose value can change during execution.' },
          { term: 'Loop', definition: 'A control structure that repeats a block of statements as long as a condition is true.' },
        ],
        formulas: ['for (init; condition; increment) { statements; }'],
        solvedQnAs: [
          { question: 'What is the syntax of a while loop in C?', answer: 'while (condition) { statement; update; }', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-eng',
    code: 'ENG-10',
    name: 'English Language & Literature',
    urduName: 'انگریزی',
    category: 'languages',
    iconName: 'BookA',
    color: '#4f46e5',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Hazrat Muhammad (PBUH) An Embodiment of Justice',
        summary: 'Comprehension, character traits, moral arbitration, vocabulary building, and direct/indirect speech.',
        importantDefinitions: [
          { term: 'Justice', definition: 'Fairness, moral rightness, and equitable treatment regardless of kinship or status.' },
        ],
        formulas: ['Direct Speech -> Indirect Speech tense shift rules'],
        solvedQnAs: [
          { question: 'How did the Holy Prophet (PBUH) resolve the dispute regarding the Black Stone (Hajr-e-Aswad)?', answer: 'He placed the stone in a mantle and asked tribal leaders to lift it jointly, preventing tribal war.', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-urdu',
    code: 'URDU-10',
    name: 'Urdu Literature',
    urduName: 'اردو ادب و گرامر',
    category: 'languages',
    iconName: 'BookOpen',
    color: '#ea580c',
    chapters: [
      {
        chapterNumber: 1,
        title: 'حمد و نعت و اسباق',
        summary: 'مرزا غالب و میر تقی میر کی شاعری، حمد و نعت کی تشریح، مضمون نویسی اور گرائمر۔',
        importantDefinitions: [
          { term: 'حمد', definition: 'وہ نظم جس میں اللہ تعالیٰ کی تعریف و توصیف بیان کی جائے۔' },
          { term: 'نعت', definition: 'وہ نظم جس میں حضرت محمد مصطفیٰ ﷺ کی مدح و شان بیان کی جائے۔' },
        ],
        formulas: ['مطلع، مقطع، قافیہ، ردیف کے اصول'],
        solvedQnAs: [
          { question: 'مطلع اور مقطع میں کیا فرق ہے؟', answer: 'مطلع غزل کا پہلا شعر ہے جس کے دونوں مصرعے ہم قافیہ ہوتے ہیں۔ مقطع آخری شعر ہوتا ہے جس میں شاعر تخلص لاتا ہے۔', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-pak',
    code: 'PAK-10',
    name: 'Pakistan Studies',
    urduName: 'مطالعہ پاکستان',
    category: 'humanities',
    iconName: 'Globe',
    color: '#15803d',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Ideological Basis of Pakistan & 1940 Resolution',
        summary: 'Two-Nation Theory, Quaid-e-Azam and Allama Iqbal\'s vision, Lahore Resolution, and geographical strategic significance.',
        importantDefinitions: [
          { term: 'Two-Nation Theory', definition: 'The ideology that Muslims and Hindus are two distinct nations with separate culture, religion, and worldview.' },
        ],
        formulas: ['23rd March 1940 Lahore Resolution key demands'],
        solvedQnAs: [
          { question: 'What was the main declaration of the Lahore Resolution 1940?', answer: 'Geographically contiguous units should be demarcated into regions formed as independent autonomous states for Muslims.', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
  {
    id: 'subj-isl',
    code: 'ISL-10',
    name: 'Islamic Studies',
    urduName: 'اسلامیات لازمی',
    category: 'humanities',
    iconName: 'HeartHandshake',
    color: '#047857',
    chapters: [
      {
        chapterNumber: 1,
        title: 'قرآن و حدیث، طہارت اور عبادات',
        summary: 'حفاظتِ قرآن، احادیثِ نبویہ، زکوٰۃ، نماز، اور اخلاقیات و حسنِ معاملات۔',
        importantDefinitions: [
          { term: 'حدیث', definition: 'نبی کریم ﷺ کے اقوال، افعال اور تقاریر کو حدیث کہتے ہیں۔' },
        ],
        formulas: ['نصابِ زکوٰۃ: ساڑھے سات تولے سونا یا باون تولے چاندی'],
        solvedQnAs: [
          { question: 'ارکانِ اسلام کون سے ہیں؟', answer: '1. کلمہ طیبہ، 2. نماز، 3. روزہ، 4. زکوٰۃ، 5. حج۔', type: 'short' },
        ],
        pdfAvailable: true,
      },
    ],
  },
];

// -------------------------------------------------------------
// IN-APP NOTIFICATIONS
// -------------------------------------------------------------
export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Mid-Term Exam Scheduled',
    message: 'Biology Mid-Term scheduled for tomorrow at 09:00 in Hall A.',
    type: 'exam',
    timestamp: '10 mins ago',
    read: false,
    targetRole: 'all',
  },
  {
    id: 'notif-2',
    title: 'Homework Assigned: Photosystem II',
    message: 'Mrs. Jenkins posted Biology Assignment. Due date: Tomorrow 23:59.',
    type: 'homework',
    timestamp: '1 hour ago',
    read: false,
    targetRole: 'student',
  },
  {
    id: 'notif-3',
    title: 'Official Report Cards Published',
    message: 'Mid-term evaluation reports for Grade 10-A have been released.',
    type: 'attendance',
    timestamp: '3 hours ago',
    read: false,
    targetRole: 'all',
  },
  {
    id: 'notif-4',
    title: 'AI Doubt Assistant Active',
    message: 'LearnAI Tutor now supports bilingual step-by-step explanations in Urdu and English.',
    type: 'ai',
    timestamp: '1 day ago',
    read: true,
    targetRole: 'all',
  },
];


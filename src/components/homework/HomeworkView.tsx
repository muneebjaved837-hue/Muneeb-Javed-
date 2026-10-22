import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Homework, HomeworkSubmission } from '../../types';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Award,
  Paperclip,
  X,
  Send,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

export const HomeworkView: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    users,
    homeworkList,
    submissions,
    createHomework,
    submitHomework,
    gradeHomework,
  } = useSchool();

  const isStudent = currentUser.role === 'student';
  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // State
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSubmissionHw, setActiveSubmissionHw] = useState<Homework | null>(null);
  const [reviewHw, setReviewHw] = useState<Homework | null>(null);

  // New Homework Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Biology');
  const [newGrade, setNewGrade] = useState('Grade 10-A');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [newDueTime, setNewDueTime] = useState('23:59');
  const [newDescription, setNewDescription] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState(50);
  const [attachmentName, setAttachmentName] = useState('');

  // Student Submit Form State
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Teacher Grade Form State
  const [activeGradingSub, setActiveGradingSub] = useState<HomeworkSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Filter school homework
  const schoolHomework = useMemo(() => {
    return homeworkList
      .filter((hw) => hw.schoolId === currentSchool.id)
      .filter((hw) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          hw.title.toLowerCase().includes(q) ||
          hw.subject.toLowerCase().includes(q) ||
          hw.grade.toLowerCase().includes(q)
        );
      });
  }, [homeworkList, currentSchool.id, searchQuery]);

  // Get student's submission for an assignment
  const getStudentSubmission = (hwId: string, studentId: string) => {
    return submissions.find((s) => s.homeworkId === hwId && s.studentId === studentId);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    createHomework({
      title: newTitle.trim(),
      subject: newSubject,
      grade: newGrade,
      dueDate: newDueDate,
      dueTime: newDueTime,
      description: newDescription.trim(),
      maxMarks: Number(newMaxMarks),
      attachments: attachmentName
        ? [{ name: attachmentName, size: '1.8 MB', url: '#', type: 'application/pdf' }]
        : [],
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
    setAttachmentName('');
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionHw) return;

    submitHomework(
      activeSubmissionHw.id,
      submitNotes,
      submitFileName || `${currentUser.name.replace(/\s+/g, '_')}_${activeSubmissionHw.subject}_Solution.pdf`,
      '2.1 MB'
    );

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveSubmissionHw(null);
      setSubmitNotes('');
      setSubmitFileName('');
    }, 1200);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingSub) return;

    gradeHomework(activeGradingSub.id, Number(scoreInput), feedbackInput.trim());
    setActiveGradingSub(null);
    setScoreInput(0);
    setFeedbackInput('');
  };

  // Enrolled students in a grade
  const getStudentsForGrade = (grade: string) => {
    return users.filter((u) => u.schoolId === currentSchool.id && u.role === 'student' && (!u.grade || u.grade === grade));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Homework &amp; Academic Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Track upcoming due dates, submit your coursework, and view teacher grading remarks.'
              : 'Create coursework, manage student submissions, and award numerical grades with feedback.'}
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Filter Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg self-start">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Assignments
          </button>
          {isStudent && (
            <>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterTab === 'pending'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Due / Pending
              </button>
              <button
                onClick={() => setFilterTab('submitted')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterTab === 'submitted'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submitted
              </button>
              <button
                onClick={() => setFilterTab('graded')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterTab === 'graded'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Graded &amp; Scored
              </button>
            </>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subject or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {schoolHomework.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No assignments found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isTeacherOrAdmin
                ? 'Click "Create Assignment" to publish your first coursework task.'
                : 'No homework assignments posted for your class yet.'}
            </p>
          </div>
        ) : (
          schoolHomework
            .filter((hw) => {
              if (!isStudent || filterTab === 'all') return true;
              const sub = getStudentSubmission(hw.id, currentUser.id);
              if (filterTab === 'pending') return !sub;
              if (filterTab === 'submitted') return sub && sub.status === 'submitted';
              if (filterTab === 'graded') return sub && sub.status === 'graded';
              return true;
            })
            .map((hw) => {
              const mySub = isStudent ? getStudentSubmission(hw.id, currentUser.id) : null;
              const gradeStudents = getStudentsForGrade(hw.grade);
              const totalSubs = submissions.filter((s) => s.homeworkId === hw.id).length;
              const gradedSubs = submissions.filter(
                (s) => s.homeworkId === hw.id && s.status === 'graded'
              ).length;

              const isPastDue = new Date(hw.dueDate + 'T' + hw.dueTime) < new Date();

              return (
                <div
                  key={hw.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Assignment Metadata & Content */}
                    <div className="space-y-2 flex-1">
                      {/* Zero-Pill Text Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-blue-700">{hw.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>{hw.grade}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{hw.maxMarks} max marks</span>
                        <span aria-hidden="true">·</span>
                        <span>Teacher: {hw.teacherName}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {hw.description}
                      </p>

                      {/* Due Date & Attachments */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: {hw.dueDate} at {hw.dueTime}</span>
                          {isPastDue && !mySub && (
                            <span className="text-rose-600 font-semibold ml-1">(Past Due)</span>
                          )}
                        </div>

                        {hw.attachments && hw.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5 text-blue-600">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>
                              {hw.attachments[0].name} ({hw.attachments[0].size})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status Column */}
                    <div className="flex items-center gap-3 shrink-0 lg:border-l lg:border-slate-200 lg:pl-6">
                      {isStudent ? (
                        /* Student Action Box */
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          {mySub ? (
                            mySub.status === 'graded' ? (
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                                  <Award className="w-4 h-4" />
                                  <span>Score: {mySub.marksObtained}/{hw.maxMarks}</span>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                  Graded by {mySub.gradedBy}
                                </span>
                              </div>
                            ) : (
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-blue-700 font-semibold text-xs">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Submitted</span>
                                </div>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {mySub.submittedAt}
                                </span>
                              </div>
                            )
                          ) : (
                            <button
                              onClick={() => {
                                setActiveSubmissionHw(hw);
                                setSubmitFileName('');
                                setSubmitNotes('');
                              }}
                              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
                            >
                              Submit Assignment
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Teacher / Admin Action Box */
                        <div className="flex items-center gap-3">
                          <div className="text-right text-xs">
                            <div className="font-mono font-bold text-slate-900 tabular-nums">
                              {totalSubs}/{gradeStudents.length} Submitted
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {gradedSubs} Graded
                            </div>
                          </div>
                          <button
                            onClick={() => setReviewHw(hw)}
                            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors whitespace-nowrap"
                          >
                            Review &amp; Grade
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Feedback display if graded */}
                  {isStudent && mySub && mySub.feedback && (
                    <div className="mt-3.5 p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-lg text-xs text-emerald-950">
                      <span className="font-semibold text-emerald-900">Teacher Remarks: </span>
                      <span>"{mySub.feedback}"</span>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* MODAL: Create Homework (Teacher/Admin) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Create New Course Assignment</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mendelian Inheritance & Punnett Square Problem Set"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="English Literature">English Literature</option>
                    <option value="World History">World History</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 9-A">Grade 9-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    required
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description &amp; Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the expectations, chapter problems to solve, lab parameters, or formatting guidelines..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Reference Document / Rubric
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Lab_Instruction_Sheet_Ch3.pdf"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAttachmentName('Chapter_Worksheet_Standard.pdf')}
                    className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 shrink-0"
                  >
                    Use Sample PDF
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Student Submit Homework Drawer/Modal */}
      {activeSubmissionHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Submit Coursework</h2>
                <span className="text-xs text-slate-500">{activeSubmissionHw.title}</span>
              </div>
              <button
                onClick={() => setActiveSubmissionHw(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Subject: {activeSubmissionHw.subject}</span>
                  <span className="font-mono">Max Marks: {activeSubmissionHw.maxMarks}</span>
                </div>
                <div>Deadline: {activeSubmissionHw.dueDate} at {activeSubmissionHw.dueTime}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Notes / Text Response
                </label>
                <textarea
                  rows={3}
                  placeholder="Include any methodology notes, answers, or comments for your teacher..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload File / Document
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50/50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600 font-medium">
                    {submitFileName ? submitFileName : 'Attach your solution document'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, ZIP, PNG (max 25MB)</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setSubmitFileName(`${currentUser.name.replace(/\s+/g, '_')}_Solution.pdf`)}
                      className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 border border-slate-200"
                    >
                      Attach Solution.pdf
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitFileName(`${currentUser.name.replace(/\s+/g, '_')}_LabData.xlsx`)}
                      className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 border border-slate-200"
                    >
                      Attach LabData.xlsx
                    </button>
                  </div>
                </div>
              </div>

              {submittedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Submission uploaded successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveSubmissionHw(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Confirm &amp; Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Review & Grade Submissions (Teacher / Admin) */}
      {reviewHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Review Submissions</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{reviewHw.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{reviewHw.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">Max Marks: {reviewHw.maxMarks}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setReviewHw(null);
                  setActiveGradingSub(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Roster list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeGradingSub ? (
                /* Grading Drawer for selected submission */
                <form onSubmit={handleGradeSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Grading {activeGradingSub.studentName}</span>
                      <div className="text-[11px] font-mono text-slate-500">Submitted at {activeGradingSub.submittedAt}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveGradingSub(null)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Back to roster
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700">Student Notes:</span>
                    <p className="mt-1 text-slate-600">{activeGradingSub.notes || 'No accompanying notes.'}</p>
                    {activeGradingSub.fileName && (
                      <div className="mt-2 flex items-center gap-1.5 text-blue-600 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{activeGradingSub.fileName} ({activeGradingSub.fileSize || '2.4 MB'})</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Awarded Score (out of {reviewHw.maxMarks})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={reviewHw.maxMarks}
                        required
                        value={scoreInput}
                        onChange={(e) => setScoreInput(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Percentage
                      </label>
                      <div className="text-sm font-mono font-bold text-blue-600 pt-2">
                        {reviewHw.maxMarks > 0 ? Math.round((scoreInput / reviewHw.maxMarks) * 100) : 0}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teacher Written Feedback
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Excellent attention to experimental detail and accurate thermodynamic equations."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveGradingSub(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                    >
                      Save Grade &amp; Feedback
                    </button>
                  </div>
                </form>
              ) : (
                /* Submissions Table */
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Student</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">File Attached</th>
                      <th className="px-4 py-2.5">Score</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {getStudentsForGrade(reviewHw.grade).map((st) => {
                      const sub = getStudentSubmission(reviewHw.id, st.id);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{st.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">Roll: {st.rollNumber}</div>
                          </td>
                          <td className="px-4 py-3">
                            {sub ? (
                              sub.status === 'graded' ? (
                                <span className="text-emerald-700 font-semibold">Graded</span>
                              ) : (
                                <span className="text-blue-700 font-semibold">Turned In</span>
                              )
                            ) : (
                              <span className="text-rose-600 font-medium">Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {sub?.fileName ? (
                              <span className="truncate max-w-[150px] inline-block font-mono text-[11px]">
                                {sub.fileName}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {sub?.marksObtained !== undefined ? (
                              <span className="font-bold text-slate-900">
                                {sub.marksObtained}/{reviewHw.maxMarks}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {sub ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveGradingSub(sub);
                                  setScoreInput(sub.marksObtained || 0);
                                  setFeedbackInput(sub.feedback || '');
                                }}
                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                              >
                                {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Awaiting work</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setReviewHw(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

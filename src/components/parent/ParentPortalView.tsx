import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  MessageSquare,
  Send,
  Download,
  Award,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ParentPortalViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({ onNavigateToTab }) => {
  const { currentSchool, currentUser, homeworkList, reportCards, examEvents } = useSchool();

  const childName = currentUser.childStudentName || 'Alex Rivera';
  const childGrade = 'Grade 10-A';
  const childRollNumber = '1042';

  // State for parent message to teacher
  const [parentMsg, setParentMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // State for leave application
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDays, setLeaveDays] = useState('1');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMsg.trim()) return;
    setMsgSent(true);
    setParentMsg('');
    setTimeout(() => setMsgSent(false), 3000);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    setLeaveSubmitted(true);
    setLeaveReason('');
    setTimeout(() => setLeaveSubmitted(false), 3000);
  };

  const childReport = reportCards.find((r) => r.studentName.includes('Alex')) || reportCards[0];
  const upcomingExams = examEvents.filter((e) => e.schoolId === currentSchool.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Parent &amp; Guardian Portal</span>
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              Verified Guardian
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor {childName}'s attendance, homework completion, exam marks, fee vouchers, and teacher communication.
          </p>
        </div>

        {/* Child Profile Card */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            AR
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">{childName}</span>
            <span className="text-[11px] text-slate-400 font-mono">Roll: {childRollNumber} · {childGrade}</span>
          </div>
        </div>
      </div>

      {/* METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Term Attendance</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
            96.5%
          </div>
          <span className="text-[11px] text-slate-400">Punctual &amp; present today</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Mid-Term Grade</span>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
            A+ <span className="text-sm font-normal text-slate-500">(88.25%)</span>
          </div>
          <span className="text-[11px] text-slate-400">Rank: 2nd in class</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Active Homework</span>
          <div className="text-2xl font-bold font-mono text-purple-600 tabular-nums mt-1">
            2 Due
          </div>
          <span className="text-[11px] text-slate-400">Biology &amp; Mathematics</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Monthly Tuition Fee</span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 flex items-center gap-1">
            <span>3,500 PKR</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Paid for Current Month</span>
        </div>
      </div>

      {/* TWO COLUMN GRID: ACADEMIC PROGRESS & COMMUNICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Homework & Report Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Homework Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Assigned Homework &amp; Deadlines</h2>
                <p className="text-xs text-slate-500">Check completed and upcoming task submissions.</p>
              </div>
              <span className="text-xs font-mono text-slate-500">{homeworkList.length} Tasks</span>
            </div>

            <div className="space-y-2">
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{hw.title}</span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {hw.subject}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Assigned by {hw.teacherName} · Due: <span className="font-mono text-rose-600 font-semibold">{hw.dueDate}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Submitted
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Card Highlight */}
          {childReport && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Latest Academic Report Card</h2>
                  <p className="text-xs text-slate-500">{childReport.term} · Official Result</p>
                </div>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('report-card')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Full Transcript</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Class Standing</span>
                    <span className="font-bold text-slate-900 text-sm">2nd Position in Class 10-A</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Marks Obtained</span>
                    <span className="font-bold font-mono text-blue-700 text-sm">{childReport.totalObtained} / {childReport.totalMarks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Percentage</span>
                    <span className="font-bold font-mono text-emerald-700 text-sm">{childReport.percentage}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-0.5">Teacher's Note:</span>
                  <p className="text-slate-600 italic">
                    "{childReport.classTeacherRemarks}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Teacher Messaging & Leave Request */}
        <div className="lg:col-span-4 space-y-6">
          {/* Direct Communication to Class Teacher */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Message Class Teacher</h2>
              <p className="text-xs text-slate-500">Contact Mrs. Sarah Jenkins (Head Teacher)</p>
            </div>

            {msgSent && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message sent to Mrs. Jenkins.</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-2 text-xs">
              <textarea
                rows={3}
                required
                placeholder="Ask teacher about child's progress, homework, or meeting..."
                value={parentMsg}
                onChange={(e) => setParentMsg(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Student Leave Application */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Submit Leave Application</h2>
              <p className="text-xs text-slate-500">Notify school administration of absence</p>
            </div>

            {leaveSubmitted && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Leave application approved and recorded.</span>
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Duration (Days)
                </label>
                <select
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="1">1 Day (Tomorrow)</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days (Medical Leave)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Reason for Absence
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fever / Family urgent visit"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Submit Absence Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

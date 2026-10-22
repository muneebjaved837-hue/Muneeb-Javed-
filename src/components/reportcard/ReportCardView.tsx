import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StudentReportCard } from '../../types';
import {
  Award,
  Printer,
  Download,
  Calendar,
  User,
  GraduationCap,
  CheckCircle2,
  Percent,
  TrendingUp,
  FileText,
  School as SchoolIcon
} from 'lucide-react';

export const ReportCardView: React.FC = () => {
  const { reportCards, currentSchool, currentUser } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.role === 'student' ? currentUser.id : reportCards[0]?.studentId || 'usr-student-1'
  );

  const activeReport =
    reportCards.find((r) => r.studentId === selectedStudentId) || reportCards[0];

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Official Examination Marks &amp; Report Cards</span>
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified Academic Record
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual subject marks, grading criteria, class standing, attendance metrics, and printable transcripts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* If teacher or admin, allow student switching */}
          {currentUser.role !== 'student' && (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {reportCards.map((r) => (
                <option key={r.id} value={r.studentId}>
                  {r.studentName} ({r.rollNumber})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* Printable Report Card Paper Document */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-8 sm:p-10 max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {currentSchool.name}
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                {currentSchool.address} · Institutional Code: <span className="font-mono font-bold text-blue-600">{currentSchool.code}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-widest border border-slate-300">
              {activeReport.term} Transcript
            </span>
          </div>
        </div>

        {/* Student Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Name</span>
            <span className="font-bold text-slate-900 text-sm">{activeReport.studentName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Roll Number</span>
            <span className="font-bold font-mono text-slate-900 text-sm">{activeReport.rollNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Class &amp; Section</span>
            <span className="font-bold text-slate-900 text-sm">{activeReport.grade}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
            <span className="font-bold font-mono text-slate-900 text-sm">{activeReport.issueDate}</span>
          </div>
        </div>

        {/* Subject Marks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-300">
              <tr>
                <th className="px-4 py-3 border-r border-slate-300">#</th>
                <th className="px-4 py-3 border-r border-slate-300">Subject</th>
                <th className="px-4 py-3 border-r border-slate-300 text-center">Max Marks</th>
                <th className="px-4 py-3 border-r border-slate-300 text-center">Obtained</th>
                <th className="px-4 py-3 border-r border-slate-300 text-center">%</th>
                <th className="px-4 py-3 border-r border-slate-300 text-center">Grade</th>
                <th className="px-4 py-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeReport.subjectMarks.map((sm, index) => {
                const pct = Math.round((sm.obtainedMarks / sm.totalMarks) * 100);
                return (
                  <tr key={sm.subject} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-slate-400 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 border-r border-slate-200">
                      {sm.subject}
                    </td>
                    <td className="px-4 py-3 font-mono text-center border-r border-slate-200">
                      {sm.totalMarks}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-center border-r border-slate-200 text-blue-700">
                      {sm.obtainedMarks}
                    </td>
                    <td className="px-4 py-3 font-mono text-center border-r border-slate-200">
                      {pct}%
                    </td>
                    <td className="px-4 py-3 text-center border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getGradeColor(sm.grade)}`}>
                        {sm.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 italic">
                      {sm.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="px-4 py-3 uppercase tracking-wider text-slate-900 border-r border-slate-300">
                  Consolidated Totals
                </td>
                <td className="px-4 py-3 text-center font-mono border-r border-slate-300">
                  {activeReport.totalMarks}
                </td>
                <td className="px-4 py-3 text-center font-mono text-blue-700 border-r border-slate-300">
                  {activeReport.totalObtained}
                </td>
                <td className="px-4 py-3 text-center font-mono border-r border-slate-300">
                  {activeReport.percentage}%
                </td>
                <td className="px-4 py-3 text-center border-r border-slate-300">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getGradeColor(activeReport.overallGrade)}`}>
                    {activeReport.overallGrade}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-[11px]">
                  Cumulative GPA Standard
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Academic Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Percentage</span>
            <span className="text-xl font-bold font-mono text-slate-900">{activeReport.percentage}%</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Final Grade</span>
            <span className="text-xl font-bold font-mono text-emerald-600">{activeReport.overallGrade}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Class Standing</span>
            <span className="text-xl font-bold font-mono text-blue-600">
              {activeReport.rankInClass} <span className="text-xs text-slate-400">/ {activeReport.totalStudentsInClass}</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Term Attendance</span>
            <span className="text-xl font-bold font-mono text-purple-600">{activeReport.attendancePercentage}%</span>
          </div>
        </div>

        {/* Official Remarks */}
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Class Teacher Official Remarks
            </span>
            <p className="text-xs text-slate-700 italic">
              "{activeReport.classTeacherRemarks}"
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Principal Evaluation &amp; Recommendation
            </span>
            <p className="text-xs text-slate-700 italic">
              "{activeReport.principalRemarks}"
            </p>
          </div>
        </div>

        {/* Signature Seals */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500">
          <div className="text-center">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <span>Class Teacher Signature</span>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 mx-auto mb-1">
              Official Seal
            </div>
            <span>Institutional Stamp</span>
          </div>

          <div className="text-center">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <span>Principal &amp; Director Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};

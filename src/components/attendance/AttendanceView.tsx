import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Check,
  UserCheck,
  Sparkles
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    users,
    attendance,
    markAttendance,
    getAttendanceForDateAndGrade,
    getStudentAttendanceStats,
  } = useSchool();

  const isStudent = currentUser.role === 'student';

  // Filters for Teacher/Admin
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10-A');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Filter students in active school and grade
  const classStudents = useMemo(() => {
    return users.filter(
      (u) => u.schoolId === currentSchool.id && u.role === 'student' && (!u.grade || u.grade === selectedGrade)
    );
  }, [users, currentSchool.id, selectedGrade]);

  // Current attendance records for date & grade
  const existingRecords = useMemo(() => {
    return getAttendanceForDateAndGrade(selectedDate, selectedGrade);
  }, [getAttendanceForDateAndGrade, selectedDate, selectedGrade, attendance]);

  // Working state for attendance table
  const [rowStatus, setRowStatus] = useState<Record<string, AttendanceStatus>>({});
  const [rowNotes, setRowNotes] = useState<Record<string, string>>({});

  // Populate rowStatus and notes when date/grade changes or records update
  React.useEffect(() => {
    const statusMap: Record<string, AttendanceStatus> = {};
    const notesMap: Record<string, string> = {};

    classStudents.forEach((st) => {
      const match = existingRecords.find((r) => r.studentId === st.id);
      statusMap[st.id] = match ? match.status : 'present';
      notesMap[st.id] = match?.notes || '';
    });

    setRowStatus(statusMap);
    setRowNotes(notesMap);
  }, [classStudents, existingRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRowStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNotesChange = (studentId: string, note: string) => {
    setRowNotes((prev) => ({ ...prev, [studentId]: note }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const nextStatus: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      nextStatus[st.id] = status;
    });
    setRowStatus(nextStatus);
  };

  const handleSaveAttendance = () => {
    const payload = classStudents.map((st) => ({
      studentId: st.id,
      status: rowStatus[st.id] || 'present',
      notes: rowNotes[st.id] || undefined,
    }));

    markAttendance(payload, selectedGrade, selectedDate);
    setSaveNotice('Attendance successfully recorded for ' + selectedGrade + ' on ' + selectedDate);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Compute live statistics for the selected class/date
  const stats = useMemo(() => {
    const total = classStudents.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach((st) => {
      const s = rowStatus[st.id] || 'present';
      if (s === 'present') present++;
      else if (s === 'absent') absent++;
      else if (s === 'late') late++;
      else if (s === 'excused') excused++;
    });

    const rate = total > 0 ? Math.round(((present + excused + late * 0.75) / total) * 100) : 100;
    return { total, present, absent, late, excused, rate };
  }, [classStudents, rowStatus]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Roll,Student Name,Grade,Date,Status,Notes\n';
    const rows = classStudents
      .map(
        (st) =>
          `"${st.rollNumber || 'N/A'}","${st.name}","${selectedGrade}","${selectedDate}","${
            rowStatus[st.id] || 'present'
          }","${rowNotes[st.id] || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedGrade.replace(/\s+/g, '_')}_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Student portal specific data
  const studentStats = getStudentAttendanceStats(currentUser.id);
  const myAttendanceHistory = attendance
    .filter((r) => r.schoolId === currentSchool.id && r.studentId === currentUser.id)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStudent ? 'My Attendance Record' : 'Attendance Register & Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'View your personal attendance history, percentage rating, and teacher absence notes.'
              : 'Record daily roll-call, review student presence rates, and export official records.'}
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Attendance</span>
            </button>
          </div>
        )}
      </div>

      {saveNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* STUDENT ROLE VIEW */}
      {isStudent ? (
        <div className="space-y-6">
          {/* Student Stats Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Overall Attendance</span>
              <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
                {studentStats.percentage}%
              </div>
              <span className="text-[11px] text-slate-400">Target: 85% or higher</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Present Days</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
                {studentStats.present}
              </div>
              <span className="text-[11px] text-slate-400">Full attendance</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Late Arrivals</span>
              <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums mt-1">
                {studentStats.late}
              </div>
              <span className="text-[11px] text-slate-400">Recorded by gate</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Excused Days</span>
              <div className="text-2xl font-bold font-mono text-sky-600 tabular-nums mt-1">
                {studentStats.excused}
              </div>
              <span className="text-[11px] text-slate-400">With medical notes</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Unexcused Absences</span>
              <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums mt-1">
                {studentStats.absent}
              </div>
              <span className="text-[11px] text-slate-400">Needs parent note</span>
            </div>
          </div>

          {/* Student Attendance Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Attendance Log for {currentUser.name}</h2>
              <span className="text-xs font-mono text-slate-500">
                Grade: {currentUser.grade || 'Grade 10-A'} · Roll: {currentUser.rollNumber || '1042'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Time Recorded</th>
                    <th className="px-6 py-3">Marked By</th>
                    <th className="px-6 py-3">Remarks / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myAttendanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No recorded attendance dates yet.
                      </td>
                    </tr>
                  ) : (
                    myAttendanceHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-mono text-slate-900 font-medium">
                          {rec.date}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 font-semibold capitalize ${
                              rec.status === 'present'
                                ? 'text-emerald-700'
                                : rec.status === 'late'
                                ? 'text-amber-700'
                                : rec.status === 'excused'
                                ? 'text-sky-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {rec.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {rec.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                            {rec.status === 'excused' && <AlertTriangle className="w-3.5 h-3.5" />}
                            {rec.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                            <span>{rec.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-500">
                          {rec.timeMarked}
                        </td>
                        <td className="px-6 py-3.5 text-slate-700">
                          {rec.markedBy}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">
                          {rec.notes || <span className="text-slate-400">Regular attendance</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TEACHER / ADMIN ATTENDANCE VIEW */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Grade Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Class:</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Grade 10-A">Grade 10-A (Science &amp; AP Math)</option>
                  <option value="Grade 10-B">Grade 10-B (General Humanities)</option>
                  <option value="Grade 9-A">Grade 9-A (Foundation Studies)</option>
                </select>
              </div>
            </div>

            {/* Quick Bulk Marking Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Bulk Actions:</span>
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
              >
                All Absent
              </button>
            </div>
          </div>

          {/* Class Attendance Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Class Enrolled</span>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {stats.total}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Present</span>
              <div className="text-xl font-bold font-mono text-emerald-600 tabular-nums mt-0.5">
                {stats.present}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Late</span>
              <div className="text-xl font-bold font-mono text-amber-600 tabular-nums mt-0.5">
                {stats.late}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Excused</span>
              <div className="text-xl font-bold font-mono text-sky-600 tabular-nums mt-0.5">
                {stats.excused}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Absent</span>
              <div className="text-xl font-bold font-mono text-rose-600 tabular-nums mt-0.5">
                {stats.absent}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Attendance Rate</span>
              <div className="text-xl font-bold font-mono text-blue-600 tabular-nums mt-0.5">
                {stats.rate}%
              </div>
            </div>
          </div>

          {/* Student Roll Call Marking Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="text-xs font-semibold text-slate-700">
                Roll Call Roster ({classStudents.length} Students)
              </div>
              <span className="text-xs text-slate-400">
                Marked by: {currentUser.name}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 w-20">Roll</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3 w-80">Attendance Status</th>
                    <th className="px-6 py-3">Absence Notes / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {classStudents.map((st) => {
                    const currentStatus = rowStatus[st.id] || 'present';
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3 font-mono font-medium text-slate-500">
                          {st.rollNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{st.name}</div>
                              <div className="text-[11px] text-slate-400">{st.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'present')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'late')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'excused')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                currentStatus === 'excused'
                                  ? 'bg-sky-600 text-white shadow-xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Excused
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(st.id, 'absent')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            placeholder="Optional note e.g. Doctor's note, athletic tournament..."
                            value={rowNotes[st.id] || ''}
                            onChange={(e) => handleNotesChange(st.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
              <span className="text-[11px] text-slate-500">
                Changes will be saved to your local school register.
              </span>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

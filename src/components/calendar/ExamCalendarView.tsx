import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ExamEvent, CalendarEventType } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  Printer,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ExamCalendarView: React.FC = () => {
  const { currentSchool, currentUser, examEvents, createExamEvent, deleteExamEvent } = useSchool();
  const isTeacherOrAdmin = currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'super_admin';

  // Calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | CalendarEventType>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExamEvent | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEventType>('exam');
  const [newSubject, setNewSubject] = useState('Biology');
  const [newGrade, setNewGrade] = useState('Grade 10-A');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('11:00');
  const [newRoom, setNewRoom] = useState('Main Examination Hall A');
  const [newSyllabus, setNewSyllabus] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(100);

  // Month Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return examEvents
      .filter((e) => e.schoolId === currentSchool.id)
      .filter((e) => {
        if (typeFilter !== 'all' && e.type !== typeFilter) return false;
        if (gradeFilter !== 'all' && e.grade !== gradeFilter && e.grade !== 'All Campus') return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }, [examEvents, currentSchool.id, typeFilter, gradeFilter]);

  // Map events by date YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: Record<string, ExamEvent[]> = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createExamEvent({
      title: newTitle.trim(),
      type: newType,
      subject: newSubject,
      grade: newGrade,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom.trim() || 'Room 101',
      syllabus: newSyllabus.trim() || 'Refer to classroom syllabus handout.',
      maxMarks: Number(newMaxMarks),
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewSyllabus('');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Exam &amp; Event Calendar
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Shared Schedule
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized test timetables, mid-terms, quizzes, and school events for students, faculty, and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isTeacherOrAdmin && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Test / Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Controls & Month Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Navigation month & year */}
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight w-44">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('exam')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'exam'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exams &amp; Tests
            </button>
            <button
              onClick={() => setTypeFilter('event')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'event'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campus Events
            </button>
          </div>

          {/* Grade filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Class: All Grades</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 9-A">Grade 9-A</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Schedule List ({filteredEvents.length})
            </button>
          </div>
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      {viewMode === 'month' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-600 py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200">
            {/* Empty padding for days before 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[105px] p-2 bg-slate-50/40" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const dayEvents = eventsByDate[dateStr] || [];

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors hover:bg-slate-50/60 ${
                    isToday ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {dayEvents.length} {dayEvents.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  {/* Event Badges list */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium truncate block transition-transform hover:scale-[1.01] ${
                          evt.type === 'exam' || evt.type === 'test'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                            : evt.type === 'event'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className="font-mono text-[10px] mr-1">{evt.startTime}</span>
                        <span>{evt.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* AGENDA LIST VIEW */
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">No scheduled exams or events</h3>
              <p className="text-xs text-slate-500 mt-1">There are no calendar items matching your selected filters.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`font-bold uppercase tracking-wider text-[10px] ${
                        evt.type === 'exam' || evt.type === 'test'
                          ? 'text-blue-700'
                          : evt.type === 'event'
                          ? 'text-purple-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-800">{evt.subject || 'Campus Wide'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.grade}</span>
                    {evt.maxMarks && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{evt.maxMarks} Marks</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{evt.syllabus}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{evt.date}</div>
                    <div>{evt.startTime} – {evt.endTime}</div>
                  </div>
                  <div className="text-right border-l border-slate-200 pl-4 text-slate-600 font-sans">
                    <div className="text-[11px] text-slate-400">Venue</div>
                    <div className="font-medium text-xs">{evt.room}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL: Event Details Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Official Exam / Event Record</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold uppercase tracking-wider text-blue-700">
                    {selectedEvent.type}
                  </span>
                  <span>·</span>
                  <span>{selectedEvent.grade}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedEvent.title}</h2>
              </div>

              {/* Timing & Venue Strip */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Date &amp; Time</span>
                  <span className="font-bold text-slate-800">{selectedEvent.date}</span>
                  <div className="text-slate-600">{selectedEvent.startTime} – {selectedEvent.endTime}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Hall / Room</span>
                  <span className="font-bold text-slate-800">{selectedEvent.room}</span>
                  {selectedEvent.maxMarks && (
                    <div className="text-blue-600 font-semibold">{selectedEvent.maxMarks} Max Marks</div>
                  )}
                </div>
              </div>

              {/* Syllabus / Requirements */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Tested Curriculum &amp; Syllabus</h4>
                <p className="text-xs text-slate-600 leading-relaxed p-3 bg-white border border-slate-200 rounded-lg">
                  {selectedEvent.syllabus}
                </p>
              </div>

              <div className="text-[11px] text-slate-400">
                Scheduled by: <span className="font-medium text-slate-600">{selectedEvent.createdBy}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                {isTeacherOrAdmin && (
                  <button
                    onClick={() => {
                      deleteExamEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Delete Schedule Entry
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Schedule</span>
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Test or Event */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Schedule Examination or Event</h2>
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
                  Test / Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term 1: Advanced Biology Examination"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CalendarEventType)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="exam">Major Exam / Board</option>
                    <option value="test">Classroom Test / Quiz</option>
                    <option value="event">School Assembly / Event</option>
                    <option value="holiday">Holiday / Recess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Audience</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="All Campus">All Campus (Whole School)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Auditorium Hall B"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Syllabus Breakdown &amp; Permitted Materials
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Chapters 4 through 7. Non-programmable scientific calculators permitted. No electronic devices."
                  value={newSyllabus}
                  onChange={(e) => setNewSyllabus(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Publish on Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

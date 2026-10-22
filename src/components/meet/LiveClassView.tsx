import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LiveClass, LiveClassStatus } from '../../types';
import { VirtualClassroomModal } from './VirtualClassroomModal';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Play,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  X
} from 'lucide-react';

export const LiveClassView: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    liveClasses,
    createLiveClass,
    updateLiveClassStatus,
    activeLiveModalClass,
    setActiveLiveModalClass,
  } = useSchool();

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | LiveClassStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Schedule Modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('Grade 10-A');
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('11:50');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [description, setDescription] = useState('');
  const [agenda1, setAgenda1] = useState('');
  const [agenda2, setAgenda2] = useState('');

  const handleCopyLink = (liveClass: LiveClass) => {
    navigator.clipboard.writeText(liveClass.meetLink);
    setCopiedCodeId(liveClass.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const agendaItems = [agenda1, agenda2].filter((a) => a.trim().length > 0);

    createLiveClass({
      title: title.trim(),
      subject,
      grade,
      scheduledDate,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes),
      description: description.trim(),
      agendaItems: agendaItems.length > 0 ? agendaItems : ['Core concepts review', 'Q&A session'],
      status: 'upcoming',
    });

    setIsScheduleOpen(false);
    setTitle('');
    setDescription('');
    setAgenda1('');
    setAgenda2('');
  };

  const filteredClasses = useMemo(() => {
    return liveClasses
      .filter((c) => c.schoolId === currentSchool.id)
      .filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.grade.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (a.status !== 'live' && b.status === 'live') return 1;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [liveClasses, currentSchool.id, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Google Meet Live Classes
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Integrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronous virtual classrooms with Google Meet video links, real-time live rooms, and timetable management.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Live Class</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Filter Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg self-start">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Classes
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'live'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Now
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'upcoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <Video className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No live classes scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isTeacherOrAdmin
                ? 'Click "Schedule Live Class" to organize a Google Meet lesson.'
                : 'Check back later for upcoming live sessions.'}
            </p>
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const isLive = cls.status === 'live';
            const isCopied = copiedCodeId === cls.id;

            return (
              <div
                key={cls.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-shadow hover:shadow-sm ${
                  isLive ? 'border-emerald-300 ring-1 ring-emerald-300 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Column: Metadata & Details */}
                  <div className="space-y-2 flex-1">
                    {/* Zero-Pill Text Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {isLive && (
                        <>
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>LIVE NOW</span>
                          </span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span className="font-semibold text-blue-700">{cls.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cls.grade}</span>
                      <span aria-hidden="true">·</span>
                      <span>Instructor: {cls.teacherName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{cls.durationMinutes} mins</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900">{cls.title}</h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">{cls.description}</p>

                    {/* Schedule Time & Meet Link Details */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cls.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cls.startTime} – {cls.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <span className="text-slate-400 font-normal">Room Code:</span>
                        <span>{cls.meetCode}</span>
                        <button
                          onClick={() => handleCopyLink(cls)}
                          title="Copy Google Meet Link"
                          className="text-slate-400 hover:text-blue-600 transition-colors ml-1"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 lg:border-l lg:border-slate-200 lg:pl-6">
                    {/* Launch Interactive Virtual Classroom Modal */}
                    <button
                      onClick={() => setActiveLiveModalClass(cls)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Join Live Classroom</span>
                    </button>

                    {/* Launch Official Google Meet in External Tab */}
                    <a
                      href={cls.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Google Meet</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    {/* Teacher Status Controls */}
                    {isTeacherOrAdmin && (
                      <div className="flex items-center gap-1 pt-1 sm:pt-0">
                        {cls.status === 'upcoming' && (
                          <button
                            onClick={() => updateLiveClassStatus(cls.id, 'live')}
                            className="px-2.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Start Session
                          </button>
                        )}
                        {cls.status === 'live' && (
                          <button
                            onClick={() => updateLiveClassStatus(cls.id, 'completed')}
                            className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                          >
                            End Class
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE LIVE CLASS MODAL */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Schedule Google Meet Class</h2>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Topic / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mendelian Genetics & Pedigree Analysis Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => {
                      const mins = Number(e.target.value);
                      setDurationMinutes(mins);
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={50}>50 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Objectives &amp; Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize the core topics, required textbook readings, and materials needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Key Agenda Points (Optional)
                </label>
                <input
                  type="text"
                  placeholder="1. Primary concept walk-through"
                  value={agenda1}
                  onChange={(e) => setAgenda1(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="2. Interactive problem solving / whiteboard"
                  value={agenda2}
                  onChange={(e) => setAgenda2(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE VIRTUAL CLASSROOM MODAL */}
      {activeLiveModalClass && (
        <VirtualClassroomModal
          liveClass={activeLiveModalClass}
          onClose={() => setActiveLiveModalClass(null)}
        />
      )}
    </div>
  );
};

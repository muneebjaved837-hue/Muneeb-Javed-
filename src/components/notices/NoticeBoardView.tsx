import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Notice, NoticePriority, NoticeAudience } from '../../types';
import {
  Bell,
  Pin,
  Plus,
  AlertCircle,
  FileCheck2,
  Calendar,
  Users,
  Trash2,
  X,
  Search,
  CheckCircle2,
  Megaphone
} from 'lucide-react';

export const NoticeBoardView: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    notices,
    createNotice,
    togglePinNotice,
    deleteNotice,
  } = useSchool();

  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<'all' | NoticePriority>('all');
  const [audienceFilter, setAudienceFilter] = useState<'all' | NoticeAudience>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Post Notice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<NoticePriority>('general');
  const [noticeAudience, setNoticeAudience] = useState<NoticeAudience>('all');
  const [noticeDepartment, setNoticeDepartment] = useState('Academic Office');
  const [noticePinned, setNoticePinned] = useState(false);

  // Read receipts acknowledgment simulation
  const [readNotices, setReadNotices] = useState<Record<string, boolean>>({});

  const handleToggleRead = (id: string) => {
    setReadNotices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    createNotice({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      priority: noticePriority,
      targetAudience: noticeAudience,
      department: noticeDepartment.trim() || 'Administration',
      pinned: noticePinned,
    });

    setIsModalOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticePinned(false);
  };

  // Filter notices for current school and audience permissions
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => n.schoolId === currentSchool.id)
      .filter((n) => {
        // Audience filter
        if (currentUser.role === 'student' && n.targetAudience === 'teachers') {
          return false;
        }
        if (audienceFilter !== 'all' && n.targetAudience !== audienceFilter && n.targetAudience !== 'all') {
          return false;
        }
        // Priority filter
        if (priorityFilter !== 'all' && n.priority !== priorityFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.department?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned first, then by date descending
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.date.localeCompare(a.date);
      });
  }, [notices, currentSchool.id, currentUser.role, audienceFilter, priorityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Broadcast &amp; Notice Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official announcements, examination dates, urgent advisories, and institution events.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            {(['all', 'urgent', 'exam', 'event', 'general'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setPriorityFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  priorityFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Notices' : cat}
              </button>
            ))}
          </div>

          {/* Target Audience Dropdown */}
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value as any)}
            className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Audience: All School</option>
            <option value="teachers">Audience: Teachers Only</option>
            <option value="students">Audience: Students Only</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-3.5">
        {filteredNotices.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No notices found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no announcements matching your current filters.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isRead = !!readNotices[notice.id];

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-shadow hover:shadow-sm ${
                  notice.pinned
                    ? 'border-blue-300/80 bg-blue-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Zero-Pill Unboxed Text Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {notice.pinned && (
                        <>
                          <span className="flex items-center gap-1 font-semibold text-blue-600">
                            <Pin className="w-3 h-3 fill-blue-600" />
                            <span>Pinned</span>
                          </span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}

                      <span
                        className={`font-semibold uppercase tracking-wider text-[11px] ${
                          notice.priority === 'urgent'
                            ? 'text-rose-600 font-bold'
                            : notice.priority === 'exam'
                            ? 'text-amber-600 font-bold'
                            : notice.priority === 'event'
                            ? 'text-indigo-600 font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        {notice.priority}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">Audience: {notice.targetAudience}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{notice.date}</span>
                      {notice.department && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Dept: {notice.department}</span>
                        </>
                      )}
                    </div>

                    {/* Notice Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {notice.title}
                    </h3>

                    {/* Notice Content */}
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    {/* Footer author note */}
                    <div className="text-[11px] text-slate-400 pt-1">
                      Posted by: <span className="font-medium text-slate-600">{notice.authorName}</span> ({notice.authorRole})
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleToggleRead(notice.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        isRead
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isRead ? 'Acknowledged' : 'Mark as Read'}
                    </button>

                    {isTeacherOrAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinNotice(notice.id)}
                          title={notice.pinned ? 'Unpin Notice' : 'Pin Notice'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            notice.pinned
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNotice(notice.id)}
                          title="Delete Notice"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Post New Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Broadcast Campus Notice</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Grade 10 Science Olympiad Preliminaries"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Tag
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as NoticePriority)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="general">General Information</option>
                    <option value="urgent">Urgent / Safety Advisory</option>
                    <option value="exam">Examination / Timetable</option>
                    <option value="event">Campus Event / Assembly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as NoticeAudience)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">Entire Campus (All)</option>
                    <option value="teachers">Faculty Only</option>
                    <option value="students">Students Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Office
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Faculty, Dean of Students, Health Clinic..."
                  value={noticeDepartment}
                  onChange={(e) => setNoticeDepartment(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Body
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter complete circular text with location, dates, requirements, or links..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={noticePinned}
                  onChange={(e) => setNoticePinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pinNotice" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin to top of Notice Board for maximum visibility
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DayOfWeek } from '../../types';
import {
  Clock,
  Calendar,
  BookOpen,
  MapPin,
  User,
  Video,
  Printer,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const TimetableView: React.FC = () => {
  const { timetable, currentSchool, currentUser, setActiveLiveModalClass, liveClasses } = useSchool();

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10-A');

  // Filter periods for the active day and grade
  const periodsForDay = timetable
    .filter((p) => p.day === selectedDay && p.grade === selectedGrade)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Campus Timetable &amp; Bell Schedule</span>
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Weekly Routine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily periods, subject schedules, allocated classrooms, and assigned subject teachers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Grade 10-A">Grade 10-A (Science)</option>
            <option value="Grade 10-B">Grade 10-B (Arts &amp; Computer)</option>
            <option value="Grade 9-A">Grade 9-A</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Day Selector Navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[110px] py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Periods List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{selectedDay} Period Schedule</h2>
            <p className="text-xs text-slate-500">
              {currentSchool.name} · {selectedGrade} · Regular Bell Schedule
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600">
            {periodsForDay.length} Periods Scheduled
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {periodsForDay.map((period, index) => {
            const isFirst = index === 0;
            // Check if there is a matching live virtual class
            const matchedLive = liveClasses.find(
              (c) =>
                c.schoolId === currentSchool.id &&
                c.subject.toLowerCase().includes(period.subject.toLowerCase())
            );

            return (
              <div
                key={period.id}
                className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Period Badge */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Period</span>
                    <span className="text-base font-bold font-mono text-slate-900">{period.periodNumber}</span>
                  </div>

                  {/* Period Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{period.subject}</span>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {period.timeRange}
                      </span>
                      {isFirst && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Morning Session</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{period.teacherName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{period.room}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {matchedLive && (
                    <button
                      onClick={() => setActiveLiveModalClass(matchedLive)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Meet</span>
                    </button>
                  )}
                  <div className="text-[11px] font-medium text-slate-400 font-mono hidden md:block">
                    45 mins
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

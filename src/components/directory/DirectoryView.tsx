import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';
import {
  Users,
  Building,
  GraduationCap,
  ShieldCheck,
  UserCheck2,
  Plus,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export const DirectoryView: React.FC = () => {
  const { currentSchool, currentUser, users, setCurrentUser } = useSchool();
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Member Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newGrade, setNewGrade] = useState('Grade 10-A');
  const [newSubject, setNewSubject] = useState('Physical Sciences');

  const schoolMembers = users.filter((u) => u.schoolId === currentSchool.id);

  const filteredMembers = schoolMembers.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.grade && u.grade.toLowerCase().includes(q)) ||
        (u.subject && u.subject.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Roster &amp; Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of enrolled students, teachers, and school administrators for {currentSchool.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
            School Code: <span className="font-bold text-blue-600">{currentSchool.code}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg self-start">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Members ({schoolMembers.length})
          </button>
          <button
            onClick={() => setRoleFilter('teacher')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              roleFilter === 'teacher'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Teachers
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              roleFilter === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              roleFilter === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administration
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isCurrent = member.id === currentUser.id;

          return (
            <div
              key={member.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-shadow hover:shadow-sm ${
                isCurrent ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 text-sm font-bold flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{member.name}</h3>
                    <div className="text-[11px] text-slate-500 capitalize flex items-center gap-1">
                      {member.role === 'admin' && <ShieldCheck className="w-3 h-3 text-indigo-600" />}
                      {member.role === 'teacher' && <UserCheck2 className="w-3 h-3 text-blue-600" />}
                      {member.role === 'student' && <GraduationCap className="w-3 h-3 text-emerald-600" />}
                      <span>{member.role}</span>
                    </div>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentUser(member)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Switch to
                  </button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                {member.grade && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span className="font-medium text-slate-800">{member.grade}</span>
                  </div>
                )}
                {member.rollNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roll Number:</span>
                    <span className="font-mono text-slate-800">{member.rollNumber}</span>
                  </div>
                )}
                {member.subject && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subject:</span>
                    <span className="font-medium text-slate-800">{member.subject}</span>
                  </div>
                )}
                {member.title && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Designation:</span>
                    <span className="font-medium text-slate-800">{member.title}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

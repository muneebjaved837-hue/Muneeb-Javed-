import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { School } from '../../types';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  XCircle,
  Building,
  Zap,
  TrendingUp,
  DollarSign,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  RefreshCw,
  Award,
  Check
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    schools,
    currentSchool,
    switchSchool,
    createSchool,
    deleteSchool,
    updateSchoolPlan,
    users,
    savedQuizzes,
    quizAttempts,
    updateSchoolAiQuota,
    toggleSchoolSuspension,
    setSchoolFreeAccess,
    addSchoolQuotaQuizzes,
    resetSchoolQuotaUsage,
    resetAllData,
  } = useSchool();

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'free'>('all');

  // Active School for Quota Edit Modal
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [quizzesLimitInput, setQuizzesLimitInput] = useState<number>(150);
  const [tokensLimitInput, setTokensLimitInput] = useState<number>(500000);
  const [expiryInput, setExpiryInput] = useState<string>('2027-01-01');
  const [freeAccessToggle, setFreeAccessToggle] = useState<boolean>(false);
  const [planInput, setPlanInput] = useState<'starter' | 'pro' | 'enterprise'>('pro');

  // New School Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolMotto, setNewSchoolMotto] = useState('');
  const [newSchoolAddress, setNewSchoolAddress] = useState('');
  const [newSchoolColor, setNewSchoolColor] = useState('#2563eb');

  // Flash Message
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 3000);
  };

  // System Wide Calculations
  const totalSchools = schools.length;
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const totalSavedQuizzes = savedQuizzes.length;
  const totalQuizAttempts = quizAttempts.length;

  // Smart System Logic: Estimated AI API dollars saved by reusing stored bank instead of calling live LLM!
  const estimatedCostSaved = Math.round((totalSavedQuizzes * 14 + totalQuizAttempts) * 0.05 * 100) / 100;

  // Filtered schools
  const filteredSchools = schools.filter((sch) => {
    const q = sch.aiQuota || {
      isSuspended: false,
      freeAccessGranted: false,
    };

    const matchesSearch =
      sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return !q.isSuspended;
    if (statusFilter === 'suspended') return !!q.isSuspended;
    if (statusFilter === 'free') return !!q.freeAccessGranted;
    return true;
  });

  const handleOpenEdit = (school: School) => {
    setSelectedSchool(school);
    const q = school.aiQuota || {
      monthlyQuizzesLimit: 150,
      monthlyTokensLimit: 500000,
      freeTrialExpiry: '2027-01-01',
      freeAccessGranted: false,
      isSuspended: false,
      quizzesGeneratedThisMonth: 0,
      tokensUsedThisMonth: 0,
    };
    setQuizzesLimitInput(q.monthlyQuizzesLimit);
    setTokensLimitInput(q.monthlyTokensLimit);
    setExpiryInput(q.freeTrialExpiry || '2027-01-01');
    setFreeAccessToggle(!!q.freeAccessGranted);
    setPlanInput(school.plan || 'pro');
  };

  const handleSaveQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    updateSchoolAiQuota(selectedSchool.id, {
      monthlyQuizzesLimit: Number(quizzesLimitInput),
      monthlyTokensLimit: Number(tokensLimitInput),
    });

    setSchoolFreeAccess(selectedSchool.id, freeAccessToggle, expiryInput);
    updateSchoolPlan(selectedSchool.id, planInput);
    showFlash(`Settings updated for ${selectedSchool.name}`);
    setSelectedSchool(null);
  };

  const handleCreateNewSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    const created = createSchool({
      name: newSchoolName.trim(),
      motto: newSchoolMotto.trim() || 'Inspiring Academic Excellence',
      address: newSchoolAddress.trim() || 'Main City Campus',
      logoColor: newSchoolColor,
    });

    setIsCreateModalOpen(false);
    setNewSchoolName('');
    setNewSchoolMotto('');
    setNewSchoolAddress('');
    showFlash(`New institution "${created.name}" registered with join code ${created.code}!`);
  };

  const handleQuickAddQuizzes = (schoolId: string, amount: number, schoolName: string) => {
    addSchoolQuotaQuizzes(schoolId, amount);
    showFlash(`Added +${amount} quizzes to ${schoolName}`);
  };

  const handleResetUsage = (schoolId: string, schoolName: string) => {
    resetSchoolQuotaUsage(schoolId);
    showFlash(`Reset monthly AI quota usage to 0 for ${schoolName}`);
  };

  const handleDeleteCampus = (school: School) => {
    if (confirm(`Are you sure you want to remove ${school.name} (${school.code}) from the platform?`)) {
      deleteSchool(school.id);
      showFlash(`Removed ${school.name} from platform`);
    }
  };

  const setExpiryPreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpiryInput(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Super Admin Console &amp; Platform Controls
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              Master Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Global institution management, AI token allocations, subscription overrides, and platform telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New School</span>
          </button>
        </div>
      </div>

      {/* FLASH NOTIFICATION */}
      {flashMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{flashMessage}</span>
          </div>
          <button onClick={() => setFlashMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* GLOBAL TELEMETRY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Enrolled Institutions</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalSchools}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>{schools.filter((s) => !s.aiQuota?.isSuspended).length} Active</span>
            <span>{schools.filter((s) => s.aiQuota?.isSuspended).length} Suspended</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Quizzes in Central Bank</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {totalSavedQuizzes}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalQuizAttempts} student test sessions taken
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>AI Cloud Cost Saved</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            ${estimatedCostSaved} USD
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Reusing bank vs calling live Gemini
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Platform User Accounts</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600 tabular-nums">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalStudents} students · {totalTeachers} teachers
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search school name or join code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({schools.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active ({schools.filter((s) => !s.aiQuota?.isSuspended).length})
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'suspended'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Suspended ({schools.filter((s) => s.aiQuota?.isSuspended).length})
          </button>
          <button
            onClick={() => setStatusFilter('free')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'free'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Free Overrides ({schools.filter((s) => s.aiQuota?.freeAccessGranted).length})
          </button>
        </div>
      </div>

      {/* SCHOOLS CONTROL TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Registered Institutions &amp; AI Quotas</h2>
            <p className="text-xs text-slate-500">
              Control school statuses, adjust limits, grant free passes, and switch campus view with 1 click.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Showing {filteredSchools.length} of {schools.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">School Name / Code</th>
                <th className="px-6 py-3">Plan &amp; Students</th>
                <th className="px-6 py-3">AI Quota (Quizzes)</th>
                <th className="px-6 py-3">Free Access / Expiry</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSchools.map((sch) => {
                const quota = sch.aiQuota || {
                  monthlyQuizzesLimit: 150,
                  quizzesGeneratedThisMonth: 0,
                  monthlyTokensLimit: 500000,
                  tokensUsedThisMonth: 0,
                  freeTrialExpiry: '2027-01-01',
                  isSuspended: false,
                  freeAccessGranted: false,
                };
                const isSuspended = !!quota.isSuspended;
                const isFree = !!quota.freeAccessGranted;
                const isCurrent = currentSchool.id === sch.id;
                const usagePercent = Math.min(
                  100,
                  Math.round((quota.quizzesGeneratedThisMonth / (quota.monthlyQuizzesLimit || 1)) * 100)
                );

                return (
                  <tr key={sch.id} className={`hover:bg-slate-50/50 ${isCurrent ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sch.logoColor || '#2563eb' }}
                        />
                        <div className="font-semibold text-slate-900">{sch.name}</div>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                            Active Campus
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 font-bold mt-0.5">
                        Code: {sch.code}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800 capitalize">
                        {sch.plan} Tier
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sch.stats?.totalStudents || 0} students · {sch.stats?.totalTeachers || 0} staff
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-mono">
                      <div className="flex items-center justify-between text-slate-900 font-bold tabular-nums mb-1">
                        <span>{quota.quizzesGeneratedThisMonth} / {quota.monthlyQuizzesLimit}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{usagePercent}%</span>
                      </div>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            usagePercent > 90 ? 'bg-rose-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {Math.round((quota.tokensUsedThisMonth || 0) / 1000)}k / {Math.round((quota.monthlyTokensLimit || 500000) / 1000)}k tokens
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-mono">
                      {isFree ? (
                        <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
                          Free Pass ({quota.freeTrialExpiry})
                        </span>
                      ) : (
                        <span className="text-slate-600">Expires: {quota.freeTrialExpiry}</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      {isSuspended ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Switch School Quick Button */}
                        <button
                          onClick={() => {
                            switchSchool(sch.id);
                            showFlash(`Switched view to ${sch.name}`);
                          }}
                          title="Switch to inspect this campus portal"
                          className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{isCurrent ? 'Viewing' : 'Switch'}</span>
                        </button>

                        {/* Quick +50 Quizzes */}
                        <button
                          onClick={() => handleQuickAddQuizzes(sch.id, 50, sch.name)}
                          title="Add 50 Quizzes to this month's quota"
                          className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                        >
                          +50
                        </button>

                        {/* Reset Quota Usage */}
                        <button
                          onClick={() => handleResetUsage(sch.id, sch.name)}
                          title="Reset monthly quizzes generated count back to 0"
                          className="p-1 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Adjust Full Quota Modal */}
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                        >
                          Settings
                        </button>

                        {/* Suspend / Reactivate */}
                        <button
                          onClick={() => {
                            toggleSchoolSuspension(sch.id);
                            showFlash(
                              `${sch.name} has been ${isSuspended ? 'Reactivated' : 'Suspended'}`
                            );
                          }}
                          className={`px-2 py-1 text-xs font-semibold rounded-md border transition-colors ${
                            isSuspended
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                              : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          }`}
                        >
                          {isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>

                        {/* Delete School */}
                        {schools.length > 1 && (
                          <button
                            onClick={() => handleDeleteCampus(sch)}
                            title="Delete this school"
                            className="p-1 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Adjust School AI Quota & Free Access */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage Quota, Access &amp; Tier</h3>
                <span className="text-xs text-slate-500">{selectedSchool.name} ({selectedSchool.code})</span>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuota} className="space-y-4 text-xs">
              {/* Plan Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subscription Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'pro', 'enterprise'] as const).map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setPlanInput(tier)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                        planInput === tier
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quotas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly AI Quizzes Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    required
                    value={quizzesLimitInput}
                    onChange={(e) => setQuizzesLimitInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly Token Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000000"
                    required
                    value={tokensLimitInput}
                    onChange={(e) => setTokensLimitInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Expiry Date & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Subscription / Free Pass Expiry Date
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setExpiryPreset(30)}
                      className="text-[10px] text-blue-600 hover:underline px-1"
                    >
                      +30 Days
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => setExpiryPreset(90)}
                      className="text-[10px] text-blue-600 hover:underline px-1"
                    >
                      +90 Days
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => setExpiryPreset(365)}
                      className="text-[10px] text-blue-600 hover:underline px-1"
                    >
                      +1 Year
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  required
                  value={expiryInput}
                  onChange={(e) => setExpiryInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Free Access Override Toggle */}
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg flex items-start gap-3">
                <input
                  type="checkbox"
                  id="freeAccessCheck"
                  checked={freeAccessToggle}
                  onChange={(e) => setFreeAccessToggle(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label htmlFor="freeAccessCheck" className="font-semibold text-purple-900 cursor-pointer block">
                    Grant Free Unlimited Access Override
                  </label>
                  <p className="text-[11px] text-purple-700 mt-0.5">
                    Gives faculty and students uninterrupted access to AI quizzes and saved bank without subscription payment checks until the expiry date.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedSchool(null)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register New School */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Register New School / Campus</h3>
                <span className="text-xs text-slate-500">Auto-generates school code and default admin account.</span>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewSchool} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crescent City High School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campus Motto / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inspiring Knowledge, Leading the Future"
                  value={newSchoolMotto}
                  onChange={(e) => setNewSchoolMotto(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campus Location / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 University Ave, Seattle, WA"
                  value={newSchoolAddress}
                  onChange={(e) => setNewSchoolAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campus Theme Color
                </label>
                <div className="flex items-center gap-2">
                  {['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setNewSchoolColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newSchoolColor === color ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Create Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

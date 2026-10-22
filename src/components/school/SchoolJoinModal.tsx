import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';
import {
  X,
  School as SchoolIcon,
  PlusCircle,
  Copy,
  Check,
  Share2,
  Users,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface SchoolJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolJoinModal: React.FC<SchoolJoinModalProps> = ({ isOpen, onClose }) => {
  const { currentSchool, schools, joinSchoolByCode, createSchool, generateOTP, verifyOTPLogin } = useSchool();
  const [activeTab, setActiveTab] = useState<'otp' | 'join' | 'create' | 'info'>('otp');

  // OTP Login state
  const [otpPhoneOrEmail, setOtpPhoneOrEmail] = useState('student@oakridge.edu');
  const [otpSchoolCode, setOtpSchoolCode] = useState('OAKR-2026');
  const [otpRole, setOtpRole] = useState<UserRole>('student');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpFeedback, setOtpFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Standard Join state
  const [joinCode, setJoinCode] = useState('');
  const [joinRole, setJoinRole] = useState<UserRole>('student');
  const [joinName, setJoinName] = useState('');
  const [joinFeedback, setJoinFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Create school state
  const [schoolName, setSchoolName] = useState('');
  const [schoolMotto, setSchoolMotto] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [createdFeedback, setCreatedFeedback] = useState<string | null>(null);

  // Copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // OTP Request
  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhoneOrEmail.trim() || !otpSchoolCode.trim()) return;

    const code = generateOTP(otpPhoneOrEmail);
    setGeneratedOtpCode(code);
    setOtpStep('verify');
    setOtpCodeInput(code); // Pre-fill for instant frictionless demo testing
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyOTPLogin(otpPhoneOrEmail, otpCodeInput, otpSchoolCode, otpRole);
    setOtpFeedback(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
        setOtpFeedback(null);
        setOtpStep('request');
      }, 1400);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const result = joinSchoolByCode(joinCode, joinRole, joinName);
    setJoinFeedback(result);
    if (result.success) {
      setTimeout(() => {
        onClose();
        setJoinFeedback(null);
        setJoinCode('');
      }, 1400);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    const newSchool = createSchool({
      name: schoolName,
      motto: schoolMotto,
      address: schoolAddress,
      logoColor: accentColor,
    });

    setCreatedFeedback(`Created "${newSchool.name}"! Unique Join Code is ${newSchool.code}.`);
    setTimeout(() => {
      onClose();
      setCreatedFeedback(null);
      setSchoolName('');
      setSchoolMotto('');
      setSchoolAddress('');
    }, 1600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSchool.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/?join=${currentSchool.code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <SchoolIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">School Onboarding &amp; OTP Access</h2>
              <p className="text-xs text-slate-500">Connect via 6-digit OTP login, campus invite code, or create a school</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Filter Control */}
        <div className="px-6 pt-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('otp')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors text-center ${
                activeTab === 'otp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OTP Login
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors text-center ${
                activeTab === 'join'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Join by Code
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors text-center ${
                activeTab === 'create'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create School
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors text-center ${
                activeTab === 'info'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School Code
            </button>
          </div>
        </div>

        {/* TAB 1: OTP Login System (Requested Feature) */}
        {activeTab === 'otp' && (
          <div className="p-6 space-y-4">
            {otpStep === 'request' ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number or Student / Teacher Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +92 300 1234567 or student@oakridge.edu"
                    value={otpPhoneOrEmail}
                    onChange={(e) => setOtpPhoneOrEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School Invite Code
                    </label>
                    <input
                      type="text"
                      required
                      value={otpSchoolCode}
                      onChange={(e) => setOtpSchoolCode(e.target.value.toUpperCase())}
                      className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      value={otpRole}
                      onChange={(e) => setOtpRole(e.target.value as UserRole)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">School Admin</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
                  A 6-digit one-time password (OTP) verification code will be generated for instant authentication and automatic dashboard routing.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              /* OTP VERIFICATION STEP */
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center space-y-1">
                  <KeyRound className="w-8 h-8 text-blue-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-900">Enter Verification Code</h3>
                  <p className="text-xs text-slate-500">
                    Sent to <span className="font-semibold text-slate-700">{otpPhoneOrEmail}</span>
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs flex items-center justify-between font-mono">
                  <span className="text-blue-800">Generated OTP Code:</span>
                  <span className="text-base font-bold text-blue-900 tracking-widest">{generatedOtpCode}</span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                    className="w-full text-center text-xl font-mono font-bold tracking-widest px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {otpFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      otpFeedback.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {otpFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{otpFeedback.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOtpStep('request')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Phone/Email
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Verify &amp; Enter Campus
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Standard Code Join */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoinSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                School Join Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. OAKR-2026 or SJCA-9102"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full text-sm font-mono tracking-wider font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white uppercase"
              />
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                <span>Available codes:</span>
                <button
                  type="button"
                  onClick={() => setJoinCode('OAKR-2026')}
                  className="font-mono text-blue-600 hover:underline"
                >
                  OAKR-2026
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setJoinCode('SJCA-9102')}
                  className="font-mono text-blue-600 hover:underline"
                >
                  SJCA-9102
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Join As Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setJoinRole(r)}
                    className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-colors text-center ${
                      joinRole === r
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Liam Foster"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {joinFeedback && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  joinFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {joinFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{joinFeedback.message}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Enroll &amp; Join
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Create New School */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                School / Institution Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cambridge Heights Academy"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Motto
              </label>
              <input
                type="text"
                placeholder="e.g. Empowering Leaders of Tomorrow"
                value={schoolMotto}
                onChange={(e) => setSchoolMotto(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Address
              </label>
              <input
                type="text"
                placeholder="e.g. 700 University Ave, Cambridge, MA"
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {createdFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{createdFeedback}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Create Campus
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: Current School Info */}
        {activeTab === 'info' && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 mb-1">Active Institution</div>
              <div className="text-base font-bold text-slate-900">{currentSchool.name}</div>
              <div className="text-xs text-slate-600 italic mt-0.5">{currentSchool.motto}</div>
              <div className="text-xs text-slate-500 mt-2">{currentSchool.address}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official School Join Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 font-mono text-base font-bold tracking-widest text-blue-700 text-center">
                  {currentSchool.code}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Direct Invite Link'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

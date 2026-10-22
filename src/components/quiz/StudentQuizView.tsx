import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SavedQuiz, StudentQuizAttempt } from '../../types';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  Award,
  Zap,
  Clock,
  Search,
  Lock,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';

export const StudentQuizView: React.FC = () => {
  const {
    currentSchool,
    currentUser,
    savedQuizzes,
    recordQuizAttempt,
    quizAttempts,
    searchSavedDatabaseDoubt,
    askLiveAiDoubt,
    upgradeStudentToPaid,
  } = useSchool();

  // Active view: 'list' | 'quiz' | 'doubts'
  const [subView, setSubView] = useState<'list' | 'quiz' | 'doubts'>('list');
  const [activeQuiz, setActiveQuiz] = useState<SavedQuiz | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  // AI Doubt State
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Biology');
  const [doubtChapter, setDoubtChapter] = useState('Cellular Respiration');
  const [isAskingLive, setIsAskingLive] = useState(false);
  const [liveAnswer, setLiveAnswer] = useState<string | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [remainingLiveQuota, setRemainingLiveQuota] = useState<number>(
    3 - (currentUser.liveAiDailyUsed || 0)
  );

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Filter school quizzes
  const schoolQuizzes = savedQuizzes.filter((q) => q.schoolId === currentSchool.id);

  // Student progress stats
  const myAttempts = quizAttempts.filter((a) => a.studentId === currentUser.id);
  const avgScore =
    myAttempts.length > 0
      ? Math.round(myAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / myAttempts.length)
      : 0;

  const handleStartQuiz = (quiz: SavedQuiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentScore(0);
    setSubView('quiz');
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    let score = 0;
    activeQuiz.mcqs.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });

    const total = activeQuiz.mcqs.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 100;

    setCurrentScore(score);
    setIsSubmitted(true);

    recordQuizAttempt({
      quizId: activeQuiz.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      score,
      totalMarks: total,
      percentage,
      selectedAnswers,
    });
  };

  // Search Type A (Database)
  const savedDatabaseMatches = searchSavedDatabaseDoubt(doubtQuestion);

  // Ask Type B (Live AI)
  const handleAskLiveAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;

    setIsAskingLive(true);
    setLiveError(null);
    setLiveAnswer(null);

    const result = await askLiveAiDoubt(doubtQuestion, doubtSubject, doubtChapter);
    setIsAskingLive(false);

    if (result.error) {
      setLiveError(result.error);
    } else {
      setLiveAnswer(result.answer);
      setRemainingLiveQuota(result.remainingQuota);
    }
  };

  const handleUpgrade50Pkr = () => {
    upgradeStudentToPaid(currentUser.id);
    setShowUpgradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Practice Hub &amp; AI Doubt Solver
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your knowledge with teacher-verified chapter quizzes and get instant explanations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSubView('list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              subView === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quizzes ({schoolQuizzes.length})
          </button>
          <button
            onClick={() => setSubView('doubts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              subView === 'doubts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Doubts Helper</span>
          </button>
        </div>
      </div>

      {/* STUDENT PROGRESS METRIC STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Quizzes Solved</span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {myAttempts.length}
          </div>
          <span className="text-[11px] text-slate-400">Lifetime attempts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Average Score</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums mt-1">
            {avgScore}%
          </div>
          <span className="text-[11px] text-slate-400">Target: 80%+</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">AI Plan Status</span>
          <div className="text-sm font-bold mt-1.5 flex items-center gap-1.5">
            {currentUser.isPaidStudent ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs font-semibold">
                Paid Student (50 PKR)
              </span>
            ) : (
              <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs font-medium">
                Free Student
              </span>
            )}
          </div>
          {!currentUser.isPaidStudent && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="text-[11px] text-blue-600 hover:underline font-semibold mt-1 block"
            >
              Unlock Live AI (50 PKR) →
            </button>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Daily Live AI Quota</span>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums mt-1">
            {remainingLiveQuota} / 3
          </div>
          <span className="text-[11px] text-slate-400">Questions left today</span>
        </div>
      </div>

      {/* VIEW 1: QUIZZES LIST */}
      {subView === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Available Chapter Quiz Bank</h2>
            <span className="text-xs font-mono text-slate-500">Teacher Curated · Unlimited Free Attempts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schoolQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{quiz.className}</span>
                    <span className="font-mono">{quiz.mcqs.length} MCQs</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{quiz.title}</h3>
                  <div className="text-xs text-slate-600 font-medium">{quiz.chapterName}</div>
                  <div className="text-[11px] text-slate-400 italic">
                    Textbook: {quiz.bookName} ({quiz.author})
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Curated by: {quiz.createdByTeacherName}
                  </span>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Start Practice</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE QUIZ PRACTICE SESSION */}
      {subView === 'quiz' && activeQuiz && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-mono text-blue-700 font-semibold">{activeQuiz.className} · {activeQuiz.chapterName}</div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h2>
            </div>
            <button
              onClick={() => setSubView('list')}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
            >
              Exit to Quiz List
            </button>
          </div>

          {/* MCQs Question list */}
          <div className="space-y-6">
            {activeQuiz.mcqs.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="text-xs font-bold text-slate-900">
                    Question {idx + 1} of {activeQuiz.mcqs.length}: {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedOpt === oIdx;
                      const isOptionCorrect = oIdx === q.correctOptionIndex;

                      let buttonStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                      if (isSubmitted) {
                        if (isOptionCorrect) {
                          buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          buttonStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                        }
                      } else if (isOptionSelected) {
                        buttonStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${buttonStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-mono text-[10px] text-slate-500">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isSubmitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {isSubmitted && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Display once submitted */}
                  {isSubmitted && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 mt-2 space-y-1">
                      <span className="font-semibold text-slate-800">Conceptual Explanation: </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {isSubmitted ? (
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-slate-900">
                  Your Score: <span className="font-mono text-emerald-600">{currentScore} / {activeQuiz.mcqs.length}</span> ({Math.round((currentScore / activeQuiz.mcqs.length) * 100)}%)
                </div>
                <button
                  onClick={() => handleStartQuiz(activeQuiz)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < activeQuiz.mcqs.length}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors ml-auto"
              >
                Submit Answers &amp; Check Score
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: AI DOUBTS SOLVER (TYPE A: DATABASE & TYPE B: LIVE AI) */}
      {subView === 'doubts' && (
        <div className="space-y-6">
          {/* Explanation Card */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Smart Hybrid AI Doubt Architecture</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Priority 1 (Type A):</strong> Searches our verified school database quiz bank for instant 0-cost answers.
              <br />
              <strong>Priority 2 (Type B):</strong> If not in database, connects to Live Gemini AI with a daily quota of 3 questions/day.
            </p>
          </div>

          {/* Question Input Form */}
          <form onSubmit={handleAskLiveAi} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter</label>
                <input
                  type="text"
                  value={doubtChapter}
                  onChange={(e) => setDoubtChapter(e.target.value)}
                  placeholder="e.g. Cellular Respiration, Quadratic Curves..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type Your Specific Academic Doubt / Question
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Why is the inner mitochondrial membrane impermeable to hydrogen ions without ATP synthase?"
                value={doubtQuestion}
                onChange={(e) => setDoubtQuestion(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500 font-mono">
                Daily Live AI: <span className="font-bold text-blue-600">{remainingLiveQuota} / 3</span> questions remaining
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isAskingLive || !doubtQuestion.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAskingLive ? 'Consulting Gemini AI...' : 'Ask Doubt Solver'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Error notice */}
          {liveError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs flex items-center justify-between">
              <span>{liveError}</span>
              {!currentUser.isPaidStudent && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-[11px]"
                >
                  Upgrade (50 PKR)
                </button>
              )}
            </div>
          )}

          {/* TYPE A: Instant Saved Database Matches */}
          {savedDatabaseMatches.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Found in School Database Bank (Instant 0-Cost Answer)</span>
              </div>
              <div className="space-y-3">
                {savedDatabaseMatches.map((m, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/50 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-slate-900">Q: {m.question}</div>
                    <div className="text-emerald-950 font-medium">A: {m.answer}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Source: {m.sourceQuiz}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPE B: Live AI Generated Answer */}
          {liveAnswer && (
            <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Gemini Academic Tutor Explanation</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">Quota Used (1/3)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pt-1">
                {liveAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 50 PKR STUDENT UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student AI Micro-Pass</h3>
              <p className="text-xs text-slate-500">
                Unlock instant saved database explanations + 3 daily Live Gemini AI question answers!
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono">
              <span className="text-2xl font-bold text-slate-900">50 PKR</span>
              <span className="text-xs text-slate-500 block">per month</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlimited Saved Database Explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>3 Live AI Question Solvers per day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personal study analytics &amp; mastery</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade50Pkr}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Activate for 50 PKR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

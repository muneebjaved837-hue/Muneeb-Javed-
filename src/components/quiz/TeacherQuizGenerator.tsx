import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SavedQuiz, MCQQuestion, ShortQuestion, LongQuestion, DifficultQuestion } from '../../types';
import {
  Sparkles,
  BookOpen,
  FileText,
  Printer,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Check
} from 'lucide-react';

export const TeacherQuizGenerator: React.FC = () => {
  const { currentSchool, currentUser, saveQuizToBank, savedQuizzes } = useSchool();

  // Generator inputs
  const [bookName, setBookName] = useState('Campbell Biology (12th Edition)');
  const [author, setAuthor] = useState('Lisa A. Urry, Michael L. Cain');
  const [publisher, setPublisher] = useState('Pearson Education');
  const [className, setClassName] = useState('Grade 10-A');
  const [chapterName, setChapterName] = useState('Chapter 9: Cellular Respiration and Fermentation');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Generated draft state
  const [generatedQuiz, setGeneratedQuiz] = useState<{
    chapterSummary: string;
    mcqs: MCQQuestion[];
    shortQuestions: ShortQuestion[];
    longQuestions: LongQuestion[];
    difficultQuestions: DifficultQuestion[];
  } | null>(null);

  // PDF Preview Modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);

  // Quota calculation
  const quota = currentSchool?.aiQuota || {
    monthlyQuizzesLimit: 150,
    quizzesGeneratedThisMonth: 0,
    monthlyTokensLimit: 500000,
    tokensUsedThisMonth: 0,
    freeTrialExpiry: '2027-01-01',
    isSuspended: false,
    freeAccessGranted: false,
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !chapterName.trim()) return;

    if (quota.quizzesGeneratedThisMonth >= quota.monthlyQuizzesLimit && !quota.freeAccessGranted) {
      setErrorMsg(`Monthly school AI quota reached (${quota.quizzesGeneratedThisMonth}/${quota.monthlyQuizzesLimit} quizzes). Super Admin can extend limits!`);
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookName,
          author,
          publisher,
          className,
          chapterName,
        }),
      });

      const json = await response.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || 'Failed to generate quiz');
      }

      setGeneratedQuiz(json.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation error. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBank = () => {
    if (!generatedQuiz) return;

    const title = `${chapterName.replace(/Chapter \d+:?\s*/i, '')} Assessment`;

    saveQuizToBank({
      title,
      bookName,
      author,
      publisher,
      className,
      chapterName,
      createdByTeacherName: currentUser.name,
      mcqs: generatedQuiz.mcqs,
      shortQuestions: generatedQuiz.shortQuestions,
      longQuestions: generatedQuiz.longQuestions,
      difficultQuestions: generatedQuiz.difficultQuestions,
    });

    setSaveSuccessMsg(`Saved to School Database Bank! Available for students forever at 0 AI cost.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Preset curriculum helper
  const handleLoadSampleCurriculum = (preset: 'biology' | 'math' | 'physics') => {
    if (preset === 'biology') {
      setBookName('Campbell Biology (12th Edition)');
      setAuthor('Lisa A. Urry');
      setPublisher('Pearson');
      setChapterName('Chapter 10: Photosynthesis & Light Reactions');
    } else if (preset === 'math') {
      setBookName('Cambridge IGCSE Mathematics');
      setAuthor('Karen Morrison');
      setPublisher('Cambridge Univ Press');
      setChapterName('Chapter 6: Trigonometric Ratios & Angles');
    } else {
      setBookName('Halliday & Resnick Fundamentals of Physics');
      setAuthor('Jearl Walker');
      setPublisher('Wiley');
      setChapterName('Chapter 5: Force and Laws of Motion');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Teacher AI Quiz &amp; Question Paper Engine
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Core Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Input textbook and chapter details to generate complete MCQ sets, short answers, long questions, and printable PDF exams.
          </p>
        </div>

        {/* School AI Quota Meter */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 text-xs font-mono">
          <div>
            <div className="text-[10px] uppercase font-sans text-slate-400 font-semibold">
              School AI Quota
            </div>
            <div className="text-slate-900 font-bold tabular-nums">
              {quota.quizzesGeneratedThisMonth} / {quota.monthlyQuizzesLimit} Quizzes
            </div>
          </div>
          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min(100, (quota.quizzesGeneratedThisMonth / quota.monthlyQuizzesLimit) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Quick Book Templates:</span>
        <button
          onClick={() => handleLoadSampleCurriculum('biology')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors"
        >
          Biology (Campbell)
        </button>
        <button
          onClick={() => handleLoadSampleCurriculum('math')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors"
        >
          Mathematics (Cambridge)
        </button>
        <button
          onClick={() => handleLoadSampleCurriculum('physics')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors"
        >
          Physics (Halliday)
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Book / Curriculum Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Campbell Biology (12th Edition)"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Author(s) / Publisher
            </label>
            <input
              type="text"
              placeholder="e.g. Urry, Cain / Pearson"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Class
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="Grade 10-A">Grade 10-A (Science &amp; AP)</option>
              <option value="Grade 10-B">Grade 10-B (General Studies)</option>
              <option value="Grade 9-A">Grade 9-A (Foundation)</option>
              <option value="Senior Level">Senior Level / A-Levels</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Chapter Title / Topic Range
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Chapter 9: Cellular Respiration, Glycolysis & Fermentation"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            Generates 3 MCQs + 2 Short Questions + 1 Long Question + 1 Difficult Question with 1-3 line answers.
          </span>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Generating Test Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Questions with AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Content Review */}
      {generatedQuiz && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Ribbon */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Questions generated successfully for {chapterName}!</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print / Export PDF</span>
              </button>
              <button
                onClick={handleSaveToBank}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Database Bank</span>
              </button>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Section 1: Multiple Choice Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900">Section A: Multiple Choice Questions (MCQs)</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">3 Questions · 1 Mark Each</span>
            </div>

            <div className="space-y-4">
              {generatedQuiz.mcqs.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-lg bg-slate-50/60 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-900">
                    Q{idx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctOptionIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-md border text-xs flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-mono text-[11px] text-slate-400">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-700 font-bold ml-auto uppercase tracking-wider">
                              (Correct)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200 mt-2">
                    <span className="font-semibold text-slate-700">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Short Answer Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">Section B: Short Answer Questions</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">2 Questions · 3 Marks Each</span>
            </div>

            <div className="space-y-4">
              {generatedQuiz.shortQuestions.map((sq, idx) => (
                <div key={sq.id} className="p-4 rounded-lg bg-slate-50/60 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">
                      Q{idx + 1}. {sq.question}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">[{sq.marks} Marks]</span>
                  </div>
                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-800">1–3 Line Model Answer: </span>
                    {sq.modelAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Long Analytical Question */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900">Section C: Long Conceptual Question &amp; Marking Rubric</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">1 Question · 5 Marks</span>
            </div>

            {generatedQuiz.longQuestions.map((lq) => (
              <div key={lq.id} className="p-4 rounded-lg bg-slate-50/60 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{lq.question}</span>
                  <span className="text-xs font-mono text-slate-500 font-bold">[{lq.marks} Marks]</span>
                </div>
                <div className="text-xs bg-white p-3 rounded border border-slate-200 space-y-1.5">
                  <span className="font-semibold text-slate-800">Teacher Marking Scheme:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {lq.markingScheme.map((item, mIdx) => (
                      <li key={mIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Section 4: Difficult / HOTS Question */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-bold text-slate-900">Section D: Difficult / Analytical Challenge Question</h3>
              </div>
              <span className="text-xs font-mono text-purple-700 font-semibold">HOTS · 4 Marks</span>
            </div>

            {generatedQuiz.difficultQuestions.map((dq) => (
              <div key={dq.id} className="p-4 rounded-lg bg-purple-50/20 border border-purple-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{dq.question}</span>
                  <span className="text-xs font-mono text-slate-500 font-bold">[{dq.marks} Marks]</span>
                </div>
                <div className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded border border-purple-200/80">
                  <span className="font-semibold">Solution Hint: </span>
                  {dq.solutionHint}
                </div>
                <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-semibold text-slate-900">Complete Model Breakdown: </span>
                  {dq.modelAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINTABLE PDF TEST PAPER MODAL */}
      {showPrintModal && generatedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Controls Bar */}
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800">Printable Test Paper Preview</h3>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAnswerKey}
                    onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Teacher Answer Key</span>
                </label>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Document Content Canvas (Styled as an authentic printed test paper) */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6 font-serif text-slate-900 bg-white">
              {/* Official School Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-wider">{currentSchool.name}</h2>
                <div className="text-xs font-sans text-slate-600">{currentSchool.address}</div>
                <div className="text-sm font-bold font-sans pt-1">
                  CLASS EXAMINATION: {chapterName.toUpperCase()}
                </div>
                <div className="flex justify-between text-xs font-sans text-slate-600 pt-2 font-mono">
                  <span>Class: {className}</span>
                  <span>Time Allowed: 60 Minutes</span>
                  <span>Maximum Marks: 15</span>
                </div>
              </div>

              {/* Student Details Blank Strip */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans pb-3 border-b border-slate-300">
                <div>Candidate Name: ___________________________________</div>
                <div>Roll Number / Seat ID: ____________________________</div>
              </div>

              {/* Section A: MCQs */}
              <div className="space-y-3 font-sans">
                <div className="font-bold text-xs uppercase border-b border-slate-200 pb-1">
                  Section A: Multiple Choice Questions (3 Marks)
                </div>
                {generatedQuiz.mcqs.map((q, idx) => (
                  <div key={q.id} className="text-xs space-y-1">
                    <div className="font-medium">
                      {idx + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          ({String.fromCharCode(65 + oIdx)}) {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section B: Short Questions */}
              <div className="space-y-3 font-sans pt-2">
                <div className="font-bold text-xs uppercase border-b border-slate-200 pb-1">
                  Section B: Short Conceptual Questions (6 Marks)
                </div>
                {generatedQuiz.shortQuestions.map((sq, idx) => (
                  <div key={sq.id} className="text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{idx + 4}. {sq.question}</span>
                      <span className="font-mono">[{sq.marks} Marks]</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section C: Long Question */}
              <div className="space-y-3 font-sans pt-2">
                <div className="font-bold text-xs uppercase border-b border-slate-200 pb-1">
                  Section C: Long Answer Essay / Derivation (6 Marks)
                </div>
                {generatedQuiz.longQuestions.map((lq, idx) => (
                  <div key={lq.id} className="text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{idx + 6}. {lq.question}</span>
                      <span className="font-mono">[{lq.marks} Marks]</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ANSWER KEY SECTION (Optional attachment) */}
              {includeAnswerKey && (
                <div className="pt-8 mt-8 border-t-2 border-dashed border-slate-400 font-sans space-y-3 page-break-before">
                  <div className="text-center font-bold text-sm uppercase text-emerald-800">
                    CONFIDENTIAL TEACHER MARKING KEY &amp; RUBRIC
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="font-semibold text-slate-800">Section A (MCQs):</div>
                    <div className="pl-4 font-mono text-slate-700">
                      {generatedQuiz.mcqs.map((q, idx) => (
                        <div key={idx}>
                          Q{idx + 1}: ({String.fromCharCode(65 + q.correctOptionIndex)}) - {q.options[q.correctOptionIndex]}
                        </div>
                      ))}
                    </div>
                    <div className="font-semibold text-slate-800 pt-1">Section B Model Answers:</div>
                    {generatedQuiz.shortQuestions.map((sq, idx) => (
                      <div key={idx} className="pl-4 text-slate-700">
                        Q{idx + 4}: {sq.modelAnswer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

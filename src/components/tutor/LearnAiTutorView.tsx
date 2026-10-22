import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Sparkles,
  Send,
  Languages,
  BookOpen,
  Calculator,
  Zap,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Bookmark,
  Layers,
  Search
} from 'lucide-react';

export const LearnAiTutorView: React.FC = () => {
  const {
    currentUser,
    curriculum,
    askLiveAiDoubt,
    searchSavedDatabaseDoubt,
    upgradeStudentToPaid,
  } = useSchool();

  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedChapter, setSelectedChapter] = useState<string>('Quadratic Equations');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat message thread
  interface ChatMessage {
    id: string;
    sender: 'user' | 'tutor';
    text: string;
    source: 'saved_bank' | 'live_gemini';
    timestamp: string;
    subject: string;
    language: 'en' | 'ur';
  }

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: language === 'ur'
        ? 'السلام علیکم! میں آپ کا LearnAI ٹیوٹر ہوں۔ آپ ریاضی، فزکس، کیمسٹری، بیالوجی، انگلش یا اردو کا کوئی بھی سوال پوچھ سکتے ہیں۔ میں مرحلہ وار (step-by-step) آسان الفاظ میں سمجھاؤں گا۔'
        : 'Hello! I am your personal LearnAI Tutor. Ask me any conceptual question or step-by-step problem in Mathematics, Physics, Chemistry, Biology, Computer Science, or Languages. I will explain it with clear derivations and examples!',
      source: 'saved_bank',
      timestamp: 'Just now',
      subject: 'Mathematics',
      language: 'en',
    },
  ]);

  const activeCurriculum = curriculum.find((c) => c.name.toLowerCase().includes(selectedSubject.toLowerCase())) || curriculum[0];
  const chaptersList = activeCurriculum.chapters.map((ch) => ch.title);

  // Quota calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const usedToday = currentUser.lastAiDate === todayStr ? (currentUser.liveAiDailyUsed || 0) : 0;
  const remainingLiveQuestions = Math.max(0, 3 - usedToday);
  const isPaid = !!currentUser.isPaidStudent;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPrompt = (prompt: string, subj: string, chap: string) => {
    setSelectedSubject(subj);
    setSelectedChapter(chap);
    setQuestionInput(prompt);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || isSubmitting) return;

    const userText = questionInput.trim();
    setQuestionInput('');

    const userMsgId = `usr-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: userText,
        source: 'saved_bank',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
        language,
      },
    ];
    setMessages(newMessages);
    setIsSubmitting(true);

    // 1. SMART LOGIC: First check Saved Database Bank (Zero cost, instantaneous)
    const savedHits = searchSavedDatabaseDoubt(userText);
    if (savedHits.length > 0) {
      setTimeout(() => {
        const topHit = savedHits[0];
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'tutor',
            text: `[Instant Verified Bank Answer]: ${topHit.answer}`,
            source: 'saved_bank',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            subject: selectedSubject,
            language,
          },
        ]);
        setIsSubmitting(false);
      }, 400);
      return;
    }

    // 2. Call Live Gemini AI (with quota check)
    const result = await askLiveAiDoubt(userText, selectedSubject, selectedChapter, language);

    if (result.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'tutor',
          text: `⚠️ ${result.error}`,
          source: 'live_gemini',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: selectedSubject,
          language,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'tutor',
          text: result.answer,
          source: 'live_gemini',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: selectedSubject,
          language,
        },
      ]);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>LearnAI Interactive Tutor</span>
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Bilingual Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step problem solver, concept clarifications, textbook explanations in English &amp; Urdu.
          </p>
        </div>

        {/* Quota & Subscription Status */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Daily Live AI Quota</span>
              <span className="font-mono font-bold text-slate-900">
                {isPaid ? `${remainingLiveQuestions} / 3 questions left` : 'Locked (Free Plan)'}
              </span>
            </div>
            {!isPaid && (
              <button
                onClick={() => upgradeStudentToPaid(currentUser.id)}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Upgrade (50 PKR)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Control Strip: Language Toggle, Subject, and Chapter Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Language Switcher */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Explanation Language
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setLanguage('en')}
              className={`py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'ur'
                  ? 'bg-white text-emerald-700 shadow-xs font-sans'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>

        {/* Subject Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Academic Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              const found = curriculum.find((c) => c.name.toLowerCase().includes(e.target.value.toLowerCase()));
              if (found && found.chapters.length > 0) {
                setSelectedChapter(found.chapters[0].title);
              }
            }}
            className="w-full text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {curriculum.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.urduName ? `(${c.urduName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Syllabus Chapter / Topic
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {chaptersList.map((chap) => (
              <option key={chap} value={chap}>
                {chap}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Subject Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Try asking:</span>
        <button
          onClick={() =>
            handleQuickPrompt(
              'How to solve quadratic equations by completing the square method?',
              'Mathematics',
              'Quadratic Equations & Complex Roots'
            )
          }
          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 shrink-0 transition-colors"
        >
          Completing the square steps
        </button>
        <button
          onClick={() =>
            handleQuickPrompt(
              'What is dynamic equilibrium and Le Chatelier principle?',
              'Chemistry',
              'Chemical Equilibrium & Le Chatelier\'s Principle'
            )
          }
          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 shrink-0 transition-colors"
        >
          Le Chatelier\'s Principle
        </button>
        <button
          onClick={() =>
            handleQuickPrompt(
              'فلو چارٹ اور الگورتھم میں کیا فرق ہے؟ آسان الفاظ میں بتائیں۔',
              'Computer Science',
              'Problem Solving & Flowcharts'
            )
          }
          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 shrink-0 transition-colors font-sans"
        >
          فلو چارٹ بمقابلہ الگورتھم (اردو)
        </button>
        <button
          onClick={() =>
            handleQuickPrompt(
              'State Snell\'s law of refraction and define critical angle.',
              'Physics',
              'Geometrical Optics & Refraction'
            )
          }
          className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg border border-cyan-200 shrink-0 transition-colors"
        >
          Snell\'s Law & Critical Angle
        </button>
      </div>

      {/* Main Chat Workspace */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/20">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
                      {isUser ? currentUser.name : 'LearnAI Academic Tutor'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.timestamp}
                      </span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          title="Copy Answer"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body text with whitespace preservation */}
                  <div className={`whitespace-pre-wrap leading-relaxed ${m.language === 'ur' ? 'font-sans text-[13px]' : ''}`}>
                    {m.text}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        {m.source === 'saved_bank' ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Verified Textbook Bank
                          </span>
                        ) : (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            Gemini 3.8 Flash Engine
                          </span>
                        )}
                      </span>
                      <span className="capitalize">{m.subject}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                <RotateCcw className="w-4 h-4 animate-spin text-blue-600" />
                <span>LearnAI is calculating derivation and formulating explanation...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            required
            placeholder={
              language === 'ur'
                ? 'اپنا سوال یا مسئلہ یہاں لکھیں (مثلاً: فوٹوسنتھیسس کے مراحل)...'
                : `Ask any question in ${selectedSubject} (${selectedChapter})...`
            }
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className={`flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              language === 'ur' ? 'font-sans text-right' : ''
            }`}
          />

          <button
            type="submit"
            disabled={isSubmitting || !questionInput.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Tutor</span>
          </button>
        </form>
      </div>
    </div>
  );
};

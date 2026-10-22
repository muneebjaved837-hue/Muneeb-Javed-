import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SubjectCurriculum, StudyNoteChapter } from '../../types';
import {
  BookOpen,
  Calculator,
  Zap,
  FlaskConical,
  Dna,
  Cpu,
  BookA,
  Globe,
  HeartHandshake,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface SubjectsNotesViewProps {
  onStartQuizOnChapter?: (subject: string, chapter: string) => void;
  onAskTutorOnChapter?: (subject: string, chapter: string) => void;
}

export const SubjectsNotesView: React.FC<SubjectsNotesViewProps> = ({
  onStartQuizOnChapter,
  onAskTutorOnChapter,
}) => {
  const { curriculum } = useSchool();

  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10');
  const [selectedBoard, setSelectedBoard] = useState<string>('Punjab Board & National Syllabus');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubject, setActiveSubject] = useState<SubjectCurriculum>(curriculum[0]);
  const [activeChapter, setActiveChapter] = useState<StudyNoteChapter>(curriculum[0].chapters[0]);

  // Icons lookup
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5" />;
      case 'Dna':
        return <Dna className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'BookA':
        return <BookA className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const filteredCurriculum = curriculum.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.urduName && c.urduName.includes(searchQuery)) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintChapter = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Subjects, Chapters &amp; Revision Notes</span>
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Grade 5 – 12
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum notes, formula cheat sheets, solved questions, definitions, and printable study guides.
          </p>
        </div>

        {/* Board & Grade Selector */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Grade 8">Grade 8 (Middle)</option>
            <option value="Grade 9">Grade 9 (Matric Part I)</option>
            <option value="Grade 10">Grade 10 (Matric Part II)</option>
            <option value="Grade 11">Grade 11 (FSc / HSSC-I)</option>
            <option value="Grade 12">Grade 12 (FSc / HSSC-II)</option>
          </select>

          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 hidden sm:block"
          >
            <option value="Punjab Board & National Syllabus">Punjab Textbook Board (PTB)</option>
            <option value="Federal Board (FBISE)">Federal Board (FBISE)</option>
            <option value="Sindh Board">Sindh Textbook Board</option>
            <option value="KPK Board">KPK Textbook Board</option>
            <option value="Cambridge O-Level">Cambridge O-Level (CIE)</option>
          </select>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredCurriculum.map((subj) => {
          const isSelected = activeSubject.id === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => {
                setActiveSubject(subj);
                if (subj.chapters.length > 0) {
                  setActiveChapter(subj.chapters[0]);
                }
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow-xs"
                style={{ backgroundColor: subj.color }}
              >
                {getSubjectIcon(subj.iconName)}
              </div>
              <div className="font-bold text-slate-900 text-xs truncate">{subj.name}</div>
              {subj.urduName && (
                <div className="text-[11px] text-slate-400 font-sans">{subj.urduName}</div>
              )}
              <div className="text-[10px] text-slate-500 font-medium mt-1">
                {subj.chapters.length} Chapters
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chapter Viewer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chapters Navigation */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2 h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {activeSubject.name} Chapters
              </h2>
              <span className="text-[10px] text-slate-400">{selectedGrade} · {selectedBoard}</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">{activeSubject.code}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {activeSubject.chapters.map((chap) => {
              const isActive = activeChapter.chapterNumber === chap.chapterNumber;
              return (
                <button
                  key={chap.chapterNumber}
                  onClick={() => setActiveChapter(chap)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[10px] opacity-80 mr-1.5">
                      Ch {chap.chapterNumber}:
                    </span>
                    <span>{chap.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chapter Study Material Details */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Chapter Banner & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Chapter {activeChapter.chapterNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">{activeSubject.name}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{activeChapter.title}</h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrintChapter}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Notes</span>
              </button>
            </div>
          </div>

          {/* Chapter Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Chapter Overview &amp; Learning Objectives</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {activeChapter.summary}
            </p>
          </div>

          {/* Formulas (if applicable) */}
          {activeChapter.formulas && activeChapter.formulas.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>Key Mathematical Rules &amp; Formulas</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeChapter.formulas.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-lg text-xs font-mono font-bold text-purple-900"
                  >
                    {form}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Definitions */}
          {activeChapter.importantDefinitions && activeChapter.importantDefinitions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>Standard Examination Definitions</span>
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {activeChapter.importantDefinitions.map((def, idx) => (
                  <div key={idx} className="p-3 bg-white text-xs">
                    <span className="font-bold text-slate-900 block mb-0.5">{def.term}</span>
                    <span className="text-slate-600 leading-relaxed">{def.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solved Questions & Model Answers */}
          {activeChapter.solvedQnAs && activeChapter.solvedQnAs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Solved Textbook Questions &amp; Marking Scheme</span>
              </h3>
              <div className="space-y-2">
                {activeChapter.solvedQnAs.map((qna, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Q{idx + 1}: {qna.question}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {qna.type} question
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pt-1">
                      <span className="font-semibold text-emerald-700">Model Answer: </span>
                      {qna.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

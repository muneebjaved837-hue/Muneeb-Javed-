import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LiveClass } from '../../types';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  ExternalLink,
  Send,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface VirtualClassroomModalProps {
  liveClass: LiveClass;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
}

export const VirtualClassroomModal: React.FC<VirtualClassroomModalProps> = ({
  liveClass,
  onClose,
}) => {
  const { currentUser, currentSchool } = useSchool();

  // Control states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'participants' | 'agenda'>('chat');

  // Interactive Live Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: liveClass.teacherName,
      role: 'teacher',
      text: `Welcome everyone to ${liveClass.title}. Please open your lecture notes!`,
      time: '10:02 AM',
    },
    {
      id: 'm2',
      sender: 'Maya Lin',
      role: 'student',
      text: 'Good morning Mrs. Jenkins! Audio is crystal clear.',
      time: '10:03 AM',
    },
    {
      id: 'm3',
      sender: 'Jordan Taylor',
      role: 'student',
      text: 'Is the slide deck available in the homework folder as well?',
      time: '10:05 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeSidePanel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      role: currentUser.role,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleOpenGoogleMeetExternal = () => {
    window.open(liveClass.meetLink || 'https://meet.google.com/new', '_blank');
  };

  const participants = [
    { name: liveClass.teacherName, role: 'Teacher (Host)', isHost: true },
    { name: currentUser.name, role: `${currentUser.role} (You)`, isHost: false },
    { name: 'Maya Lin', role: 'Student', isHost: false },
    { name: 'Jordan Taylor', role: 'Student', isHost: false },
    { name: 'Liam Chen', role: 'Student', isHost: false },
    { name: 'Sophia Morales', role: 'Student', isHost: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Google Meet Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            {/* Google Meet Color Crest Icon */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#00832d" d="M14 12l3.5-3.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-2v-2.5L14 12z" />
                <path fill="#0066da" d="M22 6.5l-4.5 4.5 4.5 4.5V6.5z" />
              </svg>
              <span className="text-xs font-semibold text-slate-200">Google Meet</span>
            </div>

            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-md">
                {liveClass.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{liveClass.meetCode}</span>
                <span>·</span>
                <span>{liveClass.grade}</span>
                <span>·</span>
                <span>Instructor: {liveClass.teacherName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Launch Real Meet Tab */}
            <button
              onClick={handleOpenGoogleMeetExternal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch on Google Meet</span>
            </button>

            {/* End Call / Close */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Center Canvas: Video Grid + Side Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Stage View */}
          <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden bg-slate-950/40">
            {/* Active Presentation or Teacher Stage */}
            <div className="flex-1 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              {isScreenSharing ? (
                /* Interactive Screen Share / Whiteboard Slide */
                <div className="w-full h-full bg-slate-900 p-6 flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MonitorUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">
                        {liveClass.teacherName} is presenting screen
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Slide 4 of 12 · {liveClass.subject}</span>
                  </div>

                  {/* Scientific / Educational Slide Display */}
                  <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 text-center">
                    <div className="max-w-xl space-y-4">
                      <div className="text-xs font-mono uppercase tracking-widest text-blue-400">
                        Oakridge Science Lecture Series
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Mechanisms of Cas9 Endonuclease Cleavage
                      </h3>
                      <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl text-left text-xs font-mono text-slate-300 space-y-1.5">
                        <div className="text-emerald-400">5'- PAM Recognition Motif: 5'-NGG-3'</div>
                        <div>Target DNA unzipping initiated by complementary single guide RNA (sgRNA).</div>
                        <div className="text-sky-300">RuvC &amp; HNH catalytic domain cuts each target DNA strand ~3bp upstream.</div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Please take down the non-homologous end joining (NHEJ) repair pathway diagram from textbook chapter 8.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-2 font-mono">
                    <span>Oakridge Interactive Whiteboard Session</span>
                    <span>1080p · 60fps Stream Active</span>
                  </div>
                </div>
              ) : (
                /* Teacher Camera Stream */
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-blue-500 p-1 flex items-center justify-center shadow-lg bg-slate-800">
                      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                        {liveClass.teacherName.charAt(0)}
                      </div>
                    </div>
                    {/* Speaking pulse ring */}
                    <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                      <Mic className="w-3 h-3 text-white" />
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-base font-bold text-white">{liveClass.teacherName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Faculty Lead · Speaking</p>
                  </div>

                  {/* Overlay Watermark info */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Class Session</span>
                  </div>
                </div>
              )}

              {/* Student Self-Preview Picture-in-Picture */}
              <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-slate-850 border border-slate-700 shadow-xl overflow-hidden flex flex-col items-center justify-center">
                {isVideoOn ? (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium mt-1 truncate max-w-[120px]">
                      {currentUser.name} (You)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                    <VideoOff className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-400">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-slate-400">
                  {isMicOn ? 'Mic On' : 'Muted'}
                </div>
              </div>
            </div>

            {/* Hand Raised Banner */}
            {isHandRaised && (
              <div className="mt-2 py-1.5 px-3 bg-amber-500/20 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-center gap-2 shrink-0">
                <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>You raised your hand. Instructor has been notified.</span>
              </div>
            )}
          </div>

          {/* Right Side Panel: Chat / Participants / Agenda */}
          <div className="w-80 border-l border-slate-800 bg-slate-900/70 flex flex-col shrink-0">
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-slate-800 p-2 gap-1 bg-slate-900">
              <button
                onClick={() => setActiveSidePanel('chat')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'chat'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>In-Call Chat</span>
              </button>
              <button
                onClick={() => setActiveSidePanel('participants')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'participants'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>People ({participants.length})</span>
              </button>
              <button
                onClick={() => setActiveSidePanel('agenda')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'agenda'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Agenda</span>
              </button>
            </div>

            {/* TAB 1: Chat Stream */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
                  <div className="p-2.5 bg-slate-800/60 rounded-lg text-[11px] text-slate-400 border border-slate-700/50">
                    Messages are visible to attendees and the instructor. Keep academic etiquette.
                  </div>

                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{msg.sender}</span>
                        <span className="font-mono text-slate-500 text-[10px]">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/40 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Send a message to everyone..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Participants */}
            {activeSidePanel === 'participants' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                  In This Meeting ({participants.length})
                </div>
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.role}</div>
                      </div>
                    </div>
                    {p.isHost && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Agenda */}
            {activeSidePanel === 'agenda' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="text-xs font-bold text-white mb-2">Session Outline &amp; Goals</div>
                <p className="text-xs text-slate-300 leading-relaxed">{liveClass.description}</p>
                {liveClass.agendaItems && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] uppercase font-semibold text-slate-400">Key Points:</span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {liveClass.agendaItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Meeting Controls Bar */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{liveClass.startTime} – {liveClass.endTime}</span>
            <span>·</span>
            <span>{liveClass.durationMinutes} min session</span>
          </div>

          {/* Central Controls */}
          <div className="flex items-center gap-3 mx-auto md:mx-0">
            {/* Toggle Mic */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Toggle Video */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen Presentation'}
            >
              <MonitorUp className="w-4 h-4" />
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`p-3 rounded-full transition-colors ${
                isHandRaised ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            >
              <Hand className="w-4 h-4" />
            </button>

            {/* End Call */}
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              title="Leave Google Meet Classroom"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleOpenGoogleMeetExternal}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>meet.google.com/{liveClass.meetCode}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

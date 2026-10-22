import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Bell,
  Calendar,
  BookOpen,
  UserCheck,
  Sparkles,
  Check,
  CheckCheck,
  X
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useSchool();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'homework':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'attendance':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs animate-in fade-in">
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.type === 'exam' && onNavigateToTab) onNavigateToTab('calendar');
                if (notif.type === 'homework' && onNavigateToTab) onNavigateToTab('homework');
                if (notif.type === 'ai' && onNavigateToTab) onNavigateToTab('ai-tutor');
              }}
              className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-0.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${notif.read ? 'text-slate-800' : 'text-slate-900 font-bold'}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

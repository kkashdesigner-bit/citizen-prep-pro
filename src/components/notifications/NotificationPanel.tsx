import { motion } from 'framer-motion';
import { Bell, BellOff, Calendar, Flame, Target, Trophy, Zap, BookOpen, Crown, CheckCheck } from 'lucide-react';
import type { Notification, NotificationType } from '@/hooks/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  isMobile?: boolean;
}

const ICON_MAP: Record<NotificationType, { icon: typeof Bell; bg: string; color: string }> = {
  daily_question: { icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-600' },
  streak_risk: { icon: Flame, bg: 'bg-orange-100', color: 'text-orange-600' },
  streak_milestone: { icon: Flame, bg: 'bg-amber-100', color: 'text-amber-600' },
  weakness_drill: { icon: Target, bg: 'bg-red-100', color: 'text-red-600' },
  milestone: { icon: Trophy, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  exam_readiness: { icon: Target, bg: 'bg-indigo-100', color: 'text-indigo-600' },
  flash_quiz: { icon: Zap, bg: 'bg-violet-100', color: 'text-violet-600' },
  weekly_summary: { icon: BookOpen, bg: 'bg-sky-100', color: 'text-sky-600' },
  new_content: { icon: BookOpen, bg: 'bg-teal-100', color: 'text-teal-600' },
  subscription: { icon: Crown, bg: 'bg-amber-100', color: 'text-amber-600' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)} sem`;
}

export default function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  isMobile,
}: NotificationPanelProps) {
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div
      className={`bg-white border border-slate-200 shadow-2xl flex flex-col ${
        isMobile ? 'rounded-none max-h-[70vh]' : 'rounded-2xl max-h-[480px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
        {hasUnread && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <BellOff className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Aucune notification</p>
            <p className="text-xs text-slate-400 mt-1">Vos notifications apparaîtront ici</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {notifications.map((notif) => {
              const config = ICON_MAP[notif.type] || ICON_MAP.milestone;
              const Icon = config.icon;

              return (
                <motion.button
                  key={notif.id}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  onClick={() => {
                    if (!notif.is_read) onMarkAsRead(notif.id);
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                    !notif.is_read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center mt-0.5`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm leading-snug truncate ${!notif.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{timeAgo(notif.created_at)}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

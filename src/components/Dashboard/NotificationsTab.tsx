import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: any;
  read: boolean;
}

interface NotificationsTabProps {
  notifications: NotificationItem[];
  handleDeleteNotification: (notifId: string) => void;
  formatDate: (date: any) => string;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  handleDeleteNotification,
  formatDate,
}) => {
  return (
    <div className="space-y-6 text-left">
      <div className="mb-6 space-y-1">
        <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">System Notifications & Alerts</h2>
        <p className="text-xs text-text-secondary">View official announcements, system alerts, and updates broadcasted by the SettleKar Admin team.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-elevated rounded-2xl border border-border shadow-sm">
          <div className="text-4xl mb-4">📢</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">No Notifications</h2>
          <p className="text-sm text-text-secondary max-w-sm mb-6">You don't have any announcements or alerts at the moment. System updates will appear here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm border-l-4 border-l-primary-accent">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3 pb-3 border-b border-border-light text-left">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span className="text-lg">📢</span>
                    <span>{notif.title}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary font-mono">{formatDate(notif.createdAt)}</span>
                  <button
                    className="py-1 px-2.5 text-xs font-semibold text-error bg-transparent hover:bg-error/10 border border-transparent hover:border-error/20 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleDeleteNotification(notif.id)}
                    title="Dismiss Notification"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
              
              <div className="text-text-primary text-sm leading-relaxed text-left pl-7">
                <p>{notif.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;

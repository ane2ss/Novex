import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

function NotificationBell() {
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="notification-bell" ref={ref}>
            <button className="bell-btn" onClick={() => setOpen(!open)}>
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {open && (
                <div className="notification-dropdown">
                    <div className="notif-header">
                        <h4>Notifications</h4>
                        {notifications.length > 0 && (
                            <button className="clear-btn" onClick={clearAll}>Mark all read</button>
                        )}
                    </div>
                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <p className="notif-empty">No notifications yet</p>
                        ) : (
                            notifications.slice(0, 20).map(n => (
                                <div
                                    key={n.id}
                                    className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <p className="notif-message">{n.message || 'New notification'}</p>
                                    <span className="notif-time">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;

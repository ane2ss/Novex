import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
    const { notifications, loading, unreadCount, markAsRead, clearAll } = useNotifications();

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            <div className="loading-container"><div className="spinner" /></div>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
            <div className="notifications-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Activity Feed</h1>
                    <p className="page-subtitle">
                        {unreadCount > 0 ? `You have ${unreadCount} new updates to review.` : 'Your workspace is up to date.'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-primary btn-sm" onClick={clearAll}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>done_all</span>
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: '5rem 2rem', background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--outline-variant)' }}>
                    <div className="empty-icon" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>notifications_off</span>
                    </div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>All Quiet Here</h3>
                    <p style={{ color: 'var(--on-surface-variant)' }}>We'll notify you when someone interacts with your projects.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map((notif, idx) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`notification-card ${!notif.is_read ? 'unread' : ''}`}
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                background: notif.is_read ? 'var(--surface-container-lowest)' : 'rgba(99, 102, 241, 0.08)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid',
                                borderColor: notif.is_read ? 'var(--outline-variant)' : 'rgba(99, 102, 241, 0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {!notif.is_read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)' }} />}

                            <div className="notification-icon-wrapper" style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                background: notif.type === 'upvote' ? 'rgba(245, 158, 11, 0.1)' :
                                    notif.type === 'comment' ? 'rgba(16, 185, 129, 0.1)' :
                                        'rgba(99, 102, 241, 0.1)',
                                color: notif.type === 'upvote' ? '#f59e0b' :
                                    notif.type === 'comment' ? '#10b981' :
                                        'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                    {notif.type === 'upvote' ? 'star' :
                                        notif.type === 'comment' ? 'chat_bubble' :
                                            notif.type === 'join_request' ? 'group_add' :
                                                'notifications'}
                                </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                    <p style={{
                                        fontSize: '0.9375rem',
                                        fontWeight: notif.is_read ? 400 : 600,
                                        color: 'var(--on-surface)',
                                        lineHeight: 1.4
                                    }}>
                                        {notif.message}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--outline)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                                        {formatTime(notif.created_at)}
                                    </span>
                                </div>
                                {notif.project_id && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                        Project #{notif.project_id}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

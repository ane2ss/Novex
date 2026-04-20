import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await api.getNotifications();
            const data = res.data || [];
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch {
            setNotifications([]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await api.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { }
    };

    const clearAll = async () => {
        try {
            await api.clearNotifications();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch { }
    };

    return { notifications, loading, unreadCount, markAsRead, clearAll, refetch: fetchNotifications };
}

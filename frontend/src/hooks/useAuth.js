import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await api.getMe();
            setUser(res.data);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (username, password) => {
        const res = await api.login(username, password);
        localStorage.setItem('token', res.access);
        localStorage.setItem('refresh', res.refresh);
        await fetchUser();
        return res;
    };

    const register = async (data) => {
        const res = await api.register(data);
        if (res.success) {
            localStorage.setItem('token', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            setUser(res.data.user);
        }
        return res;
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh');
        try { await api.logout(refresh); } catch { }
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return { user, loading, login, register, logout, fetchUser };
}

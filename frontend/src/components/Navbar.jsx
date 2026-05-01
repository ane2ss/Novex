import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

export default function Navbar({ user, logout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    const getInitials = (u) => {
        if (!u) return '?';
        const first = u.first_name || u.username || '';
        const last = u.last_name || '';
        return (first[0] || '') + (last[0] || '');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchValue.trim())}`);
            setSearchValue('');
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const diff = (new Date() - date) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        /* Outer wrapper – full-width fixed bar */
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0.75rem 2rem',
            pointerEvents: 'none',
        }}>
            {/* Floating pill */}
            <nav style={{
                maxWidth: '72rem',
                margin: '0 auto',
                background: 'rgba(11,19,38,0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '9999px',
                padding: '0.5rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(74,64,224,0.12), 0 1px 0 rgba(195,192,255,0.08) inset',
                border: '1px solid rgba(70,69,85,0.25)',
                pointerEvents: 'all',
            }}>
                {/* Left: Brand + nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img src="/logo.png" alt="Novex" style={{ height: '4rem', width: 'auto', objectFit: 'contain' }} />
                    </Link>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {[
                            { label: 'Home', to: '/' },
                            { label: 'Explore', to: '/explore' },
                        ].map(({ label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    padding: '0.4rem 0.875rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive(to) ? 700 : 500,
                                    color: isActive(to) ? '#fff' : 'rgba(199,196,216,0.8)',
                                    textDecoration: 'none',
                                    background: isActive(to) ? 'rgba(74,64,224,0.35)' : 'transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                to="/submit"
                                style={{
                                    padding: '0.4rem 0.875rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive('/submit') ? 700 : 500,
                                    color: isActive('/submit') ? '#fff' : 'rgba(199,196,216,0.8)',
                                    textDecoration: 'none',
                                    background: isActive('/submit') ? 'rgba(74,64,224,0.35)' : 'transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Create
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right: search + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Search pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(6,14,32,0.6)', borderRadius: '9999px',
                        padding: '0.4rem 1rem', border: '1px solid rgba(70,69,85,0.2)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'rgba(145,143,161,0.8)' }}>search</span>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{
                                background: 'transparent', border: 'none', outline: 'none',
                                color: '#dae2fd', fontSize: '0.8125rem', fontFamily: 'inherit',
                                width: '9rem',
                            }}
                        />
                    </div>

                    {user ? (
                        <>
                            {/* Notification bell */}
                            <div ref={notifRef} style={{ position: 'relative' }}>
                                <button
                                    id="notification-bell"
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    style={{
                                        width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                        background: 'rgba(6,14,32,0.6)', border: '1px solid rgba(70,69,85,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: 'rgba(199,196,216,0.8)', position: 'relative',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>notifications</span>
                                    {!!unreadCount && (
                                        <span style={{
                                            position: 'absolute', top: '-0.2rem', right: '-0.2rem',
                                            width: '1.1rem', height: '1.1rem', background: 'var(--primary)',
                                            borderRadius: '50%', fontSize: '0.6rem', fontWeight: 700,
                                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '2px solid rgba(11,19,38,1)',
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
                                        width: '22rem', background: 'rgba(23,31,51,0.98)',
                                        backdropFilter: 'blur(20px)', borderRadius: '1rem',
                                        border: '1px solid rgba(70,69,85,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                                        overflow: 'hidden', zIndex: 200,
                                    }}>
                                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(70,69,85,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Notifications</span>
                                            <Link to="/notifications" onClick={() => setNotifOpen(false)} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>See all</Link>
                                        </div>
                                        <div style={{ maxHeight: '20rem', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--outline)', fontSize: '0.875rem' }}>No notifications yet</div>
                                            ) : notifications.slice(0, 5).map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => { markAsRead(n.id); setNotifOpen(false); }}
                                                    style={{
                                                        padding: '0.875rem 1.25rem',
                                                        borderBottom: '1px solid rgba(70,69,85,0.1)',
                                                        cursor: 'pointer',
                                                        background: n.is_read ? 'transparent' : 'rgba(74,64,224,0.06)',
                                                        borderLeft: n.is_read ? 'none' : '3px solid var(--primary)',
                                                        transition: 'background 0.15s',
                                                        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                                                        background: n.type === 'upvote' ? 'rgba(245,158,11,0.1)' : n.type === 'comment' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: n.type === 'upvote' ? '#f59e0b' : n.type === 'comment' ? '#10b981' : 'var(--primary)',
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                                                            {n.type === 'upvote' ? 'star' : n.type === 'comment' ? 'chat_bubble' : n.type === 'join_request' ? 'group_add' : 'notifications'}
                                                        </span>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface)', marginBottom: '0.2rem', lineHeight: 1.4, fontWeight: n.is_read ? 400 : 600 }}>{n.message}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>{formatTime(n.created_at)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Avatar dropdown */}
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <div
                                    id="user-avatar"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4a40e0, #7c3aed)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, color: '#fff',
                                        border: '2px solid rgba(195,192,255,0.3)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(user).toUpperCase() || '?'
                                    )}
                                </div>
                                {dropdownOpen && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
                                        width: '14rem', background: 'rgba(23,31,51,0.98)',
                                        backdropFilter: 'blur(20px)', borderRadius: '1rem',
                                        border: '1px solid rgba(70,69,85,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                                        overflow: 'hidden', zIndex: 200,
                                    }}>
                                        <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(70,69,85,0.15)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.first_name} {user.last_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>@{user.username}</div>
                                        </div>
                                        {[
                                            { icon: 'person', label: 'My Profile', to: `/profile/${user.id}` },
                                            { icon: 'add_circle', label: 'Create Project', to: '/submit' },
                                            { icon: 'notifications', label: 'Notifications', to: '/notifications' },
                                        ].map(item => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setDropdownOpen(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', color: 'var(--on-surface)',
                                                    textDecoration: 'none', fontSize: '0.875rem',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,64,224,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        ))}
                                        <div style={{ height: '1px', background: 'rgba(70,69,85,0.15)', margin: '0.25rem 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                padding: '0.75rem 1rem', color: 'var(--error)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '0.875rem', width: '100%', fontFamily: 'inherit',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(147,0,10,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                background: 'linear-gradient(135deg, #4a40e0 0%, #3322cc 100%)',
                                color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '9999px',
                                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                                boxShadow: '0 4px 16px rgba(74,64,224,0.3)',
                                transition: 'opacity 0.2s',
                            }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

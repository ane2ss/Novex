import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="logo">
                    <span className="logo-icon">◆</span>
                    <span className="logo-text">Novex</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className="nav-link">Explore</Link>
                    {user && <Link to="/profile" className="nav-link">My Projects</Link>}
                </nav>

                <div className="header-actions">
                    {user ? (
                        <>
                            <NotificationBell />
                            <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                                <div className="avatar-small">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} />
                                    ) : (
                                        <span>{user.username[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <span className="username-text">{user.username}</span>
                                {menuOpen && (
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                            👤 Profile
                                        </Link>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-ghost">Sign In</Link>
                            <Link to="/login?tab=register" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileNav({ user }) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="mobile-nav">
            <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
                <span className="material-symbols-outlined">home</span>
                <span>Home</span>
            </Link>
            <Link to="/explore" className={`mobile-nav-item ${isActive('/explore') ? 'active' : ''}`}>
                <span className="material-symbols-outlined">explore</span>
                <span>Explore</span>
            </Link>
            {user && (
                <Link to="/submit" className={`mobile-nav-item ${isActive('/submit') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Create</span>
                </Link>
            )}
            {user && (
                <Link to="/notifications" className={`mobile-nav-item ${isActive('/notifications') ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">notifications</span>
                    <span>Alerts</span>
                </Link>
            )}
            <Link
                to={user ? `/profile/${user.id}` : '/login'}
                className={`mobile-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
            >
                <span className="material-symbols-outlined">account_circle</span>
                <span>Profile</span>
            </Link>
        </div>
    );
}

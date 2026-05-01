import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            width: '100%',
            paddingTop: '5rem',
            paddingBottom: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            background: '#060e20',
        }}>
            {/* Wave pattern */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6rem', transform: 'translateY(-60%)', pointerEvents: 'none', opacity: 0.15 }}>
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                    <path d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,197.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" fill="#4a40e0" />
                </svg>
            </div>

            {/* Grid content */}
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {/* Brand */}
                    <div>
                        <img src="/logo.png" alt="Novex" style={{ height: '8rem', width: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7 }}>
                            Defining the next era of collaborative student engineering and design excellence.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[
                                { label: 'Showcase', to: '/explore' },
                                { label: 'Collaborate', to: '/explore' },
                                { label: 'Mentors', to: '/explore' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link to={l.to} style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#818cf8'}
                                        onMouseLeave={e => e.target.style.color = '#64748b'}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Resources</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[
                                { label: 'Guidelines', to: '/#' },
                                { label: 'Privacy', to: '/#' },
                                { label: 'Terms', to: '/#' },
                            ].map(l => (
                                <li key={l.label}>
                                    <a href={l.to} style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#818cf8'}
                                        onMouseLeave={e => e.target.style.color = '#64748b'}>
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[
                                { icon: 'share', href: '#' },
                                { icon: 'language', href: '#' },
                            ].map(s => (
                                <a key={s.icon} href={s.href}
                                    style={{
                                        width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#64748b', textDecoration: 'none', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,64,224,0.2)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b'; }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>{s.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#475569' }}>© 2025 Novex. All rights reserved.</p>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(99,102,241,0.4)', letterSpacing: '0.05em' }}>v1.0.0-stable</span>
                </div>
            </div>
        </footer>
    );
}

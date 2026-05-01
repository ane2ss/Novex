import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage({ login }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [googleHovered, setGoogleHovered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.detail || 'Invalid credentials';
            setError(typeof msg === 'string' ? msg : 'Invalid credentials');
            toast.error(typeof msg === 'string' ? msg : 'Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', fontFamily: "'Manrope', sans-serif" }}>
            {/* ── Left pane – kinetic identity ── */}
            <div style={{
                display: 'none',
                position: 'relative',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4rem',
                background: 'linear-gradient(135deg, #4a40e0 0%, #1d00a5 100%)',
                overflow: 'hidden',
                flex: '0 0 42%',
            }} className="login-left-pane">
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-6rem', left: '-6rem', width: '24rem', height: '24rem', background: 'rgba(99,102,241,0.3)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '-3rem', width: '16rem', height: '16rem', background: 'rgba(195,192,255,0.2)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

                {/* Top branding */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
                        <img src="/logo.png" alt="Novex" style={{ height: '8rem', width: 'auto', objectFit: 'contain' }} />
                    </div>

                    <div style={{ maxWidth: '26rem' }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}
                        >
                            Welcome to<br />Novex.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
                            style={{ fontSize: '1.15rem', color: 'rgba(195,192,255,0.9)', lineHeight: 1.6, fontWeight: 500 }}
                        >
                            Your gateway to the Novex ecosystem. Connect with creators, build your vision, and innovate.
                        </motion.p>
                    </div>
                </div>

                {/* Bottom branding card (no AI image) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
                    style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(195,192,255,0.2)', border: '2px solid rgba(195,192,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'rgba(195,192,255,0.9)', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>The Novex Workspace</p>
                            <p style={{ color: 'rgba(195,192,255,0.7)', fontSize: '0.8rem' }}>Powered by the Novex Engine</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Right pane – login form ── */}
            <div style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ width: '100%', maxWidth: '26rem' }}
                >
                    {/* Mobile branding */}
                    <div className="login-mobile-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        <img src="/logo.png" alt="Novex" style={{ height: '4rem', width: 'auto', objectFit: 'contain' }} />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Please enter your details to continue</p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(147,0,10,0.15)', border: '1px solid rgba(255,180,171,0.2)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Username */}
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface)', display: 'block', marginBottom: '0.5rem' }} htmlFor="loginUsername">
                                Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '1.25rem', pointerEvents: 'none' }}>person</span>
                                <input
                                    id="loginUsername"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'var(--surface-container-lowest)',
                                        border: '1px solid rgba(70,69,85,0.3)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem 1rem 1rem 3rem',
                                        color: 'var(--on-surface)',
                                        fontSize: '0.9375rem',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(70,69,85,0.3)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface)' }} htmlFor="loginPassword">Password</label>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Forgot password?</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '1.25rem', pointerEvents: 'none' }}>lock</span>
                                <input
                                    id="loginPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'var(--surface-container-lowest)',
                                        border: '1px solid rgba(70,69,85,0.3)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem 3rem 1rem 3rem',
                                        color: 'var(--on-surface)',
                                        fontSize: '0.9375rem',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(70,69,85,0.3)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', background: 'linear-gradient(135deg, #4a40e0 0%, #3322cc 100%)',
                                color: '#fff', padding: '1rem', borderRadius: '9999px',
                                fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 25px rgba(74,64,224,0.35)',
                                transition: 'box-shadow 0.3s, transform 0.2s',
                                opacity: loading ? 0.8 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                marginTop: '0.5rem',
                                fontFamily: 'inherit',
                            }}
                        >
                            {loading ? <div className="spinner" style={{ width: '1.25rem', height: '1.25rem' }} /> : 'Login Now'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ margin: '2rem 0', position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(70,69,85,0.25)' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(70,69,85,0.25)' }} />
                    </div>

                    {/* Google SSO – locked */}
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setGoogleHovered(true)}
                        onMouseLeave={() => setGoogleHovered(false)}
                    >
                        <button
                            type="button"
                            disabled
                            style={{
                                width: '100%', background: 'var(--surface-container-low)', border: '1px solid rgba(70,69,85,0.25)',
                                borderRadius: '9999px', color: 'var(--on-surface)', padding: '0.875rem', fontWeight: 600,
                                fontSize: '0.9375rem', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                fontFamily: 'inherit', opacity: 0.5, position: 'relative',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M12 5.04c1.74 0 3.3.6 4.53 1.77l3.39-3.39C17.85 1.48 15.11 0 12 0 7.31 0 3.26 2.69 1.3 6.61l3.92 3.04C6.16 7.19 8.87 5.04 12 5.04z" fill="#EA4335" />
                                <path d="M23.49 12.27c0-.83-.07-1.63-.2-2.39H12v4.51h6.44c-.28 1.48-1.11 2.73-2.37 3.58l3.71 2.88c2.16-1.99 3.41-4.91 3.41-8.58z" fill="#4285F4" />
                                <path d="M5.22 14.71c-.24-.71-.37-1.47-.37-2.27s.13-1.56.37-2.27L1.3 7.13C.47 8.78 0 10.34 0 12s.47 3.22 1.3 4.87l3.92-3.16z" fill="#FBBC05" />
                                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.1.74-2.51 1.18-4.22 1.18-3.13 0-5.84-2.15-6.78-5.04l-3.92 3.04C3.26 21.31 7.31 24 12 24z" fill="#34A853" />
                            </svg>
                            Sign in with Google
                            {/* Lock badge */}
                            <span style={{
                                position: 'absolute', right: '1rem',
                                display: 'flex', alignItems: 'center', gap: '0.2rem',
                                background: 'rgba(70,69,85,0.3)', borderRadius: '9999px',
                                padding: '0.15rem 0.5rem', fontSize: '0.68rem', fontWeight: 700,
                                color: 'var(--on-surface-variant)', letterSpacing: '0.04em',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '0.8rem', fontVariationSettings: "'FILL' 1" }}>lock</span>
                                Soon
                            </span>
                        </button>

                        {/* Tooltip */}
                        <motion.div
                            initial={false}
                            animate={{ opacity: googleHovered ? 1 : 0, y: googleHovered ? 0 : 4 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute', bottom: 'calc(100% + 0.5rem)', left: '50%', transform: 'translateX(-50%)',
                                background: 'var(--surface-container)', border: '1px solid rgba(70,69,85,0.3)',
                                borderRadius: '0.5rem', padding: '0.4rem 0.75rem',
                                whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
                                fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-variant)',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            🔒 Google login coming soon
                        </motion.div>
                    </div>

                    <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create a new account</Link>
                    </p>
                </motion.div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .login-left-pane { display: flex !important; }
                    .login-mobile-brand { display: none !important; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
}

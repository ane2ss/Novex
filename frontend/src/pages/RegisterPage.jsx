import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RegisterPage({ register }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '', email: '', password: '', password2: '',
        first_name: '', last_name: '', university: '', field_of_study: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.password2) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await register(form);
            if (res.success) {
                toast.success('Account created successfully!');
                navigate('/');
            } else {
                setError(res.error || 'Registration failed');
            }
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === 'object') {
                const messages = Object.values(data).flat().join('. ');
                setError(messages || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-glow">
                <div className="glow-1" />
                <div className="glow-2" />
            </div>

            <main className="auth-main">
                <div className="auth-wrapper">
                    <div className="auth-brand">
                        <div className="auth-brand-logo">
                            <img src="/logo.png" alt="Novex" style={{ height: '2.5rem', width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <h1>Create Account</h1>
                        <p>Join the next generation of creators and innovators.</p>
                    </div>

                    <div className="auth-card">
                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && (
                                <div style={{ background: 'rgba(147, 0, 10, 0.15)', border: '1px solid rgba(255, 180, 171, 0.2)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--error)' }}>
                                    {error}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="first_name">First Name</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">badge</span>
                                        <input className="form-input" id="first_name" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="last_name">Last Name</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">badge</span>
                                        <input className="form-input" id="last_name" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-username">Username</label>
                                <div className="form-input-wrapper">
                                    <span className="material-symbols-outlined form-input-icon">person</span>
                                    <input className="form-input" id="reg-username" name="username" placeholder="johndoe" value={form.username} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="reg-email">Email</label>
                                <div className="form-input-wrapper">
                                    <span className="material-symbols-outlined form-input-icon">mail</span>
                                    <input className="form-input" id="reg-email" name="email" type="email" placeholder="john@university.edu" value={form.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="university">University</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">school</span>
                                        <input className="form-input" id="university" name="university" placeholder="MIT" value={form.university} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="field_of_study">Field of Study</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">science</span>
                                        <input className="form-input" id="field_of_study" name="field_of_study" placeholder="Computer Science" value={form.field_of_study} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-password">Password</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">lock</span>
                                        <input className="form-input" id="reg-password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="password2">Confirm</label>
                                    <div className="form-input-wrapper">
                                        <span className="material-symbols-outlined form-input-icon">lock</span>
                                        <input className="form-input" id="password2" name="password2" type="password" placeholder="••••••••" value={form.password2} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                                {loading ? <div className="spinner" /> : <>Create Account <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_forward</span></>}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

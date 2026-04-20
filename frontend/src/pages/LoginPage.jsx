import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
    const [form, setForm] = useState({
        username: '', email: '', password: '', password2: '',
        university: '', field_of_study: '', skills: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
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
                navigate('/');
            } else {
                setError(JSON.stringify(res.error));
            }
        } catch (err) {
            setError(err.response?.data?.error ? JSON.stringify(err.response.data.error) : 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <div className="auth-logo">◆</div>
                        <h2>Welcome to Novex</h2>
                        <p>The platform where students share, discover, and collaborate on innovative projects.</p>
                        <div className="auth-features">
                            <div className="auth-feature">🚀 Showcase your projects</div>
                            <div className="auth-feature">🤝 Find collaborators</div>
                            <div className="auth-feature">💡 Discover innovations</div>
                        </div>
                    </div>
                </div>

                <div className="auth-form-side">
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                            onClick={() => { setTab('login'); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                            onClick={() => { setTab('register'); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {tab === 'login' ? (
                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    name="username" type="text" required
                                    value={form.username} onChange={handleChange}
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    name="password" type="password" required
                                    value={form.password} onChange={handleChange}
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input name="username" type="text" required value={form.username} onChange={handleChange} placeholder="Username" />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password *</label>
                                    <input name="password2" type="password" required value={form.password2} onChange={handleChange} placeholder="Confirm password" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>University</label>
                                <input name="university" type="text" value={form.university} onChange={handleChange} placeholder="Your university" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Field of Study</label>
                                    <input name="field_of_study" type="text" value={form.field_of_study} onChange={handleChange} placeholder="e.g. Computer Science" />
                                </div>
                                <div className="form-group">
                                    <label>Skills</label>
                                    <input name="skills" type="text" value={form.skills} onChange={handleChange} placeholder="e.g. Python, React" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function SubmitProjectPage({ user }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        short_description: '',
        description: '',
        category: '',
        status: 'ongoing',
        level: 'intermediate',
        github_url: '',
        video_url: '',
        cover_image: '',
        looking_for_members: false,
        tags: '',
    });

    useEffect(() => {
        api.getCategories().then(res => setCategories(res.data || res || [])).catch(() => { });
    }, []);

    useEffect(() => {
        if (editId) {
            api.getProject(editId).then(res => {
                const p = res.data || res;
                setForm({
                    title: p.title || '',
                    short_description: p.short_description || '',
                    description: p.description || '',
                    category: p.category || '',
                    status: p.status || 'ongoing',
                    level: p.level || 'intermediate',
                    github_url: p.github_url || '',
                    video_url: p.video_url || '',
                    cover_image: p.cover_image || '',
                    looking_for_members: p.looking_for_members || false,
                    tags: Array.isArray(p.tags) ? p.tags.map(t => t.name || t).join(', ') : (p.tags || ''),
                });
            }).catch(() => toast.error('Failed to load project'));
        }
    }, [editId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { toast.error('Title is required'); return; }
        setLoading(true);
        try {
            const data = { ...form };
            // Ensure tags are sent as a comma-separated string to match backend CharField
            if (typeof data.tags === 'string') {
                data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean).join(', ');
            }

            if (editId) {
                await api.updateProject(editId, data);
                toast.success('Project updated!');
                navigate(`/projects/${editId}`);
            } else {
                const res = await api.createProject(data);
                const newId = res.data?.id || res.id;
                toast.success('Project created!');
                navigate(newId ? `/projects/${newId}` : '/');
            }
        } catch (err) {
            const errData = err.response?.data?.error;
            const errMsg = errData && typeof errData === 'object' ? Object.values(errData).flat().join(', ') : (errData || 'Failed to save project');
            toast.error(String(errMsg));
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div style={{ paddingTop: '2rem' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 className="page-title">{editId ? 'Edit Project' : 'Initialize Project'}</h1>
                    <p className="page-subtitle">Configure your new digital workspace. Define parameters and assemble your creative stack.</p>
                </header>

                <div className="submit-layout">
                    {/* Form */}
                    <div className="submit-form-card">
                        <div className="submit-form-glow" />
                        <form className="submit-form" onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Project Title</label>
                                <input
                                    className="form-input form-input-plain"
                                    name="title"
                                    placeholder="e.g. Lunar Ecosystem Revamp"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }}
                                />
                            </div>

                            {/* Short Description */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Short Description</label>
                                <input
                                    className="form-input form-input-plain"
                                    name="short_description"
                                    placeholder="A one-line summary of your project"
                                    value={form.short_description}
                                    onChange={handleChange}
                                    style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }}
                                />
                            </div>

                            {/* Category & Level */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                                            <option value="">Select a domain...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--outline)' }}>expand_more</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Level</label>
                                    <div style={{ position: 'relative' }}>
                                        <select className="form-select" name="level" value={form.level} onChange={handleChange}>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--outline)' }}>expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Status</label>
                                <div style={{ position: 'relative' }}>
                                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                                        <option value="idea">Idea</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--outline)' }}>expand_more</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Description</label>
                                <textarea
                                    className="form-textarea"
                                    name="description"
                                    placeholder="Describe the mission, objectives, and scope of this project..."
                                    rows={6}
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Tags */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tags</label>
                                <input
                                    className="form-input form-input-plain"
                                    name="tags"
                                    placeholder="React, AI, Sustainability..."
                                    value={form.tags}
                                    onChange={handleChange}
                                    style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }}
                                />
                            </div>

                            {/* GitHub URL */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>GitHub Repository</label>
                                <div className="form-input-wrapper">
                                    <span className="material-symbols-outlined form-input-icon">link</span>
                                    <input
                                        className="form-input"
                                        name="github_url"
                                        type="url"
                                        placeholder="https://github.com/username/repo"
                                        value={form.github_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Video URL */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Video URL</label>
                                <div className="form-input-wrapper">
                                    <span className="material-symbols-outlined form-input-icon">play_circle</span>
                                    <input
                                        className="form-input"
                                        name="video_url"
                                        type="url"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={form.video_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Cover Image URL */}
                            <div className="form-group">
                                <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Cover Image URL</label>
                                <div className="form-input-wrapper">
                                    <span className="material-symbols-outlined form-input-icon">image</span>
                                    <input
                                        className="form-input"
                                        name="cover_image"
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={form.cover_image}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Looking for members */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input
                                    type="checkbox"
                                    id="looking_for_members"
                                    name="looking_for_members"
                                    checked={form.looking_for_members}
                                    onChange={handleChange}
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                                />
                                <label htmlFor="looking_for_members" style={{ cursor: 'pointer', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                                    Looking for team members
                                </label>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? <div className="spinner" /> : (
                                        <>
                                            {editId ? 'Update Project' : 'Create Project'}
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                        </>
                                    )}
                                </button>
                                <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate(-1)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips sidebar */}
                    <div>
                        <div className="submit-tips-card" style={{ marginBottom: '2rem' }}>
                            <div className="submit-tips-title">
                                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>lightbulb</span>
                                Pro Tips
                            </div>
                            <ul className="submit-tips-list">
                                <li><span className="number">01.</span><span>Use descriptive titles to help team members find your work faster.</span></li>
                                <li><span className="number">02.</span><span>Tags act as global filters. Use relevant technologies and topics.</span></li>
                                <li><span className="number">03.</span><span>GitHub links enable automated team collaboration.</span></li>
                                <li><span className="number">04.</span><span>Add a video URL to showcase your project demo.</span></li>
                            </ul>
                        </div>

                        <div style={{
                            padding: '1.5rem', background: 'rgba(74, 64, 224, 0.05)', borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(195, 192, 255, 0.1)', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', textAlign: 'center',
                        }}>
                            <div style={{
                                width: '3rem', height: '3rem', borderRadius: '50%',
                                background: 'rgba(74, 64, 224, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem', color: 'var(--primary)',
                            }}>
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Public Workspace</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                                This project will be visible to all Novex community members.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

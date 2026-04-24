import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { SkeletonGrid } from '../components/Skeletons';

export default function ProfilePage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const profileId = id || user?.id;

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    const isOwn = user && profileId && String(user.id) === String(profileId);

    const fetchProfile = useCallback(async () => {
        if (!profileId) return;
        setLoading(true);
        try {
            if (isOwn) {
                const res = await api.getMe();
                setProfile(res.data || res);
            } else {
                const res = await api.getUser(profileId);
                setProfile(res.data || res);
            }
            setError(null);
        } catch {
            setError('Failed to load profile');
        }
        setLoading(false);
    }, [profileId, isOwn]);

    const fetchProjects = useCallback(async () => {
        if (!profileId) return;
        setProjectsLoading(true);
        try {
            if (isOwn) {
                const res = await api.getMyProjects();
                setProjects(res.data || res || []);
            } else {
                const res = await api.getProjects({ owner: profileId });
                setProjects(res.data || res.results || res || []);
            }
        } catch {
            setProjects([]);
        }
        setProjectsLoading(false);
    }, [profileId, isOwn]);

    useEffect(() => {
        fetchProfile();
        fetchProjects();
    }, [fetchProfile, fetchProjects]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        try {
            await api.updateMe(editForm);
            toast.success('Profile updated!');
            setEditing(false);
            fetchProfile();
        } catch {
            toast.error('Failed to update profile');
        }
    };

    const startEditing = () => {
        setEditForm({
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            university: profile?.university || '',
            field_of_study: profile?.field_of_study || '',
            bio: profile?.bio || '',
            skills: profile?.skills || '',
            github_url: profile?.github_url || '',
            linkedin_url: profile?.linkedin_url || '',
        });
        setEditing(true);
    };

    const getInitials = (p) => {
        if (!p) return '?';
        return ((p.first_name || p.username || '')[0] || '') + ((p.last_name || '')[0] || '');
    };

    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="256"%3E%3Crect width="400" height="256" fill="%23171f33"/%3E%3Ctext x="200" y="134" text-anchor="middle" fill="%23918fa1" font-size="14" font-family="sans-serif"%3ENo Cover%3C/text%3E%3C/svg%3E';

    if (loading) return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            <div className="skeleton" style={{ height: '20rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }} />
            <SkeletonGrid count={4} />
        </div>
    );

    if (error || !profile) return (
        <div className="container">
            <div className="error-state" style={{ paddingTop: '6rem' }}>
                <span className="material-symbols-outlined">person_off</span>
                <h3>Profile Not Found</h3>
                <p>{error || 'This user does not exist.'}</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
            {/* Hero */}
            <section className="profile-hero">
                <div className="profile-hero-glow" />
                <div className="profile-hero-content">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar-glow" />
                        <div className="profile-avatar">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.username} />
                            ) : (
                                getInitials(profile).toUpperCase()
                            )}
                        </div>
                    </div>
                    <div className="profile-info">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                            <h1 className="profile-name">{profile.first_name || profile.username} {profile.last_name || ''}</h1>
                        </div>
                        <p className="profile-role">{profile.field_of_study || 'Student'} {profile.university ? `@ ${profile.university}` : ''}</p>
                        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                        <div className="profile-actions">
                            {isOwn ? (
                                editing ? (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                                        <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                                    </div>
                                ) : (
                                    <button className="btn btn-primary" onClick={startEditing}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                                        Edit Profile
                                    </button>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            {/* Edit form */}
            {editing && (
                <div style={{
                    background: 'var(--surface-container)', borderRadius: 'var(--radius-lg)',
                    padding: '2rem', marginBottom: '3rem',
                }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input className="form-input form-input-plain" name="first_name" value={editForm.first_name} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input className="form-input form-input-plain" name="last_name" value={editForm.last_name} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">University</label>
                            <input className="form-input form-input-plain" name="university" value={editForm.university} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Field of Study</label>
                            <input className="form-input form-input-plain" name="field_of_study" value={editForm.field_of_study} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">Bio</label>
                        <textarea className="form-textarea" name="bio" value={editForm.bio} onChange={handleEditChange} rows={3} />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">Skills (Press Enter to add)</label>
                        <div className="skills-input-container" style={{
                            display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem',
                            background: 'var(--surface-container-lowest)', borderRadius: 'var(--radius-xl)',
                            border: '1px solid rgba(70,69,85,0.2)'
                        }}>
                            {(typeof editForm.skills === 'string' ? editForm.skills.split(',').map(s => s.trim()) : editForm.skills || []).filter(Boolean).map((skill, i) => (
                                <span key={i} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {skill}
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => {
                                        const skills = editForm.skills.split(',').map(s => s.trim()).filter(s => s !== skill);
                                        setEditForm({ ...editForm, skills: skills.join(', ') });
                                    }}>close</span>
                                </span>
                            ))}
                            <input
                                className="form-input-plain"
                                placeholder="Add a skill..."
                                style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--on-surface)', padding: '0.25rem' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (val) {
                                            const currentSkills = editForm.skills ? editForm.skills.split(',').map(s => s.trim()) : [];
                                            if (!currentSkills.includes(val)) {
                                                setEditForm({ ...editForm, skills: [...currentSkills, val].join(', ') });
                                            }
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">GitHub URL</label>
                            <input className="form-input form-input-plain" name="github_url" value={editForm.github_url} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">LinkedIn URL</label>
                            <input className="form-input form-input-plain" name="linkedin_url" value={editForm.linkedin_url} onChange={handleEditChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(70,69,85,0.2)', background: 'var(--surface-container-lowest)' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Content layout */}
            <div className="profile-layout">
                {/* Sidebar */}
                <aside className="profile-sidebar">
                    <div className="profile-sidebar-card">
                        {/* Skills */}
                        {profile.skills && (
                            <>
                                <h3 className="profile-sidebar-title">Expertise</h3>
                                <div className="profile-skills">
                                    {(typeof profile.skills === 'string' ? profile.skills.split(',').map(s => s.trim()) : profile.skills).filter(Boolean).map((skill, i) => (
                                        <span key={i} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Socials */}
                        <h3 className="profile-sidebar-title">Socials</h3>
                        {profile.github_url && (
                            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                                <span className="material-symbols-outlined">terminal</span>
                                GitHub
                            </a>
                        )}
                        {profile.linkedin_url && (
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                                <span className="material-symbols-outlined">work</span>
                                LinkedIn
                            </a>
                        )}
                        {profile.email && (
                            <a href={`mailto:${profile.email}`} className="profile-social-link">
                                <span className="material-symbols-outlined">mail</span>
                                {profile.email}
                            </a>
                        )}
                    </div>
                </aside>

                {/* Projects grid */}
                <div className="profile-projects">
                    <div className="profile-projects-header">
                        <h2 className="profile-projects-title">
                            {isOwn ? 'My Projects' : `${profile.first_name || profile.username}'s Projects`}
                        </h2>
                    </div>

                    {projectsLoading ? (
                        <SkeletonGrid count={4} />
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>folder_open</span>
                            </div>
                            <h3>No projects yet</h3>
                            <p>{isOwn ? 'Create your first project to showcase your work!' : 'This user hasn\'t created any projects yet.'}</p>
                            {isOwn && (
                                <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Project</Link>
                            )}
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map(project => (
                                <div key={project.id} className="grid-project-card" onClick={() => navigate(`/projects/${project.id}`)}>
                                    <div className="grid-project-cover">
                                        <img src={project.cover_image || project.image || placeholder} alt={project.title} onError={(e) => { e.target.src = placeholder; }} />
                                        <div className="grid-project-cover-overlay" />
                                        {project.category_name && <div className="grid-project-cover-badge">{project.category_name}</div>}
                                    </div>
                                    <div className="grid-project-body">
                                        <div className="grid-project-header">
                                            <h3 className="grid-project-title">{project.title}</h3>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>arrow_outward</span>
                                        </div>
                                        <p className="grid-project-desc">{project.short_description || project.description}</p>
                                        {project.tags && (
                                            <div className="grid-project-tags">
                                                {(Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? project.tags.split(',') : [])).slice(0, 3).map((tag, i) => {
                                                    const tagName = typeof tag === 'object' ? (tag.name || JSON.stringify(tag)) : tag;
                                                    return (
                                                        <span key={i} className="grid-project-tag">{tagName}</span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

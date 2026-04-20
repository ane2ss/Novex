import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';

function ProfilePage() {
    const { user, logout, fetchUser } = useAuth();
    const [myProjects, setMyProjects] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('projects');

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [projRes, joinRes] = await Promise.all([
                    api.getMyProjects(),
                    api.getMyJoinRequests(),
                ]);
                setMyProjects(projRes.data || []);
                setJoinRequests(joinRes.data || []);
            } catch { }
            setLoading(false);
        };
        fetchData();
        setForm({
            bio: user.bio || '',
            university: user.university || '',
            field_of_study: user.field_of_study || '',
            skills: user.skills || '',
            github: user.github || '',
            linkedin: user.linkedin || '',
        });
    }, [user]);

    const handleSave = async () => {
        try {
            await api.updateMe(form);
            await fetchUser();
            setEditing(false);
        } catch { }
    };

    const handleJoinAction = async (id, status) => {
        try {
            await api.updateJoinRequest(id, status);
            setJoinRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        } catch { }
    };

    if (!user) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <h2>Please sign in to view your profile</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="profile-page">
                <div className="profile-header-card">
                    <div className="profile-avatar-large">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.username} />
                        ) : (
                            <span>{user.username[0].toUpperCase()}</span>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <p className="profile-email">{user.email}</p>
                        {user.university && <span className="profile-detail">🏫 {user.university}</span>}
                        {user.field_of_study && <span className="profile-detail">📚 {user.field_of_study}</span>}
                        {user.skills && (
                            <div className="profile-skills">
                                {user.skills.split(',').map((s, i) => (
                                    <span key={i} className="tag">{s.trim()}</span>
                                ))}
                            </div>
                        )}
                        <div className="profile-links">
                            {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="profile-link">GitHub</a>}
                            {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="profile-link">LinkedIn</a>}
                        </div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => setEditing(!editing)}>
                        {editing ? '✕ Cancel' : '✏️ Edit Profile'}
                    </button>
                </div>

                {editing && (
                    <div className="edit-profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Bio</label>
                                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>University</label>
                                <input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Field of Study</label>
                                <input value={form.field_of_study} onChange={e => setForm({ ...form, field_of_study: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Skills (comma-separated)</label>
                                <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>GitHub URL</label>
                                <input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn URL</label>
                                <input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                    </div>
                )}

                <div className="profile-tabs">
                    <button className={`profile-tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
                        My Projects ({myProjects.length})
                    </button>
                    <button className={`profile-tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
                        Join Requests ({joinRequests.length})
                    </button>
                </div>

                {tab === 'projects' && (
                    <div className="projects-grid">
                        {myProjects.length === 0 ? (
                            <div className="empty-state">
                                <p>You haven't created any projects yet.</p>
                            </div>
                        ) : (
                            myProjects.map(p => <ProjectCard key={p.id} project={p} />)
                        )}
                    </div>
                )}

                {tab === 'requests' && (
                    <div className="join-requests-list">
                        {joinRequests.length === 0 ? (
                            <div className="empty-state"><p>No pending join requests.</p></div>
                        ) : (
                            joinRequests.map(r => (
                                <div key={r.id} className="join-request-card">
                                    <div>
                                        <strong>User #{r.user_id}</strong> wants to join <strong>Project #{r.project_id}</strong>
                                        <span className={`status-badge status-${r.status}`}>{r.status}</span>
                                    </div>
                                    {r.status === 'pending' && (
                                        <div className="request-actions">
                                            <button className="btn btn-primary btn-sm" onClick={() => handleJoinAction(r.id, 'accepted')}>Accept</button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleJoinAction(r.id, 'declined')}>Decline</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;

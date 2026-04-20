import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CommentSection from '../components/CommentSection';

function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upvoted, setUpvoted] = useState(false);
    const [joining, setJoining] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.getProject(id);
                setProject(res.data);
            } catch {
                navigate('/');
            }
            setLoading(false);
        };
        fetchProject();
    }, [id, navigate]);

    const handleUpvote = async () => {
        if (!token) return;
        try {
            if (upvoted) {
                await api.removeUpvote(id);
                setProject(prev => ({ ...prev, upvote_count: (prev.upvote_count || 1) - 1 }));
            } else {
                await api.upvote(id);
                setProject(prev => ({ ...prev, upvote_count: (prev.upvote_count || 0) + 1 }));
            }
            setUpvoted(!upvoted);
        } catch { }
    };

    const handleJoin = async () => {
        if (!token || !project) return;
        setJoining(true);
        try {
            await api.joinProject(id, { project_owner_id: project.owner_id });
            alert('Join request sent!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send join request');
        }
        setJoining(false);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="skeleton-detail">
                    <div className="skeleton-block skeleton-title"></div>
                    <div className="skeleton-block skeleton-text"></div>
                    <div className="skeleton-block skeleton-text"></div>
                </div>
            </div>
        );
    }

    if (!project) return null;

    const tags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const statusColors = {
        idea: '#a78bfa',
        in_progress: '#fbbf24',
        launched: '#34d399',
    };

    return (
        <div className="page-container">
            <div className="project-detail">
                <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {project.cover_image && (
                    <div className="detail-cover">
                        <img src={project.cover_image} alt={project.title} />
                    </div>
                )}

                <div className="detail-header">
                    <div className="detail-meta">
                        <span className="status-badge" style={{ backgroundColor: statusColors[project.status] || '#94a3b8' }}>
                            {project.status?.replace('_', ' ')}
                        </span>
                        {project.category_name && <span className="category-badge">{project.category_name}</span>}
                        <span className="level-badge">{project.level}</span>
                    </div>
                    <h1 className="detail-title">{project.title}</h1>
                    <p className="detail-short-desc">{project.short_description}</p>
                </div>

                <div className="detail-actions">
                    <button
                        className={`btn ${upvoted ? 'btn-primary' : 'btn-ghost'} upvote-btn`}
                        onClick={handleUpvote}
                        disabled={!token}
                    >
                        ❤️ {project.upvote_count || 0}
                    </button>

                    {project.looking_for_teammates && token && (
                        <button className="btn btn-primary" onClick={handleJoin} disabled={joining}>
                            {joining ? 'Sending...' : '🤝 Join Team'}
                        </button>
                    )}

                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                            📂 GitHub
                        </a>
                    )}
                    {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                            🌐 Live Demo
                        </a>
                    )}
                </div>

                {tags.length > 0 && (
                    <div className="detail-tags">
                        {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                    </div>
                )}

                <div className="detail-description">
                    <h2>About this project</h2>
                    <p>{project.description}</p>
                </div>

                {project.video_url && (
                    <div className="detail-video">
                        <h2>Demo Video</h2>
                        <iframe
                            src={project.video_url}
                            title="Demo"
                            frameBorder="0"
                            allowFullScreen
                            style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}
                        />
                    </div>
                )}

                {project.team_members && project.team_members.length > 0 && (
                    <div className="detail-team">
                        <h2>Team Members</h2>
                        <div className="team-list">
                            {project.team_members.map(m => (
                                <div key={m.id} className="team-member-card">
                                    <span className="team-avatar">👤</span>
                                    <span>User #{m.user_id}</span>
                                    <span className="team-role">{m.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <CommentSection projectId={id} />
            </div>
        </div>
    );
}

export default ProjectDetailPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { SkeletonDetail } from '../components/Skeletons';

export default function ProjectDetailPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Comments
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Upvote
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [upvoteAnimating, setUpvoteAnimating] = useState(false);

    // Join request
    const [joinMessage, setJoinMessage] = useState('');
    const [joiningLoading, setJoiningLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [replyTo, setReplyTo] = useState(null);

    const fetchProject = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.getProject(id);
            const p = res.data || res;
            setProject(p);
            setUpvoteCount(p.upvote_count || 0);

            if (user) {
                const upvotesRes = await api.getMyUpvotes();
                const upvotedIds = upvotesRes.data || [];
                setUpvoted(upvotedIds.includes(Number(id)));
            }

            setError(null);
        } catch {
            setError('Failed to load project');
        }
        setLoading(false);
    }, [id, user]);

    const fetchComments = useCallback(async () => {
        setCommentsLoading(true);
        try {
            const res = await api.getComments(id);
            setComments(res.data || res || []);
        } catch {
            setComments([]);
        }
        setCommentsLoading(false);
    }, [id]);

    const fetchJoinRequests = useCallback(async () => {
        if (user && project && (project.owner_id === user.id || project.owner === user.id)) {
            try {
                const res = await api.getMyJoinRequests();
                const allReqs = res.data || [];
                setPendingRequests(allReqs.filter(r => r.project_id === Number(id) && r.status === 'pending'));
            } catch { }
        }
    }, [user, project, id]);

    useEffect(() => {
        fetchProject();
        fetchComments();
    }, [fetchProject, fetchComments]);

    useEffect(() => {
        fetchJoinRequests();
    }, [fetchJoinRequests]);

    const handleUpvote = async () => {
        if (!user) { navigate('/login'); return; }
        setUpvoteAnimating(true);
        setTimeout(() => setUpvoteAnimating(false), 400);
        try {
            if (upvoted) {
                await api.removeUpvote(id);
                setUpvoted(false);
                setUpvoteCount(prev => Math.max(0, prev - 1));
            } else {
                await api.upvote(id, project.owner_id || project.owner);
                setUpvoted(true);
                setUpvoteCount(prev => prev + 1);
            }
        } catch {
            toast.error('Failed to update upvote');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!user) { navigate('/login'); return; }
        setSubmittingComment(true);
        try {
            const data = { content: commentText };
            if (replyTo) data.parent = replyTo;
            await api.addComment(id, data);
            setCommentText('');
            setReplyTo(null);
            fetchComments();
            toast.success(replyTo ? 'Reply posted!' : 'Comment posted!');
        } catch {
            toast.error('Failed to post comment');
        }
        setSubmittingComment(false);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    const handleJoin = async () => {
        if (!user) { navigate('/login'); return; }
        setJoiningLoading(true);
        try {
            await api.joinProject(id, {
                message: joinMessage,
                project_owner_id: project.owner_id || project.owner
            });
            toast.success('Join request sent!');
            setJoinMessage('');
        } catch (err) {
            const errData = err.response?.data?.error;
            const errMsg = errData && typeof errData === 'object' ? Object.values(errData).flat().join(', ') : (errData || 'Failed to send request');
            toast.error(String(errMsg));
        }
        setJoiningLoading(false);
    };

    const handleRequestAction = async (requestId, status) => {
        try {
            await api.updateJoinRequest(requestId, status);
            toast.success(`Request ${status}`);
            fetchJoinRequests();
            if (status === 'accepted') fetchProject(); // Refresh team members
        } catch {
            toast.error('Failed to update request');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.deleteProject(id);
            toast.success('Project deleted');
            navigate('/');
        } catch {
            toast.error('Failed to delete project');
        }
    };

    const isOwner = user && project && (project.owner === user.id || project.owner_id === user.id);
    const isMember = project?.team_members?.some(m => m.id === user?.id || m.user_id === user?.id);
    const coverImage = project?.cover_image || project?.image || null;
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect width="1200" height="400" fill="%23171f33"/%3E%3Ctext x="600" y="210" text-anchor="middle" fill="%23918fa1" font-size="24" font-family="sans-serif"%3EProject Cover%3C/text%3E%3C/svg%3E';

    if (loading) return <div className="container"><SkeletonDetail /></div>;

    if (error) return (
        <div className="container">
            <div className="error-state" style={{ paddingTop: '6rem' }}>
                <span className="material-symbols-outlined">error</span>
                <h3>Project Not Found</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
            {/* Hero */}
            <div className="detail-hero">
                <div className="detail-hero-bg">
                    <img src={coverImage || placeholder} alt={project.title} onError={(e) => { e.target.src = placeholder; }} />
                </div>
                <div className="detail-hero-overlay" />
                <div className="detail-hero-content">
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {project.category_name && <span className="tag tag-category">{project.category_name}</span>}
                        {project.status && <span className="tag tag-status">{project.status}</span>}
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem' }}>{project.title}</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', fontWeight: 300, maxWidth: '42rem' }}>
                        {project.short_description || (project.description && project.description.substring(0, 200))}
                    </p>
                </div>
            </div>

            <div className="detail-grid">
                {/* Main column */}
                <div>
                    {/* Description */}
                    <section className="detail-section">
                        <h2 className="detail-section-title">
                            <span className="line" />
                            Project Vision
                        </h2>
                        <div className="detail-body">
                            {(project.description || '').split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                        </div>
                    </section>

                    {/* Video embed */}
                    {project.video_url && (
                        <section className="detail-section">
                            <h2 className="detail-section-title">
                                <span className="line" />
                                Demo Video
                            </h2>
                            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-container-lowest)', aspectRatio: '16/9' }}>
                                <iframe
                                    src={project.video_url.replace('watch?v=', 'embed/')}
                                    title="Project Demo"
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    allowFullScreen
                                />
                            </div>
                        </section>
                    )}

                    {/* Comments */}
                    <section className="detail-section">
                        <h2 className="detail-section-title">
                            <span className="line" />
                            Discussion ({comments.length})
                        </h2>

                        {/* Comment input */}
                        {user && (
                            <form onSubmit={handleComment}>
                                <div className="comment-input-box">
                                    <div className="comment-avatar">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="comment-input-area">
                                        <textarea
                                            className="comment-textarea"
                                            placeholder="Join the discussion..."
                                            rows={2}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <div className="comment-actions">
                                            <button type="submit" className="btn btn-primary btn-sm" disabled={submittingComment || !commentText.trim()}>
                                                {submittingComment ? <div className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Post Comment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Comments list */}
                        {commentsLoading ? (
                            <div className="loading-container"><div className="spinner" /></div>
                        ) : comments.length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <p>No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div>
                                {comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        user={user}
                                        project={project}
                                        onDelete={handleDeleteComment}
                                        onReply={(id) => { setReplyTo(id); document.querySelector('.comment-textarea')?.focus(); }}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <aside>
                    {/* Status card */}
                    <div className="sidebar-card">
                        <div className="stat-row">
                            <span className="stat-label">Status</span>
                            <span className="status-badge-active">
                                <span className="status-pulse" />
                                {(project.status || 'ACTIVE').toUpperCase()}
                            </span>
                        </div>
                        {project.level && (
                            <div className="stat-row">
                                <span className="stat-label">Difficulty</span>
                                <span className="stat-value">{project.level}</span>
                            </div>
                        )}
                        {project.github_url && (
                            <div className="stat-row">
                                <span className="stat-label">GitHub</span>
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="stat-value" style={{ color: 'var(--primary)' }}>
                                    View Repo ↗
                                </a>
                            </div>
                        )}
                        <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <motion.button
                                className={`btn btn-primary btn-full ${upvoteAnimating ? 'upvote-animate' : ''}`}
                                onClick={handleUpvote}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: upvoted ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                {upvoted ? 'Upvoted' : 'Star Project'} ({upvoteCount})
                            </motion.button>

                            {isOwner && (
                                <>
                                    <button className="btn btn-outline btn-full" onClick={() => navigate(`/submit?edit=${id}`)}>
                                        <span className="material-symbols-outlined">edit</span> Edit Project
                                    </button>
                                    <button className="btn btn-danger btn-full btn-sm" onClick={handleDelete}>
                                        <span className="material-symbols-outlined">delete</span> Delete
                                    </button>
                                </>
                            )}

                            {user && !isOwner && !isMember && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Why do you want to join?"
                                        value={joinMessage}
                                        onChange={(e) => setJoinMessage(e.target.value)}
                                        rows={2}
                                        style={{ marginBottom: '0.5rem', minHeight: '80px' }}
                                    />
                                    <button className="btn btn-outline btn-full" onClick={handleJoin} disabled={joiningLoading}>
                                        {joiningLoading ? <div className="spinner" style={{ width: '1rem', height: '1rem' }} /> : (
                                            <>
                                                <span className="material-symbols-outlined">group_add</span> Request to Join
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {isOwner && pendingRequests.length > 0 && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: '0.75rem' }}>Pending Requests</h4>
                                    {pendingRequests.map(req => (
                                        <div key={req.id} className="sidebar-card" style={{ padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>User #{req.user_id}</div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--outline)', marginBottom: '0.5rem' }}>{req.message}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: '0.7rem' }} onClick={() => handleRequestAction(req.id, 'accepted')}>Accept</button>
                                                <button className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: '0.7rem' }} onClick={() => handleRequestAction(req.id, 'declined')}>Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Team Members */}
                    {project.team_members && project.team_members.length > 0 && (
                        <div className="sidebar-card">
                            <h3>Team Members</h3>
                            {project.team_members.map((member, idx) => (
                                <div key={idx} className="team-member">
                                    <div className="team-member-avatar">
                                        {member.avatar ? <img src={member.avatar} alt={member.username} /> : (member.username || 'U')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="team-member-name">{member.first_name || member.username || 'Member'} {member.last_name || ''}</div>
                                        <div className="team-member-role">{member.role || 'Contributor'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="sidebar-card">
                            <h3>Technologies</h3>
                            <div className="tech-tags">
                                {(Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? project.tags.split(',') : [])).map((tag, i) => {
                                    const tagName = typeof tag === 'object' ? (tag.name || JSON.stringify(tag)) : tag;
                                    return (
                                        <span key={i} className="tech-tag">{tagName}</span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

function CommentItem({ comment, user, project, onDelete, onReply }) {
    const isOwner = project && (comment.user_id === project.owner_id || comment.user_id === project.owner);
    const isMember = project?.team_members?.some(m => m.user_id === comment.user_id || m.id === comment.user_id);
    const canDelete = user && (comment.user_id === user.id || user.id === project?.owner_id);

    return (
        <div className="comment-item-wrapper">
            <div className="comment-item">
                <div className="comment-avatar">
                    <span className="material-symbols-outlined">person</span>
                </div>
                <div className="comment-body">
                    <div className="comment-meta">
                        <span className="comment-author">{comment.user_username || 'User'}</span>
                        {isOwner && <span className="tag tag-owner" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Owner</span>}
                        {isMember && !isOwner && <span className="tag tag-member" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Developer</span>}
                        <span className="comment-time">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-footer">
                        {user && (
                            <button className="comment-action-btn" onClick={() => onReply(comment.id)}>
                                Reply
                            </button>
                        )}
                        {canDelete && (
                            <button className="comment-action-btn" onClick={() => onDelete(comment.id)} style={{ color: 'var(--error)' }}>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies" style={{ marginLeft: '2.5rem', borderLeft: '1px solid var(--outline-variant)', paddingLeft: '1rem' }}>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            user={user}
                            project={project}
                            onDelete={onDelete}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

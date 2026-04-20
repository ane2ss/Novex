import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function CommentSection({ projectId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const fetchComments = async () => {
        try {
            const res = await api.getComments(projectId);
            setComments(res.data || []);
        } catch { }
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || submitting) return;
        setSubmitting(true);
        try {
            await api.addComment(projectId, { content: text });
            setText('');
            await fetchComments();
        } catch (err) {
            console.error('Comment error:', err);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteComment(id);
            setComments(prev => prev.filter(c => c.id !== id));
        } catch { }
    };

    if (loading) return <div className="comments-loading">Loading comments...</div>;

    return (
        <div className="comment-section">
            <h3 className="comments-title">💬 Comments ({comments.length})</h3>

            {token && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="comment-input"
                        rows={3}
                    />
                    <button type="submit" className="btn btn-primary" disabled={submitting || !text.trim()}>
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-user">User #{comment.user_id}</span>
                                <span className="comment-date">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                            {comment.replies && comment.replies.map(reply => (
                                <div key={reply.id} className="comment-reply">
                                    <span className="comment-user">User #{reply.user_id}</span>
                                    <p className="comment-content">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;

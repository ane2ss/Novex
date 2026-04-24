import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function ProjectCard({ project, user }) {
    const navigate = useNavigate();
    const [upvoted, setUpvoted] = useState(project.has_upvoted || false);
    const [upvoteCount, setUpvoteCount] = useState(project.upvote_count || 0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        setUpvoted(project.has_upvoted || false);
        setUpvoteCount(project.upvote_count || 0);
    }, [project.has_upvoted, project.upvote_count]);

    const handleUpvote = useCallback(async (e) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }

        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        const wasUpvoted = upvoted;
        setUpvoted(!wasUpvoted);
        setUpvoteCount(prev => wasUpvoted ? Math.max(0, prev - 1) : prev + 1);

        try {
            if (wasUpvoted) {
                await api.removeUpvote(project.id);
            } else {
                await api.upvote(project.id, project.owner_id || project.owner);
            }
        } catch (err) {
            // revert on error
            setUpvoted(wasUpvoted);
            setUpvoteCount(project.upvote_count || 0);
            toast.error('Failed to update upvote');
        }
    }, [upvoted, project.id, project.upvote_count, user, navigate]);

    const coverImage = project.cover_image || project.image || null;
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23222a3d"/%3E%3Ctext x="48" y="54" text-anchor="middle" fill="%23918fa1" font-size="14" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';

    return (
        <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
            <div className="project-card-thumb">
                <img src={coverImage || placeholder} alt={project.title} onError={(e) => { e.target.src = placeholder; }} />
            </div>

            <div className="project-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 className="project-card-title">{project.title}</h3>
                    {project.owner_username && (
                        <span className="project-card-author">by {project.owner_username}</span>
                    )}
                </div>
                <p className="project-card-desc">{project.short_description || project.description}</p>
                <div className="project-card-tags">
                    {project.category_name && <span className="tag tag-category">{project.category_name}</span>}
                    {project.status && <span className="tag tag-status">{project.status}</span>}
                    {project.level && <span className="tag tag-level">{project.level}</span>}
                    {project.looking_for_members && <span className="tag tag-looking">Looking for Team</span>}
                </div>
                {(project.comment_count !== undefined || project.comments_count !== undefined) && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--outline)' }}>
                        <span>💬 {project.comment_count || project.comments_count || 0}</span>
                    </div>
                )}
            </div>

            <motion.button
                className={`upvote-btn ${upvoted ? 'upvoted' : ''} ${animating ? 'upvote-animate' : ''}`}
                onClick={handleUpvote}
                whileTap={{ scale: 0.9 }}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: upvoted ? "'FILL' 1" : "'FILL' 0" }}>
                    change_history
                </span>
                <span>{upvoteCount}</span>
            </motion.button>
        </div>
    );
}

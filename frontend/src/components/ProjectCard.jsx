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
    const [hovered, setHovered] = useState(false);

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
            setUpvoted(wasUpvoted);
            setUpvoteCount(project.upvote_count || 0);
            toast.error('Failed to update upvote');
        }
    }, [upvoted, project.id, project.upvote_count, user, navigate]);

    const coverImage = project.cover_image || project.image || null;
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23222a3d"/%3E%3Ctext x="48" y="54" text-anchor="middle" fill="%23918fa1" font-size="14" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';

    return (
        <motion.div
            onClick={() => navigate(`/projects/${project.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={false}
            animate={{
                background: hovered
                    ? 'linear-gradient(135deg, rgba(74,64,224,0.10) 0%, rgba(99,102,241,0.08) 50%, rgba(124,58,237,0.06) 100%)'
                    : 'transparent',
                borderColor: hovered ? 'rgba(195,192,255,0.25)' : 'rgba(70,69,85,0.15)',
            }}
            transition={{ duration: 0.3 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '0.875rem',
                border: '1px solid rgba(70,69,85,0.15)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle glowing edge on hover */}
            {hovered && (
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '0.875rem',
                    boxShadow: '0 0 0 1px rgba(195,192,255,0.15) inset, 0 8px 32px rgba(74,64,224,0.12)',
                    pointerEvents: 'none',
                }} />
            )}

            {/* Thumbnail */}
            <div style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '0.625rem',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--surface-container)',
                transition: 'transform 0.3s',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}>
                <img
                    src={coverImage || placeholder}
                    alt={project.title}
                    onError={e => { e.target.src = placeholder; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Body */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem', gap: '0.5rem' }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: hovered ? '#fff' : 'var(--on-surface)',
                        transition: 'color 0.25s',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {project.title}
                    </h3>
                    {project.owner_username && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--outline)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            @{project.owner_username}
                        </span>
                    )}
                </div>
                <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--on-surface-variant)',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '0.5rem',
                }}>
                    {project.short_description || project.description}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {project.category_name && (
                        <span style={{
                            background: hovered ? 'rgba(74,64,224,0.2)' : 'rgba(74,64,224,0.1)',
                            color: 'var(--primary)',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            transition: 'background 0.25s',
                        }}>
                            {project.category_name}
                        </span>
                    )}
                    {project.status && (
                        <span style={{
                            background: 'rgba(16,185,129,0.1)',
                            color: '#10b981',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                        }}>
                            {project.status}
                        </span>
                    )}
                    {project.level && (
                        <span style={{
                            background: 'rgba(245,158,11,0.1)',
                            color: '#f59e0b',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                        }}>
                            {project.level}
                        </span>
                    )}
                    {project.looking_for_members && (
                        <span style={{
                            background: 'rgba(99,102,241,0.1)',
                            color: '#818cf8',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                        }}>
                            Hiring
                        </span>
                    )}
                    {(project.comment_count !== undefined || project.comments_count !== undefined) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--outline)', marginLeft: '0.25rem' }}>
                            💬 {project.comment_count || project.comments_count || 0}
                        </span>
                    )}
                </div>
            </div>

            {/* Upvote button – premium pill */}
            <motion.button
                onClick={handleUpvote}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.07 }}
                style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.15rem',
                    width: '2.75rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    border: upvoted ? 'none' : '1px solid rgba(195,192,255,0.25)',
                    background: upvoted
                        ? 'linear-gradient(160deg, #6366f1 0%, #4a40e0 50%, #7c3aed 100%)'
                        : 'rgba(74,64,224,0.07)',
                    boxShadow: upvoted
                        ? '0 0 16px rgba(99,102,241,0.55), 0 4px 12px rgba(74,64,224,0.35)'
                        : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s, box-shadow 0.3s, border 0.3s',
                    fontFamily: 'inherit',
                    animation: animating ? 'upvote-pop 0.35s ease' : 'none',
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '1.1rem',
                        fontVariationSettings: upvoted ? "'FILL' 1" : "'FILL' 0",
                        color: upvoted ? '#fff' : 'rgba(195,192,255,0.8)',
                        transition: 'color 0.25s',
                    }}
                >
                    arrow_upward
                </span>
                <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: upvoted ? '#fff' : 'rgba(195,192,255,0.75)',
                    letterSpacing: '0.01em',
                    transition: 'color 0.25s',
                }}>
                    {upvoteCount}
                </span>
            </motion.button>
        </motion.div>
    );
}

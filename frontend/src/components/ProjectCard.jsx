import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
    const statusColors = {
        idea: '#a78bfa',
        in_progress: '#fbbf24',
        launched: '#34d399',
    };

    const levelLabels = {
        beginner: '🌱 Beginner',
        intermediate: '⚡ Intermediate',
        advanced: '🔥 Advanced',
    };

    const tags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    return (
        <Link to={`/projects/${project.id}`} className="project-card">
            {project.cover_image && (
                <div className="card-cover">
                    <img src={project.cover_image} alt={project.title} />
                </div>
            )}
            <div className="card-body">
                <div className="card-top-row">
                    <span
                        className="status-badge"
                        style={{ backgroundColor: statusColors[project.status] || '#94a3b8' }}
                    >
                        {project.status?.replace('_', ' ')}
                    </span>
                    {project.looking_for_teammates && (
                        <span className="looking-badge">👥 Recruiting</span>
                    )}
                </div>

                <h3 className="card-title">{project.title}</h3>
                <p className="card-desc">{project.short_description || project.description}</p>

                {tags.length > 0 && (
                    <div className="card-tags">
                        {tags.slice(0, 4).map((tag, i) => (
                            <span key={i} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="card-footer">
                    <div className="card-stats">
                        <span className="stat">❤️ {project.upvote_count || 0}</span>
                        <span className="stat">👥 {project.team_members?.length || 0}</span>
                    </div>
                    <span className="card-level">{levelLabels[project.level] || project.level}</span>
                </div>
            </div>
        </Link>
    );
}

export default ProjectCard;

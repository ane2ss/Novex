import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';

function HomePage() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '', category: '', status: '', level: '', looking_for_teammates: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {};
                Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
                const res = await api.getProjects(params);
                setProjects(res.data || res.results || res || []);
            } catch (err) {
                console.error('Fetch projects error:', err);
                setProjects([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [filters]);

    useEffect(() => {
        api.getCategories().then(res => setCategories(res.data || [])).catch(() => { });
    }, []);

    const handleFilterChange = (key, value) => {
        setLoading(true);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="page-container">
            <div className="hero-section">
                <h1 className="hero-title">
                    Discover <span className="gradient-text">Student Projects</span>
                </h1>
                <p className="hero-subtitle">
                    Explore innovative projects, find collaborators, and showcase your work to the world.
                </p>
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search projects by name or tag..."
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="filters-bar">
                <select
                    value={filters.category}
                    onChange={e => handleFilterChange('category', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Statuses</option>
                    <option value="idea">💡 Idea</option>
                    <option value="in_progress">🔨 In Progress</option>
                    <option value="launched">🚀 Launched</option>
                </select>

                <select
                    value={filters.level}
                    onChange={e => handleFilterChange('level', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Levels</option>
                    <option value="beginner">🌱 Beginner</option>
                    <option value="intermediate">⚡ Intermediate</option>
                    <option value="advanced">🔥 Advanced</option>
                </select>

                <label className="filter-checkbox">
                    <input
                        type="checkbox"
                        checked={filters.looking_for_teammates === 'true'}
                        onChange={e => handleFilterChange('looking_for_teammates', e.target.checked ? 'true' : '')}
                    />
                    <span>Recruiting</span>
                </label>
            </div>

            {loading ? (
                <div className="projects-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-block skeleton-cover"></div>
                            <div className="skeleton-block skeleton-title"></div>
                            <div className="skeleton-block skeleton-text"></div>
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h2>No projects found</h2>
                    <p>Try adjusting your filters or be the first to create a project!</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
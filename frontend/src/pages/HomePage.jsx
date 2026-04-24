import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { SkeletonList } from '../components/Skeletons';

export default function HomePage({ user }) {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvotedIds, setUpvotedIds] = useState([]);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [sortBy, setSortBy] = useState('popular');

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedStatus) params.status = selectedStatus;
            if (selectedLevel) params.level = selectedLevel;
            if (sortBy) params.sort = sortBy;

            const res = await api.getProjects(params);
            setProjects(res.data || res.results || res || []);
        } catch (err) {
            setError('Failed to load projects');
            setProjects([]);
        }
        setLoading(false);
    }, [search, selectedCategory, selectedStatus, selectedLevel, sortBy]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        api.getCategories().then(res => {
            setCategories(res.data || res || []);
        }).catch(() => { });

        if (user) {
            api.getMyUpvotes().then(res => {
                setUpvotedIds(res.data || []);
            }).catch(() => { });
        }
    }, [user]);

    // Debounce search
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const statusOptions = ['', 'completed', 'ongoing', 'idea', 'archived'];
    const levelOptions = ['', 'beginner', 'intermediate', 'advanced'];

    const categoryIcons = {
        'ai': 'category',
        'web': 'web',
        'mobile': 'smartphone',
        'data': 'analytics',
        'security': 'security',
        'iot': 'sensors',
        'game': 'sports_esports',
    };

    const getCategoryIcon = (name) => {
        if (!name) return 'grid_view';
        const lower = name.toLowerCase();
        for (const [key, icon] of Object.entries(categoryIcons)) {
            if (lower.includes(key)) return icon;
        }
        return 'category';
    };

    return (
        <div className="container" style={{ paddingTop: '1.5rem' }}>
            <div className="home-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2 className="sidebar-title">Filters</h2>
                    <p className="sidebar-subtitle">Refine your discovery</p>

                    <div className="sidebar-section">
                        <div className="sidebar-section-label">Category</div>
                        <button
                            className={`sidebar-btn ${selectedCategory === '' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('')}
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                            All Projects
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id || cat.name}
                                className={`sidebar-btn ${selectedCategory === (cat.id || cat.name) ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id || cat.name)}
                            >
                                <span className="material-symbols-outlined">{getCategoryIcon(cat.name)}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-label">Project Status</div>
                        {statusOptions.filter(s => s).map(s => (
                            <button
                                key={s}
                                className={`sidebar-btn ${selectedStatus === s ? 'active' : ''}`}
                                onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)}
                            >
                                <span className="material-symbols-outlined">
                                    {s === 'completed' ? 'check_circle' : s === 'ongoing' ? 'pending' : s === 'idea' ? 'lightbulb' : 'archive'}
                                </span>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="sidebar-section">
                        <div className="sidebar-section-label">Difficulty</div>
                        {levelOptions.filter(l => l).map(l => (
                            <button
                                key={l}
                                className={`sidebar-btn ${selectedLevel === l ? 'active' : ''}`}
                                onClick={() => setSelectedLevel(selectedLevel === l ? '' : l)}
                            >
                                <span className="material-symbols-outlined">speed</span>
                                {l.charAt(0).toUpperCase() + l.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="sidebar-footer">
                        <button className="sidebar-btn" onClick={() => { setSelectedCategory(''); setSelectedStatus(''); setSelectedLevel(''); }}>
                            <span className="material-symbols-outlined">restart_alt</span>
                            Reset Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <header className="page-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 className="page-title">Today's Spotlight</h1>
                                <p className="page-subtitle">Curated digital masterpieces by the next generation of creators.</p>
                            </div>
                            <div className="sort-tabs">
                                <button className={`sort-tab ${sortBy === 'popular' ? 'active' : ''}`} onClick={() => setSortBy('popular')}>Popular</button>
                                <button className={`sort-tab ${sortBy === 'newest' ? 'active' : ''}`} onClick={() => setSortBy('newest')}>Newest</button>
                            </div>
                        </div>

                        {/* Search bar for mobile / inline */}
                        <div style={{
                            display: 'flex', alignItems: 'center', background: 'var(--surface-container-lowest)',
                            borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', gap: '0.5rem', marginTop: '1.5rem',
                            border: '1px solid rgba(70, 69, 85, 0.2)',
                        }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: '1.25rem' }}>search</span>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: 'var(--on-surface)', fontSize: '0.875rem', fontFamily: 'inherit', flex: 1,
                                }}
                            />
                            {searchInput && (
                                <button onClick={() => setSearchInput('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>close</span>
                                </button>
                            )}
                        </div>
                    </header>

                    {/* Projects List */}
                    {loading ? (
                        <SkeletonList count={4} />
                    ) : error ? (
                        <div className="error-state">
                            <span className="material-symbols-outlined">error</span>
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={fetchProjects}>Try Again</button>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>search_off</span>
                            </div>
                            <h3>No projects found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {projects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={{ ...project, has_upvoted: upvotedIds.includes(project.id) }}
                                    user={user}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* FAB */}
            {user && (
                <button className="fab" onClick={() => navigate('/submit')} id="fab-create">
                    <span className="material-symbols-outlined">add</span>
                </button>
            )}
        </div>
    );
}
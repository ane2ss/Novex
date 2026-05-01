import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

/* ── Trending Carousel ── */
function TrendingCarousel({ projects }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);
    const count = Math.min(projects.length, 3);

    const advance = (dir = 1) => setActive(prev => (prev + dir + count) % count);

    useEffect(() => {
        if (count < 2 || paused) return;
        intervalRef.current = setInterval(() => advance(1), 3800);
        return () => clearInterval(intervalRef.current);
    }, [count, paused, active]);

    if (count === 0) return (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--outline)' }}>
            No trending projects yet — be the first to submit one!
        </div>
    );

    const ranked = ['🥇', '🥈', '🥉'];
    const gradients = [
        'linear-gradient(135deg, #4a40e0 0%, #7c3aed 50%, #c026d3 100%)',
        'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
    ];

    // For each card, compute its position relative to active: -1 (left), 0 (center), 1 (right)
    const getPos = (i) => {
        if (count === 1) return 0;
        let diff = i - active;
        // wrap so diff is always in [-1, 0, 1]
        if (diff > 1) diff -= count;
        if (diff < -1) diff += count;
        return diff;
    };

    const posStyles = {
        '-1': { x: '-64%', scale: 0.78, opacity: 0.55, zIndex: 1, filter: 'brightness(0.7)' },
        '0': { x: '0%', scale: 1, opacity: 1, zIndex: 3, filter: 'brightness(1)' },
        '1': { x: '64%', scale: 0.78, opacity: 0.55, zIndex: 1, filter: 'brightness(0.7)' },
    };

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        style={{
                            width: active === i ? '2rem' : '0.5rem',
                            height: '0.5rem',
                            borderRadius: '9999px',
                            background: active === i ? 'var(--primary)' : 'rgba(195,192,255,0.25)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                            padding: 0,
                        }}
                    />
                ))}
            </div>

            {/* 3-card stage */}
            <div style={{ position: 'relative', height: '28rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {projects.slice(0, count).map((p, i) => {
                    const pos = getPos(i);
                    // only render cards in positions -1, 0, 1
                    if (count === 3 && Math.abs(pos) > 1) return null;
                    const s = posStyles[String(pos)];
                    return (
                        <motion.div
                            key={p.id}
                            animate={{
                                x: s.x,
                                scale: s.scale,
                                opacity: s.opacity,
                                filter: s.filter,
                                zIndex: s.zIndex,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={() => pos !== 0 ? setActive(i) : undefined}
                            style={{
                                position: 'absolute',
                                width: count === 1 ? '100%' : '70%',
                                cursor: pos !== 0 ? 'pointer' : 'default',
                                transformOrigin: 'center center',
                            }}
                        >
                            <TrendingCard project={p} rank={i} medal={ranked[i]} gradient={gradients[i]} isActive={pos === 0} />
                        </motion.div>
                    );
                })}
            </div>

            {/* Prev / Next arrows */}
            {count > 1 && (
                <>
                    <button onClick={() => advance(-1)} style={arrowStyle('left')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#fff' }}>chevron_left</span>
                    </button>
                    <button onClick={() => advance(1)} style={arrowStyle('right')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#fff' }}>chevron_right</span>
                    </button>
                </>
            )}

            {/* Rank pill strip */}
            {count > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                    {projects.slice(0, count).map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => setActive(i)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: active === i ? 'rgba(195,192,255,0.12)' : 'rgba(255,255,255,0.04)',
                                border: active === i ? '1px solid rgba(195,192,255,0.3)' : '1px solid rgba(70,69,85,0.2)',
                                borderRadius: '9999px',
                                padding: '0.4rem 0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                color: active === i ? 'var(--primary)' : 'var(--outline)',
                                fontSize: '0.8rem',
                                fontWeight: active === i ? 700 : 500,
                                fontFamily: 'inherit',
                            }}
                        >
                            <span>{ranked[i]}</span>
                            <span style={{ maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const arrowStyle = (side) => ({
    position: 'absolute',
    top: 'calc(50% - 2.5rem)',  /* offset so arrows sit at card midpoint */
    [side]: '-0.5rem',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    background: 'rgba(74,64,224,0.3)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(195,192,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
});

function TrendingCard({ project, rank, medal, gradient }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: '1.5rem',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                background: 'var(--surface-container)',
                border: hovered ? '1px solid rgba(195,192,255,0.3)' : '1px solid rgba(70,69,85,0.15)',
                boxShadow: hovered
                    ? '0 32px 80px rgba(74,64,224,0.35), 0 0 0 1px rgba(195,192,255,0.2)'
                    : '0 16px 48px rgba(0,0,0,0.35)',
                transition: 'box-shadow 0.4s, border 0.4s, transform 0.4s',
                transform: hovered ? 'scale(1.02)' : 'scale(1)',
                minHeight: '26rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Cover image */}
            <div style={{ position: 'relative', height: '14rem', overflow: 'hidden', flexShrink: 0 }}>
                {project.cover_image ? (
                    <img
                        src={project.cover_image}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.5)', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,31,51,0.95) 0%, transparent 60%)' }} />
                {/* Rank medal */}
                <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    borderRadius: '9999px', padding: '0.3rem 0.8rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    border: '1px solid rgba(255,255,255,0.12)',
                }}>
                    <span style={{ fontSize: '1rem' }}>{medal}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rank #{rank + 1}</span>
                </div>
                {/* Category */}
                {project.category_name && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <span style={{ background: 'rgba(74,64,224,0.85)', backdropFilter: 'blur(8px)', color: 'var(--primary)', padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {project.category_name}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.75rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.6rem', color: 'var(--on-surface)' }}>
                        {project.title}
                    </h3>
                    <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                        {(project.short_description || project.description || '').substring(0, 140)}
                    </p>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{project.upvote_count || 0} upvotes</span>
                    </div>
                    {project.owner_username && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--outline)' }}>by <strong style={{ color: 'var(--on-surface-variant)' }}>@{project.owner_username}</strong></span>
                    )}
                </div>

                {/* Animated gradient progress bar */}
                <div style={{ marginTop: '0.875rem', height: '0.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, (project.upvote_count || 0) * 4 + 25)}%`,
                        background: gradient,
                        borderRadius: '9999px',
                        transition: 'width 1s ease',
                    }} />
                </div>
            </div>
        </div>
    );
}

export default function LandingPage({ user }) {
    const navigate = useNavigate();
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [totalProjects, setTotalProjects] = useState(null);

    useEffect(() => {
        api.getProjects({ sort: 'popular' })
            .then(res => {
                const list = res.data || res.results || res || [];
                setFeaturedProjects(list.slice(0, 3));
                setTotalProjects(list.length);
            })
            .catch(() => { });
    }, []);

    return (
        <div style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--background)', minHeight: '100vh', overflow: 'hidden' }}>

            {/* ── Hero ── */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4.5rem 1.5rem 3rem', position: 'relative' }}>
                {/* Glow blobs */}
                <div style={{ position: 'absolute', top: '-4rem', right: '10%', width: '40rem', height: '40rem', background: 'radial-gradient(circle, rgba(74,64,224,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '0', left: '-5rem', width: '30rem', height: '30rem', background: 'radial-gradient(circle, rgba(195,192,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Left */}
                    <div>
                        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(74,64,224,0.12)', border: '1px solid rgba(195,192,255,0.2)', borderRadius: '9999px', padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>rocket_launch</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student Project Hub</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
                            Build your vision,<br />
                            <span style={{ background: 'linear-gradient(135deg, #c3c0ff 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                share the future.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                            style={{ fontSize: '1.05rem', color: 'var(--on-surface-variant)', lineHeight: 1.7, maxWidth: '34rem', marginBottom: '2rem' }}>
                            The ultimate hub for visionary makers. Forge groundbreaking technology, collaborate with global experts, and launch the next generation of digital excellence.
                        </motion.p>

                        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate(user ? '/submit' : '/register')}
                                style={{ background: 'linear-gradient(135deg, #4a40e0 0%, #3322cc 100%)', color: '#fff', padding: '0.875rem 2rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(74,64,224,0.35)', transition: 'transform 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}
                                onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 15px 40px rgba(74,64,224,0.5)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 30px rgba(74,64,224,0.35)'; }}
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/explore')}
                                style={{ background: 'transparent', color: 'var(--on-surface)', padding: '0.875rem 2rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1rem', border: '1px solid rgba(70,69,85,0.4)', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }}
                                onMouseEnter={e => { e.target.style.background = 'var(--surface-container-low)'; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                            >
                                Explore Gallery
                            </button>
                        </motion.div>
                    </div>

                    {/* Right – hero image + stats card */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-1rem', background: 'rgba(74,64,224,0.15)', filter: 'blur(60px)', borderRadius: '50%', opacity: 0.4 }} />
                        <div style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', position: 'relative' }}>
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMEDRL8YcrV8kdsWHAAIHvsYWPx7S1Y7IA_H2lF7Q6yOJ-yNYmqwHSU6DcaEZ_mFWQVJcYghZUunzcaIN7sYElGKzIG6hphyb71seVl6BkLhL0VNWeQOSsRX5AEeQlca8O8bnXu4BUnQd1RHjJI7nbD5TTVslNyTQDEV_nNw9wIC5ACLe9tZN-he0h51sXiAufoQXrSEl3VVQh-GcQJFTHUHxDK0o3jpP444fovdIbU19dDsaekhhFchvI4glUrLWcndLtPGGBO-Y"
                                alt="Creative workstation"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,19,38,0.7) 0%, transparent 60%)' }} />
                        </div>
                        {/* Floating stats */}
                        <div style={{ position: 'absolute', bottom: '-1.5rem', left: '-1.5rem', background: 'rgba(34,42,61,0.9)', backdropFilter: 'blur(16px)', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(70,69,85,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '3rem', height: '3rem', background: 'rgba(74,64,224,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>rocket_launch</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Live Projects</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalProjects !== null ? totalProjects.toLocaleString() : '—'}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Trending Projects – Reactive Slider ── */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 6rem', overflow: 'visible' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                            Trending Projects
                        </motion.h2>
                        <p style={{ color: 'var(--on-surface-variant)' }}>Groundbreaking concepts gaining momentum this week.</p>
                    </div>
                    <Link to="/explore" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                        View all <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                    </Link>
                </div>

                <TrendingCarousel projects={featuredProjects} />
            </section>

            {/* ── Community Section ── */}
            <section style={{ background: 'var(--surface-container-low)', padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* Grid pattern */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
                    <rect fill="url(#grid)" width="100%" height="100%" />
                </svg>

                <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                            Join the guild of extraordinary makers
                        </motion.h2>
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto' }}>
                            Collaboration is the core of innovation. Connect with the brightest minds across every discipline.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: 'groups', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', title: 'Find a Team', desc: 'Search for projects seeking your specific skill set. From developers to aerospace engineers.', cta: 'Browse Open Roles', link: '/explore' },
                            { icon: 'verified', color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'Showcase Work', desc: 'Validate your expertise and gain access to high-priority commercial and research ventures.', cta: 'Submit a Project', link: user ? '/submit' : '/register' },
                            { icon: 'school', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Grow Together', desc: 'Learn from industry veterans or share your wisdom with emerging talents in the community.', cta: 'Explore Community', link: '/explore' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.title}
                                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                                style={{ background: 'var(--surface-container-lowest)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(70,69,85,0.15)', transition: 'transform 0.3s' }}
                                whileHover={{ y: -8 }}
                            >
                                <div style={{ width: '3.5rem', height: '3.5rem', background: card.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <span className="material-symbols-outlined" style={{ color: card.color, fontSize: '1.75rem' }}>{card.icon}</span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{card.title}</h3>
                                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{card.desc}</p>
                                <Link to={card.link} style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                                    {card.cta} <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>chevron_right</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA banner */}
                    {!user && (
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}
                            style={{ marginTop: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(74,64,224,0.2) 0%, rgba(99,102,241,0.1) 100%)', borderRadius: '1.5rem', padding: '3rem', border: '1px solid rgba(195,192,255,0.15)' }}
                        >
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to launch your idea?</h3>
                            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>Join thousands of student innovators already building the future.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/register" style={{ background: 'linear-gradient(135deg, #4a40e0 0%, #3322cc 100%)', color: '#fff', padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(74,64,224,0.35)' }}>
                                    Create Free Account
                                </Link>
                                <Link to="/login" style={{ background: 'transparent', color: 'var(--on-surface)', padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(70,69,85,0.4)' }}>
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}

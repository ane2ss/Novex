import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

export default function LandingPage({ user }) {
    const navigate = useNavigate();
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [totalProjects, setTotalProjects] = useState(null);

    useEffect(() => {
        api.getProjects({ sort: 'popular' })
            .then(res => {
                const list = res.data || res.results || res || [];
                setFeaturedProjects(list.slice(0, 4));
                setTotalProjects(list.length);
            })
            .catch(() => { });
    }, []);

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--background)', minHeight: '100vh', overflow: 'hidden' }}>

            {/* ── Hero ── */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '8rem 1.5rem 6rem', position: 'relative' }}>
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
                            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
                            Build your vision,<br />
                            <span style={{ background: 'linear-gradient(135deg, #c3c0ff 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                share the future.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                            style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', lineHeight: 1.7, maxWidth: '34rem', marginBottom: '2.5rem' }}>
                            The ultimate hub for visionary makers. Forge groundbreaking technology, collaborate with global experts, and launch the next generation of digital excellence.
                        </motion.p>

                        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate(user ? '/submit' : '/register')}
                                style={{ background: 'linear-gradient(135deg, #4a40e0 0%, #3322cc 100%)', color: '#fff', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(74,64,224,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 15px 40px rgba(74,64,224,0.5)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 30px rgba(74,64,224,0.35)'; }}
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/explore')}
                                style={{ background: 'transparent', color: 'var(--on-surface)', padding: '1rem 2rem', borderRadius: '9999px', fontWeight: 700, fontSize: '1rem', border: '1px solid rgba(70,69,85,0.4)', cursor: 'pointer', transition: 'background 0.2s' }}
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

            {/* ── Trending Projects ── */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                            Trending Projects
                        </motion.h2>
                        <p style={{ color: 'var(--on-surface-variant)' }}>Groundbreaking concepts gaining momentum this week.</p>
                    </div>
                    <Link to="/explore" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', transition: 'gap 0.2s' }}>
                        View all <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                    </Link>
                </div>

                {/* Bento grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
                    {/* Large feature card */}
                    {featuredProjects[0] ? (
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
                            onClick={() => navigate(`/projects/${featuredProjects[0].id}`)}
                            style={{ gridColumn: 'span 8', background: 'var(--surface-container)', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div style={{ position: 'relative', height: '16rem', overflow: 'hidden' }}>
                                <img src={featuredProjects[0].cover_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoSGsvbvgZa4ZW-G1jzlUWeZXfnR8jdRH9jrlQqU3KkDmMyZC_w2Tq0ftutcQ-xbttpaImhPwT6rdoum5126qUi6TbzwYZh_KQExI1gLUVNOIREh7OaxWklOI8P9yscRNJgAuFRPpQ7QI0FpfCnAMX5iuKjjfYR34mowv2B7ypUGtalhhvgp742KDpjeiNBph6roaTU7lwbgDcbQcMIxruwWNuE7oqd7d-IkEmyR92cOjed4OGg40rXUuBBs0LK-s7B8_dGz3Gxo'} alt={featuredProjects[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                                    {featuredProjects[0].category_name && <span style={{ background: 'rgba(11,19,38,0.75)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>{featuredProjects[0].category_name}</span>}
                                </div>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{featuredProjects[0].title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                                            {featuredProjects[0].upvote_count || 0}
                                        </span>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{featuredProjects[0].short_description || (featuredProjects[0].description || '').slice(0, 120)}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                            style={{ gridColumn: 'span 8', background: 'var(--surface-container)', borderRadius: '1rem', overflow: 'hidden' }}>
                            <div style={{ height: '16rem', background: 'var(--surface-container-high)' }} />
                            <div style={{ padding: '2rem' }}>
                                <div style={{ height: '1.5rem', background: 'var(--surface-container-highest)', borderRadius: '0.5rem', marginBottom: '0.75rem', width: '60%' }} />
                                <div style={{ height: '1rem', background: 'var(--surface-container-highest)', borderRadius: '0.5rem', width: '80%' }} />
                            </div>
                        </motion.div>
                    )}

                    {/* Small side card */}
                    {featuredProjects[1] ? (
                        <motion.div
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
                            onClick={() => navigate(`/projects/${featuredProjects[1].id}`)}
                            style={{ gridColumn: 'span 4', background: 'var(--surface-container-low)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(70,69,85,0.15)', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div>
                                {featuredProjects[1].category_name && <span style={{ background: 'rgba(74,64,224,0.1)', color: 'var(--primary)', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1.25rem' }}>{featuredProjects[1].category_name}</span>}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{featuredProjects[1].title}</h3>
                                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 }}>{featuredProjects[1].short_description || (featuredProjects[1].description || '').slice(0, 100)}</p>
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ height: '0.375rem', background: 'var(--surface-container-highest)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                    <div style={{ height: '100%', width: `${Math.min(100, (featuredProjects[1].upvote_count || 0) / 2 + 20)}%`, background: 'var(--primary)', borderRadius: '9999px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--on-surface-variant)' }}>Popularity</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{featuredProjects[1].upvote_count || 0} upvotes</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}

                    {/* Two small horizontal cards */}
                    {[featuredProjects[2], featuredProjects[3]].map((p, i) => p ? (
                        <motion.div
                            key={p.id}
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i + 2}
                            onClick={() => navigate(`/projects/${p.id}`)}
                            style={{ gridColumn: 'span 6', background: 'var(--surface-container)', borderRadius: '1rem', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                            whileHover={{ backgroundColor: 'var(--surface-container-high)' }}
                        >
                            <div style={{ width: '5rem', height: '5rem', borderRadius: '0.75rem', background: i === 0 ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'linear-gradient(135deg, #ea580c, #dc2626)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '2rem', fontVariationSettings: "'FILL' 1" }}>{i === 0 ? 'view_in_ar' : 'speed'}</span>
                            </div>
                            <div>
                                {p.category_name && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>{p.category_name}</span>}
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{p.title}</h3>
                                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', lineHeight: 1.5 }}>{(p.short_description || p.description || '').slice(0, 80)}</p>
                            </div>
                        </motion.div>
                    ) : null)}
                </div>
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

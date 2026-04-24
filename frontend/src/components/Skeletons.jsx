import React from 'react';

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-thumb" />
            <div className="skeleton-body">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text-short" />
                <div className="skeleton-tags">
                    <div className="skeleton skeleton-tag" />
                    <div className="skeleton skeleton-tag" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonList({ count = 4 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}

export function SkeletonGrid({ count = 4 }) {
    return (
        <div className="projects-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="grid-project-card">
                    <div className="skeleton" style={{ height: '16rem' }} />
                    <div style={{ padding: '2rem' }}>
                        <div className="skeleton" style={{ height: '1.5rem', width: '60%', marginBottom: '0.75rem' }} />
                        <div className="skeleton" style={{ height: '0.875rem', width: '100%', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ height: '0.875rem', width: '70%' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonDetail() {
    return (
        <div style={{ padding: '3rem 0' }}>
            <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }} />
            <div className="detail-grid">
                <div>
                    <div className="skeleton" style={{ height: '2rem', width: '40%', marginBottom: '1.5rem' }} />
                    <div className="skeleton" style={{ height: '1rem', width: '100%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: '1rem', width: '90%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: '1rem', width: '80%' }} />
                </div>
                <div>
                    <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
                </div>
            </div>
        </div>
    );
}

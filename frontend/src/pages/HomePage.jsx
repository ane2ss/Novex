import { useEffect, useState } from 'react';
import { api } from '../services/api';

function HomePage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.getProjects();
                setProjects(data.results || data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur fetch projects:', error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token]);

    if (loading) return <div style={{ padding: '20px' }}>Chargement des projets...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>📋 Tous les projets</h1>
            {projects.length === 0 ? (
                <p>Aucun projet trouvé</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {projects.map(project => (
                        <div key={project.id} style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <span>❤️ {project.upvotes_count || 0}</span>
                                <span>👥 {project.team_members_count || 0} membres</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
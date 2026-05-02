import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useProjects(filters = {}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.getProjects(filters);
            setProjects(res.data || res.results || res);
            setError(null);
        } catch (err) {
            setError(err.message);
            setProjects([]);
        }
        setLoading(false);
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects };
}

import axios from 'axios';

const AUTH_BASE = process.env.REACT_APP_AUTH_URL || 'http://localhost:8001/api/auth';
const PROJECT_BASE = process.env.REACT_APP_PROJECT_URL || 'http://localhost:8002/api/projects';
const INTERACTION_BASE = process.env.REACT_APP_INTERACTION_URL || 'http://localhost:8003/api/interactions';
const NOTIFICATION_BASE = process.env.REACT_APP_NOTIFICATION_URL || 'http://localhost:8004/api/notifications';

const authClient = axios.create({ baseURL: AUTH_BASE });
const projectClient = axios.create({ baseURL: PROJECT_BASE });
const interactionClient = axios.create({ baseURL: INTERACTION_BASE });
const notificationClient = axios.create({ baseURL: NOTIFICATION_BASE });

// Add JWT token to every request
[authClient, projectClient, interactionClient, notificationClient].forEach(client => {
    client.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
});

export const api = {
    // Auth
    login: (username, password) =>
        authClient.post('/login/', { username, password }).then(r => r.data),
    register: (data) =>
        authClient.post('/register/', data).then(r => r.data),
    logout: (refresh) =>
        authClient.post('/logout/', { refresh }).then(r => r.data),
    getMe: () =>
        authClient.get('/me/').then(r => r.data),
    updateMe: (data) =>
        authClient.patch('/me/', data).then(r => r.data),
    getUser: (id) =>
        authClient.get(`/users/${id}/`).then(r => r.data),

    // Projects
    getProjects: (params) =>
        projectClient.get('/', { params }).then(r => r.data),
    getProject: (id) =>
        projectClient.get(`/${id}/`).then(r => r.data),
    createProject: (data) =>
        projectClient.post('/', data).then(r => r.data),
    updateProject: (id, data) =>
        projectClient.patch(`/${id}/`, data).then(r => r.data),
    deleteProject: (id) =>
        projectClient.delete(`/${id}/`).then(r => r.data),
    getMyProjects: () =>
        projectClient.get('/mine/').then(r => r.data),
    getCategories: () =>
        projectClient.get('/categories/').then(r => r.data),

    // Interactions
    upvote: (projectId) =>
        interactionClient.post(`/upvote/${projectId}/`).then(r => r.data),
    removeUpvote: (projectId) =>
        interactionClient.delete(`/upvote/${projectId}/`).then(r => r.data),
    getComments: (projectId) =>
        interactionClient.get(`/comments/${projectId}/`).then(r => r.data),
    addComment: (projectId, data) =>
        interactionClient.post(`/comments/${projectId}/`, data).then(r => r.data),
    deleteComment: (id) =>
        interactionClient.delete(`/comments/detail/${id}/`).then(r => r.data),
    joinProject: (projectId, data) =>
        interactionClient.post(`/join/${projectId}/`, data).then(r => r.data),
    updateJoinRequest: (id, status) =>
        interactionClient.patch(`/join-requests/${id}/`, { status }).then(r => r.data),
    getMyJoinRequests: () =>
        interactionClient.get('/join-requests/mine/').then(r => r.data),

    // Notifications
    getNotifications: () =>
        notificationClient.get('/').then(r => r.data),
    markRead: (id) =>
        notificationClient.patch(`/${id}/read/`).then(r => r.data),
    clearNotifications: () =>
        notificationClient.delete('/clear/').then(r => r.data),
};

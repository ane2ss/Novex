import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SubmitProjectPage from './pages/SubmitProjectPage';
import NotificationsPage from './pages/NotificationsPage';

function ProtectedRoute({ children, user, loading }) {
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const AUTH_ROUTES = ['/login', '/register'];

function AppShell({ auth, theme, toggleTheme }) {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="page">
      {!isAuthRoute && <Navbar user={auth.user} logout={auth.logout} theme={theme} toggleTheme={toggleTheme} />}
      <div className={isAuthRoute ? '' : 'page-content'}>
        <Routes>
          <Route path="/" element={<LandingPage user={auth.user} />} />
          <Route path="/explore" element={<HomePage user={auth.user} />} />
          <Route path="/login" element={auth.user ? <Navigate to="/" replace /> : <LoginPage login={auth.login} />} />
          <Route path="/register" element={auth.user ? <Navigate to="/" replace /> : <RegisterPage register={auth.register} />} />
          <Route path="/projects/:id" element={<ProjectDetailPage user={auth.user} />} />
          <Route path="/profile/:id" element={<ProfilePage user={auth.user} />} />
          <Route path="/profile" element={
            <ProtectedRoute user={auth.user} loading={auth.loading}>
              <ProfilePage user={auth.user} />
            </ProtectedRoute>
          } />
          <Route path="/submit" element={
            <ProtectedRoute user={auth.user} loading={auth.loading}>
              <SubmitProjectPage user={auth.user} />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute user={auth.user} loading={auth.loading}>
              <NotificationsPage user={auth.user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <MobileNav user={auth.user} />}
    </div>
  );
}

function App() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <Router>
      <AppShell auth={auth} theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
}

export default App;

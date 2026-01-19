import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, UserRole, PlanType, PaymentStatus } from './types';
import { PLANS } from './constants';
import { MOCK_ADMIN, createNewUser } from './services/mockBackend';

const App: React.FC = () => {
  // Global State (Simulating Database)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([MOCK_ADMIN]);

  // Load from local storage for persistence across reloads
  useEffect(() => {
    const storedUser = localStorage.getItem('dolor_user');
    const storedAllUsers = localStorage.getItem('dolor_all_users');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedAllUsers) setAllUsers(JSON.parse(storedAllUsers));
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (currentUser) localStorage.setItem('dolor_user', JSON.stringify(currentUser));
    else localStorage.removeItem('dolor_user');
    
    localStorage.setItem('dolor_all_users', JSON.stringify(allUsers));
  }, [currentUser, allUsers]);

  // Auth Handlers
  const handleLogin = (email: string) => {
    const user = allUsers.find(u => u.email === email && u.role === UserRole.BUSINESS);
    if (user) {
      setCurrentUser(user);
    } else {
      alert("User not found. Please register or check your email.");
    }
  };

  const handleAdminLogin = (username: string, pass: string) => {
      // Support both secure and dev credentials
      if ((username === 'dolorpurity' && pass === 'Dolor#0229') || (username === 'admin' && pass === 'admin')) {
          setCurrentUser(MOCK_ADMIN);
      } else {
          alert("Invalid Admin Credentials. \n\nHint: Try 'admin' as username and 'admin' as password.");
      }
  };

  const handleRegister = (data: { email: string; businessName: string; phone: string; plan: PlanType }) => {
    if (allUsers.find(u => u.email === data.email)) {
      alert("Email already exists.");
      return;
    }
    const newUser = createNewUser(data.email, data.businessName, data.phone, data.plan, PLANS[data.plan].price);
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // User Actions
  const handleUpdateUser = (updatedUser: User) => {
    // Update local session
    setCurrentUser(updatedUser);
    // Update 'Database'
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Admin Actions
  const handleAdminUpdateStatus = (userId: string, status: PaymentStatus) => {
    setAllUsers(prev => prev.map(u => {
        if (u.id === userId) {
            return {
                ...u,
                subscription: { ...u.subscription, status }
            };
        }
        return u;
    }));
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          currentUser ? (
             <Navigate to={currentUser.role === UserRole.ADMIN ? "/admin" : "/dashboard"} />
          ) : (
            <Landing 
                onLogin={handleLogin} 
                onAdminLogin={handleAdminLogin}
                onRegister={handleRegister} 
            />
          )
        } />
        
        <Route path="/dashboard" element={
          currentUser && currentUser.role === UserRole.BUSINESS ? (
            <UserDashboard 
                user={currentUser} 
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/admin" element={
          currentUser && currentUser.role === UserRole.ADMIN ? (
            <AdminDashboard 
                users={allUsers}
                onUpdateUserStatus={handleAdminUpdateStatus}
                onLogout={handleLogout}
            />
          ) : (
             <Navigate to="/" />
          )
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
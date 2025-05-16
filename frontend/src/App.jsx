import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { ThemeProvider } from 'styled-components';
import AuthService from './services/AuthService';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/movies/MovieDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BookingPage from './pages/tickets/BookingPage';
import CheckoutPage from './pages/tickets/CheckoutPage';
import BookingConfirmationPage from './pages/tickets/BookingConfirmationPage';
import UserProfilePage from './pages/auth/UserProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Theme
const theme = {
  colors: {
    primary: '#e50914',
    secondary: '#221f1f',
    background: '#141414',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    border: '#333333',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
  },
  fonts: {
    main: "'Roboto', sans-serif",
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    largeDesktop: '1200px',
  },
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 20px;
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Navbar />
          <ContentContainer>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route 
                path="/booking/:showtimeId" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/checkout/:bookingId" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/confirmation/:bookingReference" 
                element={
                  <ProtectedRoute>
                    <BookingConfirmationPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                } 
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ContentContainer>
          <Footer />
          <ToastContainer position="bottom-right" theme="dark" />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;

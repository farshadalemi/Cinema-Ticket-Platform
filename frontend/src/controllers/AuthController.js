import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuthController = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(username, password);
      setUser(result.user);
      toast.success('Login successful!');
      navigate('/');
      return result;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.register(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return result;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    toast.info('You have been logged out');
    navigate('/login');
  };

  const isAdmin = () => {
    return AuthService.isAdmin();
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: AuthService.isAuthenticated(),
    isAdmin: isAdmin()
  };
};

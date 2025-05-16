import AuthRepository from '../repositories/AuthRepository';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  async register(userData) {
    try {
      const user = await AuthRepository.register(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const data = await AuthRepository.login(username, password);
      
      // Store the token in localStorage
      localStorage.setItem('token', data.access_token);
      
      // Decode the token to get user information
      const decodedToken = jwtDecode(data.access_token);
      
      return {
        token: data.access_token,
        user: {
          id: decodedToken.user_id,
          username: decodedToken.sub,
          isAdmin: decodedToken.is_admin
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await AuthRepository.getCurrentUser();
      return user;
    } catch (error) {
      // If there's an error (like token expired), clear the token
      if (error.status === 401) {
        this.logout();
      }
      throw error;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  isAdmin() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.is_admin === true;
    } catch (error) {
      return false;
    }
  }

  getUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.user_id;
    } catch (error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default new AuthService();

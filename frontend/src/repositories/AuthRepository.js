import axios from 'axios';

class AuthRepository {
  constructor() {
    this.baseUrl = '/api/auth';
  }

  async register(userData) {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(username, password) {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${this.baseUrl}/token`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        message: error.response.data.detail || 'An error occurred',
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 503,
        message: 'No response from server',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}

export default new AuthRepository();

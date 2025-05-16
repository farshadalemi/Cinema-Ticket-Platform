import axios from 'axios';

class MovieRepository {
  constructor() {
    this.baseUrl = '/api/movies';
  }

  async getMovies(params = {}) {
    try {
      const response = await axios.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMovie(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMovie(movieData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(this.baseUrl, movieData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMovie(id, movieData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${this.baseUrl}/${id}`, movieData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMovie(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`${this.baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGenres() {
    try {
      const response = await axios.get(`${this.baseUrl}/genres/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.detail || 'An error occurred',
      };
    } else if (error.request) {
      return {
        status: 503,
        message: 'No response from server',
      };
    } else {
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}

export default new MovieRepository();

import axios from 'axios';

class TicketRepository {
  constructor() {
    this.baseUrl = '/api/tickets';
  }

  async getBookings(params = {}) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${this.baseUrl}/bookings/`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBooking(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${this.baseUrl}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBookingByReference(reference) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${this.baseUrl}/bookings/reference/${reference}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createBooking(bookingData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${this.baseUrl}/bookings/`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateBooking(id, bookingData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${this.baseUrl}/bookings/${id}`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAvailableSeats(showtimeId) {
    try {
      const response = await axios.get(`${this.baseUrl}/showtimes/${showtimeId}/seats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPayment(paymentData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${this.baseUrl}/payments/`, paymentData, {
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

export default new TicketRepository();

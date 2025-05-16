import TicketRepository from '../repositories/TicketRepository';
import AuthService from './AuthService';

class TicketService {
  async getBookings(filters = {}) {
    try {
      const bookings = await TicketRepository.getBookings(filters);
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  async getBooking(id) {
    try {
      const booking = await TicketRepository.getBooking(id);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async getBookingByReference(reference) {
    try {
      const booking = await TicketRepository.getBookingByReference(reference);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async createBooking(showtimeId, seatIds, createdBySupport = false, supportAgentId = null) {
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const bookingData = {
        showtime_id: showtimeId,
        user_id: userId,
        seat_ids: seatIds,
        created_by_support: createdBySupport
      };

      if (createdBySupport && supportAgentId) {
        bookingData.support_agent_id = supportAgentId;
      }

      const booking = await TicketRepository.createBooking(bookingData);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(id) {
    try {
      const bookingData = {
        status: 'cancelled'
      };

      const booking = await TicketRepository.updateBooking(id, bookingData);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableSeats(showtimeId) {
    try {
      const seats = await TicketRepository.getAvailableSeats(showtimeId);
      return seats;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(bookingId, amount, paymentMethod, paymentDetails = null) {
    try {
      const paymentData = {
        booking_id: bookingId,
        amount: amount,
        payment_method: paymentMethod,
        payment_details: paymentDetails
      };

      const payment = await TicketRepository.createPayment(paymentData);
      return payment;
    } catch (error) {
      throw error;
    }
  }

  formatSeatLabel(seat) {
    return `${seat.row}${seat.number}`;
  }

  formatBookingDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTotalPrice(seats) {
    return seats.reduce((total, seat) => total + seat.price, 0);
  }
}

export default new TicketService();

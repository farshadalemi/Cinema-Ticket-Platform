import { useState } from 'react';
import TicketService from '../services/TicketService';
import { toast } from 'react-toastify';

export const useTicketController = () => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.getBookings(filters);
      setBookings(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.getBooking(id);
      setBooking(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch booking details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingByReference = async (reference) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.getBookingByReference(reference);
      setBooking(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch booking details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSeats = async (showtimeId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.getAvailableSeats(showtimeId);
      setAvailableSeats(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch available seats');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (seat) => {
    setSelectedSeats(prevSelectedSeats => {
      const isSeatSelected = prevSelectedSeats.some(s => s.id === seat.id);
      
      if (isSeatSelected) {
        return prevSelectedSeats.filter(s => s.id !== seat.id);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const createBooking = async (showtimeId) => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const seatIds = selectedSeats.map(seat => seat.id);
      const data = await TicketService.createBooking(showtimeId, seatIds);
      toast.success('Booking created successfully!');
      clearSelectedSeats();
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.cancelBooking(id);
      toast.success('Booking cancelled successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (bookingId, amount, paymentMethod, paymentDetails = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TicketService.createPayment(bookingId, amount, paymentMethod, paymentDetails);
      toast.success('Payment processed successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Payment processing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    booking,
    availableSeats,
    selectedSeats,
    loading,
    error,
    fetchBookings,
    fetchBooking,
    fetchBookingByReference,
    fetchAvailableSeats,
    toggleSeatSelection,
    clearSelectedSeats,
    createBooking,
    cancelBooking,
    createPayment,
    formatSeatLabel: TicketService.formatSeatLabel,
    formatBookingDate: TicketService.formatBookingDate,
    calculateTotalPrice: TicketService.calculateTotalPrice
  };
};

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PaymentForm from '../../components/tickets/PaymentForm';
import Loading from '../../components/common/Loading';
import { useTicketController } from '../../controllers/TicketController';
import AuthService from '../../services/AuthService';

const CheckoutPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: none;
  }
  
  &::before {
    content: '←';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { booking, loading, fetchBooking, createPayment } = useTicketController();
  
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (bookingId) {
      fetchBooking(bookingId);
    }
  }, [bookingId]);
  
  const handlePaymentSubmit = async (paymentDetails) => {
    try {
      // In a real app, this would process the payment through the API
      // For now, we'll simulate a successful payment
      
      const paymentData = {
        booking_id: booking.id,
        amount: booking.total_price,
        payment_method: paymentDetails.paymentMethod,
        payment_details: JSON.stringify(paymentDetails)
      };
      
      // Create payment
      await createPayment(
        booking.id, 
        booking.total_price, 
        paymentDetails.paymentMethod, 
        JSON.stringify(paymentDetails)
      );
      
      // Navigate to confirmation page
      navigate(`/confirmation/${booking.booking_reference}`);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  
  const handleCancel = () => {
    navigate(`/booking/${booking?.showtime_id}`);
  };
  
  if (loading) {
    return (
      <CheckoutPageContainer>
        <Loading text="Loading booking information..." />
      </CheckoutPageContainer>
    );
  }
  
  if (!booking) {
    return (
      <CheckoutPageContainer>
        <h2>Booking not found</h2>
        <p>The booking you're looking for doesn't exist or has been cancelled.</p>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
      </CheckoutPageContainer>
    );
  }
  
  return (
    <CheckoutPageContainer>
      <BackButton onClick={handleCancel}>Back to Seat Selection</BackButton>
      
      <h1>Checkout</h1>
      
      <PaymentForm 
        booking={booking}
        onPaymentSubmit={handlePaymentSubmit}
        onCancel={handleCancel}
      />
    </CheckoutPageContainer>
  );
};

export default CheckoutPage;

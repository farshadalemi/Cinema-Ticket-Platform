import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import BookingConfirmation from '../../components/tickets/BookingConfirmation';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { useTicketController } from '../../controllers/TicketController';
import AuthService from '../../services/AuthService';

const ConfirmationPageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const BookingConfirmationPage = () => {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const { booking, loading, fetchBookingByReference } = useTicketController();
  
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (bookingReference) {
      fetchBookingByReference(bookingReference);
    }
  }, [bookingReference]);
  
  if (loading) {
    return (
      <ConfirmationPageContainer>
        <Loading text="Loading booking information..." />
      </ConfirmationPageContainer>
    );
  }
  
  if (!booking) {
    return (
      <ConfirmationPageContainer>
        <h2>Booking not found</h2>
        <p>The booking reference you provided doesn't exist or has been cancelled.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </ConfirmationPageContainer>
    );
  }
  
  return (
    <ConfirmationPageContainer>
      <BookingConfirmation booking={booking} />
      
      <ActionButtons>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <Button onClick={() => navigate('/profile')}>
          View My Bookings
        </Button>
      </ActionButtons>
    </ConfirmationPageContainer>
  );
};

export default BookingConfirmationPage;

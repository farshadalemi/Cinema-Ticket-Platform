import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SeatSelection from '../../components/tickets/SeatSelection';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { useTicketController } from '../../controllers/TicketController';
import { useMovieController } from '../../controllers/MovieController';
import AuthService from '../../services/AuthService';

const BookingPageContainer = styled.div`
  max-width: 1200px;
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

const ShowtimeInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  h4 {
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: normal;
  }
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { 
    availableSeats, 
    selectedSeats, 
    loading, 
    fetchAvailableSeats, 
    toggleSeatSelection, 
    clearSelectedSeats,
    createBooking 
  } = useTicketController();
  const { movie, fetchMovie } = useMovieController();
  const [showtime, setShowtime] = useState(null);
  const [loadingShowtime, setLoadingShowtime] = useState(false);
  
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (showtimeId) {
      fetchAvailableSeats(showtimeId);
      fetchShowtime(showtimeId);
    }
  }, [showtimeId]);
  
  useEffect(() => {
    if (showtime?.movie_id) {
      fetchMovie(showtime.movie_id);
    }
  }, [showtime]);
  
  const fetchShowtime = async (id) => {
    setLoadingShowtime(true);
    try {
      // In a real app, this would fetch the showtime from the API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockShowtime = {
          id: parseInt(id),
          movie_id: 1,
          theater: { id: 1, name: 'Main Theater' },
          start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 86400000 + 7200000).toISOString(),
          price: 12.99
        };
        setShowtime(mockShowtime);
        setLoadingShowtime(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching showtime:', error);
      setLoadingShowtime(false);
    }
  };
  
  const handleSeatToggle = (seat) => {
    toggleSeatSelection(seat);
  };
  
  const handleContinue = async () => {
    try {
      const booking = await createBooking(showtimeId);
      navigate(`/checkout/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  
  const handleGoBack = () => {
    clearSelectedSeats();
    navigate(-1);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading || loadingShowtime) {
    return (
      <BookingPageContainer>
        <Loading text="Loading booking information..." />
      </BookingPageContainer>
    );
  }
  
  return (
    <BookingPageContainer>
      <BackButton onClick={handleGoBack}>Back to Movie</BackButton>
      
      <h1>Select Your Seats</h1>
      
      {showtime && (
        <ShowtimeInfo>
          <InfoItem>
            <h4>Movie</h4>
            <p>{movie?.title || 'Loading...'}</p>
          </InfoItem>
          
          <InfoItem>
            <h4>Date</h4>
            <p>{formatDate(showtime.start_time)}</p>
          </InfoItem>
          
          <InfoItem>
            <h4>Time</h4>
            <p>{formatTime(showtime.start_time)}</p>
          </InfoItem>
          
          <InfoItem>
            <h4>Theater</h4>
            <p>{showtime.theater.name}</p>
          </InfoItem>
        </ShowtimeInfo>
      )}
      
      <SeatSelection
        availableSeats={availableSeats}
        selectedSeats={selectedSeats}
        onSeatToggle={handleSeatToggle}
        onContinue={handleContinue}
        loading={loading}
        showtime={showtime}
      />
    </BookingPageContainer>
  );
};

export default BookingPage;

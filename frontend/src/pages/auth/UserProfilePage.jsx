import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTicketAlt, FaUser, FaEnvelope, FaPhone, FaHistory } from 'react-icons/fa';
import { useAuthController } from '../../controllers/AuthController';
import { useTicketController } from '../../controllers/TicketController';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 3rem;
  color: white;
`;

const ProfileInfo = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: normal;
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.25rem;
  }
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const BookingsList = styled.div`
  h3 {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    
    svg {
      margin-right: 0.5rem;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const BookingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h4 {
    margin: 0;
  }
  
  span {
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    
    &.confirmed {
      background-color: rgba(46, 204, 113, 0.2);
      color: #2ecc71;
    }
    
    &.pending {
      background-color: rgba(243, 156, 18, 0.2);
      color: #f39c12;
    }
    
    &.cancelled {
      background-color: rgba(231, 76, 60, 0.2);
      color: #e74c3c;
    }
  }
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BookingDetail = styled.div`
  label {
    display: block;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.25rem;
  }
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const BookingActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const NoBookings = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuthController();
  const { bookings, loading: bookingsLoading, fetchBookings } = useTicketController();
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'confirmed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };
  
  const handleViewBooking = (bookingReference) => {
    navigate(`/confirmation/${bookingReference}`);
  };
  
  if (userLoading || bookingsLoading) {
    return (
      <ProfileContainer>
        <Loading text="Loading profile information..." />
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      
      <ProfileGrid>
        <div>
          <ProfileCard>
            <ProfileHeader>
              <ProfileAvatar>
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || <FaUser />}
              </ProfileAvatar>
              <h2>{user?.full_name || user?.username}</h2>
              {user?.is_admin && <p>Administrator</p>}
            </ProfileHeader>
            
            <ProfileInfo>
              <h3><FaUser /> Account Information</h3>
              
              <InfoItem>
                <label>Username</label>
                <p>{user?.username}</p>
              </InfoItem>
              
              <InfoItem>
                <label>Email</label>
                <p>{user?.email}</p>
              </InfoItem>
              
              {user?.phone_number && (
                <InfoItem>
                  <label>Phone</label>
                  <p>{user?.phone_number}</p>
                </InfoItem>
              )}
            </ProfileInfo>
            
            <Button fullWidth>Edit Profile</Button>
          </ProfileCard>
        </div>
        
        <BookingsList>
          <h3><FaHistory /> My Bookings</h3>
          
          {bookings && bookings.length > 0 ? (
            bookings.map(booking => (
              <BookingCard key={booking.id}>
                <BookingHeader>
                  <h4>{booking.showtime?.movie?.title || 'Movie'}</h4>
                  <span className={getStatusClass(booking.status)}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                </BookingHeader>
                
                <BookingDetails>
                  <BookingDetail>
                    <label>Date & Time</label>
                    <p>
                      {booking.showtime?.start_time ? (
                        `${formatDate(booking.showtime.start_time)} at ${formatTime(booking.showtime.start_time)}`
                      ) : (
                        'N/A'
                      )}
                    </p>
                  </BookingDetail>
                  
                  <BookingDetail>
                    <label>Theater</label>
                    <p>{booking.showtime?.theater?.name || 'N/A'}</p>
                  </BookingDetail>
                  
                  <BookingDetail>
                    <label>Seats</label>
                    <p>
                      {booking.seat_bookings?.map(sb => 
                        `${sb.seat?.row}${sb.seat?.number}`
                      ).join(', ') || 'N/A'}
                    </p>
                  </BookingDetail>
                  
                  <BookingDetail>
                    <label>Booking Reference</label>
                    <p>{booking.booking_reference}</p>
                  </BookingDetail>
                </BookingDetails>
                
                <BookingActions>
                  <Button 
                    size="small" 
                    onClick={() => handleViewBooking(booking.booking_reference)}
                  >
                    <FaTicketAlt /> View Ticket
                  </Button>
                </BookingActions>
              </BookingCard>
            ))
          ) : (
            <NoBookings>
              <p>You don't have any bookings yet.</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                style={{ marginTop: '1rem' }}
              >
                Browse Movies
              </Button>
            </NoBookings>
          )}
        </BookingsList>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default UserProfilePage;

import { useRef } from 'react';
import styled from 'styled-components';
import { FaTicketAlt, FaFilm, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCouch, FaDownload, FaPrint } from 'react-icons/fa';
import Button from '../common/Button';
import QRCode from 'qrcode.react';

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const SuccessHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  svg {
    color: ${({ theme }) => theme.colors.success};
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TicketContainer = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const BookingReference = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  h4 {
    display: flex;
    align-items: center;
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: normal;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  
  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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

const BookingConfirmation = ({ booking }) => {
  const ticketRef = useRef(null);
  
  if (!booking) {
    return <div>No booking information available</div>;
  }
  
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
  
  const handlePrint = () => {
    const printContent = ticketRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .ticket-container {
          border: 1px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
      </style>
      <div class="ticket-container">${printContent}</div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
  };
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF ticket for download
    alert('This feature would download a PDF ticket in a real application.');
  };
  
  return (
    <ConfirmationContainer>
      <SuccessHeader>
        <FaTicketAlt />
        <h2>Booking Confirmed!</h2>
        <p>Your tickets have been booked successfully.</p>
      </SuccessHeader>
      
      <TicketContainer ref={ticketRef}>
        <TicketHeader>
          <h3><FaTicketAlt /> Movie Ticket</h3>
          <BookingReference>{booking.booking_reference}</BookingReference>
        </TicketHeader>
        
        <TicketDetails>
          <DetailItem>
            <h4><FaFilm /> Movie</h4>
            <p>{booking.showtime?.movie?.title}</p>
          </DetailItem>
          
          <DetailItem>
            <h4><FaCalendarAlt /> Date</h4>
            <p>{formatDate(booking.showtime?.start_time)}</p>
          </DetailItem>
          
          <DetailItem>
            <h4><FaClock /> Time</h4>
            <p>{formatTime(booking.showtime?.start_time)}</p>
          </DetailItem>
          
          <DetailItem>
            <h4><FaMapMarkerAlt /> Theater</h4>
            <p>{booking.showtime?.theater?.name}</p>
          </DetailItem>
          
          <DetailItem>
            <h4><FaCouch /> Seats</h4>
            <p>
              {booking.seat_bookings?.map(sb => 
                `${sb.seat?.row}${sb.seat?.number}`
              ).join(', ')}
            </p>
          </DetailItem>
          
          <DetailItem>
            <h4>Payment Status</h4>
            <p style={{ 
              color: booking.payment?.status === 'completed' 
                ? '#2ecc71' 
                : booking.payment?.status === 'pending' 
                  ? '#f39c12' 
                  : '#e74c3c' 
            }}>
              {booking.payment?.status === 'completed' 
                ? 'Paid' 
                : booking.payment?.status === 'pending' 
                  ? 'Pending' 
                  : 'Failed'}
            </p>
          </DetailItem>
        </TicketDetails>
        
        <QRCodeContainer>
          <QRCode 
            value={`CINEMA-TICKET-${booking.booking_reference}`} 
            size={150}
            level="H"
            renderAs="svg"
            includeMargin={true}
            bgColor="#221f1f"
            fgColor="#ffffff"
          />
          <p>Scan this QR code at the cinema entrance</p>
        </QRCodeContainer>
      </TicketContainer>
      
      <ActionButtons>
        <Button onClick={handlePrint}>
          <FaPrint /> Print Ticket
        </Button>
        <Button onClick={handleDownload}>
          <FaDownload /> Download Ticket
        </Button>
      </ActionButtons>
    </ConfirmationContainer>
  );
};

export default BookingConfirmation;

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCouch, FaWheelchair } from 'react-icons/fa';
import Button from '../common/Button';
import Loading from '../common/Loading';

const SeatSelectionContainer = styled.div`
  margin: 2rem 0;
`;

const TheaterLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const Screen = styled.div`
  width: 80%;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
  
  &::before {
    content: 'SCREEN';
    display: block;
    text-align: center;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.5rem;
  }
`;

const SeatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-weight: bold;
`;

const Seats = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Seat = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isAvailable }) => (isAvailable ? 'pointer' : 'not-allowed')};
  opacity: ${({ isAvailable }) => (isAvailable ? 1 : 0.5)};
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.primary : 'inherit')};
  
  svg {
    font-size: 1.5rem;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ color }) => color};
  }
`;

const SummaryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const SeatSelection = ({ 
  availableSeats, 
  selectedSeats, 
  onSeatToggle, 
  onContinue, 
  loading, 
  showtime 
}) => {
  const [seatMap, setSeatMap] = useState({});
  
  useEffect(() => {
    if (availableSeats.length > 0) {
      // Organize seats by row
      const map = {};
      availableSeats.forEach(seat => {
        if (!map[seat.row]) {
          map[seat.row] = [];
        }
        map[seat.row].push(seat);
      });
      
      // Sort seats within each row
      Object.keys(map).forEach(row => {
        map[row].sort((a, b) => a.number - b.number);
      });
      
      setSeatMap(map);
    }
  }, [availableSeats]);
  
  const isSeatSelected = (seat) => {
    return selectedSeats.some(s => s.id === seat.id);
  };
  
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      // Calculate seat price based on seat type and showtime price
      let price = showtime?.price || 0;
      if (seat.seat_type === 'premium') {
        price *= 1.5;
      } else if (seat.seat_type === 'vip') {
        price *= 2;
      }
      return total + price;
    }, 0);
  };
  
  if (loading) {
    return <Loading text="Loading seats..." />;
  }
  
  return (
    <SeatSelectionContainer>
      <h2>Select Your Seats</h2>
      
      <Legend>
        <LegendItem color="white">
          <FaCouch /> Available
        </LegendItem>
        <LegendItem color="#e50914">
          <FaCouch /> Selected
        </LegendItem>
        <LegendItem color="gray">
          <FaCouch /> Taken
        </LegendItem>
        <LegendItem color="gold">
          <FaCouch /> Premium
        </LegendItem>
        <LegendItem color="#2ecc71">
          <FaWheelchair /> Accessible
        </LegendItem>
      </Legend>
      
      <TheaterLayout>
        <Screen />
        
        <SeatsContainer>
          {Object.keys(seatMap).sort().map(row => (
            <Row key={row}>
              <RowLabel>{row}</RowLabel>
              <Seats>
                {seatMap[row].map(seat => (
                  <Seat
                    key={seat.id}
                    isAvailable={true}
                    isSelected={isSeatSelected(seat)}
                    onClick={() => onSeatToggle(seat)}
                  >
                    {seat.seat_type === 'accessible' ? (
                      <FaWheelchair style={{ color: seat.seat_type === 'accessible' ? '#2ecc71' : 'inherit' }} />
                    ) : (
                      <FaCouch style={{ 
                        color: isSeatSelected(seat) 
                          ? '#e50914' 
                          : seat.seat_type === 'premium' 
                            ? 'gold' 
                            : seat.seat_type === 'vip' 
                              ? 'purple' 
                              : 'inherit' 
                      }} />
                    )}
                  </Seat>
                ))}
              </Seats>
            </Row>
          ))}
        </SeatsContainer>
      </TheaterLayout>
      
      <SummaryContainer>
        <h3>Booking Summary</h3>
        
        <SummaryRow>
          <span>Selected Seats:</span>
          <span>
            {selectedSeats.length > 0
              ? selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')
              : 'None'}
          </span>
        </SummaryRow>
        
        <SummaryRow>
          <span>Number of Tickets:</span>
          <span>{selectedSeats.length}</span>
        </SummaryRow>
        
        <SummaryRow>
          <span>Total Price:</span>
          <span>${calculateTotalPrice().toFixed(2)}</span>
        </SummaryRow>
      </SummaryContainer>
      
      <ButtonContainer>
        <Button 
          onClick={onContinue} 
          disabled={selectedSeats.length === 0}
        >
          Continue to Payment
        </Button>
      </ButtonContainer>
    </SeatSelectionContainer>
  );
};

export default SeatSelection;

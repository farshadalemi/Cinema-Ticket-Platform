import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaClock, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import Button from '../common/Button';
import Loading from '../common/Loading';
import AuthService from '../../services/AuthService';

const MovieDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const PosterContainer = styled.div`
  flex: 0 0 300px;
  
  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 0 0 200px;
    margin: 0 auto;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const GenreTag = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ShowtimesSection = styled.div`
  margin-top: 2rem;
`;

const ShowtimesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ShowtimeCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  h4 {
    margin: 0;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TrailerButton = styled(Button)`
  margin-right: 1rem;
`;

const MovieDetails = ({ movie, showtimes, loading, onSelectShowtime }) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  
  if (loading) {
    return <Loading text="Loading movie details..." />;
  }
  
  if (!movie) {
    return <div>Movie not found</div>;
  }
  
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
  
  const handleShowtimeSelect = (showtimeId) => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    onSelectShowtime(showtimeId);
  };
  
  const handleTrailerClick = () => {
    setShowTrailer(true);
  };
  
  return (
    <div>
      <MovieDetailsContainer>
        <PosterContainer>
          <img 
            src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title} 
          />
        </PosterContainer>
        
        <InfoContainer>
          <Title>{movie.title}</Title>
          
          <MetaInfo>
            {movie.rating && (
              <div>
                <FaStar style={{ color: '#f5c518' }} /> {movie.rating.toFixed(1)}
              </div>
            )}
            <div>
              <FaClock /> {movie.duration_minutes} min
            </div>
            <div>
              <FaCalendarAlt /> {formatDate(movie.release_date)}
            </div>
          </MetaInfo>
          
          <GenreList>
            {movie.genres.map(genre => (
              <GenreTag key={genre.id}>{genre.name}</GenreTag>
            ))}
          </GenreList>
          
          <Description>{movie.description}</Description>
          
          <div>
            {movie.trailer_url && (
              <TrailerButton variant="primary" onClick={handleTrailerClick}>
                Watch Trailer
              </TrailerButton>
            )}
          </div>
          
          {showTrailer && movie.trailer_url && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Trailer</h3>
              <iframe
                width="100%"
                height="400"
                src={movie.trailer_url}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </InfoContainer>
      </MovieDetailsContainer>
      
      <ShowtimesSection>
        <h2>Showtimes</h2>
        {showtimes && showtimes.length > 0 ? (
          <ShowtimesList>
            {showtimes.map(showtime => (
              <ShowtimeCard key={showtime.id}>
                <h4>{formatDate(showtime.start_time)}</h4>
                <p>{formatTime(showtime.start_time)}</p>
                <p>Theater: {showtime.theater.name}</p>
                <p>${showtime.price.toFixed(2)}</p>
                <Button 
                  fullWidth 
                  onClick={() => handleShowtimeSelect(showtime.id)}
                >
                  <FaTicketAlt /> Book Tickets
                </Button>
              </ShowtimeCard>
            ))}
          </ShowtimesList>
        ) : (
          <p>No showtimes available for this movie.</p>
        )}
      </ShowtimesSection>
    </div>
  );
};

export default MovieDetails;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MovieDetails from '../../components/movies/MovieDetails';
import Loading from '../../components/common/Loading';
import { useMovieController } from '../../controllers/MovieController';

const MovieDetailsPageContainer = styled.div`
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

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error, fetchMovie } = useMovieController();
  const [showtimes, setShowtimes] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchMovie(id);
      fetchShowtimes(id);
    }
  }, [id]);
  
  const fetchShowtimes = async (movieId) => {
    setLoadingShowtimes(true);
    try {
      // In a real app, this would fetch showtimes from the API
      // For now, we'll use mock data
      setTimeout(() => {
        setShowtimes([
          {
            id: 1,
            movie_id: parseInt(movieId),
            theater: { id: 1, name: 'Theater 1' },
            start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            end_time: new Date(Date.now() + 86400000 + 7200000).toISOString(),
            price: 12.99
          },
          {
            id: 2,
            movie_id: parseInt(movieId),
            theater: { id: 2, name: 'Theater 2' },
            start_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            end_time: new Date(Date.now() + 172800000 + 7200000).toISOString(),
            price: 12.99
          },
          {
            id: 3,
            movie_id: parseInt(movieId),
            theater: { id: 3, name: 'Theater 3 (IMAX)' },
            start_time: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
            end_time: new Date(Date.now() + 259200000 + 7200000).toISOString(),
            price: 16.99
          }
        ]);
        setLoadingShowtimes(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      setLoadingShowtimes(false);
    }
  };
  
  const handleShowtimeSelect = (showtimeId) => {
    navigate(`/booking/${showtimeId}`);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <MovieDetailsPageContainer>
      <BackButton onClick={handleGoBack}>Back to Movies</BackButton>
      
      {loading || loadingShowtimes ? (
        <Loading text="Loading movie details..." />
      ) : error ? (
        <div>Error loading movie details. Please try again.</div>
      ) : (
        <MovieDetails 
          movie={movie} 
          showtimes={showtimes}
          onSelectShowtime={handleShowtimeSelect}
        />
      )}
    </MovieDetailsPageContainer>
  );
};

export default MovieDetailsPage;

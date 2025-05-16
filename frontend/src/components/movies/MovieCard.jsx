import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaClock } from 'react-icons/fa';
import Card from '../common/Card';

const Rating = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: #f5c518;
    margin-right: 0.25rem;
  }
`;

const Duration = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const GenreTag = styled.span`
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };
  
  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Get release year from date
  const getReleaseYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };
  
  // Limit genres to first 2 for display
  const displayGenres = movie.genres.slice(0, 2);
  
  return (
    <Card
      image={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
      title={movie.title}
      subtitle={`${getReleaseYear(movie.release_date)}`}
      text={
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {movie.rating && (
              <Rating>
                <FaStar /> {movie.rating.toFixed(1)}
              </Rating>
            )}
            <Duration>
              <FaClock /> {formatDuration(movie.duration_minutes)}
            </Duration>
          </div>
          <GenreContainer>
            {displayGenres.map(genre => (
              <GenreTag key={genre.id}>{genre.name}</GenreTag>
            ))}
          </GenreContainer>
        </>
      }
      onClick={handleClick}
    />
  );
};

export default MovieCard;

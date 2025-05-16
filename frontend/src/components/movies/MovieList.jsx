import { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from './MovieCard';
import Loading from '../common/Loading';
import { useMovieController } from '../../controllers/MovieController';

const MovieListContainer = styled.div`
  margin: 2rem 0;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.6em 1em;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
`;

const SelectFilter = styled.select`
  padding: 0.6em 1em;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MovieList = ({ title = "Movies", initialFilters = {} }) => {
  const { movies, genres, loading, error, fetchMovies, fetchGenres } = useMovieController();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  useEffect(() => {
    fetchGenres();
    
    // Apply initial filters and search
    const filters = { ...initialFilters };
    if (searchTerm) {
      filters.title = searchTerm;
    }
    if (selectedGenre) {
      filters.genre_id = selectedGenre;
    }
    
    fetchMovies(filters);
  }, [searchTerm, selectedGenre, initialFilters]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };
  
  return (
    <MovieListContainer>
      <h2>{title}</h2>
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <SelectFilter value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </SelectFilter>
      </FilterContainer>
      
      {loading ? (
        <Loading text="Loading movies..." />
      ) : error ? (
        <NoResults>Error loading movies. Please try again.</NoResults>
      ) : movies.length === 0 ? (
        <NoResults>No movies found matching your criteria.</NoResults>
      ) : (
        <MovieGrid>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </MovieListContainer>
  );
};

export default MovieList;

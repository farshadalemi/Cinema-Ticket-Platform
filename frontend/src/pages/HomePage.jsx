import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFilm, FaCalendarAlt } from 'react-icons/fa';
import MovieList from '../components/movies/MovieList';
import Loading from '../components/common/Loading';
import { useMovieController } from '../controllers/MovieController';

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  
  input {
    flex: 1;
    padding: 0.8rem 1rem;
    border-radius: 4px 0 0 4px;
    border: none;
    font-size: 1rem;
  }
  
  button {
    padding: 0.8rem 1.5rem;
    border-radius: 0 4px 4px 0;
    border: none;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 1rem;
    cursor: pointer;
    
    &:hover {
      background-color: #ff424f;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    
    input {
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    
    button {
      border-radius: 4px;
    }
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { movies, loading, error, fetchMovies } = useMovieController();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to movies page with search term
    // In a real app, this would use react-router navigation with query params
    console.log('Searching for:', searchTerm);
  };
  
  return (
    <div>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Experience Movies Like Never Before</HeroTitle>
          <HeroSubtitle>
            Book your tickets online and enjoy the latest blockbusters in premium comfort
          </HeroSubtitle>
          
          <form onSubmit={handleSearch}>
            <SearchBar>
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Search</button>
            </SearchBar>
          </form>
        </HeroContent>
      </HeroSection>
      
      <div className="container">
        <section>
          <SectionTitle>
            <FaFilm /> Now Showing
          </SectionTitle>
          <MovieList 
            title="" 
            initialFilters={{ is_active: true }}
          />
        </section>
        
        <section>
          <SectionTitle>
            <FaCalendarAlt /> Coming Soon
          </SectionTitle>
          <MovieList 
            title="" 
            initialFilters={{ is_active: false }}
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;

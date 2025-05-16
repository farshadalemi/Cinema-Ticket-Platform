import { useState, useEffect } from 'react';
import MovieService from '../services/MovieService';
import { toast } from 'react-toastify';

export const useMovieController = () => {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.getMovies(filters);
      setMovies(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch movies');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMovie = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.getMovie(id);
      const formattedMovie = MovieService.formatMovieDetails(data);
      setMovie(formattedMovie);
      return formattedMovie;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch movie details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.getGenres();
      setGenres(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch genres');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMovie = async (movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.createMovie(movieData);
      toast.success('Movie created successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to create movie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMovie = async (id, movieData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.updateMovie(id, movieData);
      toast.success('Movie updated successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to update movie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovieService.deleteMovie(id);
      toast.success('Movie deleted successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to delete movie');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    movie,
    genres,
    loading,
    error,
    fetchMovies,
    fetchMovie,
    fetchGenres,
    createMovie,
    updateMovie,
    deleteMovie
  };
};

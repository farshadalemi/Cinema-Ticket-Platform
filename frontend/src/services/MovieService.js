import MovieRepository from '../repositories/MovieRepository';

class MovieService {
  async getMovies(filters = {}) {
    try {
      const movies = await MovieRepository.getMovies(filters);
      return movies;
    } catch (error) {
      throw error;
    }
  }

  async getMovie(id) {
    try {
      const movie = await MovieRepository.getMovie(id);
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async createMovie(movieData) {
    try {
      const movie = await MovieRepository.createMovie(movieData);
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async updateMovie(id, movieData) {
    try {
      const movie = await MovieRepository.updateMovie(id, movieData);
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async deleteMovie(id) {
    try {
      const movie = await MovieRepository.deleteMovie(id);
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async getGenres() {
    try {
      const genres = await MovieRepository.getGenres();
      return genres;
    } catch (error) {
      throw error;
    }
  }

  formatMovieDetails(movie) {
    return {
      ...movie,
      formattedDuration: this.formatDuration(movie.duration_minutes),
      genreNames: movie.genres.map(genre => genre.name).join(', '),
      releaseYear: new Date(movie.release_date).getFullYear()
    };
  }

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}

export default new MovieService();

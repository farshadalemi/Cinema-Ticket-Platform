from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.movie import Movie, Genre, MovieGenre
from ..models.showtime import Theater, Seat, Showtime
from ..utils.database import SessionLocal
from ..utils.logger import logger

def create_sample_genres(db: Session):
    genres = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", 
        "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
        "Romance", "Science Fiction", "Thriller"
    ]
    
    for genre_name in genres:
        # Check if genre already exists
        existing_genre = db.query(Genre).filter(Genre.name == genre_name).first()
        if not existing_genre:
            genre = Genre(name=genre_name)
            db.add(genre)
            logger.info(f"Created genre: {genre_name}")
    
    db.commit()

def create_sample_movies(db: Session):
    # Get genres
    action_genre = db.query(Genre).filter(Genre.name == "Action").first()
    adventure_genre = db.query(Genre).filter(Genre.name == "Adventure").first()
    scifi_genre = db.query(Genre).filter(Genre.name == "Science Fiction").first()
    comedy_genre = db.query(Genre).filter(Genre.name == "Comedy").first()
    drama_genre = db.query(Genre).filter(Genre.name == "Drama").first()
    
    # Sample movies
    movies = [
        {
            "title": "Interstellar Adventure",
            "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            "duration_minutes": 169,
            "release_date": datetime.now() - timedelta(days=30),
            "poster_url": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            "trailer_url": "https://www.youtube.com/embed/zSWdZVtXT7E",
            "rating": 8.6,
            "genres": [scifi_genre, adventure_genre]
        },
        {
            "title": "The Last Hero",
            "description": "A retired superhero is forced back into action when a new threat emerges that only he can stop.",
            "duration_minutes": 142,
            "release_date": datetime.now() - timedelta(days=15),
            "poster_url": "https://images.unsplash.com/photo-1535981767287-35259dbf7d0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "trailer_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "rating": 7.8,
            "genres": [action_genre, adventure_genre]
        },
        {
            "title": "Laugh Out Loud",
            "description": "A group of friends embark on a hilarious road trip that changes their lives forever.",
            "duration_minutes": 115,
            "release_date": datetime.now() - timedelta(days=7),
            "poster_url": "https://images.unsplash.com/photo-1543584756-31dc18f1c0ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "trailer_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "rating": 7.2,
            "genres": [comedy_genre]
        },
        {
            "title": "The Journey Within",
            "description": "A powerful drama about self-discovery and the human spirit's resilience in the face of adversity.",
            "duration_minutes": 128,
            "release_date": datetime.now() - timedelta(days=1),
            "poster_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
            "trailer_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "rating": 8.1,
            "genres": [drama_genre]
        },
        {
            "title": "Future World: The Beginning",
            "description": "In a dystopian future, a young rebel fights against an oppressive regime to restore freedom.",
            "duration_minutes": 155,
            "release_date": datetime.now() + timedelta(days=30),  # Coming soon
            "poster_url": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "trailer_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "rating": None,  # Not rated yet
            "genres": [scifi_genre, action_genre]
        }
    ]
    
    for movie_data in movies:
        # Check if movie already exists
        existing_movie = db.query(Movie).filter(Movie.title == movie_data["title"]).first()
        if not existing_movie:
            # Create movie
            genres = movie_data.pop("genres")
            movie = Movie(**movie_data)
            db.add(movie)
            db.flush()  # Flush to get the movie ID
            
            # Add genres
            for genre in genres:
                movie_genre = MovieGenre(movie_id=movie.id, genre_id=genre.id)
                db.add(movie_genre)
            
            logger.info(f"Created movie: {movie_data['title']}")
    
    db.commit()

def create_sample_theaters(db: Session):
    theaters = [
        {"name": "Main Theater", "capacity": 150},
        {"name": "VIP Theater", "capacity": 50},
        {"name": "IMAX Experience", "capacity": 200}
    ]
    
    for theater_data in theaters:
        # Check if theater already exists
        existing_theater = db.query(Theater).filter(Theater.name == theater_data["name"]).first()
        if not existing_theater:
            theater = Theater(**theater_data)
            db.add(theater)
            logger.info(f"Created theater: {theater_data['name']}")
    
    db.commit()
    
    # Create seats for each theater
    theaters = db.query(Theater).all()
    for theater in theaters:
        # Check if seats already exist for this theater
        existing_seats = db.query(Seat).filter(Seat.theater_id == theater.id).count()
        if existing_seats == 0:
            create_seats_for_theater(db, theater)

def create_seats_for_theater(db: Session, theater):
    rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    seats_per_row = theater.capacity // len(rows)
    
    for row in rows:
        for seat_num in range(1, seats_per_row + 1):
            # Determine seat type
            if row in ["A", "B"]:
                seat_type = "regular"
            elif row in ["C", "D", "E", "F"]:
                seat_type = "premium" if 4 <= seat_num <= seats_per_row - 3 else "regular"
            elif row in ["G", "H"]:
                seat_type = "vip" if 3 <= seat_num <= seats_per_row - 2 else "premium"
            else:
                seat_type = "vip"
            
            # Make some seats accessible
            if (row == "J" and seat_num in [1, 2, seats_per_row - 1, seats_per_row]):
                seat_type = "accessible"
            
            seat = Seat(
                theater_id=theater.id,
                row=row,
                number=seat_num,
                seat_type=seat_type
            )
            db.add(seat)
    
    db.commit()
    logger.info(f"Created seats for theater: {theater.name}")

def create_sample_showtimes(db: Session):
    # Get movies that are already released
    current_date = datetime.now()
    movies = db.query(Movie).filter(Movie.release_date <= current_date).all()
    theaters = db.query(Theater).all()
    
    if not movies or not theaters:
        logger.warning("No movies or theaters found for creating showtimes")
        return
    
    # Create showtimes for the next 7 days
    for day in range(7):
        show_date = current_date + timedelta(days=day)
        
        # Morning, afternoon, evening showtimes
        show_times = [
            show_date.replace(hour=10, minute=0, second=0),  # 10:00 AM
            show_date.replace(hour=14, minute=30, second=0),  # 2:30 PM
            show_date.replace(hour=18, minute=0, second=0),   # 6:00 PM
            show_date.replace(hour=21, minute=30, second=0)   # 9:30 PM
        ]
        
        for movie in movies:
            for theater in theaters:
                for start_time in show_times:
                    # Check if showtime already exists
                    existing_showtime = db.query(Showtime).filter(
                        Showtime.movie_id == movie.id,
                        Showtime.theater_id == theater.id,
                        Showtime.start_time == start_time
                    ).first()
                    
                    if not existing_showtime:
                        # Calculate end time based on movie duration
                        end_time = start_time + timedelta(minutes=movie.duration_minutes)
                        
                        # Set price based on theater and time
                        base_price = 10.99
                        if theater.name == "VIP Theater":
                            base_price = 15.99
                        elif theater.name == "IMAX Experience":
                            base_price = 13.99
                        
                        # Evening shows cost more
                        if start_time.hour >= 18:
                            base_price += 2.00
                        
                        showtime = Showtime(
                            movie_id=movie.id,
                            theater_id=theater.id,
                            start_time=start_time,
                            end_time=end_time,
                            price=base_price,
                            is_active=True
                        )
                        db.add(showtime)
                        logger.info(f"Created showtime: {movie.title} at {theater.name} on {start_time}")
    
    db.commit()

def create_sample_data():
    try:
        db = SessionLocal()
        create_sample_genres(db)
        create_sample_movies(db)
        create_sample_theaters(db)
        create_sample_showtimes(db)
    except Exception as e:
        logger.error(f"Error creating sample data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Creating sample data")
    create_sample_data()
    logger.info("Sample data created")

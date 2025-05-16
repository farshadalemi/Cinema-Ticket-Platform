from sqlalchemy.orm import Session
from ..models.user import User
from ..utils.security import get_password_hash
from ..utils.database import SessionLocal, engine, Base
from ..utils.logger import logger
from .sample_data import create_sample_data

def create_default_users(db: Session):
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            username="admin",
            email="admin@cinema.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            is_admin=True
        )
        db.add(admin_user)
        logger.info("Created admin user")

    # Check if regular user already exists
    regular_user = db.query(User).filter(User.username == "user").first()
    if not regular_user:
        regular_user = User(
            username="user",
            email="user@cinema.com",
            hashed_password=get_password_hash("user123"),
            full_name="Regular User",
            is_active=True,
            is_admin=False
        )
        db.add(regular_user)
        logger.info("Created regular user")

    db.commit()

def init_db():
    try:
        db = SessionLocal()
        create_default_users(db)

        # Create sample movies, theaters, and showtimes
        create_sample_data()
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Creating initial data")
    init_db()
    logger.info("Initial data created")

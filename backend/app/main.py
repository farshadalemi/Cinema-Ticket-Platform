from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controllers import auth_controller, movie_controller, ticket_controller, support_controller, admin_controller
from .utils.database import engine, Base
from .utils.logger import logger
from .utils.init_db import init_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize default data
init_db()

app = FastAPI(
    title="Cinema Ticket Booking API",
    description="API for Cinema Ticket Booking Platform",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://frontend:3000",
    "http://frontend:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_controller.router)
app.include_router(movie_controller.router)
app.include_router(ticket_controller.router)
app.include_router(support_controller.router)
app.include_router(admin_controller.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Cinema Ticket Booking API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

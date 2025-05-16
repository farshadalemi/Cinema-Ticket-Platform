# Cinema Ticket Booking Platform

A comprehensive Cinema Ticket Booking application with FastAPI backend and React frontend.

## Features

- **Movie Showcase**: Browse current and upcoming movies with details
- **Ticket Management**: Select seats, purchase tickets, and manage bookings
- **Dual Booking Channels**: Self-service online booking and support team assisted booking
- **Admin Panel**: Manage movies, showtimes, seats, and users
- **User Authentication**: Secure registration and login
- **Support System**: Track customer support calls and interactions

## Tech Stack

- **Backend**: FastAPI with controller-service-repository architecture
- **Frontend**: React with controller-service-repository architecture
- **Database**: PostgreSQL
- **Deployment**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd cinema-ticket-platform
   ```

2. Create environment files:
   ```
   cp backend/.env.example backend/.env
   ```

3. Start the application:
   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - PgAdmin: http://localhost:5050 (Email: admin@cinema.com, Password: admin)

### Default Credentials

The application comes with pre-configured user accounts for testing:

- **Admin User**:
  - Username: admin
  - Password: admin123
  - Full access to all features including the admin panel

- **Regular User**:
  - Username: user
  - Password: user123
  - Standard user access for booking tickets

### Sample Data

The application is initialized with sample data including:
- Movies with details and posters
- Theaters with different seating configurations
- Showtimes for the next 7 days
- Seat types (regular, premium, VIP, accessible)

This allows you to test the full functionality of the application immediately after startup.

## Project Structure

### Backend

```
backend/
├── app/
│   ├── controllers/      # API endpoints
│   ├── services/         # Business logic
│   ├── repositories/     # Database operations
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas for validation
│   ├── middleware/       # Middleware components
│   ├── utils/            # Utility functions
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
├── tests/                # Unit and integration tests
└── requirements.txt      # Python dependencies
```

### Frontend

```
frontend/
├── src/
│   ├── controllers/      # UI controllers
│   ├── services/         # Business logic
│   ├── repositories/     # API communication
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── assets/           # Static assets
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
└── package.json          # JavaScript dependencies
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when the application is running.

## Development

### Backend Development

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```
cd frontend
npm install
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

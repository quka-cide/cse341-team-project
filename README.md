# CSE 341 Team Project - Event Management Platform API

A RESTful API for managing events, user registrations, and reviews. Built with Node.js, Express, MongoDB, and secured with JWT authentication.

## 🌐 Live Demo

**Production URL:** https://cse341-team-project-kx4l.onrender.com

**API Documentation:** https://cse341-team-project-kx4l.onrender.com/api-docs

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger/OpenAPI 3.0
- **Testing:** Jest + Supertest
- **Deployment:** Render

## 📦 Collections (4 Total)

| Collection | Fields | Description |
|------------|--------|-------------|
| **Events** | 8 fields | title, description, date, time, location, price, capacity, creatorId |
| **Users** | 3 fields | fullName, email, password |
| **Registrations** | 3 fields | eventId, userId, registrationDate |
| **Reviews** | 5 fields | eventId, userId, rating, comment, date |

## 🔐 Protected Routes (OAuth/JWT)

The following routes require authentication via Bearer token:

| Collection | POST | PUT | DELETE |
|------------|------|-----|--------|
| **Events** | ✅ Protected | ✅ Protected | ✅ Protected |
| **Reviews** | ✅ Protected | ✅ Protected | ✅ Protected |
| Users | ❌ | ❌ | ❌ |
| Registrations | ❌ | ❌ | ❌ |

## 🧪 Testing

Unit tests are implemented for all GET endpoints using Jest and Supertest.

```bash
# Run tests
npm test

# Test results: 23 tests across 4 test suites
```

## 📋 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login (returns JWT token)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (🔒 Auth required)
- `PUT /api/events/:id` - Update event (🔒 Auth required)
- `DELETE /api/events/:id` - Delete event (🔒 Auth required)

### Registrations
- `GET /api/registrations/:eventId` - Get registrations for an event
- `POST /api/registrations` - Create registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Delete registration

### Reviews
- `GET /api/reviews/:eventId` - Get reviews for an event
- `POST /api/reviews` - Create review (🔒 Auth required)
- `PUT /api/reviews/:id` - Update review (🔒 Auth required)
- `DELETE /api/reviews/:id` - Delete review (🔒 Auth required)

---

## 👥 Individual Contributions

### Team Member 1: [Your Name Here]
- Implemented Users collection with full CRUD endpoints (GET, GET by ID, POST, PUT, DELETE)
- Created user authentication with JWT token generation
- Added login endpoint with password hashing using bcrypt
- Set up initial project structure and MongoDB connection

### Team Member 2: [Your Name Here]
- Implemented Events collection with full CRUD endpoints
- Added GET /events/:id endpoint with proper error handling
- Created Swagger documentation for Events endpoints
- Secured Events POST, PUT, DELETE routes with JWT auth middleware

### Team Member 3: [Your Name Here]
- Implemented Registrations collection with full CRUD endpoints (GET, POST, PUT, DELETE)
- Added data validation for Registrations (required fields, duplicate prevention)
- Implemented Reviews collection with full CRUD endpoints
- Added data validation for Reviews (rating 1-5, duplicate prevention)

### Team Member 4: [Your Name Here]
- Wrote unit tests for Users GET endpoints (6 tests)
- Wrote unit tests for Events GET endpoints (6 tests)
- Wrote unit tests for Registrations GET endpoints (5 tests)
- Wrote unit tests for Reviews GET endpoints (6 tests)
- Set up Jest and Supertest testing framework

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Installation

```bash
# Clone the repository
git clone https://github.com/quka-cide/cse341-team-project.git

# Install dependencies
npm install

# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=8080

# Run the server
npm start

# Run tests
npm test
```

## 📝 License

This project is for educational purposes as part of CSE 341 - Web Services at BYU-Idaho.

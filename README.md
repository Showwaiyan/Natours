# Natours 🏔️

A full-stack tour booking platform built with modern web technologies, allowing users to discover and book adventurous tours at the best prices.

## 🌟 Features

### For Users
- **Tour Discovery**: Browse through various adventure tours with detailed information
- **Interactive Maps**: View tour locations with integrated mapping functionality
- **User Reviews**: Read and write reviews for tours with star ratings
- **User Authentication**: Secure login/logout and user account management
- **Booking System**: Book tours with integrated payment processing
- **Responsive Design**: Optimized for all devices

### For Administrators
- **Tour Management**: Create, update, and delete tour listings
- **User Management**: Manage user accounts and permissions
- **Review Management**: Moderate user reviews
- **Booking Management**: Track and manage tour bookings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling

### Frontend
- **Pug** - Template engine
- **CSS3** - Styling with custom design
- **JavaScript** - Client-side functionality

### Security & Performance
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Express Mongo Sanitize** - NoSQL injection prevention
- **XSS Clean** - Cross-site scripting protection
- **HPP** - HTTP Parameter Pollution protection

### Additional Features
- **Stripe** - Payment processing
- **MapLibre GL** - Interactive maps
- **Email Templates** - Welcome emails and notifications

## 📁 Project Structure

```
natours/
├── controllers/          # Route controllers
├── models/              # Database models
├── routes/              # API routes
├── views/               # Pug templates
├── public/              # Static files (CSS, images, HTML)
├── utilities/           # Utility functions
├── dev-data/           # Development data and templates
├── app.js              # Express app configuration
├── server.js           # Server startup
└── config.env          # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/natours.git
   cd natours
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_LOCAL=mongodb://localhost:27017/natours
   DB_REMOTE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-super-secret-jwt-string
   JWT_EXPIRES_IN=90d
   
   EMAIL_FROM=noreply@natours.io
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Import sample data** (optional)
   ```bash
   node dev-data/data/import-dev-data.js --import
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Visit the application**
   Open your browser and go to `http://localhost:3000`

## 📡 API Endpoints

### Tours
- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:id` - Get a specific tour
- `POST /api/v1/tours` - Create a new tour
- `PATCH /api/v1/tours/:id` - Update a tour
- `DELETE /api/v1/tours/:id` - Delete a tour

### Users
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/me` - Get current user profile

### Reviews
- `GET /api/v1/reviews` - Get all reviews
- `POST /api/v1/tours/:tourId/reviews` - Create a review for a tour
- `GET /api/v1/reviews/:id` - Get a specific review

### Bookings
- `GET /api/v1/bookings` - Get all bookings
- `POST /api/v1/bookings` - Create a new booking

## 🗄️ Database Models

### Tour Model
- Basic information (name, duration, difficulty, price)
- Location data with coordinates
- Images and description
- Tour guides and group size limits
- Ratings and reviews

### User Model
- Authentication details
- Personal information
- User roles (user, guide, lead-guide, admin)
- Password management

### Review Model
- Review text and rating (1-5 stars)
- User and tour references
- Creation timestamp

### Booking Model
- User and tour references
- Payment information
- Booking status

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in your production environment
2. Configure your production database
3. Set up environment variables on your hosting platform

### Security Features
- Rate limiting (100 requests per hour in production)
- Data sanitization against NoSQL injection attacks
- XSS protection
- Parameter pollution prevention
- Security headers with Helmet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of "Node.js, Express, MongoDB & More: The Complete Bootcamp" by Jonas Schmedtmann.

## 🙏 Acknowledgments

- **Jonas Schmedtmann** - Course instructor and original project creator
- **Unsplash** - Tour images
- **MapLibre** - Mapping functionality
- **Stripe** - Payment processing

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.

---

*Built with ❤️ for adventure seekers around the world*

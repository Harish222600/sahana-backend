# Backend - Node.js + Express

This is the backend server for the Sahana Project, built with Node.js and Express.

## Features

- Express.js server
- CORS enabled
- Environment variable configuration
- MongoDB ready (mongoose installed)
- Nodemon for development

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sahana_project
JWT_SECRET=your_jwt_secret_key_here
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

## Project Structure

```
backend/
├── config/          # Configuration files
│   └── db.js       # Database connection
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── package.json    # Dependencies and scripts
└── server.js       # Main server file
```

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-restart

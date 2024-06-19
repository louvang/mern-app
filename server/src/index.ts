import express, { Express, Request, Response } from 'express';
import passport from './configs/passport';
import session = require('express-session');
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';

// Environment variable configuration
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: `${__dirname}/../.env.production.local`,
  });
} else {
  require('dotenv').config({
    path: `${__dirname}/../.env.development.local`,
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string);
const db = mongoose.connection;

// MongoDB error handling
const handleMongoError = (err: Error) => {
  console.error('MongoDB connection error:', err);
};
db.on('error', handleMongoError);

// Express
const app: Express = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days in ms
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use auth routes
app.use('/api/auth', authRoutes);

// General routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

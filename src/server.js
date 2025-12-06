// IMPORTS:
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { swaggerUi, swaggerSpec } = require('./swagger');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Middleware
const authMiddleware = require('./middlewares/authMiddleware');

const FRONTEND_URL = 'http://localhost:5173';

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// Use Routes
app.use('/auth', authRoutes);

app.use('/private', authMiddleware, userRoutes);
app.use('/private', authMiddleware, dashboardRoutes);
app.use('/private', authMiddleware, customerRoutes);
app.use('/private', authMiddleware, noteRoutes);

// Serve Swagger UI -> only during development
if (process.env.NODE_ENV === "development") {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.listen(5000, () => {
    console.log('App Started... Listening to Port 5000 on http://localhost:5000');
});
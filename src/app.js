//exportar express
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import inventarioRoutes from './routes/inventory.routes.js';

import cors from 'cors';

dotenv.config();
const app = express();
const FRONTEND_URL = 'http://localhost:5173';
console.log('Frontend URL:', FRONTEND_URL);
app.use(
  cors({
    origin: FRONTEND_URL, //frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Página no encontrada - Error 404',
  });
});

export default app;

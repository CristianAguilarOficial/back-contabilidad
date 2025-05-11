//exportar express
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import inventarioRoutes from './routes/inventory.routes.js';
import cors from 'cors';

const app = express();
dotenv.config();
const FRONTEND_URL = process.env.URL_FRONT;
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

export default app;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import path from 'path';

dotenv.config();

import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import workoutRoutes from './routes/workoutRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import strikeTeamRoutes from './routes/strikeTeamRoutes.js';
import biometricRoutes from './routes/biometricRoutes.js';
import transformationRoutes from './routes/transformationRoutes.js';
import armoryRoutes from './routes/armoryRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set io in app to use in controllers
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Route Mounting Logic
const mountRoutes = (router) => {
    router.use('/auth', authRoutes);
    router.use('/admin', adminRoutes);
    router.use('/dashboard', dashboardRoutes);
    router.use('/workouts', workoutRoutes);
    router.use('/nutrition', nutritionRoutes);
    router.use('/progress', progressRoutes);
    router.use('/goals', goalRoutes);
    router.use('/notifications', notificationRoutes);
    router.use('/tickets', ticketRoutes);
    router.use('/agent', agentRoutes);
    router.use('/contact', contactRoutes);
    router.use('/gamification', gamificationRoutes);
    router.use('/strike-teams', strikeTeamRoutes);
    router.use('/biometrics', biometricRoutes);
    router.use('/transformations', transformationRoutes);
    router.use('/armory', armoryRoutes);
    router.use('/exercises', exerciseRoutes);
};

// Mount on both /api (for local) and / (for Vercel prefix stripping)
const apiRouter = express.Router();
mountRoutes(apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Error Middleware uploads folder static
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('MERN Backend API is running with Socket.io');
});

if (process.env.NODE_ENV !== 'production') {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;

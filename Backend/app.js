import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import dashBoardRouter from './routes/dashboard.routes.js';
import uploadRouter from './routes/upload.routes.js';
import notificationRouter from './routes/notification.routes.js';
import cookieParser from 'cookie-parser';
import connectToDataBase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// added cors for giving access to any origins
app.use(cors({origin:'*'}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// make sure Mongo is connected before any route touches the DB — this is
// what actually fixes "buffering timed out" on serverless platforms, where
// there's no guarantee the connection made at module load has finished
// before the first request arrives (or survived a cold start).
app.use(async (req, res, next) => {
    try {
        await connectToDataBase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(503).json({ success: false, message: "Database unavailable, please try again" });
    }
});

// serve uploaded ticket photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/tickets' ,ticketRouter);
app.use('/api/v1/dashboard' ,dashBoardRouter);
app.use('/api/v1/uploads' ,uploadRouter);
app.use('/api/v1/notifications' ,notificationRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(errorMiddleware);

// Vercel (and other serverless hosts) import this file and call the
// exported app directly as a request handler — they never call app.listen.
// Only start a real listening server for local dev / traditional hosting.
if (process.env.VERCEL !== '1') {
    app.listen(PORT || 3000, () => {
        console.log(`Server is running on port ${PORT || 3000}`);
    });
}

export default app;
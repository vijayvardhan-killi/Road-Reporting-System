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

// serve uploaded ticket photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/tickets' ,ticketRouter);
app.use('/api/v1/dashboard' ,dashBoardRouter);
app.use('/api/v1/uploads' ,uploadRouter);
app.use('/api/v1/notifications' ,notificationRouter);


// app.use(authMiddleware);
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(PORT , async () => {
    console.log('Server is running on port 3000');
    await connectToDataBase();
});

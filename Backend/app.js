import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import cookieParser from 'cookie-parser';
import connectToDataBase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import cors from 'cors';
import {insertDistricts} from './controllers/area.controller.js';

const app = express();
// added cors for giving access to any origins
app.use(cors({origin:'*'}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/tickets' ,ticketRouter);



// app.use(authMiddleware);
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(PORT , async () => {
    console.log('Server is running on port 3000');
    await connectToDataBase();
    // insertDistricts();
});

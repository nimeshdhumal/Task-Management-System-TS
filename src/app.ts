import express from 'express';
import cors from 'cors';
import './models';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';
import adminRoutes from './routes/admin.routes';
import { connection } from './config/db';
import errorHandler from './middlewares/error.handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/admin', adminRoutes);

connection();

app.use(errorHandler);

export default app;
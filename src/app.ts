import express from 'express';
import cors from 'cors';
import './models';
import {connection} from '../src/config/db';

const app = express();

app.use(cors());
app.use(express.json());
connection;

export default app;
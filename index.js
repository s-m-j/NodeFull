import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'dotenv';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js'; 
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController'

mongoose
    .connect(processes.env.DB_CONN)
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Me');
});

app.post('/auth/login', UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/auth/register', registerValidation, UserController.newuser)


app.listen(processes.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});

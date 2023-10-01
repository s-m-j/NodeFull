import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js'; 
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController'

mongoose
    .connect('')
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

app.post('/auth/xxx', (req, res) => {

    const token = jwt.sign(
        {
            email: req.body.email,
            username: 'Serega',
        },
        'topsecret123',
    );
    res.json({
        success: true,
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});

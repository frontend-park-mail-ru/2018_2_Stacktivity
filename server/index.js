'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();


app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());


const users = {
	'silvman': {
		username: 'silvman',
		email: 'stack@blep.dev',
		password: 'password',
		score: 1,
	},
	'constaconst': {
		username: 'constaconst',
		email: 'stack@blep.dev',
		password: 'password',
		score: 2,
	},
	'falcon': {
		username: 'falcon',
		email: 'stack@blep.dev',
		password: 'password',
		score: 3,
	},
};

const ids = {};

app.post('/signup', function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	if (
		!username || !password || !email || !age ||
		!password.match(/^\S{4,}$/) ||
		!email.match(/@/) ||
		!(typeof age === 'number' && age > 10 && age < 100)
	) {
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[username]) {
		return res.status(400).json({error: 'Пользователь уже существует'});
	}

	const id = uuid();
	const user = {username, password, email, score: 0};
	ids[id] = username;
	users[username] = user;

	res.cookie('sessionid', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	console.log(req.body);

	const password = req.body.password;
	const username = req.body.username;
	if (!password || !username) {
		return res.status(400).json({error: 'Не указан E-Mail или пароль'});
	}
	if (!users[username] || users[username].password !== password) {
		return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
	}

	const id = uuid();
	ids[id] = username;

	res.cookie('sessionid', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.get('/profile', function (req, res) {
	const id = req.cookies['sessionid'];
	const username = ids[id];
	if (!username || !users[username]) {
		return res.status(401).end();
	}

	users[username].score += 1;

	res.json(users[username]);
});

app.get('/Leaderboard', function (req, res) {
	const scorelist = Object.values(users)
		.sort((l, r) => r.score - l.score)
		.map(user => {
			return {
				username: user.username,
				scores: user.score,
			}
		});

	res.json(scorelist);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});

app.get('/me', function (req, res) {
    const id = req.cookies['sessionid'];
    const email = ids[id];
    if (!email || !users[email]) {
        return res.status(401).end();
    }

    users[ email ].score += 1;

    res.json(users[ email ]);
});

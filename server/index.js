'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fallback = require('express-history-api-fallback');
const app = express();

const root = path.resolve(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(root));
app.use(fallback('index.html', {root}));

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});
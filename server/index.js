

const fallback = require('express-history-api-fallback');
const express = require('express');
const path = require('path');
const app = express();
const initMocks = require('./mocks');
const ws = require('express-ws');

const rootDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(rootDir));


if (process.env.MOCKS) {
    ws(app);

    initMocks(app);

    app.ws('/ws', (socket) => {
        socket.on('message', (message) => {
            console.log(message);

            socket.send(JSON.stringify({message: "working"}));
        });

        socket.on('close', () => {
            console.log('socket is closed');
        });
    });
}

app.use(fallback('index.html', {root: rootDir}));

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    /*
    if (req.url != '/') {
        res.statusCode = 404;
        res.end('404');
        return;
    }
    */

    const filename = req.url === '/' ? './index.html' : `.${req.url}`;


    const file = fs.readFile(filename, (err, file) => {
        if (err) {
            res.statusCode = 404;
            res.end('404');
            return;
        }

        res.write(file);
        res.end();
    });
});

server.listen(3000, () => {
});

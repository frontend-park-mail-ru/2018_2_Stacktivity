const url = require('url');

const initMocks = (app) => {
    const allowedOrigins = ['localhost'];

    const CORS_HEADERS = {
        requestedHeaders: 'Access-Control-Request-Headers'.toLowerCase(),
        requestedMethod: 'Access-Control-Request-Method'.toLowerCase(),

        allowOrigin: 'Access-Control-Allow-Origin'.toLowerCase(),
        allowMethods: 'Access-Control-Allow-Methods'.toLowerCase(),
        allowHeaders: 'Access-Control-Allow-Headers'.toLowerCase(),
        allowCredentials: 'Access-Control-Allow-Credentials'.toLowerCase(),
    };

    app.use(function (req, res, next) {
        const requestOrigin = req.headers.origin;

        if (typeof requestOrigin !== 'undefined') {
            const requestOriginHostname = url.parse(requestOrigin).hostname;

            const requestedHeaders = req.headers[CORS_HEADERS.requestedHeaders];
            const requestedMethod = req.headers[CORS_HEADERS.requestedMethod];

            console.log(`CORS-запрос с домена ${requestOriginHostname}`, {requestedHeaders, requestedMethod});

            const headers = [];
            if (requestedHeaders) {
                headers.push([CORS_HEADERS.allowHeaders, requestedHeaders]);
            }
            if (requestedMethod) {
                headers.push([CORS_HEADERS.allowMethods, 'GET, POST, OPTIONS']);
            }

            if (allowedOrigins.includes(requestOriginHostname)) {
                headers.push([CORS_HEADERS.allowOrigin, requestOrigin]);
                headers.push([CORS_HEADERS.allowCredentials, 'true']);
            }

            const result = headers.map((pair) => `\t${pair.join(': ')}`).
                join('\n');
            console.log(`Response with headers:\n${result}`);

            headers.forEach(([name, value]) => res.setHeader(name, value));
        }
        next();
    });

};

module.exports = initMocks;
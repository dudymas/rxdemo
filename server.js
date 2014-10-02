var connect = require('connect')
    , serveStatic = require('serve-static')
    , http = require('http')
    , port = process.argv[2]
    ;


var app = connect();
app.use(serveStatic('.'));
var server = http.createServer(app);

server.listen(port);


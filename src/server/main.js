const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = SocketIO(httpServer);

function startServer() {
    return new Promise(function(resolve, reject) {
        require('./socket-handler')(io);
        app.use(express.static(path.resolve(__dirname,'..', 'public')));
        httpServer.listen(port, function() {
            console.log(`httpServer listening on port ${port}`);
            resolve();
        });
    });
}

module.exports = startServer();
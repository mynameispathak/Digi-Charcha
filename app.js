const { static } = require('express');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, function (req, res) {
    console.log(`Server Running on port ${PORT}`);
});

const io = require('socket.io')(http);

const users = {};

io.on('connection', function (socket) {
    console.log('Connected...');
    socket.on('new-user-joined', function (name) { //Join Event
        console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', function (message) {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', function (message) {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});
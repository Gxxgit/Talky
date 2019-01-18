var app = require("http").createServer()
var io = require('socket.io')(app)

var PORT = 3000

var clientCount = 0

app.listen(PORT)

io.on('connection',function (socket) {
    clientCount++;
    socket.nickname = "User" + clientCount;
    io.emit('enter',{
        user:socket.nickname ,
        msg:" comes in",
        id:socket.id,
        type:'enter'
    });

    socket.on('message',function (str) {
        io.emit('message',{
            user:socket.nickname ,
            msg:str,
            id:socket.id,
            type:'message'
        })
    });

    socket.on('disconnect',function () {
        io.emit('leave',{
            user:socket.nickname ,
            msg:" left",
            id:socket.id,
            type:'leave'
        })
    })
})

console.log("websocket server listening on port" + PORT)

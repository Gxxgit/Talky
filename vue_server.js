var app = require("http").createServer()
var io = require('socket.io')(app)

var PORT = 3000

var clientCount = 0

var onlineList = []

app.listen(PORT)

io.on('connection',function (socket) {
    clientCount++;
    socket.nickname = "User" + clientCount;
    onlineList.push(socket.nickname)
    io.emit('enter',{
        user:socket.nickname ,
        msg:" comes in",
        id:socket.id,
        type:'enter',
        list:onlineList
    });

    socket.on('message',function (str) {
        io.emit('message',{
            user:socket.nickname ,
            msg:str,
            id:socket.id,
            type:'message'
        })
    });

    socket.on('rename',function (str) {
        changeName(onlineList,str,socket.nickname);
        socket.nickname = str;
        io.emit('rename',{
            user:socket.nickname ,
            list:onlineList
        })
    });

    socket.on('disconnect',function () {
        remove_onlineList(onlineList,socket.nickname);
        io.emit('leave',{
            user:socket.nickname ,
            msg:" left",
            id:socket.id,
            type:'leave',
            list:onlineList
        })
    })
})

/**
 *  删除离开的用户
 * @param nameList 在线用户列表
 * @param someone 待删除的用户昵称
 * @author gxx
 * @time 2019/01/22 17：50
 */
function remove_onlineList(nameList, someone){

    var index = nameList.indexOf(someone);
    if (index > -1) {
        nameList.splice(index, 1);
    }
}

function changeName(nameList,newName,oldName){
    var index = nameList.indexOf(oldName);
    if (index > -1) {
        nameList.splice(index, 1, newName);
    }
}

console.log("websocket server listening on port" + PORT)

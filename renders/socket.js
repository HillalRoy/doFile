const socket = require("socket.io")
let io;
let users = {};
function connection(user) {
    user.on('control', msg => {
        users[user.id] = msg;
    });

    user.on('player', msg => {
        users[user.id] = msg;
        user.join(`room${msg.lid}`);
    });
    user.on('connectplayer', msg => {
        user.join(`room${msg.playerid}`);
        io.in(`room${msg.playerid}`).emit("newconnection", msg);
    });

    user.on("update", msg => {
        io.to(msg.gp).emit("update", msg);
    })

    user.on('disconnect', () => {
        delete users[user.id];
    });
}


function sockeIo(server) {
    io = socket(server);
    io.on("connection", connection);
}
module.exports = sockeIo
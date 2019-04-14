const id = Math.round(Math.random() * Math.pow(10, 10))
let sendData
class MadiaControl {
    constructor(socket, connectWith) {
        this.socket = socket
        this.connectWith = connectWith
    }
    send(channel, msg) {
        msg.to = this.connectWith
        this.socket.emit(channel, msg)
    }
}


const madia = msg => {
    if (msg.video) {
        if (msg.src) {
            $("#vidoc").src = msg.src
            $("#vidoc").play()
        }
        $("#vidoc").requestFullscreen()
        $("#vidoc").controls = false
    } else if (msg.audio) {



    } else if (msg.err) {



    }
}







function controlMedia(socket) {
    socket.on("change", msg => {
        madia(msg)
        sendData.send("ok", {
            status: "ok"
        })
    })
    socket.on("nochange", msg => {
        sendData.send("ok", {
            status: "ok"
        })
    })
}
function changeType(msg){

}

function changeTrack(msg){

}

function changeTime(msg){

}

function changeVol(msg){

}





window.onload = () => {
    const socket = io()
    socket.emit("player", {
        lid: id,
        type: "player"
    })

    $("#idno").innerText = id;
    socket.on("newconnection", (msg) => {
        // sendData = new MadiaControl(socket, msg.cont)
        // controlMedia(socket)
        $("#cn").style.display = "none";
        $("#waiting").style.display = "grid";
        console.log(msg)
    });

    socket.on("update", (msg) => {
        switch (msg.type){
            case "type":

                changeType(msg);
                break;
            case "track":

                changeTrack(msg);
                break;
            case "time":

                changeTime(msg);
                break;
            case "vol":

                changeVol(msg);
                break;
            }

    });
}
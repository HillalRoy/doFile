window.onload = setup;
const id = Math.round(Math.random() * Math.pow(10, 10))
let sendData

function setup() {
    const socket = io()
    socket.emit("player", {
        lid: id,
        type: "player"
    })

    $("#idno").innerText = id;
    socket.on("newconnection", (msg) => {
        $("#cn").style.display = "none";
        $("#waiting").style.display = "grid";
    });

    socket.on("update", (msg) => {
        switch (msg.type) {
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

function changeType(msg) {
    switch (msg.newtype) {
        case "video":


            break;
        case "audio":


            break;
        default:

            break;
    }
}

function changeTrack(msg) {
    console.log(msg)
}

function changeTime(msg) {
    console.log(msg)

}

function changeVol(msg) {
    console.log(msg)
}



class Media {
    constructor() {
        this.video = document.createElement("video");
        this.vol = 1;
        this.song = new Audio();
        this.type = "video";
        this.song.onended = () => this.nextsong();
        this.songList = [];
        this.songPos = 0;
    }


    setSong(pos) {

        this.type = "audio";


        if (typeof pos === "number") {
            this.pos = pos;
            updatePlayer(this.songList[this.pos]);
            this.song.src = `${this.preFixed}/${this.songList[this.pos]}`;
        } else {
            this.pos = this.songList.indexOf(pos);
            updatePlayer(pos);
            this.song.src = `${this.preFixed}/${pos}`;
        }


        this.song.oncanplay = this.oncanplay;
    }


    setVideo(url) {

        this.type = "video";

        this.video.src = `${url}`;

        this.video.oncanplay = this.oncanplay;
    }

    playPause() {
        if (this.type === "audio") {

            if (this.song.paused) {
                return this.song.play();
            } else {
                return this.song.pause();
            }
        }
        else if (this.type === "video") {
            if (this.video.paused) {
                return this.video.play();
            } else {
                return this.video.pause();
            }
        }
    }


    preversong() {
        if (this.pos === 0) {
            this.pos = this.songList.length;
        }
        return this.setSong(--this.pos);
    }


    nextsong() {
        if (this.pos === this.songList.length - 1) {
            this.pos = -1;
        }
        return this.setSong(++this.pos);

    }


    currentTime() {
        if (this.type === "audio")
            return this.song.currentTime;
        else if (this.type === "video")
            return this.video.currentTime;
    }


    setCurrentTime(value) {
        if (this.type === "audio") {
            this.song.currentTime = value;
        }
        else if (this.type === "video") {
            this.video.currentTime = value;

        }
        this.playPause();

    }


    duration() {
        if (this.type === "audio")
            return this.song.duration;
        else if (this.type === "video")
            return this.video.duration;
    }
}

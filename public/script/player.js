window.onload = setup;
const id = Math.round(Math.random() * Math.pow(10, 10));
const gp = `room${id}`
let sendData;
let media;

function setup() {
  const socket = io();
  media = new Media(socket);
  socket.emit("player", {
    lid: id,
    type: "player"
  });

  $("#idno").innerText = id;
  // $("#idno").select();
  $("#idno").onclick = () => {
    $("#idno").select();
    document.execCommand("copy");
  };

  socket.on("newconnection", msg => {
    $("#cn").style.display = "none";
    $("#waiting").style.display = "grid";
  });

  media.setSongOntimeUpdate(()=>{
    socket.emit("ontimeupdate", {
      gp, 
    })

  })

  socket.on("update", msg => {
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
      //TODO: So many thing to do
      playSong(msg.url);

      break;
    default:
      break;
  }
}

function changeTrack(msg) {
  console.log(msg);
}

function changeTime(msg) {
  console.log(msg);
}

function changeVol(msg) {
  console.log(msg);
}

function playSong(url) {
  media.setSong(url);
}

class Media {
  constructor(socket) {
    this.video = document.createElement("video");
    this.vol = 1;
    this.song = new Audio();
    this.type = "video";
    this.song.onended = () => this.nextsong();
    this.songList = [];
    this.songPos = 0;
    this.preFixed = `http://${location.hostname}:6655`;
    this.current = "";
    this.socket = socket;

    this.song.oncanplay = () => {
      this.playPause(); 
      this.socket.emit("oncanplay", { gp, url: new URL(this.song.src).pathname });
      console.log(new URL(this.song.src).pathname)
    }

    this.song.onended = () => this.nextsong();

    $("#player").appendChild(this.video);
  }

  setSong(pos) {
    this.type = "audio";

    if (typeof pos === "number") {
      this.pos = pos;
      // updatePlayer(this.songList[this.pos]);
      this.song.src = `${this.preFixed}${this.current}/${this.songList[this.pos]}`;
    } else {
      this.pos = this.songList.indexOf(pos);
      // updatePlayer(pos);
      this.song.src = `${this.preFixed}${pos}`;
      this.listUrl(`${pos}`);
    }
  }
  listUrl(url) {
    url = url.replace(/\/[^/]*$/, "");
    this.current = url;
    const json = { path: url };

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json)
    };

    fetch(`/file/allfiles`, option)
      .then(data => data.json())
      .then(jsonData => {
        if (jsonData.type === "file not found") {
          return alert(option);
        }
        this.songList = jsonData.musics;
      });
  }

  setVideo(url) {
    this.type = "video";

    this.video.src = `${url}`;
    this.video.requestFullscreen();
    $("#waiting").style.display = "none";
    this.video.style.display = "block";
    this.video.oncanplay = () => console.log(this);
    // this.video.oncanplay = this.oncanplay;
  }

  playPause() {
    if (this.type === "audio") {
      if (this.song.paused) {
        return this.song.play();
      } else {
        return this.song.pause();
      }
    } else if (this.type === "video") {
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
    if (this.type === "audio") return this.song.currentTime;
    else if (this.type === "video") return this.video.currentTime;
  }

  setCurrentTime(value) {
    if (this.type === "audio") {
      this.song.currentTime = value;
    } else if (this.type === "video") {
      this.video.currentTime = value;
    }
    this.playPause();
  }

  setSongOntimeUpdate(fun){
    this.song.ontimeupdate = fun;
  }

  duration() {
    if (this.type === "audio") return this.song.duration;
    else if (this.type === "video") return this.video.duration;
  }
}

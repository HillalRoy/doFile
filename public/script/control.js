let socket;
let gp;
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

const controlMedia = (socket) => {
    socket.on("change", msg => {

        sendData.send("ok", { status: "ok" })
    })
    socket.on("nochange", msg => {
        sendData.send("ok", { status: "ok" })
    })
}



const id = Math.round(Math.random() * Math.pow(10, 10))


window.onload = () => {
    setup();
    socket = io()
    socket.emit("control", {
        lid: id,
        type: "controlar"
    })

    $("main").classList.add("connecting");
    $("#main").classList.add("hide");
    $("#music-player").classList.add("hide");

    function connectPlayer() {

        gp = `room${this.value}`;
        if (this.value.length === 10) {
            socket.emit("connectplayer", {
                lid: id,
                playerid: Number(this.value)
            })
        } else {
            // Error Handelar
            console.log("err")
        }
    }
    $("#idno").onchange = connectPlayer;

    socket.on("oncanplay", msg=> {
        updatePlayer(msg.url)
        console.log(msg)    
    })
    // socket.on("ontimeupdate", msg=>{
        


    // })

    socket.on("newconnection", (msg) => {
        console.log(msg);
        sendData = new MadiaControl(socket, msg.player)
        controlMedia(socket)

        $("#connection").classList.add("hide");
        $("main").classList.remove("connecting");
        $("#main").classList.remove("hide");
        $("#music-player").classList.remove("hide");

        $("#music-player-replasement").style.height = `${$("#music-player").getBoundingClientRect().height}px`;
        $("#music-player-replasement").style.width = `${$("#music-player").getBoundingClientRect().width}px`;
    });




}

function openLink(name, type) {
    switch (type) {
        case 'folder':
            dataFetch(`${name}`);
            break;


        case 'musics':
            playSong(`${name}`);
            break;

        case 'videos':
            playVideo(`${name}`);
            break;


        case 'photos':
            openImage(`${name}`);
            break;


        case 'other':
            alert(`File not soport`);
            break;
    }
}


function playSong(name) {
    console.log("sending", {
        name: `${current.join("/")}/${name}`
    })
    socket.emit("update", {
        type: "type",
        gp,
        newtype: "audio",
        url: `${current.join("/")}/${name}`
    })

}


function openImage(name) {

}


function playVideo(name) {

}

function updatePlayer(url) {
    const player = document.querySelector("#music-player");
    const title = player.querySelector("#title");
    const artist = player.querySelector("#artist");
    const cover = player.querySelector("#cover img");
    const crrentTime = player.querySelector("#left");
    const endTime = player.querySelector("#right");
    const timer = player.querySelector("#range");
    const previous = player.querySelector("#pvr");
    const playPause = player.querySelector("#playpus");
    const next = player.querySelector("#nex");
    let isElUsing = false;
    
    

    const songCTime = ct => {
      const cm = Math.floor(ct / 60);
      const cs = Math.floor(ct % 60);
      return `${cm < 10 ? "0" + cm : cm}:${cs < 10 ? "0" + cs : cs}`;
    };
  
    (function getMetaData(url, Title, Artist, Cover) {
      const fetchData = async () => {
        const json = { path: url };
  
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(json)
        };
  
        const data = await fetch(`/file/musicdata`, option);
        const jsonData = await data.json();
  
        return jsonData;
      };
  
      fetchData()
        .then(data => {
          const { title, artist } = data;
          Title.innerText =
            title.length > 25 ? title.substring(0, 23) + "..." : title;
          Artist.innerText =
            artist.length > 18 ? artist.substring(0, 16) + "..." : artist;
        })
        .catch(err => console.log(err));
  
      dataloadImg(Cover, /[^/]*$/.exec(url));
    })(url, title, artist, cover);
  
    function songTimeLine(el) {
      function getPersent() {
        return (el.value / song.duration()) * 100;
      }
  
      if (!isElUsing) el.value = song.currentTime();
  
      el.style.setProperty("--parsentis", getPersent() + "%");
    }
  
    function update() {
    //   crrentTime.innerText = songCTime(song.currentTime());
      songTimeLine(timer);
    }
  
    // song.oncanplay = () => {
    //   endTime.innerText = songCTime(song.duration());
    //   song.playPause();
    //   timer.max = song.duration();
    //   document.title = song.songList[song.pos];
    //   song.interval = setInterval(update, 500);
    // };
  
    (function() {
    //   timer.onchange = () => song.setCurrentTime(timer.value);
  
      timer.onmouseup = () => (isElUsing = false);
      timer.ontouchstart = () => (isElUsing = true);
      timer.ontouchend = () => (isElUsing = false);
      timer.onmousedown = () => (isElUsing = true);
  
      timer.onclick = () => {
        isElUsing = true;
        setTimeout(() => (isElUsing = false), 8000);
      };
    })();
  
    // playPause.onclick = () => song.playPause();
    // next.onclick = () => song.next();
    // previous.onclick = () => song.prevers();
  }
  
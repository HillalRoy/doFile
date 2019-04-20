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
    song.setSong(name);
}

function openImage (name) {
    const imgView = $('.imgview');
    const load = $('.imgview .load');
    const close = $('.imgview .closebtn');

    imgView.style.display = `block`;
    load.style.display = `block`;

    this.blur();
    close.focus();
    const newImage = new Image();
    let path = `${current.join("/")}/` + name;
    newImage.src = `http://${location.hostname}:6655${path}`;

    newImage.onload = () => {
        load.style.display = `none`;
        imgView.appendChild(newImage);
        imgView.style.height = 'auto';
        let i = 0;
        while (imgView.getBoundingClientRect().top < 30) {
            imgView.style.width = `calc(80vw - ${i++}px)`;
            if (i === 1000)
                break;
        }
    }
}
function playVideo(name) {
    let path = `${current.join("/")}/` + name;
    const newVideo = document.createElement('video');
    newVideo.setAttribute('controls', '');
    newVideo.src = `http://${location.hostname}:6655${path}`;
    document.body.appendChild(newVideo);
    newVideo.requestFullscreen();
    newVideo.play();
}

function updatePlayer(name) {
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
  
    (function getMetaData(name, Title, Artist, Cover) {
      const fetchData = async () => {
        const json = { path: `${current.join("/")}/${name}` };
  
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
  
      dataloadImg(Cover, name);
    })(name, title, artist, cover);
  
    function songTimeLine(el) {
      function getPersent() {
        return (el.value / song.duration()) * 100;
      }
  
      if (!isElUsing) el.value = song.currentTime();
  
      el.style.setProperty("--parsentis", getPersent() + "%");
    }
  
    function update() {
      crrentTime.innerText = songCTime(song.currentTime());
      songTimeLine(timer);
    }
  
    song.oncanplay = () => {
      endTime.innerText = songCTime(song.duration());
      song.playPause();
      timer.max = song.duration();
      document.title = song.songList[song.pos];
      song.interval = setInterval(update, 500);
    };
  
    (function() {
      timer.onchange = () => song.setCurrentTime(timer.value);
  
      timer.onmouseup = () => (isElUsing = false);
      timer.ontouchstart = () => (isElUsing = true);
      timer.ontouchend = () => (isElUsing = false);
      timer.onmousedown = () => (isElUsing = true);
  
      timer.onclick = () => {
        isElUsing = true;
        setTimeout(() => (isElUsing = false), 8000);
      };
    })();
  
    playPause.onclick = () => song.playPause();
    next.onclick = () => song.next();
    previous.onclick = () => song.prevers();
  }
  
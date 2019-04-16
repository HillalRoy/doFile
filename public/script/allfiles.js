let current = [];
const song = new MusicPlayer();

window.onload = () => {


    $("#music-player-replasement").style.height = `${$("#music-player").getBoundingClientRect().height}px`;
    $("#music-player-replasement").style.width = `${$("#music-player").getBoundingClientRect().width}px`;
    let pathname = location.pathname;


    current = pathname.split("/").filter(a => a !== "explor" & a !== "")

    dataFetch('')
}

const dataloadImg = async (el, name) => {
    const json = { path: `${current.join("/")}/${name}` }

    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json)
    }


    try {

        const res = await fetch("/file/img/", option);
        const jsonBuf = await res.json();
        const bolb = new Blob([new Uint8Array(jsonBuf.buf.data)], { type: jsonBuf.format });
        const url = URL.createObjectURL(bolb);
        el.parentNode.style.background = "none";
        return el.src = url;

    } catch (err) { }
}



const dataFetch = (link) => {
    let json = { path: `${current.join("/")}/${link}` }


    const fetchData = async () => {

        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json)
        }


        const data = await fetch(`/file/allfiles`, option)
        const jsonData = await data.json();
        if(jsonData.type === "file not found"){
            return window.location.replace("/404");
        }
        return jsonData;
    }

    fetchData().then(json => {
        let t = 50;
        $('#files').innerHTML = ``;


        current.push(`${link}`);
        const preFixed = `http://${location.hostname}:6655/${current.join("/")}`;


        song.songList = json.musics;
        song.preFixed = preFixed;


        for (files in json) {
            json[files].forEach(a => {
                addFile(files, a, t);
                t += 20;
            })
        }
        mapItems();
    }).catch(err => {
        let sections = document.querySelectorAll("section")
        sections.forEach(el => el.style.display = "none")
    })
}


function addFile(type, name, t) {
    const files = $('#files');
    const fragment = document.createDocumentFragment();
    const a = document.createElement('a');
    a.href = `#${name}`;
    a.style.setProperty('--dely', t)
    a.setAttribute('onclick', `openLink('${name}', '${type}')`);
    a.classList.add(type);

    if (type === "photos") {
        const path = `/file/imgthamp${current.join("/")}/` + name;
        a.innerHTML = ` <div class="icon"><img src="${path}"></div>`
    } else {
        a.innerHTML = ` <div class="icon"></div>`
    }


    a.innerHTML += `<div class="name">
                        ${name.length > 10 ? name.substring(0, 8) + '..' : name}
                    </div>`


    fragment.appendChild(a);
    files.appendChild(fragment);


    if (type === "musics") {
        const img = new Image();
        dataloadImg(img, name);


        if (img)
            a.querySelector(".icon").appendChild(img);
    }
}


const openLink = (name, type) => {
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


const closeImg = () => {
    const imgView = $('.imgview');
    const load = $('.imgview .load');
    imgView.style.display = `none`;

    if ($('.imgview img'))
        imgView.removeChild($('.imgview img'));

    load.style.display = `block`;
    imgView.style.height = '60vh';
}


const playSong = (name) => {
    song.setSong(name);
}


const openImage = (name) => {
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


const playVideo = (name) => {
    let path = `${current.join("/")}/` + name;
    const newVideo = document.createElement('video');
    newVideo.setAttribute('controls', '');
    newVideo.src = `http://${location.hostname}:6655${path}`;
    document.body.appendChild(newVideo);
    newVideo.requestFullscreen();
    newVideo.play();
}


const updatePlayer = (name) => {
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

    const songCTime = (ct) => {
        const cm = Math.floor(ct / 60);
        const cs = Math.floor(ct % 60);
        return `${cm < 10 ? "0" + cm : cm}:${cs < 10 ? "0" + cs : cs}`;
    }


    (function getMetaData(name, Title, Artist, Cover) {
        const fetchData = async () => {
            const json = { path: `${current.join("/")}/${name}` };

            const option = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json)
            };

            const data = await fetch(`/file/musicdata`, option);
            const jsonData = await data.json();

            return jsonData;
        }


        fetchData().then(data => {
            const { title, artist } = data;
            Title.innerText = title.length > 25 ? title.substring(0, 23) + "..." : title;
            Artist.innerText = artist.length > 18 ? artist.substring(0, 16) + "..." : artist;
        })
            .catch(err => console.log(err));

        dataloadImg(Cover, name);

    }(name, title, artist, cover));



    function songTimeLine(el) {

        function getPersent() {
            return (el.value / song.duration()) * 100
        }

        if (!isElUsing)
            el.value = song.currentTime()

        el.style.setProperty("--parsentis", getPersent() + "%")
    }


    function update() {
        crrentTime.innerText = songCTime(song.currentTime());
        songTimeLine(timer)

    }


    song.oncanplay = () => {
        endTime.innerText = songCTime(song.duration());
        song.playPause();
        timer.max = song.duration();
        document.title = song.songList[song.pos];
        song.interval = setInterval(update, 500);
    };

    (function () {
        timer.onchange = () => song.setCurrentTime(this.value)

        timer.onmouseup = () => isElUsing = false;
        timer.ontouchstart = () => isElUsing = true;
        timer.ontouchend = () => isElUsing = false;
        timer.onmousedown = () => isElUsing = true;

        timer.onclick = () => {

            isElUsing = true
            setTimeout(() => isElUsing = false, 8000)
        };
    }());


    playPause.onclick = () => song.playPause();
    next.onclick = () => song.next();
    previous.onclick = () => song.prevers();
}
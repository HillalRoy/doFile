let listdiv
window.onload = () => {
    listdiv = $(".file")
    fetch("/api/getfiles")
        .then(data => data.json())
        .then(json => files(json))
}

const dataload = async (link, el)=> {
    const data =await fetch("/api/img/" + link).then(dat => dat.json())
    const b64encoded = btoa(String.fromCharCode.apply(null,await data.data))
    el.src = 'data:image/jpeg;base64,' +await b64encoded
}
function files(list) {
    makeList(list.musics, $(".songs"))
}

const makeList = (list, target) => {
    target.innerHTML = ""
    list.forEach(e => {
        let songName = e.name ? e.name : e

        const div = document.createElement("a")

        div.href = "#play"

        div.setAttribute("onclick", `play("${songName}")`)

        div.classList.add("file-i")

        const img = new Image()

        dataload(songName , img)

        const divTag = document.createElement("div")

        divTag.classList.add("tag")

        songName = songName.substring(0, songName.length - 4)
        if (songName.length > 23)
            songName = songName.substring(0, 23) + "..."

        divTag.innerHTML = `
            <h6>${songName}</h6>
            <p>${e.singer ? e.singer : ""}</p>`

        div.appendChild(img)
        div.appendChild(divTag)
        target.appendChild(div)
    });
}

let song

const play = (e) => {
    if (song)
        song.pause()
    song = new Audio()
    song.src = "./content/" + e
    song.play()
    console.dir(song)
}

//Keybord Sensive
const keydown = (e) => {
    if (e.keyCode === 13) {
        console.log("enter")
        e.preventDefault()

    } else if (e.keyCode === 37) {
        e.preventDefault()
        $(".file-i").focus()
        console.log("<-")

    } else if (e.keyCode === 40) {
        e.preventDefault()
        console.log("\\/")

    } else if (e.keyCode === 39) {
        e.preventDefault()
        console.log("->")

    } else if (e.keyCode === 38) {
        e.preventDefault()
        console.log("/\\")

    }
}

addEventListener("keydown", keydown)
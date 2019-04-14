let listdiv
window.onload = () => {
    listdiv = $(".file")
    fetch("/api/getfiles")
        .then(data => data.json())
        .then(json => files(json))
}

const dataload = async (link, el) => {
    const data = await fetch("/api/img/" + link).then(dat => dat.json())
    const b64encoded = btoa(String.fromCharCode.apply(null, await data.data))
    el.src = 'data:image/jpeg;base64,' + await b64encoded
}

const getmusicdata = async (el, song) => {

    const data = await fetch("/api/mdata/" + song).then(dat => dat.json())
    console.log(await data)

    const divTag = document.createElement("div")

    divTag.classList.add("tag")

    const name = async ()=>{
        if (await data.title.length > 20)
            return data.title.substring(0, 20) + "..."
        return data.title
    }
    const artist = async ()=>{
        if (await data.artist.length > 15)
            return data.artist.substring(0, 15) + "..."
        return data.artist
    }

    divTag.innerHTML = `
            <h3>${await name()}</h3>
            <h6>${await artist()}</h6>`

    el.appendChild(divTag)

}

function files(list) {
    makeList(list.musics, $(".songs"))
}

const makeList = (list, target) => {
    target.innerHTML = ""
    list.forEach(e => {
        let songName = e.name ? e.name : e

        const div = document.createElement("div")

        div.setAttribute("onclick", `play("${songName}")`)

        div.classList.add("file-i")

        const img = new Image()

        getmusicdata(div, songName)

        dataload(songName, img)

        div.appendChild(img)

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
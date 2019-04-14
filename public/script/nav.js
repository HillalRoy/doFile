function map(val, from, to, start, end) {
    const pdist = to - from
    const ndist = end - start

    Math.min(start, end)
    return Math.min(start, end) + ((ndist / pdist) * val)
}

function $(el) {
    return document.querySelector(el)
}
const getLeft = (eliment) => {
    let left = eliment.style.left

    if (left)
        return Number(left.split(/(px)$/)[0])
    else
        return -eliment.getBoundingClientRect().width
}

const navOpen = () => {
    $("#navul").style.left = "0"
    $("main").style.filter = `brightness(30%)`
    navopen = true
}
const navClose = () => {
    $("#navul").style.left = -$("#navul").getBoundingClientRect().width + "px"
    $("main").style.filter = `brightness(100%)`
    navopen = false
}

let navopen = false

const navSwipe = (eliment) => {
    let scroll = {
        X: false,
        Y: false
    }
    let startPosition = {
        X: 0,
        Y: 0
    }
    let currentPosition = {
        X: 0,
        Y: 0
    }
    let width
    const start = (el) => {
        startPosition = {
            X: el.changedTouches[0].clientX,
            Y: el.changedTouches[0].clientY
        }
        eliment.style.transition = `all 0s`
        width = eliment.getBoundingClientRect().width
    }

    const move = (el) => {

        currentPosition = {
            X: el.changedTouches[0].clientX,
            Y: el.changedTouches[0].clientY
        }

        if (!scroll.X && !scroll.Y) {
            const xmove = startPosition.X - currentPosition.X
            let x = (xmove > 0) ? xmove : -xmove

            const ymove = startPosition.Y - currentPosition.Y
            let y = (ymove > 0) ? ymove : -ymove
            if (x > y) scroll.X = true
            else scroll.Y = true
        }
        if (scroll.X && (startPosition.X < 10 || navopen)) {

            if(navopen && startPosition.X < width){
                currentPosition.X += (width - startPosition.X)
            }

            if (currentPosition.X > width)
                currentPosition.X = width
            else if (currentPosition.X < 0)
                currentPosition.X = 0
            eliment.style.left = currentPosition.X - width + "px"
            let brightness = map(currentPosition.X - width, -width, 0, 100, 30)
            $("main").style.filter = `brightness(${brightness}%)`
        }
        if (getLeft(eliment) === 0)
            navopen = true
        else if (getLeft(eliment) === -width)
            navopen = false
    }

    const end = () => {
        if (scroll.X && getLeft(eliment) > -width && getLeft(eliment) < 0) {
            if (navopen && -10 > getLeft(eliment)) {
                navClose()
            } else if (startPosition.X < 10) {
                navOpen()
            }
        }
        eliment.style.transition = `all 0.3s ease`

        scroll = {
            X: false,
            Y: false
        }
        currentPosition = {
            X: 0,
            Y: 0
        }
        currentPosition = {
            X: 0,
            Y: 0
        }
    }

    addEventListener("touchstart", start)
    addEventListener("touchmove", move)
    addEventListener("touchend", end)
}

const loaded = () => {
    const click = (ev) => {
        ev.preventDefault()
        if (navopen) {
            navClose()
        } else {
            navOpen()
        }
    }
    $("#nav-icon").onclick = click
}
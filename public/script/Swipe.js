//Swipe Event handelar
class Swipe {
    constructor(eliment) {

        this.eliment = eliment
        console.log(this)
        this.scroll = {
            X: false,
            Y: false
        }
        this.startPosition = {
            X: 0,
            Y: 0
        }
        this.currentPosition = {
            X: 0,
            Y: 0
        }
        addEventListener("touchstart", this.start)
        addEventListener("touchmove", this.move)
        addEventListener("touchend", this.end)
    }

    start(el) {
        console.log(this.startPosition)
        this.startPosition = {
            X: el.changedTouches[0].clientX,
            Y: el.changedTouches[0].clientY
        }
    }

    move(el) {
        this.currentPosition = {
            X: el.changedTouches[0].clientX,
            Y: el.changedTouches[0].clientY
        }

        if(!this.scroll.X && !this.scroll.Y){
            const xmove = this.startPosition.X - this.currentPosition.X
            let x = (xmove > 0) ? xmove : -xmove
            
            const ymove = this.startPosition.Y - this.currentPosition.Y
            let y = (ymove > 0) ? ymove : -ymove
            if(x>y) this.scroll.X = true
            else this.scroll.Y = true
        }
        console.log(this)
        const width = this.eliment.getBoundingClientRect().width
        if(this.scroll.X && this.startPosition.X < 10 ){
            if(this.currentPosition.X > width)
                this.currentPosition.X = width
            this.eliment.style.left =this.currentPosition.X - width + "px"
        }
        
    }
    end() {
        this.scroll = {
            X: false,
            Y: false
        }
        this.currentPosition = {
            X: 0,
            Y: 0
        }
        this.currentPosition = {
            X: 0,
            Y: 0
        }
    }
}

const a = new Swipe($("#navul"));
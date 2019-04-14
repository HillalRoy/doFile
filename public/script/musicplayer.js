class MusicPlayer{
    constructor(songList, preFixed){
        this.song = new Audio();
        this.songList = songList;
        this.preFixed = preFixed;
        this.song.onended = ()=>this.next();
        this.pos = 0;
    }
    setSong(pos){
        
        if(typeof pos  === "number"){
            this.pos = pos;
            updatePlayer(this.songList[this.pos]);
            this.song.src = `${this.preFixed}/${this.songList[this.pos]}`;
        }else{
            this.pos = this.songList.indexOf(pos);
            updatePlayer(pos);
            this.song.src = `${this.preFixed}/${pos}`;
        }


        this.song.oncanplay = this.oncanplay;
    }

    playPause(){
        if(this.song.paused){
            return this.song.play();
        }else{
            return this.song.pause();
        }
    }

    prevers(){
        if(this.pos === 0){
            this.pos = this.songList.length;
        }
        return this.setSong(--this.pos) ;
    }

    next(){
        if(this.pos === this.songList.length - 1){
            this.pos = -1;
        }
        return this.setSong(++this.pos);

    }

    currentTime(){
        return this.song.currentTime;
    }
    setCurrentTime(value){
        this.song.currentTime = value;
        this.playPause();
    }
    duration(){
        return this.song.duration;
    }
}
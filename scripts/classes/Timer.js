class Timer{
    constructor(){
        this.pEl = document.querySelector('#timer')
        this.h = 0 //hours 
        this.min = 0 //minutes
        this.s = 0 //seconds
        this.ms = 1000 //milliseconds
        this.interval
        this.isStartedTimer = false
    }

    startTimer(){
        if(!this.isStartedTimer){
            this.isStartedTimer = true
            this.interval = setInterval(()=>{this.changeTimer()}, this.ms)
        }
    }

    stopTimer(){
        clearInterval(this.interval)
    }

    resetTimer(){
        this.h = 0
        this.min = 0
        this.s = 0
        this.isStartedTimer = false
        this.pEl.innerHTML = '<b>Cronômetro:</b> 00:00:00'
    }

    changeTimer(){
        this.s++

        if(this.s == 60){
            this.s = 0
            this.min++

            if(this.min == 60){
                this.min = 0
                this.h++
            }
        }

        this.setTimer()    
    }
    
    setTimer(){
        let format = (this.h < 10 ? `0${this.h}:`: `${this.h}:`) + (this.min < 10 ? `0${this.min}:` : `${this.min}:`) + (this.s < 10 ? `0${this.s}` : this.s)
        this.pEl.innerHTML = '<b>Cronômetro: </b>' + format
    }

    getTime(){
        let str = this.pEl.innerText
        return str.replace('Cronômetro: ', '')
    }
}
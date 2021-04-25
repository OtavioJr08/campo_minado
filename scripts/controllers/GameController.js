class GameController{
    constructor(){
        this.boardEl = document.querySelector('#board')
        this.levels = document.querySelectorAll('ul > li > a')
        this.modalMessageEl = new bootstrap.Modal(document.querySelector('#messageModal'))
        this.modalCustomEl = new bootstrap.Modal(document.querySelector('#customLevelModal'))
        this.objTimer = new Timer()
        this.matrix
        this.lines = 20
        this.columns = 20
        this.bombs = 40
        this.gameLevel = 'Fácil'
        this.isEnableClick
        this.score = {
            max: null, 
            current: null,
            displayedMessage: false
        }
        this.settingsModal = {
            title: null,
            textBody: null
        }
        this.initialize()
    }
    
    initialize(){
        if(JSON.stringify(localStorage.getItem('minefield')) === 'null'){//Create key in localStorage
            let times = {
                easy: '-:-:-',
                medium: '-:-:-',
                hard: '-:-:-',
                custom: '-:-:-',
            }
            localStorage.setItem('minefield', JSON.stringify(times))
        }

        this.disableRightButton()
        this.setEventsMenu()
        this.newGame()
    }
    
    newGame(){
        this.isEnableClick = true
        this.score.max = this.lines*this.columns - this.bombs
        this.score.current = 0
        this.score.displayedMessage = false
        this.objTimer.resetTimer()
        this.createMatrix()
    }

    disableRightButton(){
        document.addEventListener('contextmenu', event => {
            event.preventDefault()}
        );
    }

    setSettingsModal(title, textBody){
        this.settingsModal.title = title
        this.settingsModal.textBody = textBody
    }

    checkWon(){
        if(this.score.current == this.score.max){
            this.isEnableClick = false
            this.score.displayedMessage = true
            this.objTimer.stopTimer()
            this.saveTimers()
            this.setSettingsModal('Você Venceu!', `Parabéns, você venceu a partida! Seu tempo foi ${this.objTimer.getTime()}`)
            this.displayMessage(this.settingsModal, false)
        }    
    }

    displayMessage(settingsModal, isError){
        let modalMessageEl = document.querySelector('#messageModal')
    
        modalMessageEl.querySelector('.modal-title').innerText = settingsModal.title
        modalMessageEl.querySelector('.modal-body').innerText = settingsModal.textBody
        modalMessageEl.querySelector('.close-modal').innerHTML = 'Fechar'    
        let btnNewGame = modalMessageEl.querySelector('.newGame-modal')
        
        if(isError)
            btnNewGame.style.display = 'none'
        else{
            btnNewGame.innerHTML = 'Novo Jogo'               
            btnNewGame.addEventListener('click', ()=>{
                this.modalMessageEl.hide()
                this.newGame()
            })
        }
        
        this.modalMessageEl.show()
    }

    startTimer(){
        this.objTimer.startTimer()
    }

    //Return 'true' when the current time is less  
    isCompareTime(currentTime, localStorageTime){
        if(localStorageTime === '-:-:-' || currentTime < localStorageTime)
            return true 
        return false
    }

    saveTimers(){
        let currentTime = this.objTimer.getTime()
        let times = JSON.parse(localStorage.getItem('minefield'))
        switch(this.gameLevel){
            case 'Fácil':
                if(this.isCompareTime(currentTime, times.easy))
                    times.easy = currentTime
                break
            case 'Médio':
                if(this.isCompareTime(currentTime, times.medium))
                    times.medium = currentTime
                break
            case 'Difícil':
                if(this.isCompareTime(currentTime, times.hard))
                    times.hard = currentTime
                break
            case 'Personalizado':
            default:
                if(this.isCompareTime(currentTime, times.custom))
                    times.custom = currentTime
        }
        localStorage.setItem('minefield', JSON.stringify(times))
    }

    setEventsMenu(){
        // Fixed board size
        this.levels.forEach(lv=>{
            lv.addEventListener('click', ()=>{
                this.getLevel(lv.dataset.level)
            })
        })

        // Custom board size
        let customForm = document.querySelector('#customForm')
   
        customForm.addEventListener('submit', event=>{
            event.preventDefault()
            
            this.modalCustomEl.hide()
            this.lines = [...customForm.elements][0].value
            this.columns = [...customForm.elements][1].value
            this.bombs = [...customForm.elements][2].value
            this.gameLevel = 'Personalizado'
            let titleModal = 'Ops, algo deu errado!'
            let textBody
            if(this.lines != '' && this.columns != '' && this.bombs != ''){
                let dimensions = this.lines * this.columns
                if(this.bombs <= dimensions)
                    this.newGame()
                else{
                    textBody = `O número de bombas deve ser menor ou igual a ${ dimensions}`
                    this.setSettingsModal(titleModal, textBody)
                    this.displayMessage(this.settingsModal, true)
                }
            }else{
                textBody = 'Preencha todos os campos!'
                this.setSettingsModal(titleModal, textBody)
                this.displayMessage(this.settingsModal, true) 
            }    
        })
    }

    getLevel(level){
        switch(level){
            case 'medium':
                this.lines = 25
                this.columns = 25
                this.bombs = 80
                this.gameLevel = 'Médio'
                break;
            case 'hard':
                this.lines = 28
                this.columns = 28
                this.bombs = 120
                this.gameLevel = 'Difícil'
                break;
            case 'custom':
                break
            default:
                this.lines = 20
                this.columns = 20
                this.bombs = 40
                this.gameLevel = 'Fácil'
        }
        this.newGame()
    }

    getBestTime(){
        let times = JSON.parse(localStorage.getItem('minefield'))
        switch(this.gameLevel){
            case 'Fácil':
                return times.easy
            case 'Médio':
                return times.medium
            case 'Difícil':
                return times.hard
            case 'Personalizado':
            default:
                return times.custom
        }
    }

    createBoard(){
        this.boardEl.innerHTML = ' '
        let p = document.querySelectorAll('#gameDetails p')
        p[0].innerHTML = `<b>Nível:</b> ${this.gameLevel}`
        p[1].innerHTML = `<b>Melhor tempo:</b> ${(this.getBestTime()=='-:-:-')?'00:00:00':this.getBestTime()}`
        for(let i=0; i<this.lines; i++){
            // Create rows
            let row = document.createElement('DIV')
            row.classList.add('rowBoard')
            
            for(let j=0; j<this.columns; j++){
                // Create columns
                let square = document.createElement('div')
                square.classList.add('boardSquare')
                square.dataset.valueSquare = 0
                square.addEventListener('click', ()=>{
                    this.startTimer()
                    this.openSquare(square, i, j)
                })
                square.addEventListener('mousedown', event=>{
                    if(event.which === 3)
                        this.checkFlag(square)
                })
                row.insertAdjacentElement('beforeend', square)
                this.matrix[i][j] = square
            }
            this.boardEl.insertAdjacentElement('beforeend', row)
        }
    }

    checkFlag(square){
        if(this.isEnableClick){
            if(!square.classList.contains('boardSquareOpen') && !square.classList.contains('squareGameOver')){
                
                if(square.classList.contains('checkSquareFlag')){
                    square.querySelector('img').remove()
                    square.className = 'boardSquare'
                }else{
                    square.className = 'checkSquareFlag'
                    let img = document.createElement('img')
                    img.src = 'images/flag.png'
                    square.insertAdjacentElement('beforeend', img)
                }
            
            }
        }
    }

    removeFlag(square){
        square.querySelector('img').remove()
        square.classList.remove('checkSquareFlag')
    }

    gameOver(l, c){
        this.objTimer.stopTimer()
        this.matrix[l][c].className = 'squareGameOverClick'
        for(let i=0; i<this.lines; i++){
            for(let j=0; j<this.columns; j++){
                if(this.matrix[i][j].dataset.valueSquare == '-1'){

                    if(i == l && j == c){
                        this.matrix[l][c].className = 'squareGameOverClick'
                    }else{
                        if(this.matrix[i][j].classList.contains('checkSquareFlag'))
                            this.removeFlag(this.matrix[i][j])
                        this.matrix[i][j].className = 'squareGameOver'
                    }

                    let img = document.createElement('img')
                    img.src = 'images/bomb.png'
                    this.matrix[i][j].insertAdjacentElement('beforeend', img)
                }
            }
        }
    }

    openSquareAround(l, c){
        for(let i=l-1; i<=l+1; i++){
            for(let j=c-1; j<=c+1; j++){
                if (i >= 0 && i < this.lines && j >= 0 && j < this.columns) {
                    let square = this.matrix[i][j]                    
                    if(square.classList.contains('boardSquare') || square.classList.contains('checkSquareFlag')){
                        switch(square.dataset.valueSquare){
                            case '-1':
                                break;
                            case '0':
                                if(square.classList.contains('checkSquareFlag'))
                                    this.removeFlag(square)    
                                this.score.current++
                                square.className = 'boardSquareOpen'
                                this.openSquareAround(i, j)
                                break  
                            default:
                                this.score.current++
                                square.innerText = square.dataset.valueSquare
                                square.className = 'boardSquareOpen'
                        }
                    }
                }
            }
        }
    }

    openSquare(square, line, column){
        if(this.isEnableClick){
            
            if(square.classList.contains('boardSquare')){
                let valueSquare = square.dataset.valueSquare
    
                if(valueSquare == '-1'){
                    this.gameOver(line, column)
                    this.isEnableClick = false
                    this.setSettingsModal('Você Perdeu!', `Que pena, você perdeu a partida! Seu tempo foi ${this.objTimer.getTime()}`)
                    this.displayMessage(this.settingsModal, false)
                }else if(valueSquare == '0')
                    this.openSquareAround(line, column)
                else{
                    this.score.current++
                    square.innerText = valueSquare
                    square.className = 'boardSquareOpen'
                }
            }

            this.checkWon()
        }else{
            let titleModal
            let textBody
            
            if(this.score.displayedMessage){
                titleModal = 'Você Venceu!'
                textBody = `Parabéns, você venceu a partida! Seu tempo foi ${this.objTimer.getTime()}`
            }else{
                titleModal = 'Você Perdeu!'
                textBody = `Que pena, você perdeu a partida! Seu tempo foi ${this.objTimer.getTime()}`
            }

            this.setSettingsModal(titleModal, textBody)
            this.displayMessage(this.settingsModal, false)
        }
    }

    generateBombs(){
        for(let i=0; i<this.bombs; i++){
            let l, c
            do{
                l = this.getRandomInt(0, this.lines)
                c = this.getRandomInt(0, this.columns)   
            }while(this.matrix[l][c].dataset.valueSquare != '0')
            this.matrix[l][c].dataset.valueSquare = '-1'
            this.matrix[l][c].style.backgroundColor='red'
        }
    }

    getRandomInt(min, max){
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    checkAround(l, c){
        let bombCounter = 0
        for(let i=l-1; i<=l+1; i++){
            for(let j=c-1; j<=c+1; j++){
                if(i >= 0 && i < this.lines && j >=0 && j < this.columns){
                    let valueSquare = this.matrix[i][j].dataset.valueSquare
                    if(valueSquare == '-1')
                        bombCounter++
                }
            }
        }
        return bombCounter
    }

    countBombs(){
        let bombCounter
        for(let i=0; i<this.lines; i++){
            for(let j=0; j<this.columns; j++){
                if(this.matrix[i][j].dataset.valueSquare == '0'){
                    bombCounter =  this.checkAround(i, j)
                    this.matrix[i][j].dataset.valueSquare = bombCounter
                }
            }
        }
    }

    createMatrix(){
        this.matrix = new Array(this.lines)

        for(let i=0; i<this.lines; i++)
            this.matrix[i] = new Array(this.columns)
        
        this.createBoard()
        this.generateBombs()
        this.countBombs()
    }
}
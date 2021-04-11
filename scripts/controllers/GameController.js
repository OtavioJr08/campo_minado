class GameController{
    constructor(){
        this.boardEl = document.querySelector('#board')
        this.levels = document.querySelectorAll('ul > li > a')
        this.modalEl = new bootstrap.Modal(document.querySelector('#messageModal'))
        this.isEnableClick
        this.lines = 20
        this.columns = 20
        this.bombs = 40
        this.score = {
            max: null, 
            current: null,
            displayedMessage: false
        }
        this.matrix
        this.initialize()
    }
    
    initialize(){
        this.disableRightButton()
        this.setEventsMenu()
        this.newGame()
    }
    
    newGame(){
        this.createMatrix()
    }

    disableRightButton(){
        document.addEventListener('contextmenu', event => {
            event.preventDefault()}
        );
    }

    checkWon(){
        if(this.score.current == this.score.max){
            this.isEnableClick = false
            if(!this.score.displayedMessage){
                this.score.displayedMessage = true
                let settingsModal = {
                    title: 'Você Venceu!',
                    textBody: 'Parabéns, você venceu a partida!'
                }
                this.displayMessage(settingsModal, false)
            }
        }    
    }

    displayMessage(settingsModal, isError){
        let modalEl = document.querySelector('#messageModal')
    
        modalEl.querySelector('.modal-title').innerText = settingsModal.title
        modalEl.querySelector('.modal-body').innerText = settingsModal.textBody
        modalEl.querySelector('.close-modal').innerHTML = 'Fechar'    
        let btnNewGame = modalEl.querySelector('.newGame-modal')
        
        if(isError)
            btnNewGame.style.display = 'none'
        else{
            btnNewGame.innerHTML = 'Novo Jogo'               
            btnNewGame.addEventListener('click', ()=>{
                this.modalEl.hide()
                this.newGame()
            })
        }
        
        this.modalEl.show()
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
            
            this.lines = [...customForm.elements][0].value
            this.columns = [...customForm.elements][1].value
            this.bombs = [...customForm.elements][2].value
            let settingsModal = {
                title: 'Ops, algo deu errado!',
                textBody: null
            }
            
            if(this.lines != '' && this.columns != '' && this.bombs != ''){
                let dimensions = this.lines * this.columns
                if(this.bombs <= dimensions)
                    this.createMatrix()
                else{
                    settingsModal.textBody = 'O número de bombas deve ser menor ou igual a ' + dimensions
                    this.displayMessage(settingsModal, true)
                }
            }else{
                settingsModal.textBody = 'Preencha todos os campos'
                this.displayMessage(settingsModal, true) 
            }    
        })
    }

    getLevel(level){
        switch(level){
            case 'medium':
                this.lines = 25
                this.columns = 25
                this.bombs = 80
                break;
            case 'hard':
                this.lines = 28
                this.columns = 28
                this.bombs = 120
                break;
            case 'easy':
            default:
                this.lines = 20
                this.columns = 20
                this.bombs = 40
        }
        this.createMatrix()
    }

    createBoard(){
        this.boardEl.innerHTML = ' '
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

    gameOver(l, c){
        this.matrix[l][c].className = 'squareGameOverClick'
        for(let i=0; i<this.lines; i++){
            for(let j=0; j<this.columns; j++){
                if(this.matrix[i][j].dataset.valueSquare == '-1'){

                    if(i == l && j == c){
                        this.matrix[l][c].className = 'squareGameOverClick'
                    }else{
                        if(this.matrix[i][j].classList.contains('checkSquareFlag')){
                            this.matrix[i][j].querySelector('img').remove()
                            this.matrix[i][j].classList.remove('checkSquareFlag')
                        }  
                        this.matrix[i][j].className = 'squareGameOver'
                    }
                    let img = document.createElement('img')
                    img.src = 'images/bomb.png'
                    this.matrix[i][j].insertAdjacentElement('beforeend', img)
                }
            }
        }
        let settingsModal = {
            title: 'Você Perdeu!',
            textBody: 'Que pena, você perdeu a partida!',
        }
        this.displayMessage(settingsModal, false)
    }

    openSquareAround(l, c){
        for(let i=l-1; i<=l+1; i++){
            for(let j=c-1; j<=c+1; j++){
                if (i >= 0 && i < this.lines && j >= 0 && j < this.columns) {
                    let square = this.matrix[i][j]                    
                 
                    if(square.classList.contains('boardSquare')){
                        switch(square.dataset.valueSquare){
                            case '-1':
                                break;
                            case '0':
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
                }else if(valueSquare == '0')
                    this.openSquareAround(line, column)
                else{
                    this.score.current++
                    square.innerText = valueSquare
                    square.className = 'boardSquareOpen'
                }
            }
        }else{
            let settingsModal = {
                title: null,
                textBody: null
            }
            if(this.score.displayedMessage){
                settingsModal.title = 'Você Venceu!'
                settingsModal.textBody = 'Parabéns, você venceu a partida!'
            }else{
                settingsModal.title = 'Você Perdeu!'
                settingsModal.textBody = 'Que pena, você perdeu a partida!'
            }
            this.displayMessage(settingsModal, false)
        }
        
        this.checkWon()
    }

    generateBombs(){
        for(let i=0; i<this.bombs; i++){
            let l, c
            do{
                l = this.getRandomInt(0, this.lines)
                c = this.getRandomInt(0, this.columns)   
            }while(this.matrix[l][c].dataset.valueSquare != '0')
            this.matrix[l][c].dataset.valueSquare = '-1'
            this.matrix[l][c].style.backgroundColor  = 'red' //Temporário (Coloca posição com bomba em vermelho)
        }
    }

    getRandomInt(min, max){
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    countBombs(){
        let bombCounter = 0
        for(let i=0; i<this.lines; i++){
            for(let j=0; j<this.columns; j++){

                if(this.matrix[i][j].dataset.valueSquare == '0'){
                    if(j>0 && this.matrix[i][j-1].dataset.valueSquare == '-1') bombCounter++
                    if(j<this.columns-1 && this.matrix[i][j+1].dataset.valueSquare == '-1') bombCounter++
                    if(i<this.lines-1 && this.matrix[i+1][j].dataset.valueSquare == '-1') bombCounter++
                    if(i>0 && this.matrix[i-1][j].dataset.valueSquare == '-1') bombCounter++
                    if(i<this.lines-1 && j>0 && this.matrix[i+1][j-1].dataset.valueSquare == '-1') bombCounter++
                    if(i<this.lines-1 && j<this.columns-1 && this.matrix[i+1][j+1].dataset.valueSquare == '-1') bombCounter++
                    if(i>0 && j>0 && this.matrix[i-1][j-1].dataset.valueSquare == '-1') bombCounter++
                    if(i>0 && j<this.columns-1 && this.matrix[i-1][j+1].dataset.valueSquare == '-1') bombCounter++
                    
                    this.matrix[i][j].dataset.valueSquare = bombCounter
                    bombCounter = 0
                }
                
            }
        }
    }

    createMatrix(){
        this.isEnableClick = true
        this.score.max = this.lines*this.columns - this.bombs
        this.score.current = 0
        this.matrix = new Array(this.lines)

        for(let i=0; i<this.lines; i++)
            this.matrix[i] = new Array(this.columns)
        
        this.createBoard()
        this.generateBombs()
        this.countBombs()
    }
}
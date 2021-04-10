class GameController{
    
    constructor(){
        this.boardEl = document.querySelector('#board')
        this.levels = document.querySelectorAll('ul > li > a')
        this.enableClick
        this.lines = 20
        this.columns = 20
        this.bombs = 40
        this.matrix
        this.initialize()
    }
    
    initialize(){
        this.disableRightButton()
        this.setEventsMenu()
        this.createMatrix()
    }

    disableRightButton(){
        document.addEventListener('contextmenu', event => {
            event.preventDefault()}
        );
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
            
            if(this.lines != '' && this.columns != '' && this.bombs != ''){
                let dimensions = this.lines * this.columns
                if(this.bombs <= dimensions)
                    this.createMatrix()
                else
                    alert('O número de bombas deve ser menor ou igual a ' + dimensions)
            }else
                alert('Há campos não preenchidos!')
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
        if(this.enableClick){
            if(!square.classList.contains('boardSquareOpen') && !square.classList.contains('squareGameOver')){
                
                if(square.classList.contains('checkSquareFlag')){
                    square.querySelector('img').remove()
                    square.classList.remove('checkSquareFlag')
                    square.classList.add('boardSquare')
                }else{
                    square.classList.remove('boardSquare')
                    square.classList.add('checkSquareFlag')
                    let img = document.createElement('img')
                    img.src = 'images/flag.png'
                    square.insertAdjacentElement('beforeend', img)
                }
            
            }
        }
    }

    gameOver(){
        for(let i=0; i<this.lines; i++){
            for(let j=0; j<this.columns; j++){
                if(this.matrix[i][j].dataset.valueSquare == '-1'){
                    if(this.matrix[i][j].classList.contains('checkSquareFlag')){
                        this.matrix[i][j].querySelector('img').remove()
                        this.matrix[i][j].classList.remove('checkSquareFlag')
                    }    
                    this.matrix[i][j].classList.add('squareGameOver')
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
                 
                    if(square.classList.contains('boardSquare')){
                        switch(square.dataset.valueSquare){
                            case '-1':
                                break;
                            case '0':
                                square.classList.remove('boardSquare')
                                square.classList.add('boardSquareOpen')
                                this.openSquareAround(i, j)
                                break  
                            default:
                                square.innerText = square.dataset.valueSquare
                                square.classList.remove('boardSquare')
                                square.classList.add('boardSquareOpen')
                        }
                    }

                }
            }
        }
    }

    openSquare(square, line, column){
        if(this.enableClick && square.classList.contains('boardSquare')){
            let valueSquare = square.dataset.valueSquare

            if(valueSquare == '-1'){
                this.gameOver()
                this.enableClick = false
            }else if(valueSquare == '0')
                this.openSquareAround(line, column)
            else{
                square.innerText = valueSquare
                square.classList.remove('boardSquare')
                square.classList.add('boardSquareOpen')
            }
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
                    if(j>0 && this.matrix[i][j-1].dataset.valueSquare == '-1') bombCounter++;
                    if(j<this.columns-1 && this.matrix[i][j+1].dataset.valueSquare == '-1') bombCounter++;
                    if(i<this.lines-1 && this.matrix[i+1][j].dataset.valueSquare == '-1') bombCounter++;
                    if(i>0 && this.matrix[i-1][j].dataset.valueSquare == '-1') bombCounter++;
                    if(i<this.lines-1 && j>0 && this.matrix[i+1][j-1].dataset.valueSquare == '-1') bombCounter++;
                    if(i<this.lines-1 && j<this.columns-1 && this.matrix[i+1][j+1].dataset.valueSquare == '-1') bombCounter++;
                    if(i>0 && j>0 && this.matrix[i-1][j-1].dataset.valueSquare == '-1') bombCounter++;
                    if(i>0 && j<this.columns-1 && this.matrix[i-1][j+1].dataset.valueSquare == '-1') bombCounter++;
                    
                    this.matrix[i][j].dataset.valueSquare = bombCounter
                    bombCounter = 0
                }
                
            }
        }
    }

    createMatrix(){
        this.enableClick = true
        this.matrix = new Array(this.lines)

        for(let i=0; i<this.lines; i++)
            this.matrix[i] = new Array(this.columns)
        
        this.createBoard()
        this.generateBombs()
        this.countBombs()
    }

}
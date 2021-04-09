class GameController{
    
    constructor(){
        this.boardEl = document.querySelector('#board')
        this.levels = document.querySelectorAll('ul > li > a')
        this.lines = 20
        this.columns = 20
        this.bombs = 40
        this.matrix
        this.initialize()
    }
    
    initialize(){
        this.setEventsMenu()
        this.createMatrix()
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
                row.insertAdjacentElement('beforeend', square)
                this.matrix[i][j] = square
            }
            
            this.boardEl.insertAdjacentElement('beforeend', row)
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
        this.matrix = new Array(this.lines)

        for(let i=0; i<this.lines; i++)
            this.matrix[i] = new Array(this.columns)
        
        this.createBoard()
        this.generateBombs()
        this.countBombs()
    }

}
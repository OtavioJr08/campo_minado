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
        this.setEventMenu()
        this.createMatrix()
    }

    setEventMenu(){
        this.levels.forEach(lv=>{
            lv.addEventListener('click', ()=>{
                this.getLevel(lv.dataset.level);
            })
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
        this.createBoard()
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
                row.insertAdjacentElement('beforeend', square)
            }
            
            this.boardEl.insertAdjacentElement('beforeend', row)
        }
    }

    createMatrix(){
        this.matrix = new Array(this.lines)

        for(let i=0; i<this.lines; i++)
            this.matrix[i] = new Array(this.columns)
        
        this.createBoard()
    }

}
import { LightningElement, api } from 'lwc';
import initializePuzzleData from '@salesforce/apex/PuzzleController.initializePuzzleData';
import getRandomPuzzle from '@salesforce/apex/PuzzleController.getRandomPuzzle';
export default class SudokuPuzzle extends LightningElement {
    @api puzzle;
    @api puzzleArray = [];
    @api itemSelected;

    @api cannotBeOne = false;
    @api cannotBeTwo = false;
    @api cannotBeThree = false;
    @api cannotBeFour = false;
    @api cannotBeFive = false;
    @api cannotBeSix = false;
    @api cannotBeSeven = false;
    @api cannotBeEight = false;
    @api cannotBeNine = false;

    connectedCallback() {
        initializePuzzleData();
    }

    loadPuzzleClick(event) {
        getRandomPuzzle().then((result) => {
            this.puzzle = result;
            this.puzzleArray = [];
            console.log(this.puzzle);
            console.log(this.puzzleArray);
            var tempArray = this.puzzle.StartArray__c.split('');
            for(var r = 0; r < 9; r++){
                for(var c = 0; c < 9; c++){
                    var p = this.getStyle(c,r);
                    var v = tempArray[(r*9+c)];
                    var l = v != 0;
                    var d = "";
                    if(l){
                        p += " locked";
                        d = v;
                    }
                    console.log(p);
                    this.puzzleArray.push({
                            Id : r+":"+c, 
                            Row : r, 
                            Col : c, 
                            Val : v,
                            Dis : d,
                            Locked : l,
                            StyleClass : p });
                }
            }
            console.log(puzzleArray);
            this.puzzleArray
          })
          .catch((error) => {
            //this.error = error;
          });;
    }

    handleItemClick(event) {
        var taskId = event.target.dataset.id;
        console.log(taskId);
        if(!taskId){
            taskId = event.target.parentElement.dataset.id;
        }
        var usedNumbers = [];
        this.puzzleArray.forEach(element => {
            if(!element.Locked && element.Id == taskId){
                this.itemSelected = element;
                this.highlightItem(element.Id);
                return;
            }
        });
        if(this.itemSelected){
            console.log(this.itemSelected);
            this.puzzleArray.forEach(element => {
                if(element.Row == this.itemSelected.Row || element.Col == this.itemSelected.Col){
                    usedNumbers.push(element.Val);
                }
                //Also Add numbers from box.
            });
            console.log(usedNumbers);
            this.configureNumberBox(usedNumbers);
        }
    }

    handleNumberClick(event) {
        var num = event.target.dataset.val;
        this.puzzleArray.forEach(element => {
            if(element.Id == this.itemSelected.Id){
                this.itemSelected.Val = num;
                return;
            }
        });
        var selectedElement = this.template.querySelector(`[data-id="${this.itemSelected.Id}"]`);
        if(selectedElement){
            selectedElement.firstChild.textContent = num;
        }
        this.itemSelected = null;
        this.unhighlightAllItems();
        this.checkSolution();
    }

    checkSolution(){

    }

    configureNumberBox(usedNumbers){
        this.cannotBeOne = false;
        this.cannotBeTwo = false;
        this.cannotBeThree = false;
        this.cannotBeFour = false;
        this.cannotBeFive = false;
        this.cannotBeSix = false;
        this.cannotBeSeven = false;
        this.cannotBeEight = false;
        this.cannotBeNine = false;

        usedNumbers.forEach(num => {
            if(num == "1"){
                this.cannotBeOne = true;
            }
            if(num == "2"){
                this.cannotBeTwo = true;
            }
            if(num == "3"){
                this.cannotBeThree = true;
            }
            if(num == "4"){
                this.cannotBeFour = true;
            }
            if(num == "5"){
                this.cannotBeFive = true;
            }
            if(num == "6"){
                this.cannotBeSix = true;
            }
            if(num == "7"){
                this.cannotBeSeven = true;
            }
            if(num == "8"){
                this.cannotBeEight = true;
            }
            if(num == "9"){
                this.cannotBeNine = true;
            }
        });


    }

    highlightItem(id){
        this.unhighlightAllItems();
        var selectedElement = this.template.querySelector(`[data-id="${id}"]`);
        if(selectedElement){
            selectedElement.classList.add('highlight');
        }
    }
    unhighlightAllItems(){
        var elements = this.template.querySelectorAll('.highlight');
        if(elements){
            elements.forEach((e) => e.classList.remove('highlight'));
        }
    }

    getStyle(col, row){
        var pos = "sudoku-box slds-col slds-size_1-of-9 ";
        var mcol = col % 3;
        var mrow = row % 3;
        if(mrow == 0){
            pos += "top-";
        }
        if(mrow == 1){
            pos += "middle-";
        }
        if(mrow == 2){
            pos += "bottom-";
        }
        if(mcol == 0){
            pos += "left";
        }
        if(mcol == 1){
            pos += "middle";
        }
        if(mcol == 2){
            pos += "right";
        }
        return pos;
    }
}
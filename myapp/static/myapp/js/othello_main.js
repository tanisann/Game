const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
const SQ_div = document.getElementById("SQ");

let SQ = 8;
let values=[70,   4, 19, 14, 14, 19,  4, 70,4,-50, 14, 12, 12, 14,-50,  4, 19, 14,17,14, 14, 17, 14, 19, 14, 12,14, 15, 15, 14, 12,14, 14, 12, 14, 15,15, 14, 12,14, 19, 14, 17, 14, 14, 17, 14,19,   4, -50, 14, 12, 12, 14,-50, 4, 70,   4, 19, 14, 14, 19,  4, 70]

const stoneStateList = [];
if(SQ_div.textContent=="4"){
    SQ = 4;
    values =[70,10,10,70,10,20,20,10,10,20,20,10,70,10,10,70]
}else if(SQ_div.textContent=="6"){
    SQ = 6;
    values =[70,4,14,14,4,70,4,-20,12,12,-20,4,14,12,15,15,12,14,14,12,15,15,12,14,4,-20,12,12,-20,4,70,4,14,14,4,70]
} 

let currentColor = 1;
let skip = false;
let is_finish = false;
let RECORD = [];
let turn = 1;

var MAX_VALUE = Number.POSITIVE_INFINITY;
var MIN_VALUE = Number.NEGATIVE_INFINITY;

const currentTurnText = document.getElementById("current-turn");

const getReversibleStones = (board,idx) =>{
    const squareNums =[
        (SQ-1) - (idx%SQ),
        Math.min((SQ-1)-(idx%SQ),(SQ*(SQ-1)+(idx%SQ)-idx)/SQ),
        (SQ*(SQ-1)+(idx%SQ)-idx)/SQ,
        Math.min(idx%SQ,(SQ*(SQ-1)+(idx%SQ)-idx)/SQ),
        idx%SQ,
        Math.min(idx%SQ,(idx-(idx%SQ))/SQ),
        (idx-(idx%SQ))/SQ,
        Math.min((SQ-1)-(idx%SQ),(idx-(idx%SQ))/SQ),
     ];
    const parameters = [1,SQ+1,SQ,SQ-1,-1,-(SQ+1),-SQ,-(SQ-1)];
    
    let results = [];
    
    for (let i = 0;i < 8;i++){
        const box = [];
        const squareNum = squareNums[i];
        const param = parameters[i];
        const nextStoneState = board[idx+param];
        
        if (nextStoneState === 0 || nextStoneState === currentColor) continue;
        box.push(idx + param);

        for (let j = 0; j < squareNum -1; j++){
            const targetIdx = idx + param*2 + param*j;
            const targetColor = board[targetIdx];
            if (targetColor === 0) continue;
            if (targetColor === currentColor){
                results = results.concat(box);
                break;
            }else{
                box.push(targetIdx);
            }
        }
    }

    return results;
};




const put_best = (putable) =>{
    let put = putable[0]
    let value = values[put]
    for(let index=1; index<putable.length; index++){
        const value_next = values[putable[index]]
        if(value<value_next){
            value = value_next
            put = putable[index]
            }
    }
    //put = tryAI();
    onClickSquare(put);
};

const cpu = () =>{
    let putable = where_can_put(stoneStateList);
    let save_stoneStateList = stoneStateList


    put_best(putable);
    //onClickSquare(putable[Math.floor(Math.random()*putable.length)]);
};

const onClickSquare = (index) => {
    const reversibleStones = getReversibleStones(stoneStateList,index);
    
    if(stoneStateList[index] !== 0 || !reversibleStones.length){
        alert("You can't put here");
        return;
    }    
    skip = false;
    stoneStateList[index] = currentColor;
    document.querySelector(`[data-index='${index}']`).setAttribute("data-state",currentColor);
    RECORD.push(index);

    reversibleStones.forEach((key) => {
        stoneStateList[key] = currentColor;
        document.querySelector(`[data-index='${key}']`).setAttribute("data-state",currentColor);
    });    
        currentColor = 3-currentColor;
        turn = - turn; 
        can_put();
        if (!is_finish){
            if (currentColor === 1){
                currentTurnText.textContent = "now turn is black";
            }else{
                currentTurnText.textContent = "now turn is white";
                const canputs = where_can_put(stoneStateList);
                if(canputs.length !== 0){
                    cpu();
                }
            }
    }
}

const where_can_put = (board) =>{
    const canputs = [];
    for (let index=0; index<SQ**2; index++){
        const canputStones = getReversibleStones(board,index);
        if(board[index] === 0 && canputStones.length){
            canputs.push(index);
        }
    }
    return canputs;
};


const can_put = () => {
    for (let index=0; index<SQ**2; index++){
        document.querySelector(`[square-index='${index}']`).setAttribute("data-canput",0);
    }
    const canputs = where_can_put(stoneStateList);
    
    if(canputs.length === 0 && skip){
        finish();
    }else if (canputs.length === 0){
        pass();
    }
    
    for (let index=0; index<canputs.length; index++){
        const canputStones = getReversibleStones(stoneStateList,index);
            document.querySelector(`[square-index='${canputs[index]}']`).setAttribute("data-canput",1);    
    }
};


const pass = () => {
    currentColor = 3-currentColor;
    skip = true;
    can_put()
    if(!is_finish){
        if (currentColor === 1){
            alert("white turn was skipped");
            currentTurnText.textContent = "now turn is black";
        }else{
            alert("black turn was skipped");
            currentTurnText.textContent = "now turn is white";
        }
    }
};


const finish = () =>{
        is_finish = true;
        const blackStonesNum = stoneStateList.filter(state => state === 1).length;
        const whiteStonesNum = stoneStateList.filter(state => state === 2).length;
        
        let winnerText = "";
        if (blackStonesNum > whiteStonesNum){
            winnerText = "black win"+" "+blackStonesNum+"vs"+whiteStonesNum;
        }else if(blackStonesNum < whiteStonesNum){
            winnerText = "white win"+" "+blackStonesNum+"vs"+whiteStonesNum;
        }else{
            winnerText = "draw";
        }
        currentTurnText.textContent = winnerText
        alert(winnerText);
        record_submit();
};
    
  function record_submit(){
  let form = document.createElement('form');
  form.method = "POST";
  let name_in = document.getElementById('name');
  name_in.name = 'name';
  
  let size_in = document.createElement('input');
  size_in.type = 'hidden';
  size_in.name = "size";
  size_in.value = SQ;
  
  let record_in = document.createElement('input');
  record_in.type = 'hidden';
  record_in.name = 'record';
  record_in.value = RECORD;
  
  let csrf_fo =document.getElementById('csrf_fo');

  form.appendChild(csrf_fo);
  form.appendChild(name_in);
  form.appendChild(size_in);
  form.appendChild(record_in);
  document.body.appendChild(form);
  form.submit()
}




const createSquares = () => {
    for (let i=0; i<SQ**2; i++){
        const square =squareTemplate.cloneNode(true);
        square.removeAttribute("id");
        square.setAttribute("square-index",i);
        square.setAttribute("data-canput",0);
        stage.setAttribute("data-SQ",SQ);
        stage.appendChild(square);
        
        const stone = square.querySelector('.stone');
        stone.setAttribute("data-state",0);
        let defaultState;
        if (i==(SQ*(SQ/2-1)+SQ/2-1)||i==(SQ*(SQ/2-1)+SQ/2+SQ)){
            defaultState = 1;
        }else if (i==(SQ*(SQ/2-1)+SQ/2)||i==(SQ*(SQ/2-1)+SQ/2+SQ-1)){
            defaultState = 2;
        }else{
            defaultState = 0;
        }
        
        stone.setAttribute("data-state",defaultState);
        stone.setAttribute("data-index",i);
        stoneStateList.push(defaultState);
        
        square.addEventListener('click',() => {
            onClickSquare(i);


        })
        }
};

function calculation_board(board,line,max){
    let board_value = 0;
    for(let index=0; index<SQ**2;index++){
        if(board[index]==2){
            board_value = board_value + values[index]
        }else if(board[index]===1){
            board_value = board_value - values[index]
        }
    }
    if (line){
      if(max) return board_value;
      else return -board_value;
    }
    return 0;
};




function minimax(board, depth, turn, maxTurn){
  var line = false;
   if(where_can_put(board) === 0){
     line = true;
   }
  if(line||depth===0){
    return calculation_board(line, turn===maxTurn);
  }
  turn = 3 - turn;
  var moves = where_can_put(board);
  var score, max, min, i = 0;
  if (turn === maxTurn){
    max = MIN_VALUE;
    for(;i<moves.length;i++){
      board[moves[i]] = turn;
      score = minimax(board,depth-1, turn, maxTurn);
      board[moves[i]] = 0;
      if(score>max) max = score;
    }
    return max;
  }else{
    min = MAX_VALUE;
    for (; i < moves.length; i++) {
      board[moves[i]] = turn;
      score = minimax(board, depth - 1, turn, maxTurn);
      board[moves[i]] = 0;
      if (score < min) min = score;
    }
    return min;
  }
}

function tryAI(){
  var best = null;
  var board = stoneStateList;
  var turn_in = currentColor;
  var moves = where_can_put(board);
  var score;
  for (var i=0;i<moves.length;i++){
    board[moves[i]] = turn_in;
    score = minimax(board,3, currentColor, turn_in);//moves.length -1
    board[moves[i]] = 0;
    //console.log('move:',move[i],'score:',score)
    if (!best || best.score < score) best = {move:moves[i],score:score};
  }
 return best.move;
}



window.onload = () => {
    createSquares();
    can_put();
};

const SQ_div = document.getElementById("SQ");


let SQ = 3;
if (SQ_div.textContent == "3") {
  SQ = 3;
} else if (SQ_div.textContent == "4") {
  SQ = 4;
}


var BOARD_SIZE = SQ * SQ;
var MARU_VALUE = 1;
var PEKE_VALUE = -1;
var BLANK_VALUE = 0;
var MAX_VALUE = Number.POSITIVE_INFINITY;
var MIN_VALUE = Number.NEGATIVE_INFINITY;

let minimax_n = 0;


var turn_all = -1;
var times = 0;

const huPlayer = 1;
const aiPlayer = -1;
const h1 = document.getElementById("first");
const h3 = document.getElementById("second");
const btn = document.getElementById("btn");
btn.addEventListener("click", start);
let stateList = [];
let save_stateList = [];


const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");


var LineIndex = [];
if (SQ === 4) {
  LineIndex = [0,1,2,1,2,3,4,5,6,5,6,7,8,9,10,9,10,11,12,13,14,13,14,15,0,4,8,4,8,12,1,5,9,5,9,13,2,6,10,6,10,14,3,7,11,7,11,15,0,5,10,5,10,15,3,6,9,6,9,12,1,6,11,4,9,14,2,5,8,7,10,13];
  //for (let j = 0; j < SQ; j++) {
    //for (let i = 0; i < SQ - 2; i++) {
      //LineIndex.push(j * SQ + i);
      //LineIndex.push(j * SQ + i + 1);
      //LineIndex.push(j * SQ + i + 2);
    //}
  //}
  //for (let j = 0; j < SQ; j++) {
    //for (let i = 0; i < SQ - 2; i++) {
      //LineIndex.push(i * SQ + j);
      //LineIndex.push(i * SQ + j + SQ);
      //LineIndex.push(i * SQ + j + SQ * 2);
    //}
  //}
  //for (let i = 0; i < SQ - 2; i++) {
    //LineIndex.push(i * SQ + i);
    //LineIndex.push(i * SQ + SQ + i + 1);
    //LineIndex.push(i * SQ + 2 * SQ + i + 2);
  //}
  //for(let i=0; l<SQ-2;i++){

  //}
} else {
  for (let i = 0; i < SQ ** 2; i++) {
    LineIndex.push(i)
  }
  for (let i = 0; i < SQ; i++) {
    for (let j = 0; j < SQ; j++) {
      LineIndex.push(i + SQ * j)
    }
  }
  for (let i = 0; i < SQ; i++) {
    LineIndex.push(SQ * i + i)
  }
  for (let i = 0; i < SQ; i++) {
    LineIndex.push(SQ - 1 + SQ * i - i)
  }
}


function createSquares() {
  for (let i = 0; i < SQ ** 2; i++) {
    const square = squareTemplate.cloneNode(true);
    square.removeAttribute("id");
    square.setAttribute("square-index", i);
    stage.setAttribute("data-SQ", SQ);
    stage.appendChild(square);

    const stone = square.querySelector('.stone');
    stone.setAttribute("data-state", 0);
    stone.setAttribute("data-index", i);
    stateList.push(0)

    square.addEventListener('click', () => { playerClick(i) })
  }
}


function start(e) {
  if (e.target.id === "first") {
    createSquares();
    //turn_action(huPlayer);
  } else {
    createSquares();
    //turn_action(aiPlayer);
    bestSpot();
  }
  btn.removeEventListener("click", start);

}

function bestSpot() {
  const putable = emptyIndexies(stateList)
  let will_lose = willLose(stateList, turn_all);
  let will_win = willWin(stateList, turn_all);
  if(will_win!=='false') {
    put_index = will_win;
  }else if (will_lose!=='false') {
    put_index = will_lose;
  } else {
    put_index = tryAI();
  }

  //put_index = putable[Math.floor(Math.random()*putable.length)]; //random
  //const put_index = tryAI();

  document.querySelector(`[data-index='${put_index}']`).setAttribute("data-state", turn_all);
  stateList[put_index] = turn_all;
  //turn_action(huPlayer);
  times = times + 1;
  if (lineChecker(stateList, turn_all, SQ)) {
    h1.textContent = "cpu win";
    end();
    return;
  } else if (checkTie(stateList)) {
    h1.textContext = "draw";
    end();
    return;
  }
  turn_all = -turn_all;
}

function willLose(board, turn) {
  var moves = possibleMoves();
  for (var i = 0; i < moves.length; i++) {
    board[moves[i]] = -turn;
    if (lineChecker(board, -turn, SQ)) {
      board[moves[i]] = 0;
      return moves[i];
    } else {
      board[moves[i]] = 0;
    }
  }
  return 'false';
}

function willWin(board, turn) {
  var moves = possibleMoves();
  for (var i = 0; i < moves.length; i++) {
    board[moves[i]] = turn;
    if (lineChecker(board, turn, SQ)) {
      board[moves[i]] = 0;
      return moves[i];
    } else {
      board[moves[i]] = 0;
    }
  }
  return 'false';
}


function end() {
  h3.textContent = "retry";
  h3.addEventListener("click", () => {
    document.location.reload();
  });
}

function emptyIndexies(board) {
  const putable_list = [];
  for (let i = 0; i < SQ ** 2; i++) {
    if (board[i] === 0) {
      putable_list.push(i)
    }
  }
  return putable_list;
}

function turn_action(player) {
  turn = -turn;
  if (player === huPlayer) {
    h3.textContent = "your turn";
  } else {
    h3.textContent = "cou's turn";
  }
}

function playerClick(index) {
  if (stateList[index] !== 0) {
    alert("You can't put here");
    return;
  }

  if (stateList[index] === 0) {
    document.querySelector(`[data-index='${index}']`).setAttribute("data-state", turn_all);
    stateList[index] = turn_all;
    times = times + 1;
  }
  if (lineChecker(stateList, turn_all, SQ)) {
    h1.textContent = "you win";
    end();
    return;
  } else if (checkTie(stateList)) {
    h1.textContent = "draw";
    end();
    return;
  } else {
    turn_all = -turn_all;
    bestSpot();
  }
}


function checkTie(board) {
  if (emptyIndexies(board).length === 0) {
    return true;
  } else {
    return false;
  }
}



function lineChecker(board, turn, sq) {
  var work = 0;
  for (var i = 0; i < LineIndex.length; i++) {
    work += board[LineIndex[i]];
    if (i % 3 === 3 - 1) {
      if (work * turn > 3 - 1) return true;
      work = 0;
    }
  }
  return false;
};



function possibleMoves(turn) {
  var arr = [];
  for (var i = 0; i < SQ ** 2; i++) {
    if (stateList[i] === 0) arr.push(i);
  }
  return arr;
};

function evaluate(line, max) {
  if (line) {
    if (max) return 10;
    else return -10;
  }
  return 0;
};



function minimax(board, depth, turn, maxTurn, alpha, beta) {
  minimax_n = minimax_n + 1;
  var line = lineChecker(board, turn, SQ);
  if (line || depth === 0) {
    return evaluate(line, turn === maxTurn);
  }
  turn = -turn;
  var moves = possibleMoves();
  var score, max, min, i = 0;
  if (turn === maxTurn) {
    max = MIN_VALUE;
    for (; i < moves.length; i++) {
      board[moves[i]] = turn;
      score = minimax(board, depth - 1, turn, maxTurn, alpha, beta) + depth;
      if (score > beta) {
        board[moves[i]] = 0;
        return score;
      }
      board[moves[i]] = 0;
      if (score > max) {
        max = score;
        alpha = Math.max(max, alpha)
      }
    }
    return max;
  } else {
    min = MAX_VALUE;
    for (; i < moves.length; i++) {
      board[moves[i]] = turn;
      score = minimax(board, depth - 1, turn, maxTurn, alpha, beta) + depth;
      if (score < alpha) {
        board[moves[i]] = 0;
        return score;
      }
      board[moves[i]] = 0;
      if (score < min) {
        min = score;
        beta = Math.min(min, beta);
      }
    }
    return min;
  }
}

function tryAI() {
  minimax_n = 0;
  var best = null;
  var board = stateList;
  var turn_in = turn_all;
  var moves = possibleMoves();
  var score;
  let max_depth;
  if (SQ === 3) {
    max_depth = 9 //moves.length;
  } else {
    max_depth = Math.min(moves.length - 1, 7)
  }
  var alpha = Number.NEGATIVE_INFINITY;
  var beta = Number.POSITIVE_INFINITY;
  for (var i = 0; i < moves.length; i++) {
    board[moves[i]] = turn_in;
    score = minimax(board, max_depth, turn_in, turn_in, alpha, beta); //moves.length-1,
    board[moves[i]] = 0;
    //console.log('move:',move[i],'score:',score)
    if (!best || best.score <= score) best = { move: moves[i], score: score };
  }
  //alert(minimax_n)
  return best.move;
}
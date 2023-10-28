let FPS = 300;
const BoxSize = 60;
const CanvasWidth = 600;
const CanvasHeigth = 1200;
const WidthNum = CanvasWidth / BoxSize;
const
  HeigthNum = CanvasHeigth / BoxSize;
const BoxSizenext = 50;
const CanvasWidthnext = 200;
const CanvasHeigthnext = 600;
const WidthNumnext = CanvasWidthnext / BoxSizenext;
const
  HeigthNumnext = CanvasHeigthnext / BoxSizenext;

const Color = ['lightblue', 'yellow', 'green', 'red', 'darkgreen', 'orange', 'purple'];
let COLOR = 0;
const Blockshape = [
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]], //i
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]], //o
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 1, 0]], //z
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1]], //s
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 1]], //j
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 1]], //l
[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 1]] //t
]

const BlockBottom = [
  calbottom(Blockshape[0]),
  calbottom(Blockshape[1]),
  calbottom(Blockshape[2]),
  calbottom(Blockshape[3]),
  calbottom(Blockshape[4]),
  calbottom(Blockshape[5]),
  calbottom(Blockshape[6]),
  ]
  
const Blockedge = [
  caledge(Blockshape[0]),
  caledge(Blockshape[1]),
  caledge(Blockshape[2]),
  caledge(Blockshape[3]),
  caledge(Blockshape[4]),
  caledge(Blockshape[5]),
  caledge(Blockshape[6]),
  ]

let time = 0;
let history = [0, 1, 2, 3];

let GameOver = false;

let Move = 0;
let Routate = false;

let score = 0;
const Onescore = 10;
scorep = document.getElementById('score');

let blockState = [];
for (let h = 0; h < HeigthNum; h++) {
  blockState[h] = [];
  for (let i = 0; i < WidthNum; i++) {
    blockState[h][i] = 0;
  }
}


let canvasId = document.getElementById('canvasId');
let ctx = canvasId.getContext('2d');
canvasId.width = CanvasWidth;
canvasId.height = CanvasHeigth;
canvasId.style.border = '1px solid black'

let canvasId2 = document.getElementById('canvasId2');
let ctx2 = canvasId2.getContext('2d');
canvasId2.width = CanvasWidthnext;
canvasId2.height = CanvasHeigthnext;
canvasId2.style.border = '1px solid black'



function onedrop(shape) {
  let nextblock = (COLOR + 3 + 1) % Color.length;
  history.push(nextblock);
  ctx2.beginPath();
  ctx2.clearRect(0, 0, CanvasWidthnext, CanvasHeigthnext);
  ctx2.closePath();
  ctx2.beginPath();
  ctx2.fillStyle = '#000';
  ctx2.fillText("next", 0, 10);
  ctx2.closePath();
  scorep.textContent = 'SCORE:' + score;
  for (let i = 0; i < 3; i++) {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (Blockshape[history[time + 1 + i]][y][x] === 1) {
          ctx2.beginPath();
          ctx2.rect(x * BoxSizenext, y * BoxSizenext + i * BoxSizenext * 4, BoxSizenext, BoxSizenext);
          ctx2.fillStyle = Color[history[time + 1 + i]];
          ctx2.fill();
          ctx2.closePath();
        }
      }
    }


  }

  let blockshape = Blockshape[shape];
  let blockbottom = BlockBottom[shape];
  let blockedge = Blockedge[shape];
  let nowBlockY = 0;
  let nowBlockX = WidthNum / 2 - 2;

  const timeId = setInterval(() => {
    if (nowBlockX+Move+blockedge[0] <0 || nowBlockX+blockedge[1]+1+Move>WidthNum){
      Move = 0;
    }
    if (Routate && canroutate(nowBlockX + Move, nowBlockY + 1, routate(blockshape))) {
      preblockshape = blockshape;
      blockshape = routate(blockshape);
      blockbottom = calbottom(blockshape);
      blockedge = caledge(blockshape);
    }
    nowBlockY = nowBlockY + 1;
    let color = COLOR;
    let bottom = 0;
    for (let i = 0; i < 4; i++) {
      if (blockbottom[i] > bottom) {
        bottom = blockbottom[i];
      }
    }
    nowBlockX = nowBlockX + Move;


    let is_routate = canroutate(nowBlockX, nowBlockY, blockshape);

    if (Routate && is_routate) {
      for (let sbh = 3; sbh > -1; sbh--) {
        for (let sbw = 0; sbw < 4; sbw++) {
          if (preblockshape[sbh][sbw] === 1) {
            let whereX = nowBlockX + sbw;
            let whereY = nowBlockY + sbh;
            let where = [whereX - Move, whereY - 1];
            erase(where);
          }
        }
      }
    }
    let new_block_where = [];
    if (nowBlockY + bottom <= HeigthNum && candrop(nowBlockX, nowBlockY, shape, blockbottom)) {
      for (let sbh = 3; sbh > -1; sbh--) {
        for (let sbw = 0; sbw < 4; sbw++) {
          if (blockshape[sbh][sbw] === 1) {
            let whereX = nowBlockX + sbw;
            let whereY = nowBlockY + sbh;
            let where = [whereX, whereY];
            let prewhere = [whereX - Move, whereY - 1];
            erase(prewhere);
            show(where, color);
            new_block_where.push(where);
          }
        }
      }
      Move = 0;
      Routate = false;
    } else {
      time = time + 1;
      clearInterval(timeId);
      COLOR = (COLOR + 1) % Color.length;
      let ntetris = 0;
      for (let y = 0; y < HeigthNum; y++) {
        let empty = true;
        for (let x = 0; x < WidthNum; x++) {
          if (blockState[y][x] === 0) {
            empty = false;
          }
        }
        if (empty) {
          ntetris = ntetris + 1;
          fall(y);
        }
      }
      if (ntetris > 0) {
        FPS = FPS - 20;
        alert('tetris' + ntetris);
        score = score + Onescore * ntetris * ntetris;
      }
      if (!GameOver) {
        onedrop(history[time]) //nextblock);
      }
    }
  }, FPS);
}

function show(where, color) {
  let x = where[0];
  let y = where[1];
  blockState[y][x] = color + 1;
  ctx.beginPath();
  ctx.rect(x * BoxSize, y * BoxSize, BoxSize, BoxSize);
  ctx.fillStyle = Color[color];
  ctx.fill();
  ctx.closePath();
}

function erase(where) {
  let x = where[0];
  let y = where[1];
  blockState[y][x] = 0;
  ctx.beginPath();
  ctx.clearRect(x * BoxSize, y * BoxSize, BoxSize, BoxSize);
  ctx.closePath();
}

function candrop(x, y, shape, blockbottom) {
  for (let i = 0; i < 4; i++) {
    if (blockbottom[i] === 0) {
      continue;
    }

    if (i > 0 && blockbottom[i - 1] > blockbottom[i] && Move === -1) {
      continue;
    }
    if (i < 3 && blockbottom[i + 1] > blockbottom[i] && Move === 1) {
      continue;
    }

    if (blockState[y + blockbottom[i] - 1][x + i] !== 0) {
      return false;
    }
  }
  return true;
}

function canroutate(x, y, shape) {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (blockState[y][x] !== 0) {
        return false;
      }
    }
  }
  return true;
}

function left() {
  Move = -1;
}

function right() {
  Move = 1;
}

function routatebtn() {
  Routate = true;
}

function fall(stair) {
  for (let i = 0; i < WidthNum; i++) {
    //blockState[stair][i] = 0;
    erase([i, stair]);
  }
  for (let i = 0; i < stair; i++) {
    for (let j = 0; j < WidthNum; j++) {
      erase([j, stair - i])
      if (blockState[stair - i - 1][j] !== 0) {
        show([j, stair - i], blockState[stair - i - 1][j])
      }
    }
  }
}

function routate(blockshape) {
  let routated_blockshape = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  for (let i = 0; i < 4; i++) {
    if (blockshape[0][i] === 1) {
      routated_blockshape[i][3] = 1;
    }
  }
  for (let i = 0; i < 4; i++) {
    if (blockshape[3][i] === 1) {
      routated_blockshape[i][0] = 1;
    }
  }
  for (let i = 0; i < 4; i++) {
    if (blockshape[i][0] === 1) {
      routated_blockshape[0][3 - i] = 1;
    }
  }
  for (let i = 0; i < 4; i++) {
    if (blockshape[i][3] === 1) {
      routated_blockshape[3][3 - i] = 1;
    }
  }
  for (let i = 0; i < 2; i++) {
    if (blockshape[1][i + 1] === 1) {
      routated_blockshape[i + 1][2] = 1;
    }
  }
  for (let i = 0; i < 2; i++) {
    if (blockshape[2][i + 1] === 1) {
      routated_blockshape[i + 1][1] = 1;
    }
  }
  for (let i = 0; i < 2; i++) {
    if (blockshape[i + 1][2] === 1) {
      routated_blockshape[2][2 - i] = 1;
    }
  }
  for (let i = 0; i < 2; i++) {
    if (blockshape[i + 1][1] === 1) {
      routated_blockshape[1][2 - i] = 1;
    }
  }
  return routated_blockshape;
}

function calbottom(blockshape) {
  let bottom = [0, 0, 0, 0];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (blockshape[y][x] === 1) {
        bottom[x] = y + 1;
      }
    }
  }
  return bottom
}

function caledge(blockshape) {
  let edge = [0, 0];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (blockshape[y][x] === 1) {
        edge[1] = x;
        break;
      }
    }
  }
  for (let x = 3; x >-1; x--) {
      for (let y = 0; y < 4; y++) {
        if (blockshape[y][x] === 1) {
          edge[0] = x;
          break;
        }
      }
    }
  return edge
}

onedrop(0);
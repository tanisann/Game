    var unit = 100, canvasList, info = {}, colorList;
    
    function init() {
      info.seconds = 0;
      info.t = 0;
      canvasList = [];
      colorList = [];
      canvasList.push(document.getElementById('waveCanvas'));
      colorList.push(['#2C85F7', '#ff0', '#2CF751', '#00f', '#f0f']);
    
      for (var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth;
        canvas.height = 200;
        canvas.contextCache = canvas.getContext('2d');
      }
      update();
    }
    
    function update() {
      for (var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        draw(canvas, colorList[canvasIndex]);
      }
      info.seconds = info.seconds + 0.14;
      info.t = info.seconds * Math.PI;
      setTimeout(update, 150);
    }
    
    function draw(canvas, color) {
      var context = canvas.contextCache;
      context.clearRect(0, 0,
        canvas.width, canvas.height);
      drawWabe(canvas, color[0], 0.8, 3, 0);
      //drawWabe(canvas, color[1], 0.5, 4, 3);
      drawWabe(canvas, color[2], 0.3, 1, 5);
      //drawWabe(canvas, color[3], 0.2, 3, 100);
      //drawWabe(canvas, color[4], 0.5, 1, 250);
    }
    
    function drawWabe(canvas, color, alpha, zoom, delay) {
      var context = canvas.contextCache;
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.globalAlpha = alpha;
      context.beginPath();
      drawSince(canvas, info.t / 0.5, zoom, delay);
      context.stroke();
    }
    
    function drawSince(canvas, t, zoom, delay) {
      var xAxis = Math.floor(canvas.height / 2);
      var yAxis = 0;
      var context = canvas.contextCache;
      var x = t;
      var y = Math.sin(x) / zoom;
      context.moveTo(yAxis, unit * y + xAxis);
    
      for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t + (-yAxis + i) / unit / zoom;
        y = Math.sin(x - delay) / 3;
        context.lineTo(i, unit * y + xAxis);
      }
    
    }
    init();
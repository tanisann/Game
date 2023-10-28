let sound_int =Math.floor(Math.random()*200)*10;
while(sound_int<20){
    sound_int =Math.floor(Math.random()*2000)*10;
}

function play(){
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  let current_time = ctx.currentTime;
  const freqAndTime = [[sound_int, 2]];
  for (const [freq, time] of freqAndTime){
    oscillator.frequency.setValueAtTime(freq, current_time);
    current_time += time;
    }
  oscillator.connect(ctx.destination);
  oscillator.start(ctx.currentTime);
  oscillator.stop(current_time);
}


function check(){
  let answer = document.getElementById("answer").value;
  alert("正解は"+sound_int+"Hz");
  point = 10-Math.abs(answer-sound_int) /20;
  if (point<0){
    point = 0;
  }
  alert(point+"点");
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;




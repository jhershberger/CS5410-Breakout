/**
* @Author: Justin Hershberger
* @Date:   25-02-2017
* @Filename: high_scores.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 12-03-2017
*/

let HighScores = (function(){
  let that = {};
  let inputDispatch = {};
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  let bg = new Image();
  let bg_ready = false;
  let previousTime = performance.now();
  let elapsedTime = 0;
  let x = 500;

  bg.onload = () => {
    bg_ready = true;
  };

  bg.src = 'Images/brick.png';

  function gameLoop(time) {
    elapsedTime = time - previousTime;
    previousTime = time;

    requestAnimationFrame(gameLoop);
  }

  function drawHighScores() {
      if(bg_ready) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(bg,0,0, canvas.width, canvas.height);

        context.textAlign = 'center';
        context.fillStyle = '#b3b3b3';

        context.shadowColor = 'black';
        context.shadowBlur = 7;
        context.lineWidth = 5;

        context.font = "80px Calibri"

        context.strokeText('High Scores:', x, 100);
        context.fillText("High Scores:", x,  100);

        context.font = '30px Calibri';

        context.strokeText('1) Your name here', x, 200);
        context.fillText("1) Your name here", x,  200);

        context.strokeText('2) Your name here', x, 275);
        context.fillText("2) Your name here", x,  275);

        context.strokeText('3) Your name here', x, 350);
        context.fillText("3) Your name here", x,  350);

        context.strokeText('4) Your name here', x, 425);
        context.fillText("4) Your name here", x,  425);

        context.strokeText('5) Your name here', x, 500);
        context.fillText("5) Your name here", x,  500);

        context.font = '20px Calibri';

        context.strokeText('Press ESC To Exit High Scores', x, 580);
        context.fillText("Press ESC To Exit High Scores", x,  580);

      }

  }

  //this function detects any key presses
  function keyDown(e) {
    if (inputDispatch.hasOwnProperty(e.keyCode)) {
      inputDispatch[e.keyCode](elapsedTime);
    }
  }

  that.initialize = function() {
    window.addEventListener('keydown', keyDown, true);
    $('#menuSprite').addClass('hidden');
    //on space
    inputDispatch[27] = Menu.drawMenu;
    inputDispatch[32] = Menu.drawMenu;
    drawHighScores();
  };

  return that;
}());

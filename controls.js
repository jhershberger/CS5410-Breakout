/**
* @Author: Justin Hershberger
* @Date:   25-02-2017
* @Filename: controls.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 13-03-2017
*/


//
let Controls = (function(){
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

  function drawControls() {
      if(bg_ready) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(bg,0,0, canvas.width, canvas.height);

        context.textAlign = 'center';
        context.fillStyle = '#b3b3b3';

        context.shadowColor = 'black';
        context.shadowBlur = 7;
        context.lineWidth = 5;

        context.font = "80px Calibri"

        context.strokeText('In Game Controls:', x, 100);
        context.fillText("In Game Controls:", x,  100);

        context.font = '30px Calibri';

        context.strokeText('Move Paddle Left: Left Arrow', x, 200);
        context.fillText("Move Paddle Left: Left Arrow", x,  200);

        context.strokeText('Move Paddle Right: Right Arrow', x, 300);
        context.fillText("Move Paddle Right: Right Arrow", x,  300);

        context.strokeText('Open Menu: Esc', x, 400);
        context.fillText("Open Menu: Esc", x,  400);


        context.font = '20px Calibri';

        context.strokeText('Press ESC To Exit Controls', x, 550);
        context.fillText("Press ESC To Exit Controls", x,  550);

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
    drawControls();
  };

  return that;
}());

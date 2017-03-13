/**
* @Author: Justin Hershberger
* @Date:   22-02-2017
* @Filename: main.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 06-03-2017
*/

//the main loop should only handle the actual gameplay itself
let Game = (function() {
  let that = {};
  let inputDispatch = {};
  let previousTime = performance.now();
  let elapsedTime = 0;
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  that.countdown_times = 3;
  that.countdown= 1000;
  that.start_countdown = false;
  let draw_ball_flag = false;
  let keyLeft = true;
  let keyRight = true;
  that.pause = false;

  function update(elapsedTime) {
    if(that.start_countdown) {
      that.countdown-= elapsedTime;
    }
    if(that.countdown_times < 0) {
      that.start_countdown = false;
    }
  }

  function render() {
    //start the that.countdownif we need to
    if (that.countdown <= 0 && that.countdown_times >= 0) {
      that.pause = true;
      Graphics.drawCountdown(that.countdown_times);
      $('#countCanvas').removeClass('hidden');
      that.countdown_times -= 1;
      that.countdown= 1000;
    } else if (that.countdown_times == -1) {
      $('#countCanvas').addClass('hidden');
      draw_ball_flag = true;
      that.countdown_times = -2;
      that.pause = false;
    }

    if (draw_ball_flag && !that.pause) {
      $('#blockCanvas').removeClass('hidden');
      Graphics.gameBall.drawBall();
    }
  }

  function gameLoop(time) {
    elapsedTime = time - previousTime;
    previousTime = time;
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
  }

  function keyDown(e) {
    if (inputDispatch.hasOwnProperty(e.keyCode)) {
        inputDispatch[e.keyCode](elapsedTime);
    }
  }

  that.initialize = function() {
    window.addEventListener('keydown', keyDown, true);

    //on esc we want to draw the menu and quit drawing the rest of the game.
    let esc = function() {
      Menu.drawMenu();
      draw_ball_flag = false;
      $('#blockCanvas').addClass('hidden');
      $('#gameCanvas').addClass('hidden');
    };

    inputDispatch[27] = esc;
    inputDispatch[32] = esc;

    //on enter
    inputDispatch[13] = Menu.selectOption;

    //on down arrow
    inputDispatch[40] = Menu.dn_hlt;

    //on up arrow
    inputDispatch[38] = Menu.up_hlt;

    // inputDispatch[37] = Graphics.paddle.moveLeft;
    // inputDispatch[39] = Graphics.paddle.moveRight;


    Blocks.initialize();
    requestAnimationFrame(gameLoop);
  }

  return that;
}());

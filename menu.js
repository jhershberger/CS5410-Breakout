/**
* @Author: Justin Hershberger
* @Date:   24-02-2017
* @Filename: menu.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 20-03-2017
*/

//the menu loop will handle only the menu sequence
let Menu = (function() {
  let that = {};
  let inputDispatch = {};
  let menu_count = 0;
  let bg = new Image();
  let arrow = new Image();
  let bg_ready = false;
  let arrow_ready = false;
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  let previousTime = performance.now();
  let elapsedTime = 0;
  let x = 500;
  let y = 300;
  let countdown_times = 3;
  let countdown = 1000;
  let start_countdown = false;
  let num_play = 0;


  bg.onload = () => {
    bg_ready = true;
    // console.log('hello');
  };

  arrow.onload = () => {
    arrow_ready = true;
  };

  bg.src = 'Images/brick.png';
  arrow.src = 'Images/arrow.png';

  //This is the title page the user will see on load
  that.drawTitle = function() {
    if (bg_ready) {

      context.clearRect(0,0,canvas.width, canvas.height);

      context.drawImage(bg, 0,0, canvas.width, canvas.height);

      context.textAlign = 'center';
      context.fillStyle = '#b3b3b3';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = "80px Calibri"

      context.strokeText('BREAKOUT', x, 200);
      context.fillText("BREAKOUT", x,  200);

      context.font = '30px Calibri';

      context.strokeText('A game by: Justin Hershberger', x, 300);
      context.fillText("A game by: Justin Hershberger", x, 300);

      context.strokeText("Press SPACE to begin", x, 550);
      context.fillText("Press SPACE to begin", x,550);
    }
  }

  //The menu will be interactive and will offer multiple options on where to navigate
  that.drawMenu = function(){
    //draw the game's menu

    if(bg_ready) {
      menu_count = 0;
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(bg, 0,0, canvas.width, canvas.height);

      context.fillStyle = '#b3b3b3';
      context.textAlign = 'center';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = '60px Calibri';
      context.strokeText('BREAKOUT', x, 100);
      context.fillText('BREAKOUT', x, 100);

      context.font = '30px Calibri';

      context.strokeText('Play', x, 200);
      context.fillText('Play', x, 200);

      context.strokeText('High Scores', x, 300);
      context.fillText('High Scores', x, 300);

      context.strokeText('Controls', x, 400);
      context.fillText('Controls', x, 400);

      context.font = '20px Calibri';

      context.strokeText('Press ENTER to select an option', x, 580);
      context.fillText('Press ENTER to select an option', x, 580);

      //draw the menu arrow at the top on initialization
      canvas = $('#menuSprite')[0];
      context = canvas.getContext('2d');

      $('#menuSprite').removeClass('hidden');
      context.drawImage(arrow, x-80, 140, 50, 100);

      //switch back to the game's canvas
      canvas = $('#menuCanvas')[0];
      context = canvas.getContext('2d');


    } else {
      alert('brick.png not loaded properly');
    }


  }

  //this function displays which option the user is currently on
  function highlightOption(x,y) {
    canvas = $('#menuSprite')[0];
    context = canvas.getContext('2d');
    switch (y) {
      case 200:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(arrow, x-80, 140, 50, 100);
        break;
      case 300:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(arrow, x-120, 240, 50, 100);
        break;
      case 400:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(arrow, x-100, 340, 50, 100);
        break;
      case 500:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(arrow, x-80, 440, 50, 100);
        break;

    }
  }

  that.selectOption = function() {
    switch (menu_count) {
      case 0: //play
        menu_count = 0;
        num_play += 1;

        context.clearRect(0,0,canvas.width, canvas.height);

        $('#menuSprite').addClass('hidden');
        $('#gameCanvas').removeClass('hidden');
        $('#blockCanvas').removeClass('hidden');

        if (num_play == 1) {
          context.drawImage(bg, 0, 0, canvas.width, canvas.height);
          Graphics.paddle.drawPaddle();
          // Graphics.gameBall().drawBall();

          Game.start_countdown = true;
          Game.countdown_times = 3;
          Game.countdown= 0;
        } else {
          Game.start_countdown = true;
          Game.countdown_times = 3;
          Game.countdown= 0;
          Graphics.drawCountdown(Game.countdown_times);
          $('#countCanvas').removeClass('hidden');
        }
        break;
      case 1: //high_scores
        menu_count = 0;
        context.clearRect(0,0,canvas.width, canvas.height);
        HighScores.initialize();
        break;
      case 2: //controls
        menu_count = 0;
        context.clearRect(0,0,canvas.width, canvas.height);
        Controls.initialize();
        break;
    }
  };

  //this is the down arrow highlight function, it will increment the options as
  //the user goes down the list
  that.dn_hlt = function() {
    //toggle the options arrow
    if (menu_count >= 2) {
      menu_count = 0;
    } else {
      menu_count += 1;
    }

    switch (menu_count) {
      case 0:
        highlightOption(x,200)
        break;
      case 1:
        highlightOption(x,300)
        break;
      case 2:
        highlightOption(x,400)
        break;
    }


  };


  //This is the up highlight function, it will decrement as the user goes up
  that.up_hlt = function() {
    if (menu_count <= 0) {
      menu_count = 2;
    } else {
      menu_count -= 1;
    }

    switch (menu_count) {
      case 0:
        highlightOption(x,200)
        break;
      case 1:
        highlightOption(x,300)
        break;
      case 2:
        highlightOption(x,400)
        break;
    }
  };

  return that;
}());

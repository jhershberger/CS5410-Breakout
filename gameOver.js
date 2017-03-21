/**
* @Author: Justin Hershberger
* @Date:   06-03-2017
* @Filename: gameOver.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 19-03-2017
*/



let GameOver = (function () {
  let that = {};
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  let bg = new Image();
  let bg_ready = false;
  let x = 500;
  let abc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  let abc_index = 0;

  bg.onload = () => {
    bg_ready = true;
  };

  bg.src = 'Images/brick.png';

  that.drawLoss = function(score) {
    if(bg_ready) {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(bg,0,0, canvas.width, canvas.height);

      context.textAlign = 'center';
      context.fillStyle = '#b3b3b3';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = "80px Calibri"

      context.strokeText('Game Over!', x, 200);
      context.fillText("Game Over!", x,  200);

      context.font = '50px Calibri';

      context.strokeText('Your Score: ' + score, x, 300);
      context.fillText("Your Score: " + score, x,  300);

      context.strokeText('Enter Your Initials: ', x, 400);
      context.fillText("Enter Your Initials: ", x,  400);

      $('.initials').removeClass('hidden');


      context.font = '20px Calibri';

      context.strokeText('Press ESC To Exit', x, 580);
      context.fillText("Press ESC To Exit", x,  580);

    }
  };

  that.drawWin = function(score) {
    if(bg_ready) {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(bg,0,0, canvas.width, canvas.height);

      context.textAlign = 'center';
      context.fillStyle = '#b3b3b3';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = "80px Calibri"

      context.strokeText('You Won!', x, 200);
      context.fillText("You Won!", x,  200);

      context.font = '30px Calibri';

      context.strokeText('Your Score: ' + score, x, 300);
      context.fillText("Your Score: " + score, x,  300);

      context.strokeText('Enter Your Initials: ', x, 400);
      context.fillText("Enter Your Initials: ", x,  400);

      context.strokeText('Enter Your Initials: ', x, 400);
      context.fillText("Enter Your Initials: ", x,  400);

      $('.initials').removeClass('hidden');


      context.font = '20px Calibri';

      context.strokeText('Press ESC To Exit', x, 580);
      context.fillText("Press ESC To Exit", x,  580);

    }
  };


  return that;

}());

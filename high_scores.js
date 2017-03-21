/**
* @Author: Justin Hershberger
* @Date:   25-02-2017
* @Filename: high_scores.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 19-03-2017
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

        let localStorageArray = [];

        for (let i=0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          localStorageArray.push(key);
          // localStorage.removeItem(localStorage[key]);

        }

        //sort the high scores in descending order
        localStorageArray.sort(function(a, b){return b-a});


        if(localStorageArray.length > 5) {
          localStorage.removeItem(localStorageArray[5]);

          for (let i=0; i < 5; i++) {
            // let key = localStorage.key(i);
            context.strokeText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
            context.fillText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
          }

        } else {
          for (let i=0; i < localStorageArray.length; i++) {
            // let key = localStorageArray.key(i);
            context.strokeText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
            context.fillText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
          }
        }

        context.font = '20px Calibri';

        context.strokeText('Press ESC To Exit High Scores', x - 200, 580);
        context.fillText("Press ESC To Exit High Scores", x - 200,  580);

        context.strokeText('Press ALT + R To Reset High Scores', x + 200, 580);
        context.fillText("Press ALT + R To Reset High Scores", x + 200,  580);

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

    let clearScores = function (e) {
      if (e.keyCode == 82 && e.altKey) {

        localStorage.clear();
        drawHighScores();
      }
    };

    //if the user enters 'alt + r', reset the high scores
    document.onkeydown = clearScores;

    drawHighScores();
  };

  return that;
}());

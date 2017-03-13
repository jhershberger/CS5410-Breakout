/**
* @Author: Justin Hershberger
* @Date:   22-02-2017
* @Filename: render.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 12-03-2017
*/

//all the rendering will occur in this file
let Graphics = (function(){
  let that = {};
  let canvas = $('#gameCanvas')[0];
  let context = canvas.getContext('2d');
  let bg = new Image();
  let bg_ready = false;
  let x = 300;
  that.total_lives = 3;
  that.score = 0;

  bg.onload = () => {
    bg_ready = true;
  };

  bg.src = 'Images/brick.png';

  //this is the gameBall sprite
  that.gameBall = (function() {
    let that = {};
    that.pos = {x: 505, y: 500};
    let speed = 0.50;
    let speed_increment = 0.25;
    let max_speed = 1.0;
    let dx = 2;
    let dy = 4;
    let radius = 10;
    let pad_x = 0;
    let pad_y = 0;
    let blocks = Blocks.blocks();
    let magnitude = -1;
    let green_count = 0;
    let total_blocks = 0;
    let life_blocks = 0;

    //this is the game sprite and it will be drawn to the canvas
    that.createCircle = function(x, y) {
      context.beginPath();
      context.fillStyle = 'white';
      context.arc(x,y,radius,0,2*Math.PI);
      context.closePath();
      context.fill();

    };

    function detectDeath() {
      if (dy > 0 && that.pos.y >= 580 ) {
        return true;

      } else {
        return false;
      }


    }

    function paddleIntersect() {
      if (dy > 0 && ((that.pos.x + dx) <= pad_x + Graphics.paddle.width + 10 && (that.pos.x + dx) >= pad_x - 15) && (that.pos.y + dy >= 510 && that.pos.y + dy <= 515 ) ) {
        return true;
      } else {
        return false;
      }
    }

    function blockIntersect() {
      for (let i=0; i < 8; i++) {
        for (let j=0; j < 14; j++) {
          if (that.pos.x + dx <= blocks[i][j].x + 70 && that.pos.x + dx >= blocks[i][j].x - 10 && that.pos.y + dy >= blocks[i][j].y - 5  && that.pos.y + dy <= blocks[i][j].y + 32 ) {
            blocks[i][j].x = -1;
            blocks[i][j].y = -1;
            total_blocks += 1;
            life_blocks += 1;

            Graphics.score += blocks[i][j].points;

            //check if we hit a green block for the first time
            if (blocks[i][j].color == 'Green') {
              green_count += 1;

              if (green_count == 1) {
                Graphics.paddle.width = Graphics.paddle.width / 2;
              }
            }

            //increment the total blocks counter and see if we hit the last one
            if (total_blocks >= 113) {
              GameOver.drawWin(Graphics.score);
              Blocks.initialize();
              Graphics.blocks.drawBlocks();
              Graphics.score = 0;
              Graphics.total_lives = 3;
            }

            //check for any speed updates
            if (life_blocks == 4) {
              speed += speed_increment;
            } else if (life_blocks == 12 ) {
              speed += speed_increment;
            } else if (life_blocks == 36) {
              speed += speed_increment;
            } else if (life_blocks == 62) {
              speed += speed_increment;
            }

            //change the color so the block is no longer rendered.
            blocks[i][j].color = 'black';

            return true;
          }
        }
      }
      return false;
    }



    //this will update the sprite's positioning
    that.drawBall = function() {
      // context.clearRect(0,0, canvas.width, canvas.height);

      //every time the ball is drawn we draw the paddle
      Graphics.paddle.drawPaddle();
      pad_x = Graphics.paddle.center.x;
      pad_y = Graphics.paddle.center.y;

      // console.log('pad: ', pad_x, pad_y);
      // console.log('ball: ', that.pos.x, that.pos.y);

      Graphics.blocks.drawBlocks();

      that.createCircle(that.pos.x, that.pos.y);

      if (that.pos.x + dx > canvas.width-5 || that.pos.x + dx < 5) {
        dx = -dx;
      }

      if (that.pos.y + dy > canvas.height-5 || that.pos.y + dy < 5) {
        dy = -dy;
      }

      if (paddleIntersect()){
        dx = -(canvas.width/2 - Graphics.paddle.center.x + Graphics.paddle.width / 2) / (Graphics.paddle.width / 2);

        // dx = -(1/dx);

        dy = -dy;

        speed += speed_increment;
        speed = Math.min(speed, max_speed);
      }

      if (blockIntersect()) {
        Graphics.blocks.drawBlocks();
        // dx = -(1/dx);
        dy = -dy;
      }

      if (detectDeath()) {
        Graphics.total_lives -= 1;
        life_blocks = 0;
        green_count = 0;
        that.pos = {x: Graphics.paddle.center.x + (Graphics.paddle.width / 2), y: Graphics.paddle.center.y};
        Graphics.paddle.width = 100;

        dx = 2;
        dy = 4;

        Game.start_countdown = true;
        Game.countdown_times = 3;
        Game.countdown= 0;
        that.drawBall();
        Graphics.drawCountdown(Game.countdown_times);

        if (Graphics.total_lives <= 0) {
          Game.start_countdown = false;
          Game.countdown_times = -2;
          Game.countdown= 0;
          $('#gameCanvas').addClass('hidden');
          $('#blockCanvas').addClass('hidden');
          GameOver.drawLoss(Graphics.score);
          Blocks.initialize();
          Graphics.blocks.drawBlocks();
          Graphics.score = 0;
          Graphics.total_lives = 3;
        }
        // Graphics.paddle.drawPaddle();
      }

      that.pos.x += dx * speed;
      that.pos.y += dy * speed;
    };

    that.pause = function() {
      dx = 2;
      dy = 4;

    };

    return that;
  }());

  //this is the game block sprite. There will be several of them
  that.blocks = (function() {
    let that = {};
    let blocks = Blocks.blocks();
    let block_height = 20;
    let block_width = 60;
    let cnvs = $('#blockCanvas')[0];
    let ctxt = cnvs.getContext('2d');

    let green_block = new Image();
    let yellow_block = new Image();
    let orange_block = new Image();
    let blue_block = new Image();

    let green_ready = false;
    let yellow_ready = false;
    let orange_ready = false;
    let blue_ready = false;

    //load all the images
    green_block.onload = () => {
      green_ready = true;
    };

    green_block.src = 'Images/green_block.png';

    orange_block.onload = () => {
      orange_ready = true;
    };

    orange_block.src = 'Images/orange_block.png';

    yellow_block.onload = () => {
      yellow_ready = true;
    };

    yellow_block.src = 'Images/yellow_block.png';

    blue_block.onload = () => {
      blue_ready = true;
    };

    blue_block.src = 'Images/blue_block.png';

    that.drawBlocks = function() {
      ctxt.clearRect(0, 0, cnvs.width, cnvs.height);
      for (let i=0; i < 8; i++) {
        for (let j=0; j < 14; j++) {
          // block_count = 0;
          //draw each brick in the canvas
          if( blocks[i][j].color == 'Yellow') {
            ctxt.drawImage(yellow_block, blocks[i][j].x, blocks[i][j].y, block_width, block_height);
          } else if( blocks[i][j].color == 'Blue') {
            ctxt.drawImage(blue_block, blocks[i][j].x, blocks[i][j].y, block_width, block_height);
          } else if( blocks[i][j].color == 'Green') {
            ctxt.drawImage(green_block, blocks[i][j].x, blocks[i][j].y, block_width, block_height);
          } else if( blocks[i][j].color == 'Orange') {
            ctxt.drawImage(orange_block, blocks[i][j].x, blocks[i][j].y, block_width, block_height);
          }
        }
      }


    };


    return that;

  }());

  //this is the pong paddle sprite
  that.paddle = (function() {
    let that = {};
    let image_ready = false;
    let image = new Image();
    let speed = 15;
    let friction = 0.98;
    that.width = 100;
    let height = 50;
    that.center = {x: 450, y: 500};
    let keyLeft = false;
    let keyRight = false;

    $(document).keydown(function(e) {
      if (e.keyCode == 37) {
        keyLeft = true;
      } else if (e.keyCode == 39) {
        keyRight = true;
      }

    }).keyup(function(e) {
      if (e.keyCode == 37) {
        keyLeft = false;
      } else if (e.keyCode == 39) {
        keyRight = false;
      }
    })

    image.onload = () => {
      image_ready = true;
    }

    image.src = 'Images/pong_paddle.png';

    that.drawPaddle = function() {
      if (image_ready) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(bg, 0, 0, canvas.width, canvas.height);
        if(keyLeft) {
          that.moveLeft();
        }

        if(keyRight) {
          that.moveRight();
        }
        //draw the number of lives remaining
        context.fillStyle = '#b3b3b3';
        context.textAlign = 'center';

        context.shadowColor = 'black';
        context.shadowBlur = 7;
        context.lineWidth = 5;

        context.font = '20px Calibri';
        context.strokeText('Lives:', 30, 580);
        context.fillText('Lives:', 30, 580);

        //draw the lives remaining
        for (let i=1; i <= Graphics.total_lives; i++) {

          context.drawImage(image, 55*i, 580, 50, 20);
        }

        //draw the Scores
        context.strokeText('Score: ' + Graphics.score, 900, 580);
        context.fillText('Score: ' + Graphics.score, 900, 580);

        context.drawImage(image, that.center.x, that.center.y, that.width, height);

      } else {
        alert('Paddle image not loaded properly');
      }
    };

    that.moveLeft = function(elapsedTime) {
      if (that.center.x - (speed * friction) >= 0) {

        that.center.x -= (speed * friction);
      } else {
        that.center.x = 0;
      }
      // that.drawPaddle();
    };

    that.moveRight = function(elapsedTime) {
      if (that.center.x + (speed * friction) <= 900) {

        that.center.x += (speed * friction);
      } else {
        that.center.x = 900;
      }

      // that.drawPaddle();
    };


    return that;
  }());

  that.drawCountdown = function(countdown_times) {
    // context.drawImage(bg, 0, 0, canvas.width, canvas.height);

    canvas = $('#countCanvas')[0];
    context = canvas.getContext('2d');

    if (countdown_times > 0) {
      Game.pause = true;

      context.clearRect(0,0,canvas.width, canvas.height);

      // context.drawImage(bg, 0,0, canvas.width, canvas.height);

      context.fillStyle = '#b3b3b3';
      context.textAlign = 'center';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = '300px Calibri';
      context.strokeText(countdown_times, 500, 400);
      context.fillText(countdown_times, 500, 400);
      // Game.pause = false;
    }
    canvas = $('#gameCanvas')[0];
    context = canvas.getContext('2d');

  };

  return that;


}());

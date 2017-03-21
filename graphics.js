/**
* @Author: Justin Hershberger
* @Date:   22-02-2017
* @Filename: render.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 20-03-2017
*/

//all the rendering will occur in this file
let Graphics = (function(){
  let that = {};
  let canvas = $('#gameCanvas')[0];
  let context = canvas.getContext('2d');
  let bg = new Image();
  let p_image = new Image();
  let bg_ready = false;
  let p_ready = false;
  let x = 300;
  let active_balls = [];
  let collide_audio = new Audio('Sounds/stop.flac');
  that.total_lives = 3;
  that.score = 0;

  bg.onload = () => {
    bg_ready = true;
  };

  p_image.onload = () => {
    p_ready = true;
  };

  p_image.src = 'Images/rock.png';

  bg.src = 'Images/brick.png';

  //this is the gameBall sprite
  that.gameBall = function(x,y) {
    let that = {};
    that.pos = {x: x, y: y, dx: 2, dy: 4};
    active_balls.push(that.pos);
    let speed = 0.50;
    let speed_increment = 0.25;
    let max_speed = 1.0;
    // let dx = 2;
    // let dy = 4;
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

    function detectDeath(x, y, dy) {
      if (dy > 0 && y >= 580 ) {
        // for (let j=0; j < active_balls.length; j++) {
        //   if (active_balls[j].x == x && active_balls[j].y == y) {
        //     active_balls.splice(j, 1);
        //   }
        // }
        return true;

      } else {
        return false;
      }


    }

    function paddleIntersect(x, y, dx, dy) {
      if (dy > 0 && ((x + dx) <= pad_x + Graphics.paddle.width + 10 && (x + dx) >= pad_x - 15) && (y + dy >= 510 && y + dy <= 515 ) ) {
        return true;
      } else {
        return false;
      }
    }

    function blockIntersect(x, y, dx, dy) {
      for (let i=0; i < 8; i++) {
        for (let j=0; j < 14; j++) {
          if(typeof(blocks[i][j]) != 'undefined') {

            if (x + dx <= blocks[i][j].x + 70 && x + dx >= blocks[i][j].x - 10 && y + dy >= blocks[i][j].y - 5  && y + dy <= blocks[i][j].y + 32 ) {
              total_blocks += 1;
              life_blocks += 1;

              //play the collision sound
              collide_audio.play();

              //set the blockCollision flag to true to start rendering particles
              Game.blockCollision.active = true;
              Game.blockCollision.x = blocks[i][j].x;
              Game.blockCollision.y = blocks[i][j].y;

              //update the score
              Graphics.score += blocks[i][j].points;


              //check if we hit a green block for the first time
              if (blocks[i][j].color == 'Green') {
                green_count += 1;

                if (green_count == 1) {
                  Graphics.paddle.width = Graphics.paddle.width / 2;
                }
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

              //remove the block from the data structure
              blocks[i].splice(j,1);

              //if the row is empty add 25 to the user's score
              if (blocks[i].length == 0) {
                Graphics.score += 25;
              }
              // Game.blockCollision.active = false;
              return true;
            }
          } else {
            //see if the user won
            if (Graphics.score == 508) {
              //end the game
              Game.gameOver = true;
              Game.start_countdown = false;
              Game.countdown_times = -2;
              Game.countdown= 0;
              $('#gameCanvas').addClass('hidden');
              $('#blockCanvas').addClass('hidden');
              GameOver.drawWin(Graphics.score);
              break;
            } else {
              //check if the game has been won.
              continue;
              return false;

            }
          }
        }

      }
    }

    //this will update the sprite's positioning
    that.drawBall = function() {

      //every time the ball is drawn we draw the paddle
      Graphics.paddle.drawPaddle();
      pad_x = Graphics.paddle.center.x;
      pad_y = Graphics.paddle.center.y;

      Graphics.blocks.drawBlocks();

      for (let i = 0; i < active_balls.length; i++) {

        that.createCircle(active_balls[i].x, active_balls[i].y);

        if (active_balls[i].x + active_balls[i].dx > canvas.width-5 || active_balls[i].x + active_balls[i].dx < 5) {
          active_balls[i].dx = -active_balls[i].dx;
        }

        if (active_balls[i].y + active_balls[i].dy > canvas.height-5 || active_balls[i].y + active_balls[i].dy < 5) {
          active_balls[i].dy = -active_balls[i].dy;
        }

        if (paddleIntersect(active_balls[i].x, active_balls[i].y, active_balls[i].dx, active_balls[i].dy)){

          //deflect using the technique discussed in class
          active_balls[i].dx = -(canvas.width/2 - Graphics.paddle.center.x + Graphics.paddle.width / 2) / (Graphics.paddle.width / 2);
          active_balls[i].dy = -active_balls[i].dy;

          //increment the speed
          speed += 0.25;
          speed = Math.min(speed, max_speed);
        }

        if (blockIntersect(active_balls[i].x, active_balls[i].y, active_balls[i].dx, active_balls[i].dy)) {
          //redraw the blocks
          Graphics.blocks.drawBlocks();
          active_balls[i].dy = -active_balls[i].dy;
        }

        if (detectDeath(active_balls[i].x, active_balls[i].y, active_balls[i].dy)) {

          if(active_balls.length == 0) {
            //if the user dies, update the total lives and reset to a proper game state
            Graphics.total_lives -= 1;
            that.speed = 0.5;
            life_blocks = 0;
            green_count = 0;
            that.pos = {x: Graphics.paddle.center.x + (Graphics.paddle.width / 2), y: Graphics.paddle.center.y};
            Graphics.paddle.width = 100;

            dx = 2;
            dy = -4;

            Game.start_countdown = true;
            Game.countdown_times = 3;
            Game.countdown= 0;
            that.drawBall();
            Graphics.drawCountdown(Game.countdown_times);

            //check if the user just lost
            if (Graphics.total_lives <= 0) {
              //end the game
              Game.gameOver = true;
              Game.start_countdown = false;
              Game.countdown_times = -2;
              Game.countdown= 0;
              $('#gameCanvas').addClass('hidden');
              $('#blockCanvas').addClass('hidden');
              GameOver.drawLoss(Graphics.score);
            } else {
              active_balls.push({x:Graphics.paddle.x + 20, y:500, dx: 2, dy: -4});
            }
          }

        }

        active_balls[i].x += active_balls[i].dx * speed;
        active_balls[i].y += active_balls[i].dy * speed;
      };
      }
      // that.createCircle(that.pos.x + 50, that.pos.y);


    that.pause = function() {
      dx = 2;
      dy = 4;

    };

    return that;
  };

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
          if(typeof(blocks[i][j]) != 'undefined'){

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
          } else {
            continue;
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


    //add the paddle's event listener
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
    };

    that.moveRight = function(elapsedTime) {
      if (that.center.x + (speed * friction) <= (canvas.width - that.width)) {

        that.center.x += (speed * friction);
      } else {
        that.center.x = (canvas.width - that.width);
      }

    };

    return that;
  }());

  // this is the particle effects graphic to occur each time a block is hit
  that.particle = function(p) {
    let that = {};
    p.width = 20;
    p.height = 20;
    p.fill = 'rgba(255, 255, 255, 1)';
		p.stroke = 'rgba(0, 0, 0, 0)';
    p.alive = 0;


    that.update = function(elapsedTime) {
      //update the positioning
      elapsedTime = elapsedTime / 1000;

      p.alive += elapsedTime;

      p.position.x += (elapsedTime * p.speed * p.direction.x);
      p.position.y += (elapsedTime * p.speed * p.direction.y);

      p.rotation += p.speed / 500;

      return (p.alive < p.lifetime);
    }

    that.draw = function() {

      context.save();
    	context.translate(p.position.x + p.width / 2, p.position.y + p.height / 2);
    	context.rotate(p.rotation);
    	context.translate(-(p.position.x + p.width / 2), -(p.position.y + p.height / 2));

      context.drawImage(p_image, p.position.x, p.position.y, p.width, p.height);

    	context.restore();
    }

    return that;

  };


 // this is the function that draws the countdown sequence
  that.drawCountdown = function(countdown_times) {

    canvas = $('#countCanvas')[0];
    context = canvas.getContext('2d');

    if (countdown_times > 0) {
      Game.pause = true;

      context.clearRect(0,0,canvas.width, canvas.height);


      context.fillStyle = '#b3b3b3';
      context.textAlign = 'center';

      context.shadowColor = 'black';
      context.shadowBlur = 7;
      context.lineWidth = 5;

      context.font = '300px Calibri';
      context.strokeText(countdown_times, 500, 400);
      context.fillText(countdown_times, 500, 400);
    }
    canvas = $('#gameCanvas')[0];
    context = canvas.getContext('2d');

  };

  return that;


}());

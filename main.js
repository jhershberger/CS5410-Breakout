/**
* @Author: Justin Hershberger
* @Date:   22-02-2017
* @Filename: main.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 20-03-2017
*/

//the main loop should only handle the actual gameplay itself
let Game = (function() {
  let that = {};
  let inputDispatch = {};
  let previousTime = performance.now();
  let elapsedTime = 0;
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  let in_game = new Audio('Sounds/Journey to the East Rocks.ogg');
  let gb = null;
  let gb1 = null;
  that.countdown_times = 3;
  that.countdown= 1000;
  that.start_countdown = false;
  let draw_ball_flag = false;
  let keyLeft = true;
  let keyRight = true;
  that.pause = false;
  that.gameOver = false;
  that.blockCollision = {active: false,x: -1, y:-1};
  let num_particles = 7;
  let op_dx = 0;
  let op_dy = 0;
  let particles = [];
  let alive_particles = [];

  function update(elapsedTime) {
    //see which particles are still alive
    alive_particles = [];

    //try to avoid too many particles, as too many will slow down the game
    if (particles.length < 30) {

      for (let prt = 0; prt < particles.length; prt++) {
        if (particles[prt].update(elapsedTime)) {
          alive_particles.push(particles[prt]);
        }
      }
    } else {
      for (let prt = 0; prt < 30; prt++) {
        if (particles[prt].update(elapsedTime)) {
          alive_particles.push(particles[prt]);
        }
      }
    }

    particles = alive_particles;

    //add particles if a collision has occurred
    if (that.blockCollision.active != false) {
      //add more particles for the block that was hit
      for (let i = 0; i < num_particles; i++) {
        op_dx = Math.random() < 0.5 ? 1 : -1;
        op_dy = Math.random() < 0.5 ? 1 : -1;
        p = {
          position: {x: that.blockCollision.x + 20, y: that.blockCollision.y},
          direction: {x: Math.random() * op_dx, y: Math.random() * op_dy},
          speed: 300, // pixels per second
          rotation: 0,
          lifetime:  2	// seconds
        };

        particles.push(Graphics.particle(p));
      }

      that.blockCollision.active = false;
    }

    //detect if the game needs to begin
    if(that.start_countdown) {
      particles = [];
      that.countdown-= elapsedTime;
    }
    if(that.countdown_times < 0) {
      that.start_countdown = false;
    }

    //check if the game has ended
    if(that.gameOver) {
      particles = [];
      let storeScore = function() {
        localStorage.setItem(Graphics.score, $('.initials').val());
        location.reload();
      };

      inputDispatch[13] = storeScore;
      inputDispatch[32] = 0;

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

    //draw the ball if we need to
    if (draw_ball_flag && !that.pause) {
      $('#blockCanvas').removeClass('hidden');
      gb.drawBall();
      // gb1.drawBall();

      //on enter
      inputDispatch[13] = 0;

    }

    //draw particles
    for (let i=0; i < particles.length; i++) {
      particles[i].draw();
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
    that.gameOver = false;
    gb = Graphics.gameBall(505,500);
    gb1 = Graphics.gameBall(325, 400);

    //initialize the game's soundtrack
    in_game.loop = true;
    in_game.volume = 0.2;
    in_game.play();

    //on esc we want to draw the menu and quit drawing the rest of the game.
    let esc = function() {
      Menu.drawMenu();
      draw_ball_flag = false;
      $('#blockCanvas').addClass('hidden');
      $('#gameCanvas').addClass('hidden');

      //on enter
      inputDispatch[13] = Menu.selectOption;
    };

    //on esc or space
    inputDispatch[27] = esc;
    inputDispatch[32] = esc;

    //on down arrow
    inputDispatch[40] = Menu.dn_hlt;

    //on up arrow
    inputDispatch[38] = Menu.up_hlt;


    //initialize the blocks
    Blocks.initialize();
    requestAnimationFrame(gameLoop);
  }

  return that;
}());

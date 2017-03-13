/**
* @Author: Justin Hershberger
* @Date:   22-02-2017
* @Filename: Block.js
* @Last modified by:   Justin Hershberger
* @Last modified time: 06-03-2017
*/


//this is the data structure that stores the set of blocks
let Blocks = (function() {
  // within the graphics a block should be defined
  // as well as the ball and the pong paddle
  let that = {};
  that.rows = 8;
  that.cols = 14;
  let blocks = new Array(that.rows);
  let colors = ['Yellow', 'Orange', 'Blue', 'Green'];
  let color_points = [1, 2, 3, 5];
  let color_count = -1;
  let color_index = 0;
  let cvs_x = 70;
  let cvs_y = 300;

  // set up a 2d array
  for (let i=0; i < that.rows; i++) {
    blocks[i] = new Array(that.cols);
  }

  //this function will initialize the blocks data structure
  that.initialize = function() {
    color_count = -1;
    color_index = 0;
    cvs_x = 70;
    cvs_y = 300;
    for(let i=0; i < that.rows; i++) {
      color_count += 1;

      if (color_count == 2) {
        color_index += 1;
        color_count = 0;

        //update the cvs row coordinate
        cvs_y -= 80;
      }
      //begin at the same x coordinate for each row and progress through each column
      cvs_x = 17;
      for (let j=0; j < that.cols; j++) {
        if (color_count == 0) {
          //define the initial row
          blocks[i][j] = {color: colors[color_index], x: (i+cvs_x), y: cvs_y, points: color_points[color_index] };
        } else if (color_count == 1) {
          //move up one row
          blocks[i][j] = {color: colors[color_index], x: (i+cvs_x), y: cvs_y-39, points: color_points[color_index] };
        }
        cvs_x += 69;
      }
    }

    // console.log(blocks);
  }
  that.blocks = function() {
    return blocks;
  };

  return that;
}());

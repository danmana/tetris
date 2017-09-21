(function() {
  //Block shapes
  var SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    L: [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    O: [[4, 4], [4, 4]],
    S: [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    T: [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
  };

  //Define 10x20 grid as the board
  var GRID_W = 10;
  var GRID_H = 20;
  var EMPTY_ROW = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var EMPTY_GRID = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  /**
   * Create a new Tetris instance.
   * @param nextShapes the game shapes
   * @constructor
   */
  function Tetris(nextShapes) {
    this.grid = clone(EMPTY_GRID);

    this.nextShapes = nextShapes || '';
    this.shapeIndex = 0;

    this.score = 0;
    this.lost = false;
    this.won = false;
  }

  /**
   * Clone this instance of Tetris.
   */
  Tetris.prototype.clone = function() {
    var clone = new Tetris();

    clone.grid = clone(this.grid);
    clone.nextShapes = this.nextShapes;
    clone.shapeIndex = this.shapeIndex;

    clone.score = this.score;
    clone.lost = this.lost;
    clone.won = this.won;

    return clone;
  };

  /**
   * Output a html string representing the current state of this Tetris game.
   * @returns {string}
   */
  Tetris.prototype.toHtml = function() {
    var html = '<div class="tetris">';

    html += '<h1>Score: ' + this.score;

    if (this.lost) {
      html += '<span class="lost">LOST!</span>';
    } else if (this.won) {
      html += '<span class="won">WON!</span>';
    }

    html += '</h1>';

    html += gridToHtml(this.grid);

    html += '</div>';
    return html;
  };

  /**
   * Convert a grid (2 dimensional array) to html.
   * Wrap this in a <div class="tetris"></div> to use the tetris.css styles
   * @param grid
   * @returns {string}
   */
  function gridToHtml(grid) {
    var i, j, row, html = '';
    for (i = 0; i < grid.length; i++) {
      row = grid[i];
      html += '<div class="tetris-row">';
      for (j = 0; j < row.length; j++) {
        html += '<div class="tetris-cell tetris-cell-' + row[j] + '"></div>';
      }
      html += '</div>';
    }

    return html;
  }


  /**
   * Make a move. This will alter the current state of the game.
   * @param x the column where to place the next shape
   * @param rot the numebr of rotations to apply to the next shape
   */
  Tetris.prototype.makeMove = function(x, rot) {
    var shape = clone(SHAPES[this.nextShapes[this.shapeIndex]]), i;

    shape = rotate(shape, rot);

    // bound the X so the shape is in the grid
    x = getBoundedX(shape, x);

    // find where the shape drops
    var y = getDropLocation(this.grid, shape, x);

    if (isLoss(shape, y)) {
      this.lost = true;
    } else {
      this.score++;
      applyShape(this.grid, shape, x, y);
      this.score += clearRows(this.grid);

      this.shapeIndex++;
      if (this.shapeIndex >= this.nextShapes.length) {
        this.won = true;
      }
    }
  };

  /**
   * Clear all filled rows
   * @param grid
   * @returns {number} the score from clearing rows
   */
  function clearRows(grid) {
    var i, j, cleared = 0, is_full, score = 0;
    for (i = 0; i < GRID_H; i++) {
      is_full = true;
      for (j = 0; j < GRID_W; j++) {
        if (grid[i][j] === 0) {
          is_full = false;
          break;
        }
      }
      if (is_full) {
        cleared++;
        grid.splice(i, 1);
        grid.unshift(clone(EMPTY_ROW));
      }
    }

    if (cleared === 1) {
      score = 100;
    } else if (cleared === 2) {
      score = 200;
    } else if (cleared === 3) {
      score = 400;
    } else if (cleared >= 4) {
      score = 800;
    }

    return score;


  }

  /**
   * Get the row where this shape will drop
   * @param grid
   * @param shape
   * @param x
   * @returns {number}
   */
  function getDropLocation(grid, shape, x) {
    var i;
    for (i = -shape.length; i < GRID_H; i++) {
      if (collides(grid, shape, x, i)) {
        return i - 1;
      }
    }

    return GRID_H - 1;
  }

  /**
   * Check if placing the shape at this row causes a loss (the shape is outside the grid)
   * @param shape
   * @param y
   * @returns {boolean}
   */
  function isLoss(shape, y) {
    var i, j;
    for (i = 0; i < shape.length; i++) {
      for (j = 0; j < shape.length; j++) {
        if (shape[i][j] && y + i < 0) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Paste the given shape in the grid at x,y starting with the top,left corner of the shape.
   * @param grid
   * @param shape
   * @param x
   * @param y
   */
  function applyShape(grid, shape, x, y) {
    for (i = 0; i < shape.length; i++) {
      for (j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          if (x + j < GRID_W && y + i >= 0 && y + i < GRID_H) {
            grid[y + i][x + j] = shape[i][j];
          }
        }
      }
    }
  }

  /**
   * Get the min/max positions where this shape could be placed such that it doesn't go outside the gird.
   * @param shape
   * @returns {{min: number, max: number}}
   */
  function getShapePositionBounds(shape) {
    var i, j;
    var minX = GRID_W;
    var maxX = 0;
    for (i = 0; i < shape.length; i++) {
      for (j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          minX = Math.min(minX, j);
          maxX = Math.max(maxX, j);
        }
      }
    }

    return {min: -minX, max: GRID_W - 1 - maxX};
  }

  /**
   * Bound the x position based on the min/max posiion where the shape can be placed (such that it doesn't go outside the grid)
   * @param shape
   * @param x
   * @returns {x: number} bounded x position
   */
  function getBoundedX(shape, x) {
    var bounds = getShapePositionBounds(shape);
    if (x < bounds.min) {
      return bounds.min;
    }
    if (x > bounds.max) {
      return bounds.max;
    }
    return x;
  }

  /**
   * Check if placing the given shape at position x,y will collide with the grid or has filled cells outside the grid.
   * x,y represent where to place the top, left cell of the shape
   *
   * @param grid the grid to test on
   * @param shape the shape to try and place
   * @param x the column position where to place the shape
   * @param y the row where to place it (0 = on top, can be negative, GRID_H-1 on bottom)
   * @returns {boolean} if the shape collides with anything on the grid
   */
  function collides(grid, shape, x, y) {
    var i, j;
    for (i = 0; i < shape.length; i++) {
      for (j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          if (x + j < 0 || x + j >= GRID_W) {
            return true;
          }
          if (y + i >= GRID_H) {
            return true;
          }
          if (y + i >= 0) {
            if (grid[y + i][x + j] !== 0) {
              return true;
            }
          }
        }
      }

    }

    return false;
  }

  /**
   * Clone any plain object or array.
   */
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  /**
   * Rotate a shape or grid.
   * @param matrix the 2 dimensional array to rotate
   * @param times the number of rotations
   * @returns {*}
   */
  function rotate(matrix, times) {
    //for each time
    for (var t = 0; t < times; t++) {
      //flip the shape matrix
      matrix = transpose(matrix);
      //and for the length of the matrix, reverse each column
      for (var i = 0; i < matrix.length; i++) {
        matrix[i].reverse();
      }
    }
    return matrix;
  }

  /**
   * Transpose a matrix (2 dimensional array).
   * flip row x column to column x row
   * @param array
   */
  function transpose(array) {
    return array[0].map(function(col, i) {
      return array.map(function(row) {
        return row[i];
      });
    });
  }


  var MOVE_SEPARATOR = ';';
  var MOVE_PART_SEPARATOR = ':';

  /**
   * Parse a moves string into an array of moves.
   * @param val
   * @returns {Array}
   */
  function parseMoves(val) {
    var moves = [];
    var moveStrings = val.split(MOVE_SEPARATOR), i, parts;
    for (i = 0; i < moveStrings.length; i++) {
      parts = moveStrings[i].split(MOVE_PART_SEPARATOR);
      moves.push({
        x: parseInt(parts[0]),
        rot: parseInt(parts[1])
      });
    }
    return moves;
  }

  // Expose some of the static utility functions

  Tetris.SHAPE_NAMES = 'IJLOSTZ';
  Tetris.SHAPES = SHAPES;
  Tetris.GRID_W = GRID_W;
  Tetris.GRID_H = GRID_H;
  Tetris.rotate = rotate;
  Tetris.transpose = transpose;
  Tetris.gridToHTML = gridToHtml;
  Tetris.clone = clone;
  Tetris.parseMoves = parseMoves;

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Tetris;
  else
    window.Tetris = Tetris;
}());
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

    function Tetris(nextShapes) {
        this.grid = clone(EMPTY_GRID);

        this.nextShapes = nextShapes || '';
        this.shapeIndex = 0;

        this.score = 0;
        this.lost = false;
    }


    Tetris.prototype.clone = function() {
        var clone = new Tetris();

        clone.grid = clone(this.grid);
        clone.nextShapes = this.nextShapes;
        clone.shapeIndex = this.shapeIndex;

        clone.score = this.score;
        clone.lost = this.lost;
    };

    Tetris.prototype.toHtml = function() {
        var html = '<div class="tetris">', i, j;

        for (i = 0; i < GRID_H; i++) {
            html += '<div class="tetris-row">';
            for (j = 0; j < GRID_W; j++) {
                html += '<div class="tetris-cell tetris-cell-' + this.grid[i][j] + '"></div>';
            }
            html += '</div>';
        }


        html += '</div>';
        return html;
    };


    Tetris.prototype.makeMove = function(x, rot) {
        var shape = clone(SHAPES[this.nextShapes[this.shapeIndex]]), i;

        shape = rotate(shape, rot);

        var i, dropPosition = this.grid.length - 1;
        for (i = -shape.length; i < this.grid.length; i++) {
            if (collides(this.grid, shape, x, i)) {
                dropPosition = i - 1;
                break;
            }
        }

        // apply the shape
        for (i = 0; i < shape.length; i++) {
            for (j = 0; j < shape[i].length; j++) {
                if (shape[i][j] && x + j < GRID_W && dropPosition + i >= 0 && dropPosition + i < GRID_H) {
                    this.grid[dropPosition + i][x + j] = shape[i][j];
                }
            }
        }

        this.shapeIndex++;
    };

    function collides(grid, shape, x, y) {
        var i, j;
        for (i = 0; i < shape.length; i++) {
            for (j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    if (x +j < 0 || x + j >= GRID_W) {
                        return true;
                    }
                    if (y + i >= GRID_H) {
                        return true;
                    }
                    if (y + i >=0) {
                        if (grid[y+i][x+j] !== 0) {
                            return true;
                        }
                    }
                }
            }

        }

        return false;
    }

    // clones an object
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }


    //for rotating a shape, how many times should we rotate
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

//flip row x column to column x row
    function transpose(array) {
        return array[0].map(function(col, i) {
            return array.map(function(row) {
                return row[i];
            });
        });
    }


    window.Tetris = Tetris;
}());
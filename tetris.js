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

    function Tetris(nextShapes) {
        this.grid = clone(EMPTY_GRID);

        this.nextShapes = nextShapes || '';
        this.shapeIndex = 0;

        this.score = 0;
        this.lost = false;
        this.won = false;
    }


    Tetris.prototype.clone = function() {
        var clone = new Tetris();

        clone.grid = clone(this.grid);
        clone.nextShapes = this.nextShapes;
        clone.shapeIndex = this.shapeIndex;

        clone.score = this.score;
        clone.lost = this.lost;
        clone.won = this.won;
    };

    Tetris.prototype.toHtml = function() {
        var html = '<div class="tetris">', i, j;

        html += '<h1>Score: ' + this.score;

        if (this.lost) {
            html += '<span class="lost">LOST!</span>';
        } else if (this.won) {
            html += '<span class="won">WON!</span>';
        }

        html += '</h1>';

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

    function getDropLocation(grid, shape, x) {
        var i;
        for (i = -shape.length; i < GRID_H; i++) {
            if (collides(grid, shape, x, i)) {
                return i - 1;
            }
        }

        return GRID_H - 1;
    }

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
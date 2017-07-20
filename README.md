# Tetris

A Tetris engine and server used for hosting a private competition.

A sample solution can be found in [sample_solution](./sample_solution)

## Tetris.js

The [Tetris engine](https://github.com/danmana/tetris/blob/master/tetris.js) used for scoring can also be used for developing your solution.

### Tetris.js API

To create a new game all you have to do is pass in the shapes.
The game will keep track of the current position, the grid cells and your score as you make moves.

The Tetris engine maintains the following internal state:
 * `shapes` (string) - the list of input shapes
 * `shapeIndex` (number) - the current shape index
 * `grid` (number[][])- the game grid, a 20 by 10 array of cells (0 = empty, 1-7 part of a shape)
 * `score` (number)- current score
 * `lost` (boolean) - if the game is lost (the last shape you placed could not fit in the current grid)
 * `won` (boolean) - if the game is won (you finished all shapes and didn't go outside of the grid)



```js
// creating a new game
var t = new Tetris('LSTSITS');

// the current shape index (starts at 0 and increments automatically for each move)
console.log(t.shapeIndex); // 0

// making a move (place the current shape at column 5, rotated 0 times)
t.makeMove(5,0);
console.log(t.shapeIndex); // 1

// check the current game grid to see what cells are filled
console.log(t.grid); // 20 x 10 array - 0=empty cell, 1-7=belongs to one of the shapes

// check if you won or lost
if (t.won) {
  console.log('You won!, score = ' + t.score);
} else if (t.lost) {
  console.log('You lost :( score = ' + t.score);
} else {
  console.log('Game in progress ... score = ' + t.score);
}

// clone the game if you want to try out a move without advancing the game
var t2 = t.clone();
t2.makeMove(5,0);
console.log(t2.score);

```

#### Constants
```js
// tetris shape names: 'IJLOSTZ'
Tetris.SHAPE_NAMES;

// a map of shapes <shape_name,shape_grid>
Tetris.SHAPES;

// grid width (10)
Tetris.GRID_W;

// grid height (20)
Tetris.GRID_H;
```

#### Utility functions
```js
// util for rotating shapes
Tetris.rotate(shape, times);

// util for transposing an array
Tetris.transpose(array);

// transform any grid into html (can be used on shapes or the entire grid)
// wrap this with a <div class="tetris"></div> to use the css styles from tetris.css
Tetris.gridToHTML(grid);

// clone any plain object or array
Tetris.clone(obj);

// parse moves string into an array of internal moves: {x: number; rot: number;}
Tetris.parseMoves(moves);
```

## Commandline eval
Run the evaluator (it will print the final score - 19 in this example)
```
node tetris-eval.js --pieces IJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZ --moves 3:1;0:0;3:0;0:1;6:1;6:0;5:1;5:0;3:1;6:0;1:0;2:1;3:2;2:0;2:2;1:0;5:2;1:0;3:0;1:2;4:0;0:1;1:0;3:2;4:2;6:2;0:2;1:0;2:1;1:2;3:2;6:1;4:1;5:1;1:1;6:2;2:1;0:1;0:2;0:1;1:2;3:1;0:2;6:1;5:0;3:2;0:1;1:1;6:2;6:0;5:2;5:0;6:1;1:0;1:0;1:0;
```

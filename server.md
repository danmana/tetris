# Tetris app

Install dependencies
```
npm install
```

## Server

Run the express js server using
```
# development
node index.js

# prod
nohup sudo nodejs index.js --port 80 --dir /home/ubuntu/tmp &
```

## Game generator

Generating random games:
```
node tetris-gen.js --out games.txt
```


## Commandline eval
Run the evaluator (it will print the final score - 19 in this example)
```
node tetris-eval.js --pieces IJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZIJLOSTZ --moves 3:1;0:0;3:0;0:1;6:1;6:0;5:1;5:0;3:1;6:0;1:0;2:1;3:2;2:0;2:2;1:0;5:2;1:0;3:0;1:2;4:0;0:1;1:0;3:2;4:2;6:2;0:2;1:0;2:1;1:2;3:2;6:1;4:1;5:1;1:1;6:2;2:1;0:1;0:2;0:1;1:2;3:1;0:2;6:1;5:0;3:2;0:1;1:1;6:2;6:0;5:2;5:0;6:1;1:0;1:0;1:0;
```


For more help about the evaluator options run:
```
node tetris-eval.js --help
```


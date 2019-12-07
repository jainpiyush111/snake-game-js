// Import stylesheets
import './style.css';

    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext("2d");
    context.scale(10, 10);
    let continuousInteval = null;
    let lastSnakePosition = 0;
    let lastSecondSnakePosition = 0;
    let newSnakePosition: any = 0;
    let lastkeypressed = null;
    let snake = [];
    let initialFoodPosition = [15, 15];
    let currentFoodPosition = initialFoodPosition;

    function draw() {
        context.clearRect(0, 0, 300, 300);
        snake = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
        ];
        snake.forEach(([x, y]) => {
            context.fillRect(x, y, 1, 1);
        });

        // initial snake food
        context.fillRect( initialFoodPosition[0], initialFoodPosition[1], 1, 1);
    }

    draw();

    function redraw() {
        context.clearRect(0, 0, 300, 300);
        snake.forEach(([x, y]) => {
            context.fillRect(x, y, 1, 1);
        });
        context.fillRect( currentFoodPosition[0], currentFoodPosition[1], 1, 1);
    }

    addEventListener('keyup', (e) => {
        if (lastkeypressed && e.code === lastkeypressed) {
            return;
        } else {
            lastkeypressed = e.code;
        }

        if (e.code === 'ArrowRight') {
            updateSnakePosition([1, 0]);
        } else if (e.code === 'ArrowLeft') {
            updateSnakePosition([-1, 0]);
        } else if (e.code === 'ArrowUp') {
            updateSnakePosition([0, -1]);
        } else if (e.code === 'ArrowDown') {
            updateSnakePosition([0, 1]);
        }
    });

    function updateSnakePosition(value) {
        lastSecondSnakePosition = snake[snake.length - 2];
        lastSnakePosition = snake[snake.length - 1];
        newSnakePosition = [lastSnakePosition[0] + value[0], lastSnakePosition[1] + value[1]];

        if (isSnakeHittedTheWall()) {
            stopGameAndMoveToBeginning();
            return;
        }

        if (isShiftingToLastPosition()) {
            // stopping user to move to the opposite direction
            return;
        }

        if (isSnakeHittingItself()) {
            stopGameAndMoveToBeginning();
            return;
        }

        stopInterval();
        moveToNextPosition();
        continuousInteval = setInterval(() => {
            updateSnakePosition(value);
        }, 400);
    }

    function isSnakeHittingItself() {
        let snakeHittingItself = false;
        snake.forEach(([x, y]) => {
            if (x === newSnakePosition[0] && y === newSnakePosition[1]) {
                snakeHittingItself = true;
            }
        });
        return snakeHittingItself;
    }

    function isSnakeHittedTheWall() {
        if (newSnakePosition[0] === 30 || newSnakePosition[1] === 30
            || newSnakePosition[0] === -1 || newSnakePosition[1] === -1) {
            return true;
        } else {
            return false;
        }
    }

    function stopGameAndMoveToBeginning() {
        console.log("Game Over !!");
        stopInterval();
        draw();
    }

    function snakeAteTheFood() {
        if (JSON.stringify(lastSnakePosition) === JSON.stringify(currentFoodPosition)) {
          return true;
          console.log("Snake ate the food");
        }
    }

    function moveToNextPosition() {
      snake.push(newSnakePosition);
      
      if (snakeAteTheFood()) {
        addNewFoodPosition();
      } else {
        snake.shift();
      }
      redraw();
    }

    var addNewFoodPosition = function(){
        currentFoodPosition[0] = Math.floor(Math.random() * ((canvas.width / 10) - 1));
        currentFoodPosition[1] = Math.floor(Math.random() * ((canvas.height / 10) - 1));
        // check if it is somewhere in the snake position then reposition
        for(var i = 0; i < snake.length; i++){
            if (checkTheCurrentPosition( currentFoodPosition[0], currentFoodPosition[1], snake[i].x, snake[i].y)){
                addNewFoodPosition();
            }
        }
    }
    
    var checkTheCurrentPosition = function(x, y, _x, _y){
        return (x == _x && y == _y) ? true : false;
    }

    function stopInterval() {
        if (continuousInteval) {
            clearInterval(continuousInteval);
        }
    }

    function isShiftingToLastPosition() {

        if (lastSecondSnakePosition[0] === newSnakePosition[0]
            && lastSecondSnakePosition[1] === newSnakePosition[1]) {
            return true;
        } else {
            return false;
        }
    }
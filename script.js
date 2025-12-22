const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');

const boardSize = 20; // 20x20 grid
const blockSize = 20; // 20px per block
let snake = [{x: 0, y: 0}]; // initial snake position
let direction = {x: 1, y: 0}; // moving right
let food = {x: 100, y: 100};
let score = 0;
let gameInterval;

// Create food element
const foodElement = document.createElement('div');
foodElement.classList.add('food');
gameBoard.appendChild(foodElement);
foodElement.style.left = food.x + 'px';
foodElement.style.top = food.y + 'px';

// Listen to arrow keys
document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp':
      if(direction.y === 0) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if(direction.y === 0) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if(direction.x === 0) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if(direction.x === 0) direction = {x: 1, y: 0};
      break;
  }
});

// Start game
function startGame() {
  gameInterval = setInterval(updateGame, 200);
}

function updateGame() {
  // Move snake
  const head = {...snake[0]};
  head.x += direction.x * blockSize;
  head.y += direction.y * blockSize;

  // Check collisions with walls
  if(head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.some(s => s.x === head.x && s.y === head.y)) {
    alert('Game Over! Score: ' + score);
    clearInterval(gameInterval);
    return;
  }

  snake.unshift(head);

  // Check food collision
  if(head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop(); // remove tail
  }

  drawSnake();
}

function drawSnake() {
  gameBoard.innerHTML = '';
  // draw food
  gameBoard.appendChild(foodElement);
  foodElement.style.left = food.x + 'px';
  foodElement.style.top = food.y + 'px';
  
  // draw snake
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.left = segment.x + 'px';
    snakeElement.style.top = segment.y + 'px';
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });
}

function placeFood() {
  food.x = Math.floor(Math.random() * boardSize) * blockSize;
  food.y = Math.floor(Math.random() * boardSize) * blockSize;
}

// Start the game
startGame();

// Game Manager - Handles game loading, scoring, and modal management

class GameManager {
  constructor() {
    this.currentGame = null;
    this.scores = this.loadScores();
    this.modal = document.getElementById('gameModal');
    this.gameContainer = document.getElementById('gameContainer');
    this.gameTitle = document.getElementById('gameTitle');
    this.currentScoreDisplay = document.getElementById('currentScore');
    this.highScoreDisplay = document.getElementById('highScore');
    this.closeBtn = document.getElementById('closeBtn');
    this.restartBtn = document.getElementById('restartBtn');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Close modal when clicking close button
    this.closeBtn.addEventListener('click', () => this.closeGame());
    
    // Restart current game
    this.restartBtn.addEventListener('click', () => this.restartGame());
    
    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeGame();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeGame();
      }
    });
  }

  openGame(gameId) {
    const game = GAMES_CATALOG.find(g => g.id === gameId);
    if (!game) return;

    if (!game.implemented) {
      alert(`${game.name} is coming soon! This game hasn't been implemented yet.\n\nYou can add it by creating a new file in the games/ folder.`);
      return;
    }

    this.currentGame = game;
    this.gameTitle.textContent = game.name;
    this.updateScoreDisplay(0);
    this.modal.classList.add('active');
    
    // Load the specific game
    this.loadGameContent(game);
  }

  loadGameContent(game) {
    // Clear previous game content
    this.gameContainer.innerHTML = '';
    
    // Load game based on ID
    switch(game.id) {
      case 1: // Snake
        this.loadSnakeGame();
        break;
      case 21: // Tic Tac Toe
        this.loadTicTacToeGame();
        break;
      default:
        this.gameContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Game coming soon!</p>';
    }
  }

  loadSnakeGame() {
    // Create Snake game HTML
    this.gameContainer.innerHTML = `
      <div style="text-align: center;">
        <div id="snakeGameBoard" style="width: 400px; height: 400px; background-color: #000; position: relative; margin: 0 auto; border: 2px solid #333;"></div>
        <div style="margin-top: 20px; color: #666;">
          <p>Use arrow keys to move the snake</p>
          <p>Eat the red food to grow and score points</p>
        </div>
      </div>
    `;

    // Initialize Snake game
    const gameBoard = document.getElementById('snakeGameBoard');
    const boardSize = 20;
    const blockSize = 20;
    let snake = [{x: 0, y: 0}];
    let direction = {x: 1, y: 0};
    let food = {x: 100, y: 100};
    let score = 0;
    let gameInterval;
    let isGameOver = false;

    // Capture 'this' context for use in nested functions
    const self = this;

    const foodElement = document.createElement('div');
    foodElement.style.width = '20px';
    foodElement.style.height = '20px';
    foodElement.style.backgroundColor = 'red';
    foodElement.style.position = 'absolute';
    gameBoard.appendChild(foodElement);
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';

    const keyHandler = (e) => {
      if (isGameOver) return;
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
    };

    document.addEventListener('keydown', keyHandler);

    const placeFood = () => {
      food.x = Math.floor(Math.random() * boardSize) * blockSize;
      food.y = Math.floor(Math.random() * boardSize) * blockSize;
    };

    const drawSnake = () => {
      gameBoard.innerHTML = '';
      gameBoard.appendChild(foodElement);
      foodElement.style.left = food.x + 'px';
      foodElement.style.top = food.y + 'px';
      
      snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = segment.x + 'px';
        snakeElement.style.top = segment.y + 'px';
        snakeElement.style.width = '20px';
        snakeElement.style.height = '20px';
        snakeElement.style.backgroundColor = 'lime';
        snakeElement.style.position = 'absolute';
        gameBoard.appendChild(snakeElement);
      });
    };

    const updateGame = () => {
      if (isGameOver) return;

      const head = {...snake[0]};
      head.x += direction.x * blockSize;
      head.y += direction.y * blockSize;

      if(head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || 
         snake.some(s => s.x === head.x && s.y === head.y)) {
        isGameOver = true;
        clearInterval(gameInterval);
        document.removeEventListener('keydown', keyHandler);
        setTimeout(() => {
          alert('Game Over! Final Score: ' + score);
        }, 100);
        return;
      }

      snake.unshift(head);

      if(head.x === food.x && head.y === food.y) {
        score++;
        self.updateScore(score);
        placeFood();
      } else {
        snake.pop();
      }

      drawSnake();
    };

    gameInterval = setInterval(updateGame, 200);
    
    // Store cleanup function
    this.currentGameCleanup = () => {
      clearInterval(gameInterval);
      document.removeEventListener('keydown', keyHandler);
    };
  }

  loadTicTacToeGame() {
    // Create Tic Tac Toe game HTML
    this.gameContainer.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-bottom: 20px;">
          <p id="tttStatus" style="font-size: 1.2rem; font-weight: bold; color: #333;">Player X's Turn</p>
        </div>
        <div id="tttBoard" style="display: grid; grid-template-columns: repeat(3, 100px); gap: 10px; justify-content: center; margin: 0 auto;">
        </div>
        <div style="margin-top: 20px; color: #666;">
          <p>Get 3 in a row to win!</p>
          <p>Player: X | Computer: O</p>
        </div>
      </div>
    `;

    const board = document.getElementById('tttBoard');
    const status = document.getElementById('tttStatus');
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let score = 0;

    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    const checkWinner = () => {
      for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
          return gameState[a];
        }
      }
      return gameState.includes('') ? null : 'tie';
    };

    const computerMove = () => {
      if (!gameActive) return;
      
      // Simple AI: Random available cell
      const emptyCells = [];
      for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
          emptyCells.push(i);
        }
      }
      
      if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setTimeout(() => {
          if (gameActive) {
            gameState[randomIndex] = 'O';
            updateBoard();
            const winner = checkWinner();
            if (winner) {
              handleGameEnd(winner);
            } else {
              currentPlayer = 'X';
              status.textContent = "Player X's Turn";
            }
          }
        }, 500);
      }
    };

    const handleGameEnd = (winner) => {
      gameActive = false;
      if (winner === 'X') {
        status.textContent = '🎉 You Win!';
        score += 10;
        this.updateScore(score);
      } else if (winner === 'O') {
        status.textContent = '😢 Computer Wins!';
      } else {
        status.textContent = "It's a Tie!";
        score += 5;
        this.updateScore(score);
      }
    };

    const handleCellClick = (index) => {
      if (gameState[index] !== '' || !gameActive || currentPlayer !== 'X') return;
      
      gameState[index] = 'X';
      updateBoard();
      
      const winner = checkWinner();
      if (winner) {
        handleGameEnd(winner);
      } else {
        currentPlayer = 'O';
        status.textContent = "Computer's Turn";
        computerMove();
      }
    };

    const updateBoard = () => {
      board.innerHTML = '';
      gameState.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.style.width = '100px';
        cellElement.style.height = '100px';
        cellElement.style.backgroundColor = '#fff';
        cellElement.style.border = '3px solid #667eea';
        cellElement.style.borderRadius = '10px';
        cellElement.style.display = 'flex';
        cellElement.style.alignItems = 'center';
        cellElement.style.justifyContent = 'center';
        cellElement.style.fontSize = '3rem';
        cellElement.style.fontWeight = 'bold';
        cellElement.style.cursor = gameActive && cell === '' ? 'pointer' : 'default';
        cellElement.style.transition = 'all 0.3s ease';
        cellElement.textContent = cell;
        
        if (cell === 'X') {
          cellElement.style.color = '#667eea';
        } else if (cell === 'O') {
          cellElement.style.color = '#e74c3c';
        }
        
        cellElement.addEventListener('click', () => handleCellClick(index));
        cellElement.addEventListener('mouseenter', () => {
          if (gameActive && cell === '') {
            cellElement.style.backgroundColor = '#f0f0f0';
          }
        });
        cellElement.addEventListener('mouseleave', () => {
          cellElement.style.backgroundColor = '#fff';
        });
        
        board.appendChild(cellElement);
      });
    };

    updateBoard();
    
    this.currentGameCleanup = () => {
      gameActive = false;
    };
  }

  updateScore(newScore) {
    this.currentScoreDisplay.textContent = newScore;
    
    if (this.currentGame) {
      const gameId = this.currentGame.id;
      const highScore = this.scores[gameId] || 0;
      
      if (newScore > highScore) {
        this.scores[gameId] = newScore;
        this.saveScores();
        this.highScoreDisplay.textContent = newScore;
      }
    }
  }

  updateScoreDisplay(currentScore) {
    this.currentScoreDisplay.textContent = currentScore;
    
    if (this.currentGame) {
      const highScore = this.scores[this.currentGame.id] || 0;
      this.highScoreDisplay.textContent = highScore;
    }
  }

  restartGame() {
    if (this.currentGame) {
      // Clean up current game
      if (this.currentGameCleanup) {
        this.currentGameCleanup();
      }
      // Reload the game
      this.loadGameContent(this.currentGame);
      this.updateScoreDisplay(0);
    }
  }

  closeGame() {
    // Clean up current game
    if (this.currentGameCleanup) {
      this.currentGameCleanup();
      this.currentGameCleanup = null;
    }
    
    this.modal.classList.remove('active');
    this.currentGame = null;
    this.gameContainer.innerHTML = '';
  }

  loadScores() {
    try {
      const saved = localStorage.getItem('miniGamesScores');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading scores:', e);
      return {};
    }
  }

  saveScores() {
    try {
      localStorage.setItem('miniGamesScores', JSON.stringify(this.scores));
    } catch (e) {
      console.error('Error saving scores:', e);
    }
  }

  getHighScore(gameId) {
    return this.scores[gameId] || 0;
  }
}

// Initialize global game manager
const gameManager = new GameManager();

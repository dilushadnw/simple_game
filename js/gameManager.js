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
      case 22: // Memory Match
        this.loadMemoryMatchGame();
        break;
      case 56: // Whack-a-Mole
        this.loadWhackAMoleGame();
        break;
      case 58: // Reaction Time
        this.loadReactionTimeGame();
        break;
      case 77: // Math Quiz
        this.loadMathQuizGame();
        break;
      case 93: // Rock Paper Scissors
        this.loadRockPaperScissorsGame();
        break;
      case 94: // Number Guess
        this.loadNumberGuessGame();
        break;
      case 59: // Color Match
        this.loadColorMatchGame();
        break;
      case 92: // Coin Flip
        this.loadCoinFlipGame();
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

  loadMemoryMatchGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center;">
        <div id="memoryBoard" style="display: grid; grid-template-columns: repeat(4, 100px); gap: 10px; justify-content: center; margin: 20px auto;"></div>
        <div style="margin-top: 20px; color: #666;">
          <p>Match all pairs to win!</p>
          <p>Moves: <span id="moveCount">0</span></p>
        </div>
      </div>
    `;

    const board = document.getElementById('memoryBoard');
    const moveCountEl = document.getElementById('moveCount');
    const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🥝'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let moves = 0;
    const self = this;

    cards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.style.cssText = 'width: 100px; height: 100px; background: #667eea; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 3rem; cursor: pointer; transition: all 0.3s;';
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      
      card.addEventListener('click', () => {
        if (flipped.length < 2 && !card.classList.contains('flipped')) {
          card.textContent = symbol;
          card.style.background = '#fff';
          card.classList.add('flipped');
          flipped.push(card);

          if (flipped.length === 2) {
            moves++;
            moveCountEl.textContent = moves;
            
            setTimeout(() => {
              if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
                matched += 2;
                flipped = [];
                if (matched === cards.length) {
                  const score = Math.max(0, 1000 - moves * 10);
                  self.updateScore(score);
                  setTimeout(() => alert(`You won in ${moves} moves! Score: ${score}`), 300);
                }
              } else {
                flipped.forEach(c => {
                  c.textContent = '';
                  c.style.background = '#667eea';
                  c.classList.remove('flipped');
                });
                flipped = [];
              }
            }, 1000);
          }
        }
      });
      
      board.appendChild(card);
    });

    this.currentGameCleanup = () => {};
  }

  loadWhackAMoleGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-bottom: 20px; font-size: 1.2rem; color: #333;">
          Time: <span id="timeLeft">30</span>s
        </div>
        <div id="moleGrid" style="display: grid; grid-template-columns: repeat(3, 120px); gap: 15px; justify-content: center; margin: 20px auto;"></div>
        <div style="margin-top: 20px; color: #666;">
          <p>Click the moles as fast as you can!</p>
        </div>
      </div>
    `;

    const grid = document.getElementById('moleGrid');
    const timeEl = document.getElementById('timeLeft');
    let score = 0;
    let timeLeft = 30;
    const self = this;
    let gameInterval;
    let moleInterval;

    for (let i = 0; i < 9; i++) {
      const hole = document.createElement('div');
      hole.style.cssText = 'width: 120px; height: 120px; background: #8B4513; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 4rem; border: 3px solid #654321;';
      hole.dataset.index = i;
      grid.appendChild(hole);
    }

    const holes = grid.children;
    
    const showMole = () => {
      const randomHole = holes[Math.floor(Math.random() * 9)];
      if (!randomHole.textContent) {
        randomHole.textContent = '🐹';
        randomHole.dataset.active = 'true';
        
        setTimeout(() => {
          if (randomHole.dataset.active === 'true') {
            randomHole.textContent = '';
            randomHole.dataset.active = 'false';
          }
        }, 1000);
      }
    };

    grid.addEventListener('click', (e) => {
      const hole = e.target.closest('[data-index]');
      if (hole && hole.dataset.active === 'true') {
        hole.textContent = '';
        hole.dataset.active = 'false';
        score += 10;
        self.updateScore(score);
      }
    });

    gameInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(moleInterval);
        setTimeout(() => alert(`Game Over! Final Score: ${score}`), 300);
      }
    }, 1000);

    moleInterval = setInterval(showMole, 800);

    this.currentGameCleanup = () => {
      clearInterval(gameInterval);
      clearInterval(moleInterval);
    };
  }

  loadReactionTimeGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div id="reactionBox" style="width: 400px; height: 300px; background: #667eea; margin: 20px auto; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; border-radius: 15px; cursor: pointer;"></div>
        <div style="margin-top: 20px; color: #666;">
          <p>Click when the box turns green!</p>
          <p id="resultText"></p>
        </div>
      </div>
    `;

    const box = document.getElementById('reactionBox');
    const resultText = document.getElementById('resultText');
    let startTime;
    let timeout;
    const self = this;

    const startTest = () => {
      box.style.background = '#667eea';
      box.textContent = 'Wait for green...';
      
      const delay = Math.random() * 3000 + 2000;
      timeout = setTimeout(() => {
        box.style.background = '#4ade80';
        box.textContent = 'Click now!';
        startTime = Date.now();
      }, delay);
    };

    box.addEventListener('click', () => {
      if (box.style.background === 'rgb(74, 222, 128)') {
        const reactionTime = Date.now() - startTime;
        resultText.textContent = `Your reaction time: ${reactionTime}ms`;
        const score = Math.max(0, 1000 - reactionTime);
        self.updateScore(score);
        box.textContent = `${reactionTime}ms - Click to try again`;
        box.style.background = '#667eea';
        setTimeout(startTest, 1000);
      } else if (box.textContent === 'Wait for green...') {
        resultText.textContent = 'Too early! Wait for green.';
        clearTimeout(timeout);
        setTimeout(startTest, 1000);
      } else {
        startTest();
      }
    });

    startTest();

    this.currentGameCleanup = () => {
      clearTimeout(timeout);
    };
  }

  loadMathQuizGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="margin-bottom: 30px;">
          <p style="font-size: 1.2rem; color: #333;">Question <span id="questionNum">1</span>/10</p>
        </div>
        <div id="questionBox" style="font-size: 2.5rem; margin: 30px 0; color: #333;"></div>
        <div id="answersBox" style="display: grid; grid-template-columns: repeat(2, 200px); gap: 15px; justify-content: center; margin: 30px auto;"></div>
        <div style="margin-top: 20px; color: #666;">
          <p>Answer as many as you can!</p>
        </div>
      </div>
    `;

    const questionBox = document.getElementById('questionBox');
    const answersBox = document.getElementById('answersBox');
    const questionNumEl = document.getElementById('questionNum');
    let currentQuestion = 1;
    let score = 0;
    const self = this;

    const generateQuestion = () => {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      
      let correctAnswer;
      switch(op) {
        case '+': correctAnswer = a + b; break;
        case '-': correctAnswer = a - b; break;
        case '×': correctAnswer = a * b; break;
      }

      questionBox.textContent = `${a} ${op} ${b} = ?`;

      const answers = [correctAnswer];
      while (answers.length < 4) {
        const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (!answers.includes(wrong) && wrong >= 0) {
          answers.push(wrong);
        }
      }
      answers.sort(() => Math.random() - 0.5);

      answersBox.innerHTML = '';
      answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.style.cssText = 'padding: 20px; font-size: 1.5rem; border: 2px solid #667eea; background: white; border-radius: 10px; cursor: pointer; transition: all 0.3s;';
        btn.addEventListener('mouseenter', () => btn.style.background = '#f0f0f0');
        btn.addEventListener('mouseleave', () => btn.style.background = 'white');
        btn.addEventListener('click', () => {
          if (answer === correctAnswer) {
            score += 100;
            self.updateScore(score);
            btn.style.background = '#4ade80';
          } else {
            btn.style.background = '#ef4444';
          }
          
          currentQuestion++;
          if (currentQuestion > 10) {
            setTimeout(() => alert(`Quiz complete! Final Score: ${score}/1000`), 300);
          } else {
            questionNumEl.textContent = currentQuestion;
            setTimeout(generateQuestion, 1000);
          }
        });
        answersBox.appendChild(btn);
      });
    };

    generateQuestion();
    this.currentGameCleanup = () => {};
  }

  loadRockPaperScissorsGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="margin-bottom: 30px;">
          <p style="font-size: 1.3rem; color: #333;">Choose your weapon!</p>
        </div>
        <div id="choices" style="display: flex; gap: 20px; justify-content: center; margin: 30px 0;"></div>
        <div id="result" style="font-size: 1.5rem; margin: 30px 0; min-height: 60px; color: #333;"></div>
        <div style="color: #666;">
          <p>Wins: <span id="wins">0</span> | Losses: <span id="losses">0</span> | Ties: <span id="ties">0</span></p>
        </div>
      </div>
    `;

    const choicesDiv = document.getElementById('choices');
    const resultDiv = document.getElementById('result');
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const tiesEl = document.getElementById('ties');
    
    let wins = 0, losses = 0, ties = 0;
    const choices = ['✊', '✋', '✌️'];
    const names = ['Rock', 'Paper', 'Scissors'];
    const self = this;

    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.textContent = choice;
      btn.style.cssText = 'font-size: 4rem; padding: 20px; background: white; border: 3px solid #667eea; border-radius: 15px; cursor: pointer; transition: all 0.3s;';
      btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
      btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
      btn.addEventListener('click', () => {
        const computerChoice = Math.floor(Math.random() * 3);
        const result = (index - computerChoice + 3) % 3;
        
        resultDiv.innerHTML = `You: ${choices[index]} vs Computer: ${choices[computerChoice]}<br>`;
        
        if (result === 0) {
          resultDiv.innerHTML += "It's a tie!";
          ties++;
          tiesEl.textContent = ties;
        } else if (result === 1) {
          resultDiv.innerHTML += 'You win!';
          wins++;
          winsEl.textContent = wins;
          self.updateScore(wins * 10);
        } else {
          resultDiv.innerHTML += 'You lose!';
          losses++;
          lossesEl.textContent = losses;
        }
      });
      choicesDiv.appendChild(btn);
    });

    this.currentGameCleanup = () => {};
  }

  loadNumberGuessGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="margin-bottom: 30px;">
          <p style="font-size: 1.3rem; color: #333;">I'm thinking of a number between 1 and 100</p>
        </div>
        <input type="number" id="guessInput" min="1" max="100" style="font-size: 1.5rem; padding: 15px; border: 2px solid #667eea; border-radius: 10px; width: 200px;" placeholder="Enter guess">
        <button id="guessBtn" style="font-size: 1.2rem; padding: 15px 30px; margin-left: 10px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">Guess</button>
        <div id="feedback" style="font-size: 1.5rem; margin: 30px 0; min-height: 60px; color: #333;"></div>
        <div style="color: #666;">
          <p>Attempts: <span id="attempts">0</span></p>
        </div>
      </div>
    `;

    const input = document.getElementById('guessInput');
    const btn = document.getElementById('guessBtn');
    const feedback = document.getElementById('feedback');
    const attemptsEl = document.getElementById('attempts');
    
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const self = this;

    const makeGuess = () => {
      const guess = parseInt(input.value);
      if (isNaN(guess) || guess < 1 || guess > 100) {
        feedback.textContent = 'Please enter a number between 1 and 100';
        return;
      }

      attempts++;
      attemptsEl.textContent = attempts;

      if (guess === targetNumber) {
        feedback.textContent = `🎉 Correct! You got it in ${attempts} attempts!`;
        const score = Math.max(0, 1000 - attempts * 50);
        self.updateScore(score);
        btn.disabled = true;
        input.disabled = true;
      } else if (guess < targetNumber) {
        feedback.textContent = '⬆️ Too low! Try higher.';
      } else {
        feedback.textContent = '⬇️ Too high! Try lower.';
      }
      
      input.value = '';
      input.focus();
    };

    btn.addEventListener('click', makeGuess);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') makeGuess();
    });

    this.currentGameCleanup = () => {};
  }

  loadColorMatchGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="margin-bottom: 30px;">
          <p style="font-size: 1.3rem; color: #333;">Does the word match the color?</p>
        </div>
        <div id="colorWord" style="font-size: 4rem; margin: 40px 0; font-weight: bold;"></div>
        <div style="display: flex; gap: 20px; justify-content: center; margin: 30px 0;">
          <button id="yesBtn" style="font-size: 1.5rem; padding: 20px 40px; background: #4ade80; color: white; border: none; border-radius: 10px; cursor: pointer;">✓ YES</button>
          <button id="noBtn" style="font-size: 1.5rem; padding: 20px 40px; background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer;">✗ NO</button>
        </div>
        <div style="color: #666;">
          <p>Time: <span id="timeLeft">30</span>s | Correct: <span id="correct">0</span></p>
        </div>
      </div>
    `;

    const wordEl = document.getElementById('colorWord');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const timeEl = document.getElementById('timeLeft');
    const correctEl = document.getElementById('correct');
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
    const colorNames = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK'];
    let timeLeft = 30;
    let correct = 0;
    let isMatch;
    const self = this;

    const newRound = () => {
      const wordIndex = Math.floor(Math.random() * colors.length);
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      wordEl.textContent = colorNames[wordIndex];
      wordEl.style.color = colors[colorIndex];
      isMatch = wordIndex === colorIndex;
    };

    const checkAnswer = (answer) => {
      if (answer === isMatch) {
        correct++;
        correctEl.textContent = correct;
        self.updateScore(correct * 10);
      }
      newRound();
    };

    yesBtn.addEventListener('click', () => checkAnswer(true));
    noBtn.addEventListener('click', () => checkAnswer(false));

    const gameInterval = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(gameInterval);
        setTimeout(() => alert(`Time's up! You got ${correct} correct!`), 300);
      }
    }, 1000);

    newRound();

    this.currentGameCleanup = () => {
      clearInterval(gameInterval);
    };
  }

  loadCoinFlipGame() {
    this.gameContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="margin-bottom: 30px;">
          <p style="font-size: 1.3rem; color: #333;">Choose Heads or Tails!</p>
        </div>
        <div id="coin" style="width: 200px; height: 200px; background: #ffd700; border-radius: 50%; margin: 30px auto; display: flex; align-items: center; justify-content: center; font-size: 4rem; border: 5px solid #b8860b; box-shadow: 0 10px 20px rgba(0,0,0,0.2);"></div>
        <div style="display: flex; gap: 20px; justify-content: center; margin: 30px 0;">
          <button id="headsBtn" style="font-size: 1.3rem; padding: 15px 30px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">🪙 Heads</button>
          <button id="tailsBtn" style="font-size: 1.3rem; padding: 15px 30px; background: #764ba2; color: white; border: none; border-radius: 10px; cursor: pointer;">🪙 Tails</button>
        </div>
        <div id="result" style="font-size: 1.3rem; margin: 20px 0; color: #333;"></div>
        <div style="color: #666;">
          <p>Wins: <span id="wins">0</span> | Losses: <span id="losses">0</span></p>
        </div>
      </div>
    `;

    const coin = document.getElementById('coin');
    const headsBtn = document.getElementById('headsBtn');
    const tailsBtn = document.getElementById('tailsBtn');
    const resultDiv = document.getElementById('result');
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    
    let wins = 0, losses = 0;
    const self = this;

    const flipCoin = (choice) => {
      coin.textContent = '🔄';
      coin.style.transform = 'rotateY(720deg)';
      coin.style.transition = 'transform 1s';
      
      setTimeout(() => {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.textContent = result === 'heads' ? '👑' : '⭐';
        coin.style.transform = 'rotateY(0deg)';
        
        if (choice === result) {
          resultDiv.textContent = `It's ${result}! You win! 🎉`;
          wins++;
          winsEl.textContent = wins;
          self.updateScore(wins * 10);
        } else {
          resultDiv.textContent = `It's ${result}! You lose! 😢`;
          losses++;
          lossesEl.textContent = losses;
        }
      }, 1000);
    };

    headsBtn.addEventListener('click', () => flipCoin('heads'));
    tailsBtn.addEventListener('click', () => flipCoin('tails'));

    coin.textContent = '🪙';

    this.currentGameCleanup = () => {};
  }
}

// Initialize global game manager
const gameManager = new GameManager();

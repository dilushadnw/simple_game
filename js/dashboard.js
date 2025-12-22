// Dashboard - Handles game tile rendering and filtering

class Dashboard {
  constructor() {
    this.gamesContainer = document.getElementById('gamesContainer');
    this.searchBar = document.getElementById('searchBar');
    this.categoryFilter = document.getElementById('categoryFilter');
    
    this.initializeEventListeners();
    this.renderGames();
  }

  initializeEventListeners() {
    // Search functionality
    this.searchBar.addEventListener('input', () => this.filterGames());
    
    // Category filter
    this.categoryFilter.addEventListener('change', () => this.filterGames());
  }

  renderGames(gamesToRender = GAMES_CATALOG) {
    this.gamesContainer.innerHTML = '';
    
    if (gamesToRender.length === 0) {
      this.gamesContainer.innerHTML = '<div class="no-results">No games found. Try a different search or filter.</div>';
      return;
    }

    gamesToRender.forEach(game => {
      const tile = this.createGameTile(game);
      this.gamesContainer.appendChild(tile);
    });
  }

  createGameTile(game) {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    
    // Add locked class if not implemented
    if (!game.implemented) {
      tile.classList.add('locked');
    }

    // Get high score for this game
    const highScore = gameManager.getHighScore(game.id);

    tile.innerHTML = `
      <div class="game-icon">${game.icon}</div>
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <span class="game-category">${game.category}</span>
      ${highScore > 0 ? `<span class="high-score-badge">🏆 ${highScore}</span>` : ''}
      ${!game.implemented ? '<p style="color: #999; font-size: 0.75rem; margin-top: 8px;">Coming Soon</p>' : ''}
    `;

    // Add click event to open game
    if (game.implemented) {
      tile.addEventListener('click', () => {
        gameManager.openGame(game.id);
      });
    }

    return tile;
  }

  filterGames() {
    const searchTerm = this.searchBar.value.toLowerCase();
    const category = this.categoryFilter.value;

    const filteredGames = GAMES_CATALOG.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm) || 
                           game.description.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || game.category === category;
      
      return matchesSearch && matchesCategory;
    });

    this.renderGames(filteredGames);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});

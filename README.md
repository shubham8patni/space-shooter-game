# Space Shooter Game

A simple 2D shooter game built with Pygame where the player's character moves and shoots at enemies.

## Setup

1. Make sure you have Python 3.x installed
2. Set up a virtual environment:
   ```
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
   - On Windows:
     ```
     venv\Scripts\activate
     ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## How to Play

### Desktop Version
Run the desktop game:
```
python game.py
```

### Web Version
Run the web-based version:
```
python app.py
```
Then open your browser and navigate to `http://localhost:5000`

### Controls
- Arrow keys: Move player
- Spacebar: Shoot
- Close the window to quit
- Press 'R' or click the RESTART button to restart the game after game over

## Game Rules
- Move your ship (green square) using arrow keys
- Avoid the red enemies
- Shoot the enemies to score points
- The game ends if an enemy hits your ship
- High score is tracked between game sessions

## Features
- Desktop version built with Pygame
- Web version built with Flask and HTML5 Canvas
- Moving star background
- Continuous shooting when holding spacebar
- Score tracking
- Game restart without reloading the page
- High score tracking 
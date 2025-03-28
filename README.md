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

Run the game:
```
python game.py
```

### Controls
- Arrow keys: Move player
- Spacebar: Shoot
- Close the window to quit

## Game Rules
- Move your ship (green square) using arrow keys
- Avoid the red enemies
- Shoot the enemies to score points
- The game ends if an enemy hits your ship 
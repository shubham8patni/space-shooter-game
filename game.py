import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Game constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
LIGHT_BLUE = (100, 100, 255)
YELLOW = (255, 255, 0)

# Create the game window
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Space Shooter")
clock = pygame.time.Clock()

class Star(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.size = random.randint(1, 3)
        self.image = pygame.Surface((self.size, self.size))
        brightness = random.randint(150, 255)
        self.image.fill((brightness, brightness, brightness))
        self.rect = self.image.get_rect()
        self.rect.x = random.randrange(SCREEN_WIDTH)
        self.rect.y = random.randrange(SCREEN_HEIGHT)
        self.speed = random.randrange(1, 3)

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > SCREEN_HEIGHT:
            self.rect.y = 0
            self.rect.x = random.randrange(SCREEN_WIDTH)

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.centerx = SCREEN_WIDTH // 2
        self.rect.bottom = SCREEN_HEIGHT - 10
        self.speed = 8
        self.shoot_delay = 150  # milliseconds (reduced from 250 for faster fire rate)
        self.last_shot = pygame.time.get_ticks()

    def update(self):
        # Movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
        if keys[pygame.K_UP]:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN]:
            self.rect.y += self.speed

        # Keep player on screen
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > SCREEN_WIDTH:
            self.rect.right = SCREEN_WIDTH
        if self.rect.top < 0:
            self.rect.top = 0
        if self.rect.bottom > SCREEN_HEIGHT:
            self.rect.bottom = SCREEN_HEIGHT

        # Continuous shooting when space key is held down
        keys = pygame.key.get_pressed()
        if keys[pygame.K_SPACE]:
            bullet = self.shoot()
            if bullet:
                return bullet
        return None

    def shoot(self):
        now = pygame.time.get_ticks()
        if now - self.last_shot > self.shoot_delay:
            self.last_shot = now
            return Bullet(self.rect.centerx, self.rect.top)
        return None

class Enemy(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((30, 30))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.x = random.randrange(SCREEN_WIDTH - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        self.speed_y = random.randrange(1, 5)
        self.speed_x = random.randrange(-2, 2)

    def update(self):
        self.rect.y += self.speed_y
        self.rect.x += self.speed_x
        
        # Respawn if off screen
        if self.rect.top > SCREEN_HEIGHT or self.rect.left < -self.rect.width or self.rect.right > SCREEN_WIDTH + self.rect.width:
            self.rect.x = random.randrange(SCREEN_WIDTH - self.rect.width)
            self.rect.y = random.randrange(-100, -40)
            self.speed_y = random.randrange(1, 5)
            self.speed_x = random.randrange(-2, 2)

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((5, 10))
        self.image.fill(LIGHT_BLUE)
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speed = -15  # Increased bullet speed (was -10)

    def update(self):
        self.rect.y += self.speed
        # Kill bullet if it goes off screen
        if self.rect.bottom < 0:
            self.kill()

def show_score(score):
    font = pygame.font.SysFont("Arial", 24)
    text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(text, (10, 10))

def main_game():
    # Create sprite groups
    all_sprites = pygame.sprite.Group()
    background_stars = pygame.sprite.Group()
    enemies = pygame.sprite.Group()
    bullets = pygame.sprite.Group()
    
    # Create stars for background
    for i in range(100):
        star = Star()
        background_stars.add(star)
        all_sprites.add(star)
    
    # Create player
    player = Player()
    all_sprites.add(player)
    
    # Add enemies
    for i in range(8):
        enemy = Enemy()
        all_sprites.add(enemy)
        enemies.add(enemy)
    
    # Game variables
    score = 0
    game_over = False
    
    # Game loop
    running = True
    while running:
        # Keep loop running at the right speed
        clock.tick(FPS)
        
        # Process events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        # Check for automatic bullet firing from player update
        bullet = player.update()
        if bullet:
            all_sprites.add(bullet)
            bullets.add(bullet)
        
        # Update other sprites
        background_stars.update()
        enemies.update()
        bullets.update()
        
        # Check for bullet-enemy collisions
        hits = pygame.sprite.groupcollide(enemies, bullets, True, True)
        for hit in hits:
            score += 1
            enemy = Enemy()
            all_sprites.add(enemy)
            enemies.add(enemy)
        
        # Check for player-enemy collisions
        if pygame.sprite.spritecollide(player, enemies, False):
            game_over = True
            running = False
        
        # Render game
        screen.fill(BLACK)
        
        # Draw all sprites
        all_sprites.draw(screen)
        
        # Draw score
        show_score(score)
        
        # Display everything
        pygame.display.flip()
    
    # Game over
    if game_over:
        font = pygame.font.SysFont("Arial", 72)
        text = font.render("GAME OVER", True, RED)
        text_rect = text.get_rect(center=(SCREEN_WIDTH/2, SCREEN_HEIGHT/2))
        screen.blit(text, text_rect)
        pygame.display.flip()
        pygame.time.wait(3000)  # Wait 3 seconds before closing
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main_game() 
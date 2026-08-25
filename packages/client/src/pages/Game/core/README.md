# Tower Defense game logic

## Overview

This is a tower defense game with a wave system, where enemies appear and move along a path from start to finish, and the player places and upgrades cannons to destroy them before they reach the goal. The game includes an economy system (player money/health), several upgradeable cannon types, waves of different enemy types, and a Strategy-pattern-based architecture for projectiles.

## Main components

### Game engine ([managers/gameEngine.ts](managers/gameEngine.ts))

The main class that ties all the systems together. It manages the game loop and coordinates rendering:

1. **Initialization**: sets up all managers (Map, Path, Enemy, Cannon, Projectile) and creates the Player object
2. **Game loop**: runs at 60 FPS using `requestAnimationFrame` with frame skipping
3. **Render order**:
   - Map layers (game field, walls, start, finish)
   - Enemy updates (spawn, movement, removal)
   - Cannon updates (targeting, firing)
   - Projectile updates (movement, collisions)
   - Cannon rendering with range indicators
   - Projectile rendering
   - Enemy rendering with health bars

### Player ([entities/player.ts](entities/player.ts))

Manages player state:

- **Health**: starts at 10 HP (configurable via `GameConfig.hp`)
- **Money**: starts at 80 coins (configurable via `GameConfig.initialMoney`)
- **Methods**:
  - `takeDamage()` — loses 1 HP when an enemy reaches the end of the path
  - `isDead()` — checks whether the game has ended
  - `addMoney(amount)` / `subtractMoney(amount)` — for buying cannons and rewarding enemy kills
  - `haveEnoughMoney(amount)` — purchase validation
  - `getMoney()` / `getHp()` — state queries

### Map manager ([managers/mapManager.ts](managers/mapManager.ts))

Responsible for the game map and user interaction:

- **Map data**: loads the map layout from JSON with different layers (Game, Walls, Start, Finish)
- **Collision grid**: builds a 2D array marking walkable (0) and blocked (1) tiles
- **Cannon placement**: tracks clicks on the canvas and tries to place cannons on valid tiles
- **Cannon type selection**: tracks `placingCannonType` for placing different cannon types
- **Validation**: prevents placing cannons on the start tile, already occupied tiles, or with insufficient money
- **Cursor preview**: displays the tile under the cursor while placing a cannon

### Path manager ([managers/pathManager.ts](managers/pathManager.ts))

Handles pathfinding using the A* algorithm (via EasyStar.js):

- **Dynamic pathfinding**: computes the optimal path from the start tile to the finish tile
- **Path validation**: when placing a cannon, checks that a path still exists
- **Blocking prevention**: rejects cannon placements that would completely block enemy movement
- **Event-driven updates**: emits the `pathManager:pathUpdated` event so all enemies recalculate their route from their current position

### Enemy system

#### Enemy class ([entities/enemy.ts](entities/enemy.ts))

Behavior of an individual enemy:

- **Enemy types**: normal (pink, speed 1), fast (light blue, speed 1.5), immune (green, speed 1, larger 12px radius), normalBoss (red, speed 1, larger size)
- **Health**: configurable per wave (from 20 to 500 HP for bosses)
- **Movement**: follows the computed path at variable speed (1-1.5 pixels/frame depending on type)
- **Pathfinding**: uses the path from PathManager and moves tile by tile
- **Dynamic rerouting**: listens for `pathManager:pathUpdated` events and recalculates the path from its current position
- **Damage system**: takes damage from projectiles, is destroyed at 0 health
- **Reward**: gives the player money when destroyed (5-50 coins depending on type)
- **Rendering**: a colored circle with a health bar showing current/max health

#### Enemy manager ([managers/enemyManager.ts](managers/enemyManager.ts))

Manages the enemy lifecycle and wave system:

- **Wave system**: loads wave configuration from `waves-config.ts` with settings for enemy type, count, spawn interval, health, and reward
- **Spawning**: automatically creates enemies based on the current wave at variable intervals (300-900 ms)
- **Delay between waves**: 10 seconds (configurable via `GameConfig.waveDelay`)
- **Cleanup**: removes enemies that are destroyed or have reached the end
- **Destruction handling**: rewards the player with money and removes the enemy on death
- **End-of-path handling**: damages the player (1 HP) and removes the enemy
- **Game-over check**: tracks completion of all waves and absence of active enemies
- **Events**: emits `redux:waveStarted` when a new wave begins

### Cannon system

#### Cannon class ([entities/cannon.ts](entities/cannon.ts))

Behavior of an individual cannon with an upgrade system:

- **Cannon types** (from `cannons-config.ts`):
  - **dumb** (cost 2) — a wall/obstacle with no combat stats
  - **basic** (cost 5) — standard cannon, 60px range, 10 damage, 1500ms fire rate
  - **rocket** (cost 15) — area damage, 70px range, 50px explosion radius, 800ms fire rate
  - **sniper** (cost 50) — long range, 100px range, 50 damage, 4000ms fire rate
  - **freeze** (cost 50) — 80px range, 10 damage, 1500ms fire rate
- **Upgrade system**: max level 5 (configurable via `GameConfig.maxCannonLevel`)
  - `upgrade()` increases: damage ×1.1, range ×1.2, fire rate ×0.9 (faster), projectile speed ×1.1, explosion radius ×1.2
  - Upgrade cost grows with each level: `cost += upgradeCost * level`
- **Targeting**: automatically selects the first enemy within range
- **Firing**: creates a projectile with a specific strategy via ProjectileManager when it fires
- **Rendering**: a square on the tile with a semi-transparent range circle, color depends on type

#### Cannon manager ([managers/cannonManager.ts](managers/cannonManager.ts))

Manages all cannons:

- **Placement**: listens for `mapManager:cannonPlaced` events and creates new cannons after validating the player's money
- **Upgrading**: `upgradeCannon(id)` upgrades a cannon, validating cost and max level
- **Selling**: `sellCannon(id)` refunds 70% of the purchase cost and frees the tile
- **Updates**: updates all cannons every frame based on current enemy positions
- **Coordination**: passes the list of living enemies to each cannon for targeting
- **Events**: listens for `redux:selectedCannon` to handle cannon selection

### Projectile system

Uses the **Strategy pattern** for an extensible architecture with various movement and collision types.

#### Projectile class ([entities/projectile/projectile.ts](entities/projectile/projectile.ts))

Behavior of an individual projectile via strategy composition:

- **Speed**: depends on the cannon (improves with cannon upgrades)
- **Damage**: depends on the cannon (10-50 base damage)
- **Movement**: determined by `MoveStrategy`
- **Collision**: determined by `CollisionStrategy`
- **Rendering**: an orange circle (configurable via `GameConfig.projectile`)

#### Move strategies (MoveStrategy)

Abstract class: [entities/projectile/MoveStrategy.ts](entities/projectile/MoveStrategy.ts)

Implementations:

- **StraightMove** ([StraightMove.ts](entities/projectile/StraightMove.ts)) — flies in a straight line from its start point until it reaches the cannon's range
- **AtTargetMove** ([AtTargetMove.ts](entities/projectile/AtTargetMove.ts)) — flies straight to the target, explodes on arrival (used for rockets)
- **NoMove** ([NoMove.ts](entities/projectile/NoMove.ts)) — a stationary projectile (unused)

#### Collision strategies (CollisionStrategy)

Abstract class: [entities/projectile/CollisionStrategy.ts](entities/projectile/CollisionStrategy.ts)

Implementations:

- **SingleHitCollision** ([SingleHitCollision.ts](entities/projectile/SingleHitCollision.ts)) — is destroyed on first contact with an enemy, dealing damage to a single target
- **ExplosionCollision** ([ExplosionCollision.ts](entities/projectile/ExplosionCollision.ts)) — area damage within the explosion radius, damages all enemies in the area once the projectile explodes
- **NoCollisionStrategy** ([NoCollisionStrategy.ts](entities/projectile/NoCollisionStrategy.ts)) — no collision detection (for dumb cannons)

#### Projectile configuration ([managers/constants/projectile-config.ts](managers/constants/projectile-config.ts))

Maps cannon types to strategies:

```typescript
projectileConfig = {
  dumb: { moveStrategy: NoMove, collisionStrategy: NoCollisionStrategy },
  basic: { moveStrategy: StraightMove, collisionStrategy: SingleHitCollision },
  fast: { moveStrategy: StraightMove, collisionStrategy: SingleHitCollision },
  rocket: { moveStrategy: AtTargetMove, collisionStrategy: ExplosionCollision },
  sniper: { moveStrategy: StraightMove, collisionStrategy: SingleHitCollision },
  freeze: { moveStrategy: AtTargetMove, collisionStrategy: ExplosionCollision }
}
```

#### Projectile manager ([managers/projectileManager.ts](managers/projectileManager.ts))

Manages the lifecycle of all projectiles:

- **Creation**: accepts requests from cannons, creates projectiles with the appropriate move and collision strategies based on cannon type
- **Update**: updates the positions of all projectiles (calls `moveStrategy.move()`) and checks collisions (calls `collisionStrategy.checkCollision()`)
- **Cleanup**: removes destroyed projectiles from the list
- **Rendering**: renders all active projectiles

## Event system ([utils/eventBus.ts](utils/eventBus.ts))

Centralized event-driven communication between components (Singleton pattern):

**Methods**:

- `on(event, handler)` — subscribe to an event, returns an unsubscribe function
- `once(event, handler)` — one-time listener
- `emit(event, payload)` — broadcast an event

**Game logic events**:

- `pathManager:pathUpdated` — the path has changed, enemies recalculate their routes
- `mapManager:cannonPlaced` — a cannon was successfully placed
- `mapManager:tryAddCannon` — a user click to place a cannon

**Redux events (UI integration)**:

- `redux:waveStarted` — a new wave has started
- `redux:selectedCannon` — a cannon was selected for upgrade/sale
- `redux:setMoney` — player money update
- `redux:setPlayerHp` — player health update

## Gameplay

### Initialization sequence

1. GameEngine creates the Player with initial money (80) and health (10)
2. MapManager loads map data from JSON
3. PathManager computes the initial path from start to finish using A*
4. EnemyManager loads the wave configuration and prepares to spawn
5. Auto-spawn of the first wave starts
6. Enemies begin moving along the path

### Game loop (every frame @ 60 FPS)

1. Clear the canvas
2. Render map layers (game field, walls, start, finish)
3. **Update enemies** (EnemyManager):
   - Check the delay between waves
   - Auto-spawn enemies for the current wave at configured intervals
   - Move all enemies along their paths according to their type's speed
   - Handle reaching the end (damages player -1 HP)
   - Handle destruction (rewards player with money)
   - Check for game over (all waves complete or player health = 0)
4. **Update cannons** (CannonManager):
   - Check for enemies within each cannon's range
   - Fire (create projectiles with the appropriate strategies) if the cooldown is over
5. **Update projectiles** (ProjectileManager):
   - Move all projectiles (call `moveStrategy.move()`)
   - Check collisions (call `collisionStrategy.checkCollision()`)
   - Deal damage on hit (single-target or area depending on strategy)
   - Remove destroyed projectiles
6. Render cannons (with range circles and type color)
7. Render projectiles
8. Render enemies (with health bars and type colors)

### Cannon placement process

1. The player selects a cannon type (MapManager tracks `placingCannonType`)
2. The player clicks on the canvas
3. MapManager converts the click into tile coordinates
4. The tile is validated (not the start tile, not occupied, player has enough money)
5. MapManager emits the `tryAddCannon` event with the cannon type
6. PathManager validates the placement:
   - Temporarily adds the cannon to the collision map
   - Tries to find a path with the new obstacle using A*
   - If a path exists — confirms the placement
   - If no path exists — shows an alert and rejects it
7. On success, the `cannonPlaced` event is emitted with the position and type
8. CannonManager:
   - Deducts the cannon's cost from the player's money
   - Creates a new cannon of the specified type at the position
   - Updates the player's money via the `redux:setMoney` event
9. PathManager emits the `pathUpdated` event
10. All enemies recalculate their routes from their current positions to the finish

### Combat mechanics

1. Every frame, cannons check all living enemies
2. If an enemy is within range AND the cooldown is over:
   - The cannon creates a projectile via ProjectileManager with the cannon's type
   - ProjectileManager selects the corresponding move and collision strategies from the configuration
   - The projectile is created with the composed strategies and aimed at the enemy's current position
   - The cannon's cooldown timer starts
3. ProjectileManager updates all active projectiles:
   - Calls `moveStrategy.move()` to move the projectile
   - Calls `collisionStrategy.checkCollision()` to check for hits
4. On collision with an enemy (depends on strategy):
   - **SingleHitCollision**: deals damage to a single enemy, the projectile is destroyed
   - **ExplosionCollision**: when the projectile reaches its target, deals area damage to all enemies within the explosion radius
   - **NoCollisionStrategy**: no collision checks (for dumb cannons)
5. If an enemy's health reaches 0:
   - The enemy is marked as destroyed
   - EnemyManager rewards the player with money (from the wave configuration)
6. Destroyed enemies are removed on the next frame by EnemyManager
7. Destroyed projectiles are removed by ProjectileManager

### Cannon upgrade process

1. The player clicks on a cannon on the map
2. MapManager emits the `redux:selectedCannon` event with the cannon's data
3. The UI displays cannon information (level, damage, range, upgrade cost)
4. The player clicks the "Upgrade" button
5. CannonManager.upgradeCannon(id):
   - Checks that the cannon hasn't reached the max level (5)
   - Checks that the player has enough money
   - Deducts the upgrade cost
   - Calls `cannon.upgrade()` — increases stats (damage, range, fire rate, etc.)
   - Updates the player's money via the `redux:setMoney` event

### Cannon selling process

1. The player clicks on a cannon on the map
2. The UI displays a "Sell" button
3. CannonManager.sellCannon(id):
   - Calculates the money refund: 70% of the total cost (initial + all upgrades)
   - Adds the money to the player
   - Frees the tile in MapManager (sets collision = 0)
   - Removes the cannon from the array
   - Recalculates the path via PathManager
   - Updates the player's money via the `redux:setMoney` event

### Wave system

1. EnemyManager loads `wavesConfig` on initialization
2. Each wave defines:
   - Enemy type (normal, fast, immune, normalBoss)
   - Number of enemies
   - Spawn interval (ms)
   - Enemy health (overrides the base value from `enemies-config.ts`)
   - Kill reward
3. Wave process:
   - 10-second delay before the next wave starts
   - Sends the `redux:waveStarted` event to the UI
   - Spawns enemies at the specified interval until the count is reached
   - Moves to the next wave once all enemies are destroyed/reach the end
4. Game over:
   - **Victory**: all waves complete and all enemies destroyed
   - **Defeat**: player health reaches 0

## Configuration

All game parameters are extracted into separate configuration files in `../constants/`:

### Game parameters ([constants/game-config.ts](../constants/game-config.ts))

```typescript
{
  waveDelay: 10000,           // Delay between waves (ms)
  hp: 10,                     // Initial player health
  initialMoney: 80,           // Initial player money
  tileSize: 32,               // Tile size (pixels)
  maxCannonLevel: 5,          // Max cannon upgrade level
  healthBar: {
    width: 24,                // Health bar width
    height: 3,                // Health bar height
    offset: 18                // Offset above the enemy
  },
  projectile: {
    radius: 3,                // Projectile radius
    color: 'orange'           // Projectile color
  }
}
```

### Cannon types ([constants/cannons-config.ts](../constants/cannons-config.ts))

```typescript
{
  dumb: { cost: 2, range: 0, damage: 0, fireRate: 0, ... },
  basic: { cost: 5, range: 60, damage: 10, fireRate: 1500, projectileSpeed: 3, ... },
  fast:  {cost: 15...},
  rocket: { cost: 20, range: 70, damage: 15, fireRate: 800, explosionRadius: 50, ... },
  sniper: { cost: 50, range: 100, damage: 50, fireRate: 4000, projectileSpeed: 15, ... },
  freeze: { cost: 50, range: 80, damage: 10, fireRate: 1500, projectileSpeed: 3, ... }
}
```

### Effect types ([constants/effects-config.ts](../constants/effects-config.ts))

```typescript
{
  dumb: null,
  basic: null,
  fast:  null,
  rocket: null,
  sniper: null,
  freeze: { duration: 2000, magnitude: 0.5, name: 'Freeze' }
}
```

### Enemy types ([constants/enemies-config.ts](../constants/enemies-config.ts))

```typescript
{
  normal: { speed: 1, color: 'pink', radius: 10 },
  fast: { speed: 1.5, color: 'lightblue', radius: 10 },
  immune: { speed: 1, color: 'lightgreen', radius: 12, immune: true },
  normalBoss: { speed: 1, color: 'red', radius: 10 }
}
```

### Waves ([constants/waves-config.ts](../constants/waves-config.ts))

An array of 4+ waves with increasing difficulty:

```typescript
[
  { enemyType: 'normal', count: 5, spawnInterval: 500, hp: 20, reward: 5 },
  { enemyType: 'fast', count: 5, spawnInterval: 300, hp: 30, reward: 7 },
  { enemyType: 'immune', count: 5, spawnInterval: 500, hp: 40, reward: 6 },
  { enemyType: 'normalBoss', count: 3, spawnInterval: 900, hp: 500, reward: 50 },
  ...
]
```

## Key patterns

- **Manager Pattern**: separate managers for Map, Path, Enemy, Cannon, Projectile — clear separation of responsibilities
- **Strategy Pattern**: projectiles use composition of movement strategies (MoveStrategy) and collision strategies (CollisionStrategy) for flexible behavior
- **Event-Driven Architecture**: loosely coupled interaction via EventBus (Singleton)
- **Entity-Component**: each enemy, cannon, and projectile is an independent entity with its own state
- **Centralized Management**: projectiles are managed centrally through ProjectileManager rather than by each cannon individually
- **Reactive Pathfinding**: the path is recalculated when the map changes (A* via EasyStar.js), enemies automatically update their routes
- **Validation Before State Change**: a path must exist before confirming cannon placement, money is checked before purchase
- **Configuration-Driven**: all game parameters, entity types, and waves are extracted into separate configuration files for easy tuning
- **Progressive Difficulty**: a wave system with increasing difficulty (enemy health, spawn rate, types)
- **Economy System**: the player manages two resources (money and health) that require strategic balancing

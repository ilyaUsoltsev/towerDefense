import React from 'react';
import MapManager from './mapManager';
import PathManager from './pathManager';
import CannonManager from './cannonManager';
import EntityManager from './entityManager';

const GamePage = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    const asyncWrapper = async () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!context || !canvas) {
        return;
      }

      const mapManager = new MapManager(context);
      const cannonManager = new CannonManager(
        context,
        mapManager.tileSize,
        mapManager.collisionMap
      );
      const pathManager = new PathManager(
        context,
        mapManager.getStartTile(),
        mapManager.getFinishTile()
      );
      const path = await pathManager.setCollisionMap(mapManager.collisionMap);

      const entityManager = new EntityManager(
        context,
        pathManager,
        mapManager.getTiles('Start')[0],
        2000
      );

      // Generate initial entities
      entityManager.generateEntities(3, 100);
      // entityManager.getEntities().forEach(entity => entity.setPath(path));

      // Start auto-spawning
      entityManager.startSpawning();

      canvas.width = mapManager.mapWidth * mapManager.tileSize;
      canvas.height = mapManager.mapHeight * mapManager.tileSize;

      const animate = () => {
        const currentTime = Date.now();
        context.clearRect(0, 0, canvas.width, canvas.height);
        mapManager.renderGameField();
        mapManager.renderWalls();
        mapManager.renderStart();
        mapManager.renderFinish();
        pathManager.renderPathStartFinish();

        entityManager.update(currentTime, path);
        cannonManager.update(entityManager.getAliveEntities());
        cannonManager.render();

        entityManager.render();
        requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    asyncWrapper();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default GamePage;

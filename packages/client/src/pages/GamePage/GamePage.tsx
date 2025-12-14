import React from 'react';
import MapManager from './mapManager';
import Entity from './entity';
import PathManager from './pathManager';
import CannonManager from './cannonManager';

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
      const entity = new Entity(mapManager.getTiles('Start')[0], pathManager);
      entity.setPath(path);

      const entities = [entity];

      canvas.width = mapManager.mapWidth * mapManager.tileSize;
      canvas.height = mapManager.mapHeight * mapManager.tileSize;

      const animate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        mapManager.renderGameField();
        mapManager.renderWalls();
        mapManager.renderStart();
        mapManager.renderFinish();
        pathManager.renderPathStartFinish();

        cannonManager.update(entities);
        cannonManager.render();

        entity.render(context);
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

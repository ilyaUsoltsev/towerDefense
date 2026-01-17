import { FC } from 'react';
import { GameStats } from './components/GameStats';
import Game from './Game';
import GameMenu from './GameMenu';
import { WaveInfo } from './components/WaveInfo';
import { useSelector } from '../../store';

const GameScreen: FC = () => {
  const money = useSelector(state => state.game.money);
  const lives = useSelector(state => state.game.hp);
  const waveNumber = useSelector(state => state.game.waveNumber);

  return (
    <>
      <div className="flex gap-2">
        <div>
          <GameStats waveNumber={waveNumber} lives={lives} money={money} />
          <Game />
        </div>
        <GameMenu />
      </div>
      {waveNumber !== null && <WaveInfo waveNumber={waveNumber} />}
    </>
  );
};

export default GameScreen;

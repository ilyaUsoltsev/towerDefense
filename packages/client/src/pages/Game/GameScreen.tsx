import { FC } from 'react';
import { useSelector } from '../../store';
import { GameStats } from './components/GameStats';
import { WaveInfo } from './components/WaveInfo';
import Game from './Game';
import GameMenu from './GameMenu';

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

import MoveStrategy from './MoveStrategy';

class NoMove implements MoveStrategy {
  move() {
    return;
  }
}

export default NoMove;

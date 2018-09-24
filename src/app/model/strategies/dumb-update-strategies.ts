import { UpdateStrategy } from '../update-strategy';

export class MoveLeft extends UpdateStrategy {

  private distanceMoved = 0;
  private dx = 1;

  update(timeElapsed: number) {

    if (this.distanceMoved > 300) {
      this.entityImpl.setStrategy(new MoveUp());
      return;
    }
    this.entityImpl.cx -= this.dx;
    this.distanceMoved += this.dx;
  }

}

export class MoveRight extends UpdateStrategy {
  private distanceMoved = 0;
  private dx = 1;

  update(timeElapsed: number) {

    if (this.distanceMoved > 300) {
      this.entityImpl.setStrategy(new MoveDown());
      return;
    }
    this.entityImpl.cx += this.dx;
    this.distanceMoved += this.dx;
  }
}

export class MoveUp extends UpdateStrategy {
  private distanceMoved = 0;
  private dy = 1;

  update(timeElapsed: number) {

    if (this.distanceMoved > 300) {
      this.entityImpl.setStrategy(new MoveRight());
      return;
    }
    this.entityImpl.cy -= this.dy;
    this.distanceMoved += this.dy;
  }
}

export class MoveDown extends UpdateStrategy {
  private distanceMoved = 0;
  private dy = 1;

  update(timeElapsed: number) {

    if (this.distanceMoved > 300) {
      this.entityImpl.setStrategy(new MoveLeft());
      return;
    }
    this.entityImpl.cy += this.dy;
    this.distanceMoved += this.dy;
  }
}

export class NoOp extends UpdateStrategy {
  update(timeElapsed: number) {}
}

export class Circle400 extends UpdateStrategy {
  update(timeElapsed: number) {
    const dx = .02 * (400 - this.entityImpl.cy);
    const dy = .02 * (this.entityImpl.cx - 400);
    this.entityImpl.cx += dx;
    this.entityImpl.cy += dy;
  }
}

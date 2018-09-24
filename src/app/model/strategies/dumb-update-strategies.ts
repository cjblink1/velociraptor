import { UpdateStrategy } from '../update-strategy';
import { EntityImpl } from '../entity-impl';
import { World } from '../world';
import { Entity } from '../entity';

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
    const dx = .01 * (400 - this.entityImpl.cy);
    const dy = .01 * (this.entityImpl.cx - 400);
    this.entityImpl.cx += dx;
    this.entityImpl.cy += dy;
  }
}

export class FollowEvader extends UpdateStrategy {

  private evader: Entity;

  onEntry(entityImpl: EntityImpl, world: World) {
    super.onEntry(entityImpl, world);
    this.pickEvader();
  }

  private pickEvader() {
    this.evader = this.world.getEntities().find(entity => entity.getType() === 'evader');
  }

  update(timeElapsed: number) {
    if (!this.evader) {
      this.pickEvader();
    }
    const dx = .02 * (this.evader.getX() - this.entityImpl.cx);
    const dy = .02 * (this.evader.getY() - this.entityImpl.cy);
    this.entityImpl.cx += dx;
    this.entityImpl.cy += dy;
  }
}

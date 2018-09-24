import { UpdateStrategy } from '../update-strategy';
import { EntityImpl } from '../entity-impl';
import { World } from '../world';
import { Entity } from '../entity';
import * as d3 from 'd3';

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

export class FigureEight extends UpdateStrategy {

  private t = 0;

  update(timeElapsed: number, delta: number) {
    this.entityImpl.cx = 400 + 200 * Math.cos((2 * Math.PI / 4500) * this.t);
    this.entityImpl.cy = 400 + 60 * Math.sin((4 * Math.PI / 4500) * this.t);
    this.t += delta;
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

export class MouseMove extends UpdateStrategy {

  private mouseX: number;
  private mouseY: number;

  onEntry(entityImpl: EntityImpl, world: World) {
    super.onEntry(entityImpl, world);

    this.mouseX = 0;
    this.mouseY = 0;

    world.ref.on('mousemove', () => {
      this.mouseX = d3.event.offsetX;
      this.mouseY = d3.event.offsetY;
    });
  }

  update(timeElapsed: number, delta: number) {
    this.entityImpl.cx = this.mouseX;
    this.entityImpl.cy = this.mouseY;
  }

}


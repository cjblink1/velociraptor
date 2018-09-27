import { UpdateStrategy } from '../update-strategy';
import { EntityImpl } from '../entity-impl';
import { World } from '../world';
import { Entity } from '../entity';
import * as d3 from 'd3';

export class FollowEvaderSpeed extends UpdateStrategy {

    private evader: Entity;
  
    onEntry(entityImpl: EntityImpl, world: World) {
      super.onEntry(entityImpl, world);
      this.pickEvader();
    }
  
    private pickEvader() {
      this.evader = this.world.getEntities().find(entity => entity.getType() === 'evader');
    }
  
    update(timeElapsed: number, delta: number) {
      if (!this.evader) {
        this.pickEvader();
      }
      const dx = this.evader.getX() - this.entityImpl.cx;
      const dy = this.evader.getY() - this.entityImpl.cy;

      const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

      const totalDistance = delta * this.entityImpl.getSpeed();

      const proportion = totalDistance / toEvader;

      this.entityImpl.cx += dx * proportion;
      this.entityImpl.cy += dy * proportion;


      
    }
}

export class EscapePredator extends UpdateStrategy {

    private pursuer: Entity;
  
    onEntry(entityImpl: EntityImpl, world: World) {
      super.onEntry(entityImpl, world);
      this.pickPursuer();
    }
  
    private pickPursuer() {
      this.pursuer = this.world.getEntities().find(entity => entity.getType() === 'pursuer');
    }
  
    update(timeElapsed: number, delta: number) {
      if (!this.pursuer) {
        this.pickPursuer();
      }
      const dx = this.entityImpl.cx - this.pursuer.getX();
      const dy = this.entityImpl.cy - this.pursuer.getY();

      const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

      const totalDistance = delta * this.entityImpl.getSpeed();

      const proportion = totalDistance / toEvader;

      this.entityImpl.cx += dx * proportion;
      this.entityImpl.cy += dy * proportion;
    }
}


export class Turn extends UpdateStrategy {

  private totalAngle: number;
  private centerX: number;
  private centerY: number;
  private degreeTurn;
  private newX: number;
  private newY: number;
  private start: number;

  constructor(degreeTurn: number, newX: number, newY: number, centerX: number, centerY: number, start: number) {
    super();
    this.degreeTurn = degreeTurn;
    this.newX = newX;
    this.newY = newY;
    this.centerX = centerX;
    this.centerY = centerY;
    this.start = start;
  }


  onEntry(entityImpl: EntityImpl, world: World) {
    super.onEntry(entityImpl, world);
    this.totalAngle = 0;
  }

  update(timeElapsed: number, delta: number) {
    const totalDistance = delta * this.entityImpl.getSpeed();

    const radians = totalDistance / (this.entityImpl.getTurningRadius());

    this.totalAngle += radians;

    this.entityImpl.cx = this.centerX + Math.cos(this.totalAngle + this.start) * this.entityImpl.getTurningRadius();
    this.entityImpl.cy = this.centerY + Math.sin(this.totalAngle - this.start) * this.entityImpl.getTurningRadius();

    if (this.totalAngle >= this.degreeTurn) {
      this.entityImpl.setStrategy(new GoDirection(this.newX, this.newY));
    }
  }
}


export class EscapePredatorTurn extends UpdateStrategy {

  private pursuer: Entity;

  onEntry(entityImpl: EntityImpl, world: World) {
    super.onEntry(entityImpl, world);
    this.pickPursuer();
  }

  private pickPursuer() {
    this.pursuer = this.world.getEntities().find(entity => entity.getType() === 'pursuer');
  }

  update(timeElapsed: number, delta: number) {
    if (!this.pursuer) {
      this.pickPursuer();
    }
    const dx = this.entityImpl.cx - this.pursuer.getX();
    const dy = this.entityImpl.cy - this.pursuer.getY();

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    const totalDistance = delta * this.entityImpl.getSpeed();

    const proportion = totalDistance / toEvader;

    this.entityImpl.cx += dx * proportion;
    this.entityImpl.cy += dy * proportion;

    if (toEvader <= 15) {
      this.entityImpl.setStrategy(new Turn(Math.PI / 2.0, 0, -1, this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.5 * Math.PI));
    }
  }
}


export class GoDirection extends UpdateStrategy {

  private dirX: number;
  private dirY: number;

  constructor(dirX: number, dirY: number){
    super();
    this.dirX = dirX;
    this.dirY = dirY;
  }

  update(timeElapsed: number, delta: number) {

    const dx = this.dirX;
    const dy = this.dirY;

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    const totalDistance = delta * this.entityImpl.getSpeed();

    const proportion = totalDistance / toEvader;

    this.entityImpl.cx += dx * proportion;
    this.entityImpl.cy += dy * proportion;
  }
}


export class GoDirectionOfEvader extends UpdateStrategy {

  private dirX: number;
  private dirY: number;
  private evader: Entity;

  constructor(dirX: number, dirY: number) {
    super();
    this.evader = this.world.getEntities().find(entity => entity.getType() === 'evader');
    this.dirX = this.entityImpl.getX() - this.evader.getX();
    this.dirY = this.entityImpl.getY() - this.evader.getY();
    const toEvader = Math.sqrt(Math.pow(this.dirX,2) + Math.pow(this.dirY,2));

    this.dirX = this.dirX / toEvader;
    this.dirY = this.dirY / toEvader;
  }

  update(timeElapsed: number, delta: number) {
    const dx = this.dirX;
    const dy = this.dirY;

    const totalDistance = delta * this.entityImpl.getSpeed();

    this.entityImpl.cx += dx * totalDistance;
    this.entityImpl.cy += dy * totalDistance;

    const testx = this.evader.getX() - this.entityImpl.cx;
    const testy = this.evader.getY() - this.entityImpl.cy;

    const totalDis = Math.sqrt(Math.pow(testx,2) + Math.pow(testy,2));

    const dirToX = testx;
    const dirToY = testy;

   /* if ( Math.abs(testx/totalDis - dx) > .1 || Math.abs(testy/totalDis - dy) > .1 ) {
      const newAngle  = Math.atan(dirToY / dirToX);
      const curAngle = Math.atan(this.dirY / this.dirX);
      
      if (newAngle > curAngle) {
        this.entityImpl.setStrategy(new PredatorTurn(newAngle - curAngle, dirToX, dirToY, this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.75 *Math.PI));
      } else {
        this.entityImpl.setStrategy(new PredatorTurn(curAngle - newAngle, dirToX, dirToY, this.entityImpl.getX(), this.entityImpl.getY() + this.entityImpl.getTurningRadius(), 1.75 * Math.PI));
      }

    }*/
  }
}
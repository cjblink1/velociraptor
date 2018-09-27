import { UpdateStrategy } from '../update-strategy';
import { EntityImpl } from '../entity-impl';
import { World } from '../world';
import { Entity } from '../entity';
import * as d3 from 'd3';


export class GoDir extends UpdateStrategy {

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

export class PredatorStratgey1 extends UpdateStrategy {

  update(timeElapsed: number, delta: number) {

    const pursuer = this.world.getEntities().find(entity => entity.getType() === 'evader');

    const dx = this.entityImpl.cx - pursuer.getX();
    const dy = this.entityImpl.cy - pursuer.getY();

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    if ((10/3600) * 15000 < toEvader) {
      this.entityImpl.setStrategy(new GoDir(1,0));
    } else {
      this.entityImpl.setStrategy(new Turn(Math.PI / 2.0, 0, -1, this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.5 * Math.PI, 0,1));
    }
  }

}

export class PreyStratgey1 extends UpdateStrategy {


  update(timeElapsed: number, delta: number) {
    const pursuer = this.world.getEntities().find(entity => entity.getType() === 'pursuer');

    const dx = this.entityImpl.cx - pursuer.getX();
    const dy = this.entityImpl.cy - pursuer.getY();

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    if ((10/3600) * 15000 < toEvader) {
      this.entityImpl.setStrategy(new GoDir(1,0));
    } else {
      this.entityImpl.setStrategy(new Turn(Math.PI / 2.0, 0, -1, this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.5 * Math.PI, 0,1));
    }
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
    private numTurn: number;
    private direction: number;
  
    constructor(degreeTurn: number, newX: number, newY: number, centerX: number, centerY: number, start: number, numTurn: number, direction: number) {
      super();
      this.degreeTurn = degreeTurn;
      this.newX = newX;
      this.newY = newY;
      this.centerX = centerX;
      this.centerY = centerY;
      this.start = start;
      this.numTurn = numTurn;
      this.direction = direction;
    }
  
  
    onEntry(entityImpl: EntityImpl, world: World) {
      super.onEntry(entityImpl, world);
      this.totalAngle = 0;
    }
  
    update(timeElapsed: number, delta: number) {
      const totalDistance = delta * this.entityImpl.getSpeed();
  
      const radians = totalDistance / (this.entityImpl.getTurningRadius());
  
      this.totalAngle +=  radians;
  
      this.entityImpl.cx = this.centerX + Math.cos(this.direction * this.totalAngle + this.start) * this.entityImpl.getTurningRadius();
      this.entityImpl.cy = this.centerY + Math.sin(this.totalAngle - this.start) * this.entityImpl.getTurningRadius();

      if (this.totalAngle >= this.degreeTurn) {
      
        if (this.entityImpl.getType() == 'evader') {
          this.entityImpl.setStrategy(new GoDir(0,-1));
        } else {
          if (this.numTurn == 0) {
            this.entityImpl.setStrategy(new Turn(Math.PI / 2.0, 0, -1, this.entityImpl.getX() + this.entityImpl.getTurningRadius(), this.entityImpl.getY(), Math.PI, 1,-1));
          } else {
            this.entityImpl.setStrategy(new GoDir(1, 0));
          }
        }
      }
    

    }
  }
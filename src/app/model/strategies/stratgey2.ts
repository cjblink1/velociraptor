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

export class PredatorStratgey2 extends UpdateStrategy {

  update(timeElapsed: number, delta: number) {
    const angle1 = Math.PI / 3;
    const angle2 = Math.PI / 8;

    const pursuer = this.world.getEntities().find(entity => entity.getType() === 'evader');

    const dx = this.entityImpl.cx - pursuer.getX();
    const dy = this.entityImpl.cy - pursuer.getY();

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    if ((10/3600) * 15000 < toEvader) {
      this.entityImpl.setStrategy(new GoDir(1,0));
    } else {
      const angles = new Angles(angle1, angle2, this.entityImpl.getTurningRadius())
      this.entityImpl.setStrategy(new Turn(angle1, angles.newDir()[0], angles.newDir()[1], this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.5 * Math.PI, 0,1, angles));
    }
  }

}

export class PreyStratgey2 extends UpdateStrategy {


  update(timeElapsed: number, delta: number) {
    const angle = Math.PI * .75;

    const pursuer = this.world.getEntities().find(entity => entity.getType() === 'pursuer');

    const dx = this.entityImpl.cx - pursuer.getX();
    const dy = this.entityImpl.cy - pursuer.getY();

    const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    if ((10/3600) * 15000 < toEvader) {
      this.entityImpl.setStrategy(new GoDir(1,0));
    } else {
      const E1x = this.entityImpl.getX() + this.entityImpl.getTurningRadius() * Math.sin(angle);
      const E1y = this.entityImpl.getY() + this.entityImpl.getTurningRadius() * (1 + Math.cos(Math.PI - angle));
      const vx = E1x + 1;
      const vy = E1y + Math.tan(angle);
      this.entityImpl.setStrategy(new Turn(angle, (-1)*vx, (-1)*vy, this.entityImpl.getX(), this.entityImpl.getY() - this.entityImpl.getTurningRadius(), 1.5 * Math.PI, 0,1,0));
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
    private angles;
  
    constructor(degreeTurn: number, newX: number, newY: number, centerX: number, centerY: number, start: number, numTurn: number, direction: number, angles) {
      super();
      this.degreeTurn = degreeTurn;
      this.newX = newX;
      this.newY = newY;
      this.centerX = centerX;
      this.centerY = centerY;
      this.start = start;
      this.numTurn = numTurn;
      this.direction = direction;
      this.angles = angles;
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
          this.entityImpl.setStrategy(new GoDir(this.newX, this.newY));
        } else {
          if (this.numTurn == 0) {
            this.entityImpl.setStrategy(new Turn(this.angles.theta2, this.newX, this.newY, this.angles.C()[0], this.angles.C()[1], Math.PI - this.angles.A(), 1,-1, this.angles));
          } else {
            this.entityImpl.setStrategy(new GoDir(this.newX, (-1)*this.newY));
          }
        }
      }

    }
}

export class Angles {

  public theta1: number;
  public theta2: number;
  private radius: number;

  constructor(theta1, theta2, radius) {
    this.theta1 = theta1;
    this.theta2 = theta2;
    this.radius = radius;

  }

  newDir() {
    const x = this.P2()[0] + 1;
    const y = this.P2()[1] + this.M2();
    return [x,y];
  }

  M2() {
    const x = this.C()[0] - this.P2()[0];
    const y = this.P2()[1] - this.C()[1];
    return x / y;
  }

  P2() {
    const x = this.C()[0] + this.radius * Math.cos(Math.PI * this.A() - this.theta2);
    const y = this.C()[1] + this.radius * Math.sin(Math.PI * this.A() - this.theta2);
    return [x,y];
  }

  A() {
    const x = this.P1()[0] - this.C()[0];
    const y = this.P1()[1] - this.C()[1];

    return Math.atan(((-1) * y) / x);
  }

  C() {
    const divis = Math.sqrt(Math.pow(1/Math.tan(this.theta1),2) + 1)

    const x = this.P1()[0] + this.radius * (1/divis);

    const y = this.P1()[1] + this.radius * ((-1) / Math.tan(this.theta1)) / divis;
    return [x,y];
  }

  P1() {
    const x = this.P0()[0] +  this.radius * Math.sin(this.theta1);
    const y = this.P0()[1] + this.radius * (1 - Math.cos(this.theta1));
    return [x,y];
  }

  P0() {
    return [0,0];
  }


}
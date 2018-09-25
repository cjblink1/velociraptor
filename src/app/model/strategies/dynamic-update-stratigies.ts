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
      const dx = this.entityImpl.cx - this.pursuer.getX() ;
      const dy = this.entityImpl.cy - this.pursuer.getY() ;

      const toEvader = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

      const totalDistance = delta * this.entityImpl.getSpeed();

      const proportion = totalDistance / toEvader;

      this.entityImpl.cx += dx * proportion;
      this.entityImpl.cy += dy * proportion;
    }
}
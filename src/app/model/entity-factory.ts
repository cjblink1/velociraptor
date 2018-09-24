import { Entity } from './entity';
import { EntityImpl } from './entity-impl';
import { World } from './world';
import { NoOp, Circle400, MoveLeft, FollowEvader, FigureEight, MouseMove } from './strategies/dumb-update-strategies';

export class EntityFactory {

  private entitiesRef;
  private tracesRef;
  private world: World;

  constructor(entitiesRef, tracesRef, world: World) {
    this.entitiesRef = entitiesRef;
    this.tracesRef = tracesRef;
    this.world = world;
  }

  public createEvader(startX: number, startY: number): Entity {
    const lineRef = this.tracesRef.append('path')
      .attr('id', 'th-trace')
      .attr('d', `M${+startX} ${+startY} L `)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-dasharray', '10,10')
      .attr('stroke-width', 4);
    const ref = this.entitiesRef.append('circle')
      .attr('id', 'th')
      .attr('r', 30);
    return new EntityImpl('evader', startX, startY, ref, lineRef, this.world, new MouseMove());
  }

  public createPursuer(startX: number, startY: number): Entity {
    const lineRef = this.tracesRef.append('path')
      .attr('id', 'raptor-trace')
      .attr('d', `M${startX} ${startY} `)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-dasharray', '10,10')
      .attr('stroke-width', 4);
    const ref = this.entitiesRef.append('circle')
    .attr('id', 'raptor')
    .attr('r', 10);
    return new EntityImpl('pursuer', startX, startY, ref, lineRef, this.world, new FollowEvader());
  }
}

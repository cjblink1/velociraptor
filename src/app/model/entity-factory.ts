import { Entity } from './entity';
import { EntityImpl } from './entity-impl';
import { World } from './world';
import { MoveUp, MoveLeft, NoOp, Circle400 } from './strategies/dumb-update-strategies';

export class EntityFactory {

  private svg;
  private world: World;

  constructor(svg, world: World) {
    this.svg = svg;
    this.world = world;
  }

  public createEvader(startX: number, startY: number): Entity {
    const lineRef = this.svg.append('path')
      .attr('id', 'th-trace')
      .attr('d', `M${+startX} ${+startY} L `)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '10,10')
      .attr('stroke-width', 4);
    const ref = this.svg.append('circle')
      .attr('id', 'th')
      .attr('r', 30);
    return new EntityImpl(startX, startY, ref, lineRef, this.world, new Circle400());
  }

  public createPursuer(startX: number, startY: number): Entity {
    const lineRef = this.svg.append('path')
      .attr('id', 'th-trace')
      .attr('d', `M${startX} ${startY} `)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '10,10')
      .attr('stroke-width', 4);
    const ref = this.svg.append('circle')
    .attr('id', 'raptor')
    .attr('r', 10);
    return new EntityImpl(startX, startY, ref, lineRef, this.world, new NoOp());
  }
}

import { Entity } from './entity';
import { EntityImpl } from './entity-impl';
import { World } from './world';
import { MoveUp, MoveLeft, NoOp } from './strategies/dumb-update-strategies';

export class EntityFactory {

  private svg;
  private world: World;

  constructor(svg, world: World) {
    this.svg = svg;
    this.world = world;
  }

  public createEvader(startX: number, startY: number): Entity {
    const ref = this.svg.append('circle')
      .attr('id', 'th')
      .attr('r', 30);
    return new EntityImpl(startX, startY, ref, this.world, new MoveLeft());
  }

  public createPursuer(startX: number, startY: number): Entity {
    const ref = this.svg.append('circle')
    .attr('id', 'raptor')
    .attr('r', 10);
    return new EntityImpl(startX, startY, ref, this.world, new NoOp());
  }
}

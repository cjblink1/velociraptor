import { Entity } from './entity';
import { EntityImpl } from './entity-impl';
import { World } from './world';

export abstract class UpdateStrategy implements Entity {

  protected entityImpl: EntityImpl;
  protected world: World;

  onEntry(entityImpl: EntityImpl, world: World) {
    this.entityImpl = entityImpl;
    this.world = world;
  }

  onExit() {}

  update(timeElapsed: number) {}

  render() {
    this.entityImpl.ref.attr('cx', this.entityImpl.cx);
    this.entityImpl.ref.attr('cy', this.entityImpl.cy);
  }
}

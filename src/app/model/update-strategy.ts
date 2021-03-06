import { Entity } from './entity';
import { EntityImpl } from './entity-impl';
import { World } from './world';

export abstract class UpdateStrategy {

  protected entityImpl: EntityImpl;
  protected world: World;

  onEntry(entityImpl: EntityImpl, world: World) {
    this.entityImpl = entityImpl;
    this.world = world;
  }

  onExit() {}

  update(timeElapsed: number, delta: number) {}

  render() {
    const data = this.entityImpl.lineRef.attr('d');
    this.entityImpl.lineRef.attr('d', data + `${+this.convertMeterToPixel(this.entityImpl.cx)},${+this.convertMeterToPixel(this.entityImpl.cy)} `);
    this.entityImpl.ref.attr('cx', this.convertMeterToPixel(this.entityImpl.cx));
    this.entityImpl.ref.attr('cy', this.convertMeterToPixel(this.entityImpl.cy));
  }

  convertMeterToPixel(pos) {
    return (pos * 3) + 400;
  }
}

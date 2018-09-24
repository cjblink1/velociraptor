import { Entity } from './entity';

export class World {
  private entities: Entity[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  getEntities(): Entity[] {
    return this.entities.slice(0);
  }

  update(elapsed: number, delta: number) {
    this.entities.forEach(entity => entity.update(elapsed, delta));
  }

  render() {
    this.entities.forEach(entity => entity.render());
  }
}

import { Entity } from './entity';

export class World {
  private entities: Entity[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  update(elapsed: number) {
    this.entities.forEach(entity => entity.update(elapsed));
  }

  render() {
    this.entities.forEach(entity => entity.render());
  }
}

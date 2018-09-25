import { Entity } from './entity';

export class World {
  public ref;
  private entities: Entity[] = [];

  constructor(ref) {
    this.ref = ref;
  }

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

  clear() {
    this.entities.forEach(entity => entity.clear());
    this.entities = [];
  }

  changeStrategyForType(type: string, newStrategy) {
    this.entities
    .filter(entity => entity.getType() === type)
    .forEach(entity => entity.setStrategy(new newStrategy()));

  }
}

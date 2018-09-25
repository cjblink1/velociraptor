import { Entity } from './entity';

export class World {
  public ref;
  private entities: Entity[] = [];
  public caputreRadius;

  constructor(ref, captureRadius) {
    this.ref = ref;
    this.caputreRadius = captureRadius
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  getEntities(): Entity[] {
    return this.entities.slice(0);
  }

  update(elapsed: number, delta: number) {
    this.entities.forEach(entity => entity.update(elapsed, delta));
    this.entities.forEach(entity1 => {
      this.entities.forEach(entity2 => {
        if (entity1 !== entity2) {
          if (Math.pow(entity1.getX() - entity2.getX(), 2) + Math.pow(entity1.getY() - entity2.getY(), 2) < Math.pow(this.caputreRadius,2)) {
            return false;
          }
        }
      })
    })
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

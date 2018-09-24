import { Entity } from './entity';
import { UpdateStrategy } from './update-strategy';
import { World } from './world';

export class EntityImpl implements Entity {
  public cx: number;
  public cy: number;
  public ref;
  public lineRef;
  public world;
  private currentStrategy: UpdateStrategy;

  constructor(startX: number, startY: number, ref, lineRef, world: World, initialStrategy: UpdateStrategy) {
    this.cx = startX;
    this.cy = startY;
    this.ref = ref;
    this.lineRef = lineRef;
    this.world = world;
    this.currentStrategy = initialStrategy;
    this.currentStrategy.onEntry(this, this.world);
  }

  update(timeElapsed: number): void {
    this.currentStrategy.update(timeElapsed);
  }

  render(): void {
    this.currentStrategy.render();
  }

  setStrategy(newStrategy: UpdateStrategy) {
    this.currentStrategy.onExit();
    this.currentStrategy = newStrategy;
    this.currentStrategy.onEntry(this, this.world);
  }
}

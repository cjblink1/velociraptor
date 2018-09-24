import { Entity } from './entity';
import { UpdateStrategy } from './update-strategy';
import { World } from './world';

export class EntityImpl implements Entity {
  public type: string;
  public cx: number;
  public cy: number;
  public ref;
  public lineRef;
  public world;
  private currentStrategy: UpdateStrategy;

  constructor(type: string, startX: number, startY: number, ref, lineRef, world: World, initialStrategy: UpdateStrategy) {
    this.type = type;
    this.cx = startX;
    this.cy = startY;
    this.ref = ref;
    this.lineRef = lineRef;
    this.world = world;
    this.currentStrategy = initialStrategy;
    this.currentStrategy.onEntry(this, this.world);
  }

  update(timeElapsed: number, delta: number): void {
    this.currentStrategy.update(timeElapsed, delta);
  }

  render(): void {
    this.currentStrategy.render();
  }

  getX(): number {
    return this.cx;
  }
  getY(): number {
    return this.cy;
  }
  getType(): string {
    return this.type;
  }

  setStrategy(newStrategy: UpdateStrategy) {
    this.currentStrategy.onExit();
    this.currentStrategy = newStrategy;
    this.currentStrategy.onEntry(this, this.world);
  }
}

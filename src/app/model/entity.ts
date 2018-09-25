import { UpdateStrategy } from './update-strategy';

export interface Entity {
  getX(): number;
  getY(): number;
  update(timeElapsed: number, delta: number): void;
  render(): void;
  getType(): string;
  clear(): void;
  setStrategy(newStrategy: UpdateStrategy): void;
}

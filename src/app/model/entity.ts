export interface Entity {
  getX(): number;
  getY(): number;
  update(timeElapsed: number, delta: number): void;
  render(): void;
  getType(): string;
}

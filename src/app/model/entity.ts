export interface Entity {
  getX(): number;
  getY(): number;
  update(timeElapsed: number): void;
  render(): void;
  getType(): string;
}

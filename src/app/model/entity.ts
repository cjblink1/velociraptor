export interface Entity {
  update(timeElapsed: number): void;
  render(): void;
}

export class Metrics {
  private counters = new Map<string, number>();

  increment(metric: string, value = 1): void {
    const current = this.counters.get(metric) ?? 0;
    this.counters.set(metric, current + value);
  }

  getValue(metric: string): number {
    return this.counters.get(metric) ?? 0;
  }

  reset(metric: string): void {
    this.counters.delete(metric);
  }

  snapshot(): Record<string, number> {
    return Object.fromEntries(this.counters.entries());
  }
}

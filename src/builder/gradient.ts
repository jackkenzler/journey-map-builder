/** Smallest gap, as a fraction of the road, allowed between two neighbouring color transitions. */
export const MIN_TRANSITION_GAP = 0.02;

const MAX_BLEND_WINDOW = 0.028;

export interface GradientStop {
  color: string;
  offset: number;
}

/** The original hand-tuned transition points, spread evenly once there are more stages than presets. */
export function getDefaultGradientTransitions(colorCount: number) {
  if (colorCount <= 1) return [1];
  const defaultOffsets = [0.15, 0.61, 0.69, 0.841505];
  if (colorCount - 1 <= defaultOffsets.length) {
    return defaultOffsets.slice(0, colorCount - 1);
  }

  const start = 0.15;
  const end = 0.86;
  const step = (end - start) / (colorCount - 2);
  return Array.from({ length: colorCount - 1 }, (_, index) =>
    Number((index === colorCount - 2 ? end : start + step * index).toFixed(6)),
  );
}

export function getEvenGradientTransitions(colorCount: number) {
  if (colorCount <= 1) return [1];
  return Array.from({ length: colorCount - 1 }, (_, index) => Number(((index + 1) / colorCount).toFixed(6)));
}

/**
 * Uses the map's saved transition points when they fit the current number of stages, otherwise
 * falls back to the defaults. Always returns increasing values between 0 and 1.
 */
export function resolveGradientTransitions(colorCount: number, custom?: number[]) {
  if (colorCount <= 1) return [1];
  if (!custom || custom.length !== colorCount - 1 || custom.some((value) => !Number.isFinite(value))) {
    return getDefaultGradientTransitions(colorCount);
  }

  const resolved: number[] = [];
  custom.forEach((value, index) => {
    const min = (resolved[index - 1] ?? 0) + (index === 0 ? 0 : MIN_TRANSITION_GAP);
    resolved.push(Math.min(1, Math.max(min, value)));
  });
  return resolved;
}

export function getGradientColorStops(colors: string[], transitions?: number[]): GradientStop[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) {
    return [
      { color: colors[0], offset: 0 },
      { color: colors[0], offset: 1 },
    ];
  }

  const pivots = resolveGradientTransitions(colors.length, transitions);
  const stops: GradientStop[] = [{ color: colors[0], offset: 0 }];

  colors.forEach((color, index) => {
    if (index === 0) return;

    const pivot = pivots[index - 1] ?? 1;
    // Narrow the fade when two transitions sit close together so their blends never overlap.
    const before = pivot - (pivots[index - 2] ?? 0);
    const after = (pivots[index] ?? 1) - pivot;
    const blend = Math.max(0, Math.min(MAX_BLEND_WINDOW, before / 2, after / 2));

    stops.push({ color: colors[index - 1], offset: Number(Math.max(0, pivot - blend).toFixed(6)) });
    stops.push({ color, offset: Number(Math.min(1, pivot + blend).toFixed(6)) });
  });

  stops.push({ color: colors[colors.length - 1], offset: 1 });
  return stops;
}

export function gradientStopsToCss(stops: GradientStop[]) {
  if (stops.length === 0) return 'transparent';
  return `linear-gradient(to right, ${stops.map((stop) => `${stop.color} ${(stop.offset * 100).toFixed(3)}%`).join(', ')})`;
}

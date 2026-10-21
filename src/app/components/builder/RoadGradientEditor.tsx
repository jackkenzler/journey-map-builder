import { useRef } from 'react';
import {
  MIN_TRANSITION_GAP,
  getDefaultGradientTransitions,
  getEvenGradientTransitions,
  getGradientColorStops,
  gradientStopsToCss,
  resolveGradientTransitions,
} from '../../../builder/gradient';

interface RoadGradientEditorProps {
  stages: Array<{ number: string; title: string; color: string }>;
  /** Saved transition points, or undefined when the map still uses the defaults. */
  transitions?: number[];
  onChange: (transitions: number[] | undefined) => void;
}

const toPercent = (value: number) => Number((value * 100).toFixed(1));

function sameValues(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < 0.0005);
}

/** Bar that previews the road gradient and lets each color-to-color fade point be dragged. */
export function RoadGradientEditor({ stages, transitions, onChange }: RoadGradientEditorProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);

  const colors = stages.map((stage) => stage.color);
  const points = resolveGradientTransitions(stages.length, transitions);
  const hasBoundaries = stages.length > 1;
  const isDefault = sameValues(points, getDefaultGradientTransitions(stages.length));
  const isEven = sameValues(points, getEvenGradientTransitions(stages.length));
  const barBackground = gradientStopsToCss(getGradientColorStops(colors, points));

  const setPoint = (index: number, rawValue: number) => {
    const min = index === 0 ? 0 : points[index - 1] + MIN_TRANSITION_GAP;
    const max = index === points.length - 1 ? 1 : points[index + 1] - MIN_TRANSITION_GAP;
    const value = Math.min(max, Math.max(min, rawValue));
    if (Math.abs(value - points[index]) < 0.0001) return;
    onChange(points.map((point, pointIndex) => (pointIndex === index ? Number(value.toFixed(4)) : point)));
  };

  const valueFromPointer = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return (clientX - rect.left) / rect.width;
  };

  const segmentStarts = [0, ...points];
  const segmentEnds = [...points, 1];

  return (
    <div className="grid gap-[14px]">
      <div className="px-[10px] pb-[2px] pt-[10px]">
        <div ref={barRef} className="relative h-[52px] rounded-[12px] border border-black/10" style={{ background: barBackground }}>
          {stages.map((stage, index) => {
            const width = segmentEnds[index] - segmentStarts[index];
            return (
              <span
                key={`${stage.number}-${index}`}
                className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-[8px] py-[2px] text-[13px] text-[#191919] shadow-sm"
                style={{
                  left: `${((segmentStarts[index] + segmentEnds[index]) / 2) * 100}%`,
                  fontWeight: 'bold',
                  display: width < 0.04 ? 'none' : undefined,
                }}
              >
                {stage.number}
              </span>
            );
          })}

          {points.map((point, index) =>
            hasBoundaries ? (
              <div
                key={index}
                role="slider"
                tabIndex={0}
                aria-label={`Where stage ${index + 1} fades into stage ${index + 2}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={toPercent(point)}
                aria-valuetext={`${toPercent(point)} percent along the road`}
                className="absolute top-[-10px] bottom-[-10px] w-[28px] -translate-x-1/2 cursor-ew-resize touch-none outline-none"
                style={{ left: `${point * 100}%` }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  draggingRef.current = index;
                }}
                onPointerMove={(event) => {
                  if (draggingRef.current !== index) return;
                  const value = valueFromPointer(event.clientX);
                  if (value !== null) setPoint(index, value);
                }}
                onPointerUp={(event) => {
                  draggingRef.current = null;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  draggingRef.current = null;
                }}
                onKeyDown={(event) => {
                  const step = event.shiftKey ? 0.05 : 0.01;
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    setPoint(index, point - step);
                  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    setPoint(index, point + step);
                  }
                }}
              >
                <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
                <span className="absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#191919] shadow-md" />
              </div>
            ) : null,
          )}
        </div>
      </div>

      {hasBoundaries ? (
        <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <label key={index} className="grid gap-[6px] rounded-[12px] border border-black/10 bg-white p-[10px]">
              <span className="flex items-center gap-[6px] text-[14px] text-[#767676]">
                <span className="h-[10px] w-[10px] rounded-full border border-black/10" style={{ background: colors[index] }} />
                {stages[index].number}
                <span aria-hidden>→</span>
                <span className="h-[10px] w-[10px] rounded-full border border-black/10" style={{ background: colors[index + 1] }} />
                {stages[index + 1].number}
              </span>
              <span className="flex items-center gap-[6px]">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={toPercent(point)}
                  onChange={(event) => {
                    const next = event.target.valueAsNumber;
                    if (Number.isFinite(next)) setPoint(index, next / 100);
                  }}
                  className="w-full rounded-[10px] border border-black/10 bg-[#FAFAFA] px-[10px] py-[8px] text-[16px] text-[#191919] outline-none"
                />
                <span className="text-[14px] text-[#767676]">%</span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-[14px] leading-[1.5] text-[#767676]">Add a second stage to set where the road changes color.</p>
      )}

      {hasBoundaries ? (
        <div className="flex flex-wrap gap-[10px]">
          <button
            type="button"
            onClick={() => onChange(getEvenGradientTransitions(stages.length))}
            disabled={isEven}
            className="cursor-pointer rounded-full border border-black/10 bg-white px-[14px] py-[8px] text-[14px] text-[#191919] transition-all duration-150 hover:brightness-[0.98] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ fontWeight: 'bold' }}
          >
            Even split
          </button>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            disabled={isDefault && !transitions}
            className="cursor-pointer rounded-full border border-black/10 bg-white px-[14px] py-[8px] text-[14px] text-[#191919] transition-all duration-150 hover:brightness-[0.98] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ fontWeight: 'bold' }}
          >
            Reset to default
          </button>
        </div>
      ) : null}
    </div>
  );
}

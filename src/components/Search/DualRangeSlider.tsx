import React, { useEffect, useRef } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  step,
  minValue,
  maxValue,
  onChange,
}) => {
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = (value: number) =>
    Math.round(((value - min) / (max - min)) * 100);

  // Set width of the range to decrease/increase from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(Number(maxValRef.current.value));

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minValue, min, max]);

  // Set width of the range to decrease/increase from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(Number(minValRef.current.value));
      const maxPercent = getPercent(maxValue);

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxValue, min, max]);

  return (
    <div className="relative w-full py-4 flex flex-col items-center">
      {/* Dynamic Style Injection for standard slider thumbs */}
      <style dangerouslySetInnerHTML={{__html: `
        .thumb::-webkit-slider-thumb {
          background-color: #ffffff;
          border: 2.5px solid #0A2540;
          border-radius: 9999px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          height: 20px;
          width: 20px;
          pointer-events: all;
          position: relative;
          -webkit-appearance: none;
          transition: transform 0.1s ease, border-color 0.1s ease;
        }
        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          border-color: #030d17;
        }
        .thumb::-webkit-slider-thumb:active {
          transform: scale(0.95);
          background-color: #f8fafc;
        }
        .thumb::-moz-range-thumb {
          background-color: #ffffff;
          border: 2.5px solid #0A2540;
          border-radius: 9999px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          height: 20px;
          width: 20px;
          pointer-events: all;
          transition: transform 0.1s ease, border-color 0.1s ease;
        }
        .thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
          border-color: #030d17;
        }
      `}} />

      {/* Slider inputs */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxValue - step);
          onChange(value, maxValue);
        }}
        className="thumb pointer-events-none absolute h-0 w-full outline-none z-30"
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
          top: '12px'
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minValue + step);
          onChange(minValue, value);
        }}
        className="thumb pointer-events-none absolute h-0 w-full outline-none z-40"
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
          top: '12px'
        }}
      />

      {/* Track and range bar */}
      <div className="relative w-full h-1.5 bg-slate-200 rounded-full mt-2">
        <div
          ref={rangeRef}
          className="absolute h-full bg-primary rounded-full"
        />
      </div>
    </div>
  );
};

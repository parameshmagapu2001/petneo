import React, { useRef, useState, useEffect, useCallback } from 'react';

interface DistanceSliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  unit?: string;
  onChange?: (value: number) => void;
}

export default function DistanceSlider ({
  min = 0,
  max = 50,
  initialValue = 10,
  unit = 'km',
  onChange
}: DistanceSliderProps)  {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 110;
  const handleRadius = 14;

  // Utility functions
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    if (endAngle - startAngle === 0) return '';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  // Render tick marks
  const renderTickMarks = () => {
    const tickCount = 60;
    const ticks = [];

    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * 360 - 90;
      const angleRad = (angle * Math.PI) / 180;

      const tickLength = i % 5 === 0 ? 8 : 5;
      const innerRadius = radius - 12;
      const outerRadius = innerRadius - tickLength;

      const x1 = centerX + innerRadius * Math.cos(angleRad);
      const y1 = centerY + innerRadius * Math.sin(angleRad);
      const x2 = centerX + outerRadius * Math.cos(angleRad);
      const y2 = centerY + outerRadius * Math.sin(angleRad);

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#E5E7EB"
          strokeWidth="1.5"
          className="dark:stroke-gray-700"
        />
      );
    }

    return ticks;
  };

  // Calculate positions based on value
  const percentage = (value - min) / (max - min);
  const angle = percentage * 360;
  const angleRad = ((angle - 90) * Math.PI) / 180;

  const handleX = centerX + radius * Math.cos(angleRad);
  const handleY = centerY + radius * Math.sin(angleRad);

  const startAngle = -90;
  const endAngle = angle - 90;
  const arcPath = describeArc(centerX, centerY, radius, startAngle, endAngle);

  // Update value from mouse/touch event
  const updateValueFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      let calcAngle = Math.atan2(y, x) * (180 / Math.PI);
      calcAngle = (calcAngle + 90 + 360) % 360;

      const newPercentage = calcAngle / 360;
      const newValue = min + newPercentage * (max - min);
      const clampedValue = Math.max(min, Math.min(max, newValue));

      setValue(Math.round(clampedValue));
      onChange?.(Math.round(clampedValue));
    },
    [min, max, onChange]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateValueFromEvent(e.clientX, e.clientY);
    },
    [isDragging, updateValueFromEvent]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    setIsDragging(true);
    updateValueFromEvent(e.clientX, e.clientY);
  };

  // Touch event handlers
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      updateValueFromEvent(touch.clientX, touch.clientY);
    },
    [isDragging, updateValueFromEvent]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<SVGElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    updateValueFromEvent(touch.clientX, touch.clientY);
  };

  // Attach global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="flex flex-col items-center gap-8">

      {/* Circular Slider */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        <svg
          ref={svgRef}
          className="absolute w-full h-full"
          viewBox={`0 0 ${size} ${size}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="24"
            className="dark:stroke-gray-700"
          />

          {/* Tick marks */}
          <g className="tick-marks">{renderTickMarks()}</g>

          {/* Progress arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#D946A8"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Handle circle */}
          <circle
            cx={handleX}
            cy={handleY}
            r={handleRadius}
            fill="#EF4444"
            className="cursor-grab active:cursor-grabbing transition-transform active:scale-110"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 text-center">
          <div className="text-5xl font-semibold leading-none mb-1" style={{ color: '#D946A8' }}>
            {Math.round(value)}
          </div>
          <div className="text-lg font-medium text-gray-400">
            {unit}
          </div>
        </div>
      </div>

      {/* Output Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Current Selection
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Distance:</span>
          <span className="text-2xl font-bold" style={{ color: '#D946A8' }}>
            {Math.round(value)} {unit}
          </span>
        </div>
      </div>
    </div>
  );
};


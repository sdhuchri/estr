"use client";
import React from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLegend?: boolean;
}

export default function PieChart({ data, size = 200, showLegend = true }: PieChartProps) {
  // Filter out items with zero values
  const filteredData = data.filter(item => item.value > 0);
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  let currentAngle = -90; // Start from top
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  const segments = filteredData.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path for pie slice
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Special handling for near-complete circles (>= 99.9%)
    let pathData;
    if (angle >= 359.9) {
      // Draw a full circle using two arcs
      const midRad = (startAngle + 180) * Math.PI / 180;
      const xMid = centerX + radius * Math.cos(midRad);
      const yMid = centerY + radius * Math.sin(midRad);
      pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 1 1 ${xMid} ${yMid}`,
        `A ${radius} ${radius} 0 1 1 ${x1} ${y1}`,
        "Z",
      ].join(" ");
    } else {
      pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");
    }

    // Calculate label position (middle of the slice)
    const labelAngle = startAngle + angle / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.65; // Position label at 65% of radius
    const labelX = centerX + labelRadius * Math.cos(labelRad);
    const labelY = centerY + labelRadius * Math.sin(labelRad);

    currentAngle = endAngle;

    return {
      pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(2),
      labelX,
      labelY,
      isFullCircle: angle >= 359.9,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pie Chart SVG */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, index) => (
          <g key={index}>
            {/* Pie slice - use circle for 100%, path for others */}
            {segment.isFullCircle ? (
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            ) : (
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            )}
            
            {/* Percentage inside slice */}
            {parseFloat(segment.percentage) > 5 && ( // Only show label if segment is large enough
              <g>
                {/* White background for better readability */}
                <circle
                  cx={segment.labelX}
                  cy={segment.labelY}
                  r="22"
                  fill="white"
                  opacity="0.95"
                />
                
                {/* Percentage text */}
                <text
                  x={segment.labelX}
                  y={segment.labelY + 4}
                  textAnchor="middle"
                  className="text-sm font-bold"
                  fill="#1f2937"
                >
                  {segment.percentage}%
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700 truncate">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

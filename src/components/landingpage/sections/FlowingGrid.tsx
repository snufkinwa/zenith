// src/components/landingpage/sections/FlowingGrid.tsx
'use client';

import React from 'react';

interface UnifiedFlowingGridProps {
  intensity?: 'light' | 'medium' | 'strong';
}

const UnifiedFlowingGrid: React.FC<UnifiedFlowingGridProps> = ({ 
  intensity = 'medium' 
}) => {
  const getOpacity = () => {
    switch (intensity) {
      case 'light': return 0.06;
      case 'medium': return 0.12;
      case 'strong': return 0.18;
      default: return 0.12;
    }
  };

  const opacity = getOpacity();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 8000"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <defs>
          {/* Flowing ribbon gradients */}
          <linearGradient id="ribbon-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#33cc99" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#124dff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#33cc99" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="ribbon-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#124dff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#33cc99" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#124dff" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Main Flowing Ribbon */}
        <g className="main-ribbon">
          {/* Central flowing spine */}
          <path
            d="M-200,300 Q300,100 600,400 Q900,700 1200,300 Q1500,0 1800,500 Q2100,800 1600,1200 Q1100,1600 1400,2000 Q1700,2400 1000,2600 Q300,2800 800,3200 Q1300,3600 600,3800 Q-100,4000 700,4400 Q1500,4800 400,5000 Q-700,5200 900,5600 Q2500,6000 200,6200 Q-1100,6400 1100,6800 Q3300,7200 -300,7400 Q-1500,7600 1500,8000"
            stroke="none"
            fill="none"
            strokeWidth="1"
          />

          {/* Ribbon flow lines - creating the flowing ribbon effect */}
          {Array.from({ length: 40 }, (_, i) => {
            const offset = (i - 20) * 8; // Spread lines across ribbon width
            const opacity_val = 1 - Math.abs(i - 20) / 25; // Fade towards edges
            
            return (
              <path
                key={`ribbon-line-${i}`}
                d={`M${-200 + offset * 0.3},${300 + offset} 
                   Q${300 + offset * 0.5},${100 + offset * 0.8} 
                   ${600 + offset * 0.4},${400 + offset * 0.6} 
                   Q${900 + offset * 0.3},${700 + offset * 0.4} 
                   ${1200 + offset * 0.5},${300 + offset * 0.7} 
                   Q${1500 + offset * 0.2},${0 + offset * 0.9} 
                   ${1800 + offset * 0.6},${500 + offset * 0.3} 
                   Q${2100 + offset * 0.1},${800 + offset * 0.5} 
                   ${1600 + offset * 0.7},${1200 + offset * 0.2} 
                   Q${1100 + offset * 0.4},${1600 + offset * 0.6} 
                   ${1400 + offset * 0.3},${2000 + offset * 0.4} 
                   Q${1700 + offset * 0.5},${2400 + offset * 0.7} 
                   ${1000 + offset * 0.6},${2600 + offset * 0.3} 
                   Q${300 + offset * 0.2},${2800 + offset * 0.8} 
                   ${800 + offset * 0.4},${3200 + offset * 0.5} 
                   Q${1300 + offset * 0.7},${3600 + offset * 0.2} 
                   ${600 + offset * 0.3},${3800 + offset * 0.6} 
                   Q${-100 + offset * 0.5},${4000 + offset * 0.4} 
                   ${700 + offset * 0.6},${4400 + offset * 0.7} 
                   Q${1500 + offset * 0.2},${4800 + offset * 0.3} 
                   ${400 + offset * 0.8},${5000 + offset * 0.5} 
                   Q${-700 + offset * 0.4},${5200 + offset * 0.6} 
                   ${900 + offset * 0.3},${5600 + offset * 0.2} 
                   Q${2500 + offset * 0.1},${6000 + offset * 0.7} 
                   ${200 + offset * 0.9},${6200 + offset * 0.4} 
                   Q${-1100 + offset * 0.5},${6400 + offset * 0.8} 
                   ${1100 + offset * 0.2},${6800 + offset * 0.3} 
                   Q${3300 + offset * 0.1},${7200 + offset * 0.6} 
                   ${-300 + offset * 0.7},${7400 + offset * 0.5} 
                   Q${-1500 + offset * 0.3},${7600 + offset * 0.4} 
                   ${1500 + offset * 0.6},${8000 + offset * 0.2}`}
                stroke={i % 2 === 0 ? "#33cc99" : "#124dff"}
                strokeWidth="1.5"
                fill="none"
                opacity={opacity_val * 0.7}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;20,10;0,0"
                  dur={`${15 + (i % 5) * 2}s`}
                  repeatCount="indefinite"
                />
              </path>
            );
          })}

          {/* Secondary ribbon flow - smaller, more subtle */}
          {Array.from({ length: 25 }, (_, i) => {
            const offset = (i - 12) * 12;
            const opacity_val = 1 - Math.abs(i - 12) / 15;
            
            return (
              <path
                key={`secondary-ribbon-${i}`}
                d={`M${400 + offset * 0.4},${800 + offset * 0.3} 
                   Q${700 + offset * 0.6},${600 + offset * 0.5} 
                   ${1000 + offset * 0.3},${900 + offset * 0.7} 
                   Q${1300 + offset * 0.8},${1200 + offset * 0.2} 
                   ${1000 + offset * 0.5},${1500 + offset * 0.6} 
                   Q${700 + offset * 0.2},${1800 + offset * 0.4} 
                   ${1200 + offset * 0.7},${2100 + offset * 0.8} 
                   Q${1700 + offset * 0.3},${2400 + offset * 0.5} 
                   ${1100 + offset * 0.6},${2700 + offset * 0.3} 
                   Q${500 + offset * 0.4},${3000 + offset * 0.7} 
                   ${1000 + offset * 0.8},${3300 + offset * 0.2} 
                   Q${1500 + offset * 0.2},${3600 + offset * 0.6} 
                   ${800 + offset * 0.5},${3900 + offset * 0.4} 
                   Q${100 + offset * 0.7},${4200 + offset * 0.8} 
                   ${900 + offset * 0.3},${4500 + offset * 0.5} 
                   Q${1700 + offset * 0.6},${4800 + offset * 0.2} 
                   ${600 + offset * 0.4},${5100 + offset * 0.7} 
                   Q${-500 + offset * 0.8},${5400 + offset * 0.3} 
                   ${1200 + offset * 0.2},${5700 + offset * 0.6} 
                   Q${2900 + offset * 0.5},${6000 + offset * 0.4} 
                   ${300 + offset * 0.7},${6300 + offset * 0.8} 
                   Q${-1300 + offset * 0.3},${6600 + offset * 0.2} 
                   ${1400 + offset * 0.6},${6900 + offset * 0.5} 
                   Q${4100 + offset * 0.1},${7200 + offset * 0.7} 
                   ${-100 + offset * 0.8},${7500 + offset * 0.3} 
                   Q${-1900 + offset * 0.4},${7800 + offset * 0.6} 
                   ${1800 + offset * 0.5},${8000 + offset * 0.2}`}
                stroke={i % 3 === 0 ? "#33cc99" : i % 3 === 1 ? "#124dff" : "#66d9cc"}
                strokeWidth="1"
                fill="none"
                opacity={opacity_val * 0.5}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;-15,8;0,0"
                  dur={`${18 + (i % 4) * 3}s`}
                  repeatCount="indefinite"
                />
              </path>
            );
          })}

          {/* Tertiary flowing lines - outermost edges */}
          {Array.from({ length: 15 }, (_, i) => {
            const side = i % 2 === 0 ? 1 : -1;
            const offset = 200 + i * 30;
            
            return (
              <path
                key={`tertiary-flow-${i}`}
                d={`M${960 + side * offset},200 
                   Q${960 + side * (offset + 100)},600 
                   ${960 + side * (offset - 50)},1000 
                   Q${960 + side * (offset + 150)},1400 
                   ${960 + side * (offset)},1800 
                   Q${960 + side * (offset - 100)},2200 
                   ${960 + side * (offset + 80)},2600 
                   Q${960 + side * (offset - 120)},3000 
                   ${960 + side * (offset + 60)},3400 
                   Q${960 + side * (offset + 140)},3800 
                   ${960 + side * (offset - 80)},4200 
                   Q${960 + side * (offset - 160)},4600 
                   ${960 + side * (offset + 120)},5000 
                   Q${960 + side * (offset + 200)},5400 
                   ${960 + side * (offset - 100)},5800 
                   Q${960 + side * (offset - 60)},6200 
                   ${960 + side * (offset + 180)},6600 
                   Q${960 + side * (offset - 220)},7000 
                   ${960 + side * (offset + 100)},7400 
                   Q${960 + side * (offset + 140)},7800 
                   ${960 + side * (offset - 40)},8000`}
                stroke={i % 2 === 0 ? "#33cc99" : "#124dff"}
                strokeWidth="0.8"
                fill="none"
                opacity={0.4 - i * 0.02}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0;${side * 25},15;0,0`}
                  dur={`${20 + i * 2}s`}
                  repeatCount="indefinite"
                />
              </path>
            );
          })}

          {/* Convergence points - where ribbon lines come together */}
          {[
            { x: 600, y: 400 },
            { x: 1200, y: 300 },
            { x: 1800, y: 500 },
            { x: 1600, y: 1200 },
            { x: 1400, y: 2000 },
            { x: 1000, y: 2600 },
            { x: 800, y: 3200 },
            { x: 600, y: 3800 },
            { x: 700, y: 4400 },
            { x: 400, y: 5000 },
            { x: 900, y: 5600 },
            { x: 200, y: 6200 },
            { x: 1100, y: 6800 },
            { x: -300, y: 7400 }
          ].map((point, i) => (
            <g key={`convergence-${i}`}>
              {/* Convergence effect */}
              {Array.from({ length: 8 }, (_, j) => {
                const angle = (j * 2 * Math.PI) / 8;
                const radius = 40;
                
                return (
                  <path
                    key={`convergence-line-${i}-${j}`}
                    d={`M${point.x + radius * Math.cos(angle)},${point.y + radius * Math.sin(angle)} 
                       L${point.x},${point.y}`}
                    stroke={j % 2 === 0 ? "#33cc99" : "#124dff"}
                    strokeWidth="1"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.6;0.2;0.6"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${i * 0.3 + j * 0.1}s`}
                    />
                  </path>
                );
              })}
              
              {/* Central convergence point */}
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="url(#ribbon-gradient-1)"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="3;6;3"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Flowing particles along the ribbon */}
        <g className="ribbon-particles">
          {Array.from({ length: 50 }, (_, i) => {
            const progress = i / 50;
            const y = progress * 8000;
            const x = 960 + 300 * Math.sin(progress * 8 * Math.PI);
            
            return (
              <circle
                key={`particle-${i}`}
                cx={x}
                cy={y}
                r="1.5"
                fill={i % 2 === 0 ? "#33cc99" : "#124dff"}
                opacity="0.6"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;20,0;0,0"
                  dur={`${8 + (i % 3) * 2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.1}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur={`${3 + (i % 2)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default UnifiedFlowingGrid;
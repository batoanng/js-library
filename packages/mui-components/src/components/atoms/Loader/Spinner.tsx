import React, { useEffect, useRef } from 'react';
import './Spinner.css';
import { Box, SxProps } from '@mui/material';

export const Spinner: React.FC = ({ sx }: { sx?: SxProps }) => {
  const groupRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const svgGroup = groupRef.current;
    if (!svgGroup) return;

    let cancelled = false;
    const timeouts: number[] = [];
    const spacing = 25;
    const svgNS = 'http://www.w3.org/2000/svg';

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(id);
    };

    const createDot = (cx: number, cy: number, r: number) => {
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', String(cx));
      dot.setAttribute('cy', String(cy));
      dot.setAttribute('r', String(r));
      dot.classList.add('dot');
      svgGroup.appendChild(dot);
      return dot as SVGCircleElement;
    };

    const animateSpinner = () => {
      if (cancelled) return;

      // Clear existing dots
      svgGroup.querySelectorAll('.dot').forEach((dot) => dot.remove());

      // Center dot
      createDot(100, 100, 6);

      // Cardinal positions
      const first4 = [
        { cx: 100, cy: 100 - spacing },
        { cx: 100, cy: 100 + spacing },
        { cx: 100 - spacing, cy: 100 },
        { cx: 100 + spacing, cy: 100 },
      ];

      const allDots: SVGCircleElement[] = [];

      first4.forEach((pos) => {
        const dot = createDot(100, 100, 6);
        allDots.push(dot);
        const midX = (100 + pos.cx) / 2;
        const midY = (100 + pos.cy) / 2;

        schedule(() => {
          dot.setAttribute('r', '8');
          dot.setAttribute('cx', String(midX));
          dot.setAttribute('cy', String(midY));
        }, 50);

        schedule(() => {
          dot.setAttribute('r', '6');
          dot.setAttribute('cx', String(pos.cx));
          dot.setAttribute('cy', String(pos.cy));
        }, 500);
      });

      // Diagonals
      schedule(() => {
        const diagSpacing = spacing / Math.sqrt(2);
        const diagonal = [
          { cx: 100 - diagSpacing, cy: 100 - diagSpacing },
          { cx: 100 + diagSpacing, cy: 100 - diagSpacing },
          { cx: 100 - diagSpacing, cy: 100 + diagSpacing },
          { cx: 100 + diagSpacing, cy: 100 + diagSpacing },
        ];

        diagonal.forEach((pos) => {
          const dot = createDot(100, 100, 6);
          allDots.push(dot);
          const midX = (100 + pos.cx) / 2;
          const midY = (100 + pos.cy) / 2;

          schedule(() => {
            dot.setAttribute('r', '8');
            dot.setAttribute('cx', String(midX));
            dot.setAttribute('cy', String(midY));
          }, 50);

          schedule(() => {
            dot.setAttribute('r', '6');
            dot.setAttribute('cx', String(pos.cx));
            dot.setAttribute('cy', String(pos.cy));
          }, 500);
        });
      }, 1000);

      // Rotate the whole group
      schedule(() => {
        (svgGroup as SVGGElement).style.transform = 'rotate(360deg)';
      }, 2500);

      // Back to single dot at center
      schedule(() => {
        (svgGroup as SVGGElement).style.transition = 'transform 0.5s linear';
        (svgGroup as SVGGElement).style.transform = 'rotate(0deg)';
        allDots.forEach((dot) => {
          dot.setAttribute('cx', '100');
          dot.setAttribute('cy', '100');
          dot.setAttribute('r', '6');
        });
      }, 3000);

      // Infinite repeat
      schedule(() => {
        animateSpinner();
      }, 4000);
    };

    animateSpinner();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <Box className="gooey-spinner-container" sx={[{ color: 'text.secondary' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <svg viewBox="0 0 200 200" className="gooey-spinner-svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10
              "
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
        <g id="gooey" ref={groupRef} filter="url(#goo)">
          <circle className="dot" cx="100" cy="100" r="6" />
        </g>
      </svg>
    </Box>
  );
};

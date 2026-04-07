import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NOTES } from '../lib/music';

interface CircleOfFifthsProps {
  activeNotes: string[];
  onNoteClick?: (note: string) => void;
}

export default function CircleOfFifths({ activeNotes, onNoteClick }: CircleOfFifthsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Circle of Fifths order: C G D A E B F# C# G# D# A# F
  const circleOrder = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw outer circle
    g.append('circle')
      .attr('r', radius + 20)
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2);

    // Draw notes
    const angleStep = (2 * Math.PI) / 12;

    circleOrder.forEach((note, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const isActive = activeNotes.includes(note);

      const noteGroup = g.append('g')
        .attr('class', 'cursor-pointer group')
        .on('click', () => onNoteClick?.(note));

      // Background circle for active note
      noteGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 24)
        .attr('fill', isActive ? '#2563eb' : '#f8fafc')
        .attr('stroke', isActive ? '#1e40af' : '#cbd5e1')
        .attr('stroke-width', 2)
        .attr('class', 'transition-all duration-200 group-hover:stroke-blue-400');

      // Note text
      noteGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', isActive ? '#ffffff' : '#475569')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(note);
    });

    // Draw lines between active notes to show structure
    if (activeNotes.length > 1) {
      const activeIndices = activeNotes
        .map(n => circleOrder.indexOf(n))
        .filter(idx => idx !== -1)
        .sort((a, b) => a - b);

      const lineGenerator = d3.lineRadial<number>()
        .angle(d => d * angleStep)
        .radius(radius - 10)
        .curve(d3.curveLinearClosed);

      g.append('path')
        .datum(activeIndices)
        .attr('d', lineGenerator as any)
        .attr('fill', 'rgba(37, 99, 235, 0.1)')
        .attr('stroke', 'rgba(37, 99, 235, 0.5)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');
    }

  }, [activeNotes, onNoteClick]);

  return (
    <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <svg ref={svgRef} />
    </div>
  );
}

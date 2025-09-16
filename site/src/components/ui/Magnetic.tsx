'use client';
import { useRef } from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & { strength?: number };

export default function Magnetic({ strength = 12, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }
  
  function onLeave() {
    if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)';
  }
  
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  );
}
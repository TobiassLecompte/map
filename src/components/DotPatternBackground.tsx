"use client";

import { useEffect, useRef } from "react";

export function DotPatternBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // 配置项
    const dotRadius = 1;
    const spacing = 32;
    const mouseRadius = 300;
    const repulsion = 20;
    const returnSpeed = 0.08;
    const maxGlow = 0.35;
    const baseGlow = 0.08;

    let dots: { x: number; y: number; originX: number; originY: number }[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const initDots = () => {
      dots = [];
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          dots.push({
            x: x + spacing / 2,
            y: y + spacing / 2,
            originX: x + spacing / 2,
            originY: y + spacing / 2,
          });
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        
        // Handle high DPI displays for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        initDots();
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      // 浅色模式下跟随主题强调色（靛蓝），深色模式下为纯白
      const baseColor = isDark ? "255, 255, 255" : "99, 102, 241"; 

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        // Physics
        const dx = mouseX - dot.originX;
        const dy = mouseY - dot.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = dot.originX;
        let targetY = dot.originY;
        let opacity = baseGlow;
        let radius = dotRadius;

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          
          targetX = dot.originX - Math.cos(angle) * force * repulsion;
          targetY = dot.originY - Math.sin(angle) * force * repulsion;
          
          opacity = baseGlow + force * (maxGlow - baseGlow);
          radius = dotRadius + force * 1.5;
        }

        dot.x += (targetX - dot.x) * returnSpeed;
        dot.y += (targetY - dot.y) * returnSpeed;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, ${opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

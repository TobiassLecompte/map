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
    let isAnimating = false;
    let needsRender = true;

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
    let isMouseInside = false;

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
        needsRender = true;
        startAnimation();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInside = true;
      needsRender = true;
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      isMouseInside = false;
      needsRender = true;
    };

    function startAnimation() {
      if (!isAnimating) {
        isAnimating = true;
        render();
      }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    resize();

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      // 浅色模式下跟随主题强调色（靛蓝），深色模式下为纯白
      const baseColor = isDark ? "255, 255, 255" : "99, 102, 241"; 

      let anyMoving = false;

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

        // Check if dot is still moving (threshold for stopping)
        const distFromTarget = Math.abs(dot.x - targetX) + Math.abs(dot.y - targetY);
        if (distFromTarget > 0.1) {
          anyMoving = true;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, ${opacity})`;
        ctx.fill();
      }

      // Only continue animating if dots are still moving or mouse is inside
      if (anyMoving || isMouseInside) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isAnimating = false;
      }
    }

    // Initial static render
    startAnimation();

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

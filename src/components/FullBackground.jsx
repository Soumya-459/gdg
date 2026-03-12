import { useEffect, useRef } from "react";

export default function FullBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 20;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const chars = "01 DO IT YES BUILD CODE CREATE EXECUTE INNOVATE HACK LEARN WIN ";

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none"
  }} />;
}
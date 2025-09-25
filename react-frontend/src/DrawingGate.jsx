import { useEffect, useRef, useState } from "react";
import { API_BASE } from "./lib/apiBase";

export default function DrawingGate({ apiBase = API_BASE, onPassed }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 10));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize canvas with white background and drawing settings
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
  }, []);

  // Get mouse/touch position on canvas
  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const client = e.touches ? e.touches[0] : e;
    return { x: client.clientX - rect.left, y: client.clientY - rect.top };
  }

  // Start drawing
  function handleDown(e) {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  // Continue drawing
  function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Stop drawing
  function handleUp() { setIsDrawing(false); }

  // Clear canvas
  function clearCanvas() {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  // Submit drawing to backend for digit check
  async function submitDrawing() {
    try {
      setLoading(true);
      setMsg("");

      // Scale drawing down to 28x28 for MNIST model
      const src = canvasRef.current;
      const small = document.createElement("canvas");
      small.width = 28; small.height = 28;
      const sctx = small.getContext("2d");
      sctx.fillStyle = "#ffffff"; sctx.fillRect(0, 0, 28, 28);
      sctx.drawImage(src, 0, 0, 28, 28);
      const dataUrl = small.toDataURL("image/png");

      // Send image to Flask API
      const res = await fetch(`${apiBase}/mnist/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, target_digit: target, threshold: 0.85 }),
      });
      const data = await res.json();

      // Handle response
      if (data.status === "success") {
        if (data.passed) {
          const p = typeof data.prob === "number" ? data.prob.toFixed(2) : "–";
          setMsg(`✅ Correct! ${data.pred} (p=${p}).`);
          onPassed?.();
        } else {
          const p = typeof data.prob === "number" ? data.prob.toFixed(2) : "–";
          setMsg(`❌ Incorrect ${data.pred} (p=${p}). Try again!`);
        }
      } else {
        setMsg(`Error: ${data.error || "unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  // Generate new target digit and reset canvas
  function newTarget() {
    setTarget(Math.floor(Math.random() * 10));
    clearCanvas();
    setMsg("");
  }

  // Component UI
  return (
    <div className="gate-wrap">
      <h2>Draw the number: <span className="gate-target">{target}</span></h2>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="gate-canvas"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
      <div className="gate-actions">
        <button onClick={clearCanvas} disabled={loading}>Clear</button>
        <button onClick={newTarget} disabled={loading}>New Number</button>
        <button onClick={submitDrawing} disabled={loading}>{loading ? "Checking…" : "Submit"}</button>
      </div>
      {msg && <p className="gate-msg">{msg}</p>}
      <p className="gate-hint">Tip: Draw with thick, continuous lines.</p>
    </div>
  );
}

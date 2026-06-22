import { useEffect, useRef, type CSSProperties } from "react";

/**
 * MorphField — фирменный мотив SLS24: облако частиц сэмплит фигуры-глифы в
 * точечные облака и морфит между ними, связи как нейросеть. Глубина, мягкий
 * bloom, бегущие импульсы, параллакс к курсору, вспышка на стыке фигур, дыхание
 * в покое. Уважает prefers-reduced-motion (одна статичная фигура).
 *
 * Тема-зависимое: при `color`/`link` = "auto" читает `--accent-soft` и
 * `--accent-rgb` активной темы — у Vanga синий. Морф ведётся извне дробным
 * индексом `active`.
 */
export function MorphField({
  shapes = ["📄", "🔍", "🧾", "✅"],
  active = 0,
  count = 460,
  color = "auto",
  link = "auto",
  size = 0.62,
  posX = 0.5,
  posY = 0.5,
  dprCap = 2,
  paused = false,
  className = "",
  style,
}: {
  shapes?: string[];
  active?: number;
  count?: number;
  color?: string;
  link?: string;
  size?: number;
  posX?: number;
  posY?: number;
  dprCap?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const shapesKey = shapes.join("|");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cs = getComputedStyle(canvas);
    const COLOR = color === "auto" ? cs.getPropertyValue("--accent-soft").trim() || "#9dc2ff" : color;
    const LINKRGB = link === "auto" ? cs.getPropertyValue("--accent-rgb").trim() || "47,128,255" : link;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

    let w = 0,
      h = 0,
      raf = 0,
      tt = 0,
      LINK = 24;
    const FRAME_MS = 1000 / 60;
    let lastFrame = -1;
    let current = activeRef.current;
    let prevSeg = Math.round(current);
    let flash = 0,
      mx = 0,
      my = 0,
      pmx = 0,
      pmy = 0;

    interface N {
      nx: number;
      ny: number;
      d: number;
    }
    interface P {
      x: number;
      y: number;
      amp: number;
      sp: number;
      ph: number;
      r: number;
      depth: number;
      pulse: number;
    }
    let forms: N[][] = [];
    let pts: P[] = [];

    const sampleShape = (emoji: string): N[] | null => {
      const S = 200;
      const off = document.createElement("canvas");
      off.width = S;
      off.height = S;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return null;
      octx.clearRect(0, 0, S, S);
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `${Math.round(S * 0.84)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
      octx.fillText(emoji, S / 2, S / 2 + S * 0.02);
      let d: Uint8ClampedArray;
      try {
        d = octx.getImageData(0, 0, S, S).data;
      } catch {
        return null;
      }
      const lum = new Float32Array(S * S);
      for (let i = 0; i < S * S; i++) {
        const k = i * 4;
        lum[i] = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) * (d[k + 3] / 255);
      }
      const edge: N[] = [];
      const fill: N[] = [];
      for (let y = 1; y < S - 1; y++) {
        for (let x = 1; x < S - 1; x++) {
          const i = y * S + x;
          if (d[i * 4 + 3] <= 90) continue;
          const cx = (x / S - 0.5) * 2,
            cy = (y / S - 0.5) * 2;
          const dep = Math.max(0, 1 - Math.sqrt(cx * cx + cy * cy));
          fill.push({ nx: x / S, ny: y / S, d: dep });
          const g = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + S] - lum[i - S]);
          if (g > 28) edge.push({ nx: x / S, ny: y / S, d: dep * 0.5 + 0.25 });
        }
      }
      if (fill.length < 50) return null;
      let minX = 1,
        maxX = 0,
        minY = 1,
        maxY = 0;
      for (const p of fill) {
        if (p.nx < minX) minX = p.nx;
        if (p.nx > maxX) maxX = p.nx;
        if (p.ny < minY) minY = p.ny;
        if (p.ny > maxY) maxY = p.ny;
      }
      const span = Math.max(Math.max(maxX - minX, 1e-4), Math.max(maxY - minY, 1e-4));
      const pad = 0.08,
        scale = (1 - pad * 2) / span;
      const cx = (minX + maxX) / 2,
        cy = (minY + maxY) / 2;
      const norm = (p: N): N => ({ nx: 0.5 + (p.nx - cx) * scale, ny: 0.5 + (p.ny - cy) * scale, d: p.d });
      const fillN = fill.map(norm),
        edgeN = edge.map(norm);
      const out: N[] = [];
      const nEdge = edgeN.length ? Math.round(count * 0.7) : 0;
      for (let i = 0; i < nEdge; i++) out.push(edgeN[(Math.random() * edgeN.length) | 0]);
      for (let i = out.length; i < count; i++) out.push(fillN[(Math.random() * fillN.length) | 0]);
      return out;
    };

    const buildForms = () => {
      forms = [];
      for (const e of shapes) {
        const s = sampleShape(e);
        if (s) forms.push(s);
      }
      if (forms.length === 0) {
        forms.push(
          Array.from({ length: count }, () => {
            const a = Math.random() * Math.PI * 2,
              r = Math.sqrt(Math.random()) * 0.5;
            return { nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r, d: 1 - r / 0.5 };
          }),
        );
      }
    };

    const syncSize = () => {
      const cw = canvas.clientWidth || Math.round(canvas.getBoundingClientRect().width);
      const ch = canvas.clientHeight || Math.round(canvas.getBoundingClientRect().height);
      const nw = cw || window.innerWidth,
        nh = ch || window.innerHeight;
      if (nw !== w || nh !== h) {
        w = nw;
        h = nh;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        LINK = Math.min(w, h) * size * 0.055;
      }
    };

    const resize = () => {
      syncSize();
      if (pts.length !== count) {
        pts = Array.from({ length: count }, () => ({
          x: w * posX,
          y: h * posY,
          amp: 0.6 + Math.random() * 2,
          sp: 0.4 + Math.random() * 0.9,
          ph: Math.random() * Math.PI * 2,
          r: Math.random() * 1.1 + 0.5,
          depth: 0.5,
          pulse: Math.random(),
        }));
      }
    };

    const targetN = (i: number): { nx: number; ny: number; depth: number } => {
      const n = forms.length;
      const seg = Math.min(Math.max(current, 0), n - 1);
      let a = Math.floor(seg);
      if (a < 0) a = 0;
      if (a > n - 1) a = n - 1;
      const b = Math.min(a + 1, n - 1);
      let ff = (seg - a - 0.35) / 0.65;
      if (ff < 0) ff = 0;
      if (ff > 1) ff = 1;
      ff = ff * ff * (3 - 2 * ff);
      const pa = forms[a][i],
        pb = forms[b][i];
      return {
        nx: pa.nx + (pb.nx - pa.nx) * ff,
        ny: pa.ny + (pb.ny - pa.ny) * ff,
        depth: pa.d + (pb.d - pa.d) * ff,
      };
    };

    const buckets = new Map<number, number[]>();
    const NB = 8;
    const segBuf: number[][] = Array.from({ length: NB }, () => []);
    const drawLinks = () => {
      const cell = Math.max(LINK, 1);
      const cols = Math.ceil(w / cell) + 2;
      buckets.clear();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const key = (Math.floor(p.y / cell) + 1) * cols + Math.floor(p.x / cell) + 1;
        const arr = buckets.get(key);
        if (arr) arr.push(i);
        else buckets.set(key, [i]);
      }
      ctx.lineWidth = 0.6;
      const L2 = LINK * LINK,
        AMAX = 0.62;
      for (let b = 0; b < NB; b++) segBuf[b].length = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const gx = Math.floor(a.x / cell) + 1,
          gy = Math.floor(a.y / cell) + 1;
        for (let oy = -1; oy <= 1; oy++)
          for (let ox = -1; ox <= 1; ox++) {
            const arr = buckets.get((gy + oy) * cols + (gx + ox));
            if (!arr) continue;
            for (const j of arr) {
              if (j <= i) continue;
              const b = pts[j];
              const dx = a.x - b.x,
                dy = a.y - b.y,
                d2 = dx * dx + dy * dy;
              if (d2 < L2) {
                const dist = Math.sqrt(d2),
                  t = 1 - dist / LINK;
                const imp = 0.5 + 0.5 * Math.sin(tt * 2.2 + (a.pulse + b.pulse) * 6);
                let al = t * (0.28 + a.depth * 0.34) * (0.7 + imp * 0.6);
                if (al <= 0.012) continue;
                if (al > AMAX) al = AMAX;
                let bi = (al * (NB / AMAX)) | 0;
                if (bi >= NB) bi = NB - 1;
                segBuf[bi].push(a.x, a.y, b.x, b.y);
              }
            }
          }
      }
      for (let bi = 0; bi < NB; bi++) {
        const buf = segBuf[bi];
        if (buf.length === 0) continue;
        ctx.strokeStyle = `rgba(${LINKRGB},${(((bi + 0.5) / NB) * AMAX).toFixed(3)})`;
        ctx.beginPath();
        for (let k = 0; k < buf.length; k += 4) {
          ctx.moveTo(buf[k], buf[k + 1]);
          ctx.lineTo(buf[k + 2], buf[k + 3]);
        }
        ctx.stroke();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const fl = flash;
      ctx.globalCompositeOperation = "lighter";
      drawLinks();
      ctx.fillStyle = COLOR;
      for (const p of pts) {
        const dep = p.depth;
        ctx.globalAlpha = 0.04 + dep * 0.06 + fl * 0.05;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (2.6 + dep * 2.0), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      for (const p of pts) {
        const dep = p.depth;
        ctx.globalAlpha = 0.45 + dep * 0.5 + fl * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.6 + dep * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffffff";
      for (const p of pts) {
        if (p.depth > 0.82 && p.pulse > 0.95) {
          ctx.globalAlpha = (0.4 + fl * 0.4) * (0.3 + 0.7 * Math.sin(tt * 3 + p.ph));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const computeLayout = () => {
      const breathe = 1 + Math.sin(tt * 0.7) * 0.012;
      const squeeze = 1 - flash * 0.06;
      const box = Math.min(w, h) * size * breathe * squeeze;
      return { box, bx: w * posX - box / 2 + pmx * 14, by: h * posY - box / 2 + pmy * 14 };
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (lastFrame >= 0 && now - lastFrame < FRAME_MS - 1) return;
      lastFrame = now;
      if (document.hidden || canvas.offsetParent === null) return;
      if (pausedRef.current) return;
      tt += 0.016;
      syncSize();
      if (w === 0 || h === 0) return;
      current += (activeRef.current - current) * 0.06;
      const seg = Math.round(current);
      if (seg !== prevSeg) {
        flash = 1;
        prevSeg = seg;
      }
      flash *= 0.9;
      if (flash < 0.001) flash = 0;
      pmx += (mx - pmx) * 0.05;
      pmy += (my - pmy) * 0.05;
      const { box, bx, by } = computeLayout();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const tn = targetN(i);
        const tx = bx + tn.nx * box,
          ty = by + tn.ny * box;
        p.depth += (tn.depth - p.depth) * 0.08;
        p.x += (tx + Math.sin(tt * p.sp + p.ph) * p.amp - p.x) * 0.085;
        p.y += (ty + Math.cos(tt * p.sp * 0.9 + p.ph) * p.amp - p.y) * 0.085;
      }
      render();
    };

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const staticDraw = () => {
      current = Math.min(Math.max(activeRef.current, 0), forms.length - 1);
      const { box, bx, by } = computeLayout();
      for (let i = 0; i < pts.length; i++) {
        const tn = targetN(i);
        pts[i].x = bx + tn.nx * box;
        pts[i].y = by + tn.ny * box;
        pts[i].depth = tn.depth;
      }
      render();
    };

    buildForms();
    resize();

    if (reduced) {
      staticDraw();
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    const onResize = () => {
      resize();
      if (reduced) staticDraw();
    };
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(canvas);
    const onLost = (e: Event) => e.preventDefault();
    const onRestored = () => {
      buildForms();
      resize();
    };
    canvas.addEventListener("contextlost", onLost as EventListener);
    canvas.addEventListener("contextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("contextlost", onLost as EventListener);
      canvas.removeEventListener("contextrestored", onRestored);
      if (ro) ro.disconnect();
    };
  }, [shapesKey, count, color, link, size, posX, posY, dprCap]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none", ...style }}
    />
  );
}

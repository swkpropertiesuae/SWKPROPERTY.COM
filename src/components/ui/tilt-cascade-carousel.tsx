"use client";

import * as React from "react";

/**
 * 21st.dev Tilt Cascade Carousel (@kedhareswer/tilt-cascade-carousel)
 * Dual-spring physics slanted architectural carousel: front card sits upright at full size;
 * trailing and leading cards cascade along a tilted diagonal arc with trailing spring swing.
 * Supports drag, flick, trackpad horizontal swipe, keyboard arrows, glass controls & autoplay.
 */

export type TiltCascadeItem = {
  /** Shown above the card in front. */
  title: string;
  /** Optional small line under the card in front. */
  caption?: string;
  /** Image URL. */
  src?: string;
  alt?: string;
  /** Optional destination URL for click-through. */
  href?: string;
};

export type TiltCascadeCarouselProps = {
  items: TiltCascadeItem[];
  /** Root height. Must be a definite length. */
  height?: string;
  /** Width (and height) of the card in front, any CSS length. */
  slideSize?: string;
  /** Degrees each step away from the front turns a card. */
  angle?: number;
  /** How far each step drops a card, as a fraction of the card. */
  drop?: number;
  /** Scale of every card that isn't in front. */
  inactiveScale?: number;
  /** Card corner radius in px. */
  radius?: number;
  /** Spring bounce, 0 (none) to about 0.5. */
  bounce?: number;
  /** Roughly how long a move takes, in seconds. */
  duration?: number;
  /** Wrap past the ends. */
  loop?: boolean;
  /** Milliseconds between automatic moves. 0 is off. */
  autoplay?: number;
  titles?: boolean;
  captions?: boolean;
  /** The prev / dots / next pill. */
  controls?: boolean;
  /** Root background, any CSS colour or gradient. */
  background?: string;
  /** Text, dots and buttons color. */
  color?: string;
  fontFamily?: string;
  /** Controlled index. Omit for uncontrolled. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Clicking (or Enter on) the card that's already in front. */
  onSelect?: (item: TiltCascadeItem, index: number) => void;
  ariaLabel?: string;
  className?: string;
};

export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

export function indexAt(pos: number, n: number, loop: boolean): number {
  if (n <= 0) return 0;
  const i = Math.round(pos);
  return loop ? wrapIndex(i, n) : Math.min(Math.max(i, 0), n - 1);
}

export function offsetOf(i: number, pos: number, n: number, loop: boolean): number {
  const d = i - pos;
  return loop && n > 0 ? d - n * Math.round(d / n) : d;
}

export function scaleAt(d: number, min: number): number {
  return 1 - (1 - min) * Math.min(Math.abs(d), 1);
}

export function rubber(pos: number, n: number): number {
  if (pos < 0) return pos / 3;
  if (pos > n - 1) return n - 1 + (pos - (n - 1)) / 3;
  return pos;
}

export function springOf(
  bounce: number,
  duration: number
): { omega: number; slide: number; tilt: number } {
  const b = Math.min(Math.max(bounce, 0), 0.9);
  return {
    omega: (2 * Math.PI) / Math.max(duration, 0.1),
    slide: 1 - b / 2,
    tilt: 1 - b,
  };
}

export function springStep(
  x: number,
  v: number,
  target: number,
  omega: number,
  zeta: number,
  dt: number
): [number, number] {
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let k = 0; k < steps; k++) {
    v += (-omega * omega * (x - target) - 2 * zeta * omega * v) * h;
    x += v * h;
  }
  return [x, v];
}

export function releaseTarget(
  pos: number,
  velocity: number,
  n: number,
  loop: boolean
): number {
  const here = Math.round(pos);
  let t = Math.round(pos + velocity * 0.2);
  t = Math.min(Math.max(t, here - 3), here + 3);
  return loop ? t : Math.min(Math.max(t, 0), n - 1);
}

export function targetFor(
  i: number,
  target: number,
  n: number,
  loop: boolean
): number {
  if (!loop) return Math.min(Math.max(i, 0), n - 1);
  const here = Math.round(target);
  let d = i - wrapIndex(here, n);
  d -= n * Math.round(d / n);
  return here + d;
}

function computeTransform(
  i: number,
  a: number,
  b: number,
  n: number,
  loop: boolean,
  angle: number,
  drop: number,
  inactiveScale: number
) {
  const dx = offsetOf(i, a, n, loop);
  const d = offsetOf(i, b, n, loop);
  return {
    transform:
      "translate3d(calc(" +
      dx.toFixed(4) +
      " * var(--tcc-s)), " +
      (d * drop * 100).toFixed(3) +
      "%, 0) scale(" +
      scaleAt(d, inactiveScale).toFixed(4) +
      ") rotate(" +
      (d * angle).toFixed(3) +
      "deg)",
    zIndex: 100 - Math.round(Math.abs(d) * 10),
    hidden: Math.abs(dx) > 6.5,
  };
}

const CSS =
  ".tcc-root{position:relative;overflow:hidden;display:grid;place-items:center;width:100%;" +
  "color:#ffffff;user-select:none;-webkit-user-select:none;touch-action:pan-y;" +
  "outline:none;-webkit-tap-highlight-color:transparent}" +
  ".tcc-root:focus-visible{box-shadow:inset 0 0 0 2px #51fec0}" +
  ".tcc-root[data-dragging]{cursor:grabbing}" +
  ".tcc-root[data-dragging] .tcc-slide{cursor:grabbing}" +
  ".tcc-stage{position:relative;aspect-ratio:1/1;margin-top:-1.75rem}" +
  ".tcc-slide{position:absolute;inset:0;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;" +
  "cursor:pointer;will-change:transform;transform-origin:50% 50%;-webkit-tap-highlight-color:transparent}" +
  ".tcc-slide:focus-visible{outline:none}" +
  ".tcc-slide:focus-visible .tcc-frame{box-shadow:0 0 0 3px #0a1420,0 0 0 5px #51fec0}" +
  ".tcc-frame{position:absolute;inset:0;overflow:hidden;border-radius:var(--tcc-r);" +
  "background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);" +
  "box-shadow:0 28px 70px rgba(0,0,0,0.55)}" +
  ".tcc-frame>img{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;object-fit:cover}" +
  ".tcc-title,.tcc-cap{position:absolute;left:50%;white-space:nowrap;pointer-events:none;opacity:0;" +
  "transform:translateX(-50%) scale(.78);transition:opacity .32s,transform .32s}" +
  ".tcc-title{bottom:calc(100% + 14px);font-size:13px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;line-height:18px}" +
  ".tcc-cap{top:calc(100% + 14px);font-size:11px;line-height:16px;letter-spacing:.16em;text-transform:uppercase;" +
  "color:rgba(255,255,255,0.72)}" +
  ".tcc-slide[data-active] .tcc-title,.tcc-slide[data-active] .tcc-cap{opacity:1;transform:translateX(-50%) scale(1)}" +
  "@media (min-width:768px){.tcc-title{font-size:15px;line-height:20px}.tcc-cap{font-size:12px}}" +
  ".tcc-controls{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;" +
  "gap:14px;padding:4px 10px;border-radius:999px;z-index:120;" +
  "background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);" +
  "-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);" +
  "box-shadow:0 12px 32px rgba(0,0,0,0.35)}" +
  ".tcc-btn{display:grid;place-items:center;margin:0;padding:8px;border:0;border-radius:999px;background:none;" +
  "color:inherit;cursor:pointer;transition:opacity .2s,transform .2s,background-color .2s}" +
  ".tcc-btn:hover:not(:disabled){background:rgba(255,255,255,0.14)}" +
  ".tcc-btn:disabled{opacity:.3;cursor:default}" +
  ".tcc-btn:not(:disabled):active{transform:scale(.88)}" +
  ".tcc-btn:focus-visible,.tcc-dot:focus-visible{outline:2px solid #51fec0;outline-offset:2px}" +
  ".tcc-dots{min-width:150px;display:flex;justify-content:center;align-items:center;gap:8px}" +
  ".tcc-dot{position:relative;width:8px;height:8px;margin:0;padding:0;border:0;border-radius:999px;" +
  "background:currentColor;opacity:.35;cursor:pointer;transition:width .3s,opacity .3s,background-color .3s}" +
  ".tcc-dot::after{content:\"\";position:absolute;inset:-10px -4px}" +
  ".tcc-dot[aria-current]{width:28px;opacity:1;background:#51fec0}" +
  ".tcc-count{font-size:13px;font-variant-numeric:tabular-nums}" +
  ".tcc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@media (prefers-reduced-motion:reduce){" +
  ".tcc-title,.tcc-cap,.tcc-dot,.tcc-btn{transition:none}}";

function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ maxWidth: "none" }}
    >
      <path d={dir < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const pad = (n: number) => (n < 10 ? "0" + n : "" + n);

const blank = (i: number) => {
  const h = (i * 47 + 200) % 360;
  return `linear-gradient(145deg, hsl(${h} 32% 82%), hsl(${(h + 40) % 360} 28% 64%))`;
};

type EngineState = {
  a: number;
  va: number;
  b: number;
  vb: number;
  target: number;
  raf: number;
  last: number;
  size: number;
  reduced: boolean;
  drag: null | {
    id: number;
    x0: number;
    pos0: number;
    moved: boolean;
    samples: { t: number; x: number }[];
  };
  clickBlock: boolean;
  wheel: number;
  wheelAt: number;
  stepAt: number;
};

export default function TiltCascadeCarousel({
  items,
  height = "580px",
  slideSize = "clamp(210px, 44vmin, 370px)",
  angle = 24,
  drop = 0.42,
  inactiveScale = 0.68,
  radius = 22,
  bounce = 0.22,
  duration = 0.8,
  loop = true,
  autoplay = 4400,
  titles = true,
  captions = true,
  controls = true,
  color = "#ffffff",
  background = "transparent",
  fontFamily,
  index,
  defaultIndex = 0,
  onIndexChange,
  onSelect,
  ariaLabel = "Interactive architectural residence cascade",
  className = "",
}: TiltCascadeCarouselProps) {
  const n = items.length;
  const start = Math.min(
    Math.max(Math.round(index ?? defaultIndex), 0),
    Math.max(n - 1, 0)
  );
  const [active, setActive] = React.useState(start);
  const [dragging, setDragging] = React.useState(false);
  const [stopped, setStopped] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const slideRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const engineRef = React.useRef<EngineState>({
    a: start,
    va: 0,
    b: start,
    vb: 0,
    target: start,
    raf: 0,
    last: 0,
    size: 320,
    reduced: false,
    drag: null,
    clickBlock: false,
    wheel: 0,
    wheelAt: 0,
    stepAt: 0,
  });

  const cfgRef = React.useRef({
    n,
    loop,
    angle,
    drop,
    inactiveScale,
    bounce,
    duration,
  });

  const cbRef = React.useRef({ onIndexChange, active });

  React.useEffect(() => {
    cfgRef.current = { n, loop, angle, drop, inactiveScale, bounce, duration };
  }, [n, loop, angle, drop, inactiveScale, bounce, duration]);

  React.useEffect(() => {
    cbRef.current = { onIndexChange, active };
  }, [onIndexChange, active]);

  const paint = React.useCallback(() => {
    const E = engineRef.current;
    const c = cfgRef.current;
    for (let i = 0; i < slideRefs.current.length; i++) {
      const el = slideRefs.current[i];
      if (!el) continue;
      const t = computeTransform(
        i,
        E.a,
        E.b,
        c.n,
        c.loop,
        c.angle,
        c.drop,
        c.inactiveScale
      );
      el.style.transform = t.transform;
      el.style.zIndex = String(t.zIndex);
      el.style.visibility = t.hidden ? "hidden" : "";
    }
  }, []);

  const frameRef = React.useRef<(now: number) => void>(() => {});

  const kick = React.useCallback(() => {
    const E = engineRef.current;
    if (!E.raf) {
      E.raf = requestAnimationFrame((ts) => frameRef.current(ts));
    }
  }, []);

  React.useEffect(() => {
    frameRef.current = (now: number) => {
      const E = engineRef.current;
      const dt = Math.min((now - (E.last || now)) / 1000, 1 / 20);
      E.last = now;
      const c = cfgRef.current;
      const s = springOf(c.bounce, c.duration);
      if (E.reduced && !E.drag) {
        E.a = E.b = E.target;
        E.va = E.vb = 0;
      } else {
        if (!E.drag) {
          [E.a, E.va] = springStep(E.a, E.va, E.target, s.omega, s.slide, dt);
        }
        [E.b, E.vb] = springStep(E.b, E.vb, E.a, s.omega * 1.05, s.tilt, dt);
      }
      paint();
      const settled =
        !E.drag &&
        Math.abs(E.a - E.target) < 1e-3 &&
        Math.abs(E.va) < 1e-2 &&
        Math.abs(E.b - E.a) < 1e-3 &&
        Math.abs(E.vb) < 1e-2;
      if (settled) {
        E.a = E.b = E.target;
        E.va = E.vb = 0;
        paint();
        E.raf = 0;
        E.last = 0;
        return;
      }
      E.raf = requestAnimationFrame((ts) => frameRef.current(ts));
    };
  }, [paint]);

  const setTarget = React.useCallback(
    (t: number) => {
      const E = engineRef.current;
      const c = cfgRef.current;
      if (!c.n) return;
      E.target = c.loop ? t : Math.min(Math.max(t, 0), c.n - 1);
      const i = indexAt(E.target, c.n, c.loop);
      if (i !== cbRef.current.active) {
        setActive(i);
        cbRef.current.onIndexChange?.(i);
      }
      kick();
    },
    [kick]
  );

  const goTo = React.useCallback(
    (i: number) => {
      const E = engineRef.current;
      const c = cfgRef.current;
      setTarget(targetFor(i, E.target, c.n, c.loop));
    },
    [setTarget]
  );

  const step = React.useCallback(
    (by: number) => {
      const E = engineRef.current;
      setTarget(Math.round(E.target) + by);
    },
    [setTarget]
  );

  React.useEffect(() => {
    if (index == null || !n) return;
    const E = engineRef.current;
    if (wrapIndex(Math.round(E.target), n) !== wrapIndex(index, n)) {
      goTo(wrapIndex(index, n));
    }
  }, [index, n, goTo]);

  React.useEffect(() => {
    const E = engineRef.current;
    if (n && !loop && E.target > n - 1) setTarget(n - 1);
    paint();
  }, [n, loop, angle, drop, inactiveScale, paint, setTarget]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
      engineRef.current.reduced = mq.matches;
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      engineRef.current.size = el.offsetWidth || 320;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const engine = engineRef.current;
    return () => {
      if (engine.raf) cancelAnimationFrame(engine.raf);
    };
  }, []);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const E = engineRef.current;
      const now = performance.now();
      if (now - E.wheelAt > 160) E.wheel = 0;
      E.wheelAt = now;
      E.wheel += e.deltaX;
      if (Math.abs(E.wheel) > 50 && now - E.stepAt > 320) {
        setStopped(true);
        step(Math.sign(E.wheel));
        E.wheel = 0;
        E.stepAt = now;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step]);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || !autoplay) return;
    const io = new IntersectionObserver(([e]) =>
      setVisible(e.isIntersecting && !document.hidden)
    );
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [autoplay]);

  const playing =
    autoplay > 0 && n > 1 && !stopped && !focused && !dragging && visible;

  React.useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setTimeout(() => {
      const c = cfgRef.current;
      const E = engineRef.current;
      if (!c.loop && Math.round(E.target) >= c.n - 1) goTo(0);
      else step(1);
    }, autoplay);
    return () => window.clearTimeout(t);
  }, [playing, active, autoplay, goTo, step]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !n) return;
    if ((e.target as Element).closest("[data-tcc-controls]")) return;
    const E = engineRef.current;
    E.drag = {
      id: e.pointerId,
      x0: e.clientX,
      pos0: E.a,
      moved: false,
      samples: [{ t: e.timeStamp, x: e.clientX }],
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const E = engineRef.current;
    const d = E.drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      d.x0 = e.clientX;
      d.pos0 = E.a;
      E.va = 0;
      rootRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
      setStopped(true);
    }
    const c = cfgRef.current;
    const raw = d.pos0 - (e.clientX - d.x0) / E.size;
    E.a = c.loop ? raw : rubber(raw, c.n);
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    if (d.samples.length > 6) d.samples.shift();
    const i = indexAt(E.a, c.n, c.loop);
    if (i !== cbRef.current.active) {
      setActive(i);
      cbRef.current.onIndexChange?.(i);
    }
    kick();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const E = engineRef.current;
    const d = E.drag;
    if (!d || d.id !== e.pointerId) return;
    E.drag = null;
    if (!d.moved) return;
    setDragging(false);
    E.clickBlock = true;
    window.setTimeout(() => {
      engineRef.current.clickBlock = false;
    }, 0);
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const ms = Math.max(last.t - first.t, 1);
    const v =
      e.type === "pointercancel"
        ? 0
        : (-(last.x - first.x) / ms / E.size) * 1000;
    E.va = v;
    setTarget(releaseTarget(E.a, v, cfgRef.current.n, cfgRef.current.loop));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let handled = true;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(n - 1);
    else handled = false;
    if (handled) {
      e.preventDefault();
      setStopped(true);
    }
  };

  const onSlideClick = (i: number) => {
    if (engineRef.current.clickBlock) return;
    setStopped(true);
    if (i === active) onSelect?.(items[i], i);
    else goTo(i);
  };

  const atStart = !loop && active <= 0;
  const atEnd = !loop && active >= n - 1;
  const manyDots = n > 14;
  const current = items[active];

  return (
    <div
      ref={rootRef}
      className={"tcc-root " + className}
      style={{ height, background, color, fontFamily }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      data-dragging={dragging ? "" : undefined}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <style>{CSS}</style>

      <div
        ref={stageRef}
        className="tcc-stage"
        style={
          {
            width: slideSize,
            ["--tcc-s" as string]: slideSize,
            ["--tcc-r" as string]: radius + "px",
          } as React.CSSProperties
        }
      >
        {items.map((item, i) => {
          const initial = computeTransform(
            i,
            start,
            start,
            n,
            loop,
            angle,
            drop,
            inactiveScale
          );
          const isActive = i === active;
          return (
            <button
              key={item.title}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              type="button"
              className="tcc-slide"
              data-active={isActive ? "" : undefined}
              tabIndex={isActive ? 0 : -1}
              aria-roledescription="slide"
              aria-label={i + 1 + " of " + n + ": " + item.title}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSlideClick(i)}
              style={{
                transform: initial.transform,
                zIndex: initial.zIndex,
                visibility: initial.hidden ? "hidden" : undefined,
              }}
            >
              <span className="tcc-frame">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    width={640}
                    height={640}
                    style={{ maxWidth: "none" }}
                  />
                ) : (
                  <span
                    role="img"
                    aria-label={item.alt ?? item.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: blank(i),
                    }}
                  />
                )}
              </span>
              {titles ? (
                <span className="tcc-title" aria-hidden="true">
                  {item.title}
                </span>
              ) : null}
              {captions && item.caption ? (
                <span className="tcc-cap" aria-hidden="true">
                  {item.caption}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {controls && n > 1 ? (
        <div className="tcc-controls" data-tcc-controls="">
          <button
            type="button"
            className="tcc-btn"
            aria-label="Previous slide"
            disabled={atStart}
            onClick={() => {
              setStopped(true);
              step(-1);
            }}
          >
            <Chevron dir={-1} />
          </button>
          <div className="tcc-dots">
            {manyDots ? (
              <span className="tcc-count">
                {pad(active + 1)} / {pad(n)}
              </span>
            ) : (
              items.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  className="tcc-dot"
                  aria-label={"Go to slide " + (i + 1) + ": " + item.title}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => {
                    setStopped(true);
                    goTo(i);
                  }}
                />
              ))
            )}
          </div>
          <button
            type="button"
            className="tcc-btn"
            aria-label="Next slide"
            disabled={atEnd}
            onClick={() => {
              setStopped(true);
              step(1);
            }}
          >
            <Chevron dir={1} />
          </button>
        </div>
      ) : null}

      <div className="tcc-sr" aria-live="polite" aria-atomic="true">
        {current
          ? "Slide " + (active + 1) + " of " + n + ": " + current.title
          : ""}
      </div>
    </div>
  );
}

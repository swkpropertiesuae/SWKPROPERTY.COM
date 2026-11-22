"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type TiltStackCard = {
  title: string;
  /** Small line above the title, e.g. "Nakheel · Palm Jebel Ali". */
  kicker?: string;
  description: string;
  image: string;
  alt?: string;
  /** Short chips under the copy. */
  tags?: string[];
  /** Big figure on the right, e.g. "AED 4.35M". */
  price?: string;
  priceNote?: string;
  cta?: string;
  href?: string;
  /** Tint for the chip dots and the button. */
  accent?: string;
};

export type TiltStackScrollProps = {
  cards: TiltStackCard[];
  eyebrow?: string;
  heading?: string;
  /** Height of the sticky stage; the section scrolls one stage per card. */
  height?: string;
  /** Settle on the nearest card when scrolling stops. */
  snap?: boolean;
  className?: string;
};

// #region pose
export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export type Pose = { y: number; scale: number; rx: number; rz: number; shade: number; opacity: number };

/** Where card i sits when the scroll is at p (0 = first card, n-1 = last).
 *  A card slides up tilted and turned, lands flat, then tips back and shrinks
 *  as later cards land on it. y is a percentage of the card's own height. */
export function pose(p: number, i: number, reduced: boolean): Pose {
  const enter = i === 0 ? 1 : clamp(p - (i - 1), 0, 1);
  const depth = clamp(p - i, 0, 3);
  if (reduced)
    return { y: 0, scale: 1, rx: 0, rz: 0, shade: Math.min(depth, 1) * 0.5, opacity: enter >= 1 ? 1 : enter };
  const e = easeOut(enter);
  return {
    y: (1 - e) * 130 - depth * 3.2,
    scale: (1 - depth * 0.07) * (0.9 + 0.1 * e),
    rx: (1 - e) * 22 - depth * 9,
    rz: (1 - e) * (i % 2 ? 5 : -5) + 0,
    shade: Math.min(depth, 2) * 0.34,
    opacity: depth > 2.6 ? clamp((3 - depth) / 0.4, 0, 1) : 1,
  };
}

export const toTransform = (q: Pose) =>
  "translate3d(0," +
  q.y.toFixed(3) +
  "%,0) perspective(1400px) rotateX(" +
  q.rx.toFixed(3) +
  "deg) rotateZ(" +
  q.rz.toFixed(3) +
  "deg) scale(" +
  q.scale.toFixed(4) +
  ")";

export const pad2 = (n: number) => (n < 10 ? "0" : "") + n;
// #endregion

// 100% consistent site typography (Switzer / Inter + Geist Mono)
const DISPLAY_FONT = "var(--font-sans)";
const MONO_FONT = "var(--font-mono)";

const CSS =
  ".tss-track{position:relative;width:100%}" +
  ".tss-stage{position:sticky;top:92px;display:flex;flex-direction:column;overflow:hidden;background:transparent;color:var(--color-foreground);box-sizing:border-box;padding:12px 0 84px}" +
  ".tss-head{position:relative;z-index:5;width:100%;max-width:1180px;margin:0 auto 14px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:14px 22px;border-radius:20px;background:rgba(255,255,255,0.82);border:1px solid rgba(255,255,255,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 16px 42px rgba(12,56,96,0.08)}" +
  ".tss-eyebrow{font-family:" + MONO_FONT + ";font-weight:600;font-size:11px;line-height:1;letter-spacing:.2em;text-transform:uppercase;color:#1b6aa7;margin:0 0 8px}" +
  ".tss-h{font-family:" + DISPLAY_FONT + ";font-weight:500;font-size:clamp(24px,3.6vw,40px);line-height:1.04;letter-spacing:-.04em;margin:0;color:#121212}" +
  ".tss-h span{display:inline-block}" +
  ".tss-count{flex:none;font-family:" + MONO_FONT + ";font-weight:600;font-size:12px;line-height:1;letter-spacing:.12em;color:#64748b;display:flex;align-items:center;gap:12px}" +
  ".tss-count b{font-weight:600;color:#121212;font-size:22px;letter-spacing:-.02em}" +
  ".tss-rail{width:96px;height:3px;border-radius:999px;background:rgba(12,35,58,0.14);overflow:hidden}" +
  ".tss-rail i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#121212,#1b6aa7,#0e9f6e);transform-origin:0 50%;transform:scaleX(0)}" +
  ".tss-deck{position:relative;flex:1;width:100%;max-width:1180px;margin:10px auto 0;min-height:0}" +
  ".tss-card{position:absolute;inset:0;border-radius:30px;overflow:hidden;transform-origin:50% 0;will-change:transform;backface-visibility:hidden;background:#0a1421;color:#fff;" +
  "box-shadow:0 1px 0 rgba(255,255,255,.22) inset,0 0 0 1px rgba(255,255,255,.16),0 50px 90px -40px rgba(8,18,32,.55),0 18px 40px -20px rgba(8,18,32,.42)}" +
  ".tss-card>img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;transform:scale(1.05)}" +
  ".tss-card::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(6,12,22,.84) 0%,rgba(6,12,22,.54) 44%,rgba(6,12,22,.12) 78%),linear-gradient(0deg,rgba(6,12,22,.72),rgba(6,12,22,0) 48%)}" +
  ".tss-shade{position:absolute;inset:0;z-index:4;background:#050b14;opacity:0;pointer-events:none}" +
  ".tss-body{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(22px,3.4vw,44px)}" +
  ".tss-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}" +
  ".tss-num{font-family:" + DISPLAY_FONT + ";font-weight:500;font-size:clamp(50px,7.5vw,94px);line-height:.85;letter-spacing:-.05em;color:rgba(255,255,255,.92);font-feature-settings:'tnum'}" +
  ".tss-kick{font-family:" + MONO_FONT + ";font-weight:600;font-size:11px;line-height:1;letter-spacing:.18em;text-transform:uppercase;padding:9px 14px;border-radius:999px;background:rgba(8,19,31,.65);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);white-space:nowrap;color:#fff}" +
  ".tss-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:28px}" +
  ".tss-copy{max-width:520px}" +
  ".tss-title{font-family:" + DISPLAY_FONT + ";font-weight:500;font-size:clamp(30px,4.2vw,54px);line-height:1.02;letter-spacing:-.04em;margin:0 0 14px;color:#fff}" +
  ".tss-desc{font-family:" + DISPLAY_FONT + ";font-weight:400;font-size:clamp(14px,1.25vw,16px);line-height:1.58;color:rgba(255,255,255,.82);margin:0 0 18px}" +
  ".tss-tags{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}" +
  ".tss-tags li{display:flex;align-items:center;gap:7px;font-family:" + DISPLAY_FONT + ";font-weight:500;font-size:12px;line-height:1;padding:8px 12px;border-radius:999px;background:rgba(8,19,31,.48);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px)}" +
  ".tss-tags li::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--tss-accent)}" +
  ".tss-buy{flex:none;text-align:right}" +
  ".tss-price{font-family:" + DISPLAY_FONT + ";font-weight:500;font-size:clamp(26px,3.1vw,40px);line-height:1.05;letter-spacing:-.035em;color:#fff}" +
  ".tss-note{display:block;font-family:" + MONO_FONT + ";font-weight:500;font-size:11px;line-height:1;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.68);margin:8px 0 16px}" +
  ".tss-cta{display:inline-flex;align-items:center;gap:10px;font-family:" + DISPLAY_FONT + ";font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:#0a1624;background:var(--tss-accent);padding:14px 20px;border-radius:999px;text-decoration:none;border:0;cursor:pointer;" +
  "box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 12px 28px -8px var(--tss-accent);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s,background-color .25s}" +
  ".tss-cta:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 18px 36px -8px var(--tss-accent)}" +
  ".tss-cta:active{transform:scale(.97)}" +
  ".tss-cta:focus-visible{outline:2px solid #fff;outline-offset:3px}" +
  ".tss-cta svg{transition:transform .3s cubic-bezier(.22,1,.36,1)}" +
  ".tss-cta:hover svg{transform:translateX(3px)}" +
  "@media (max-width:768px){.tss-stage{top:72px}.tss-bottom{flex-direction:column;align-items:flex-start;gap:18px}.tss-buy{text-align:left;display:flex;align-items:center;gap:16px;width:100%;justify-content:space-between}.tss-note{margin:6px 0 0}" +
  ".tss-card::before{background:linear-gradient(0deg,rgba(6,12,22,.92) 0%,rgba(6,12,22,.6) 55%,rgba(6,12,22,.14) 100%)}.tss-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.tss-head{flex-direction:column;align-items:flex-start;gap:12px;padding:16px 18px}.tss-card{border-radius:24px}}" +
  "@media (prefers-reduced-motion:reduce){.tss-cta,.tss-cta svg{transition:none}}";

export default function TiltStackScroll({
  cards,
  eyebrow = "Signature Dubai Landmarks",
  heading = "Six icons rising across the skyline",
  height = "86svh",
  snap = true,
  className = "",
}: TiltStackScrollProps) {
  const track = useRef(null as HTMLDivElement | null);
  const els = useRef([] as (HTMLElement | null)[]);
  const shades = useRef([] as (HTMLDivElement | null)[]);
  const count = useRef(null as HTMLElement | null);
  const rail = useRef(null as HTMLElement | null);
  const headWords = useRef(null as HTMLHeadingElement | null);
  const n = cards.length;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    let last = -1;
    let p = 0;

    const paint = () => {
      for (let i = 0; i < n; i++) {
        const el = els.current[i];
        if (!el) continue;
        const q = pose(p, i, reduced);
        el.style.transform = toTransform(q);
        el.style.opacity = String(q.opacity);
        const sh = shades.current[i];
        if (sh) sh.style.opacity = String(q.shade);
      }
      const idx = Math.round(p);
      if (idx !== last && count.current) {
        last = idx;
        count.current.textContent = pad2(idx + 1);
      }
      if (rail.current) rail.current.style.transform = "scaleX(" + (n > 1 ? p / (n - 1) : 1).toFixed(4) + ")";
    };

    const trigger = ScrollTrigger.create({
      trigger: track.current,
      start: "top 80px",
      end: "bottom bottom",
      onUpdate: (self) => {
        p = self.progress * Math.max(n - 1, 0);
        paint();
      },
      snap:
        snap && !reduced && n > 1
          ? { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.65 }, delay: 0.08, ease: "power2.inOut" }
          : undefined,
    });
    paint();

    const ctx = gsap.context(() => {
      if (reduced) return;
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      const words = headWords.current ? headWords.current.querySelectorAll(".tss-w") : [];
      intro.from(words, { yPercent: 110, opacity: 0, rotate: 3, duration: 1.0, stagger: 0.05 }, 0.08);
      if (els.current[0]) {
        intro.from(
          els.current[0],
          { yPercent: 14, rotateX: 16, scale: 0.94, opacity: 0, duration: 1.25, clearProps: "rotateX" },
          0.18
        );
      }
      intro.eventCallback("onComplete", paint);
    });

    const on = () => {
      reduced = mq.matches;
      paint();
    };
    mq.addEventListener("change", on);
    return () => {
      mq.removeEventListener("change", on);
      trigger.kill();
      ctx.revert();
      paint();
    };
  }, [n, snap]);

  return (
    <div
      ref={track}
      className={"tss-track " + className}
      style={{ height: `calc(${height} * ${Math.max(n, 1) * 0.78 + 0.5})` }}
    >
      <style>{CSS}</style>
      <section className="tss-stage" style={{ height }} aria-roledescription="carousel" aria-label={heading}>
        <header className="tss-head">
          <div>
            <p className="tss-eyebrow">{eyebrow}</p>
            <h3 className="tss-h" ref={headWords}>
              {heading.split(" ").map((w, i) => (
                <span key={i} style={{ overflow: "hidden", paddingBottom: 4 }}>
                  <span className="tss-w">{w}</span>
                  {"\u00a0"}
                </span>
              ))}
            </h3>
          </div>
          <div className="tss-count" aria-hidden="true">
            <b ref={count}>01</b> / {pad2(n)}
            <span className="tss-rail">
              <i ref={rail} />
            </span>
          </div>
        </header>

        <div className="tss-deck">
          {cards.map((c, i) => (
            <article
              key={c.title + i}
              className="tss-card"
              ref={(el) => {
                els.current[i] = el;
              }}
              style={{ zIndex: i + 1, ["--tss-accent" as string]: c.accent ?? "#51fec0" }}
              aria-roledescription="slide"
              aria-label={pad2(i + 1) + " of " + pad2(n) + ": " + c.title}
            >
              <img src={c.image} alt={c.alt ?? c.title} draggable={false} loading={i < 2 ? "eager" : "lazy"} />
              <div className="tss-body">
                <div className="tss-top">
                  <span className="tss-num">{pad2(i + 1)}</span>
                  {c.kicker && <span className="tss-kick">{c.kicker}</span>}
                </div>
                <div className="tss-bottom">
                  <div className="tss-copy">
                    <h4 className="tss-title">{c.title}</h4>
                    <p className="tss-desc">{c.description}</p>
                    {c.tags && c.tags.length > 0 && (
                      <ul className="tss-tags">
                        {c.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {(c.price || c.cta) && (
                    <div className="tss-buy">
                      {c.price && (
                        <div>
                          <div className="tss-price">{c.price}</div>
                          {c.priceNote && <span className="tss-note">{c.priceNote}</span>}
                        </div>
                      )}
                      {c.href ? (
                        <Link className="tss-cta" href={c.href}>
                          {c.cta ?? "Explore Residence"}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path
                              d="M2 7h10M8 3l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <button type="button" className="tss-cta">
                          {c.cta ?? "Explore Residence"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="tss-shade"
                ref={(el) => {
                  shades.current[i] = el;
                }}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

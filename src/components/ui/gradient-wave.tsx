"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev @designali-in/gradient-wave
 * High-performance WebGL Simplex Noise Mesh Gradient Wave background
 * (with automatic reduced-motion and Canvas2D fallback).
 */
export interface GradientWaveProps {
  colors?: string[];
  isPlaying?: boolean;
  className?: string;
  shadowPower?: number;
  darkenTop?: boolean;
  noiseSpeed?: number;
  noiseFrequency?: [number, number];
  deform?: {
    incline?: number;
    noiseAmp?: number;
    noiseFlow?: number;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform float u_shadowPower;
uniform float u_darkenTop;
uniform vec2 u_noiseFreq;
uniform float u_incline;
uniform float u_noiseAmp;
uniform float u_noiseFlow;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 coord = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float t = u_time * u_noiseFlow;
  float tilt = coord.x * u_incline;

  float n1 = snoise(vec3(coord.x * u_noiseFreq.x + t * 0.45, coord.y * u_noiseFreq.y + tilt - t * 0.25, t * 0.35));
  float n2 = snoise(vec3(coord.x * u_noiseFreq.x * 1.35 - t * 0.32, coord.y * u_noiseFreq.y * 1.15 + n1 * u_noiseAmp, t * 0.28 + 3.1));
  float n3 = snoise(vec3(coord.x * u_noiseFreq.x * 0.85 + n2 * 0.4, coord.y * u_noiseFreq.y * 1.6 + t * 0.2, t * 0.22 + 7.7));

  float waveA = smoothstep(-0.65, 0.72, n1 * 0.65 + n2 * 0.35 + (uv.y - 0.45) * 0.45);
  float waveB = smoothstep(-0.55, 0.68, n2 * 0.6 + n3 * 0.4 + (uv.x - 0.5) * 0.35);
  float waveC = smoothstep(-0.45, 0.75, n3 * 0.7 - n1 * 0.3);
  float ribbon = smoothstep(0.18, 0.82, sin((coord.y * 3.2 + n1 * 1.45 + t * 0.6)) * 0.5 + 0.5);

  vec3 col = mix(u_color0, u_color1, waveA);
  col = mix(col, u_color2, waveB * 0.72);
  col = mix(col, u_color3, waveC * 0.55);
  col = mix(col, u_color4, ribbon * 0.36);

  // Subtle architectural lighting sheen
  float sheen = pow(clamp(1.0 - abs(n1 - n2), 0.0, 1.0), max(u_shadowPower, 1.0));
  col = mix(col, u_color0, sheen * 0.16);

  if (u_darkenTop > 0.5) {
    float topMask = smoothstep(0.55, 1.0, uv.y);
    col *= (1.0 - topMask * 0.12);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

export function GradientWave({
  colors = ["#ffffff", "#f4f7f5", "#e4f9ef", "#f8f3e8", "#eef4ff"],
  isPlaying = true,
  className,
  shadowPower = 5,
  darkenTop = false,
  noiseSpeed = 0.000018,
  noiseFrequency = [1.45, 1.85],
  deform = { incline: 0.24, noiseAmp: 0.42, noiseFlow: 1.0 },
}: GradientWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorKey = colors.join(",");
  const freqX = noiseFrequency[0];
  const freqY = noiseFrequency[1];
  const incline = deform.incline ?? 0.24;
  const noiseAmp = deform.noiseAmp ?? 0.42;
  const noiseFlow = deform.noiseFlow ?? 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const palette = [
      colors[0] ?? "#ffffff",
      colors[1] ?? "#f4f7f5",
      colors[2] ?? "#e4f9ef",
      colors[3] ?? "#f8f3e8",
      colors[4] ?? colors[1] ?? "#eef4ff",
    ].map(hexToRgb);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (!gl) {
      // Clean Canvas2D mesh gradient fallback when WebGL is disabled
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, colors[0] ?? "#ffffff");
        g.addColorStop(0.35, colors[1] ?? "#f4f7f5");
        g.addColorStop(0.68, colors[2] ?? "#e4f9ef");
        g.addColorStop(1, colors[3] ?? "#f8f3e8");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return () => window.removeEventListener("resize", resize);
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      return () => window.removeEventListener("resize", resize);
    }

    const prog = gl.createProgram();
    if (!prog) {
      return () => window.removeEventListener("resize", resize);
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return () => window.removeEventListener("resize", resize);
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uC0 = gl.getUniformLocation(prog, "u_color0");
    const uC1 = gl.getUniformLocation(prog, "u_color1");
    const uC2 = gl.getUniformLocation(prog, "u_color2");
    const uC3 = gl.getUniformLocation(prog, "u_color3");
    const uC4 = gl.getUniformLocation(prog, "u_color4");
    const uShadow = gl.getUniformLocation(prog, "u_shadowPower");
    const uDarken = gl.getUniformLocation(prog, "u_darkenTop");
    const uFreq = gl.getUniformLocation(prog, "u_noiseFreq");
    const uIncline = gl.getUniformLocation(prog, "u_incline");
    const uAmp = gl.getUniformLocation(prog, "u_noiseAmp");
    const uFlow = gl.getUniformLocation(prog, "u_noiseFlow");

    gl.uniform3fv(uC0, palette[0]);
    gl.uniform3fv(uC1, palette[1]);
    gl.uniform3fv(uC2, palette[2]);
    gl.uniform3fv(uC3, palette[3]);
    gl.uniform3fv(uC4, palette[4]);
    gl.uniform1f(uShadow, shadowPower);
    gl.uniform1f(uDarken, darkenTop ? 1.0 : 0.0);
    gl.uniform2f(uFreq, freqX, freqY);
    gl.uniform1f(uIncline, incline);
    gl.uniform1f(uAmp, noiseAmp);
    gl.uniform1f(uFlow, noiseFlow);

    let rafId = 0;
    let start = performance.now();
    const speedFactor = Math.max(noiseSpeed * 12000, 0.14);

    const draw = (now: number) => {
      const elapsed = ((now - start) / 1000) * speedFactor;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (isPlaying && !prefersReduced) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    start = performance.now();
    draw(start);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [colorKey, isPlaying, shadowPower, darkenTop, noiseSpeed, freqX, freqY, incline, noiseAmp, noiseFlow, colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full block",
        className
      )}
    />
  );
}

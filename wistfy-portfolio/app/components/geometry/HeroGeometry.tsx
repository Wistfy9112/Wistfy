'use client'

import { useEffect, useRef } from 'react'
import { useSystem } from '@/app/system/SystemProvider'
import { getPassive } from '@/app/system/passive'

/* ================================================================== */
/* GRAPHICS LAB — a single restrained render artifact                  */
/* (WebGL2/GLSL ES1, single pass, transparent fixed canvas)            */
/*                                                                     */
/* A procedural geometry experiment, not a decorative sphere:          */
/*                                                                     */
/*   BASE     quantized surface patches -> flat-shaded facets          */
/*   DEFORM   slow noise displacement; eroded silhouette eats inward   */
/*   WIRE     sparse incomplete mesh edges + subtle facet borders      */
/*   LIGHT    restrained traveling key + rim, no glow hotspots         */
/*   FRAG     small detached shards orbiting the form (signature)      */
/*                                                                     */
/* A faint reconstruction front sweeps the mesh slowly; a few cells    */
/* are missing and rebuilt over time. Motion is extremely slow; the    */
/* cursor adds only ±3°/±5° parallax + a gentle proximity lift.        */
/* Reduced motion freezes. Fixed to the viewport; fades on scroll.     */
/* ================================================================== */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uReduced;
uniform float uMobile;
uniform float uScroll;

/* ---------- procedural helpers ---------- */
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

/* trilinear value noise on a 3D lattice */
float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float bz = i.z * 17.0;
  float bz1 = (i.z + 1.0) * 17.0;
  float n000 = hash21(i.xy + vec2(bz));
  float n100 = hash21(i.xy + vec2(bz) + vec2(1.0, 0.0));
  float n010 = hash21(i.xy + vec2(bz) + vec2(0.0, 1.0));
  float n110 = hash21(i.xy + vec2(bz) + vec2(1.0, 1.0));
  float n001 = hash21(i.xy + vec2(bz1));
  float n101 = hash21(i.xy + vec2(bz1) + vec2(1.0, 0.0));
  float n011 = hash21(i.xy + vec2(bz1) + vec2(0.0, 1.0));
  float n111 = hash21(i.xy + vec2(bz1) + vec2(1.0, 1.0));
  float a = mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y);
  float b = mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y);
  return mix(a, b, u.z);
}

/* slow surface displacement field */
float de(vec3 v, float tt) {
  float n1 = vnoise3(v * 2.2 + vec3(0.0, 0.0, tt * 0.05));
  float n2 = vnoise3(v * 5.0 + vec3(tt * 0.03, 1.7, 0.0));
  return (n1 - 0.5) * 1.2 + (n2 - 0.5) * 0.5;
}

/* distance from point p to segment a->b */
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  vec2 ap = p - a;
  float h = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
  return length(ap - ab * h);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uReduced > 0.5 ? 0.0 : uTime;
  vec2 m = uReduced > 0.5 ? vec2(0.0) : uMouse;

  /* form — right side, restrained render artifact */
  float cx = mix(0.82, 0.92, uMobile);
  vec2 center = vec2((cx * 2.0 - 1.0) * aspect, 0.0);
  vec2 p = uv - center;
  float b = length(p);

  vec2 mu = m * vec2(aspect, 1.0);
  float prox = (1.0 - smoothstep(0.18, 0.72, distance(mu, center))) * 0.6;

  float tA = t * 0.12;                       /* extremely slow */
  float R0 = mix(0.38, 0.28, uMobile) * (1.0 + 0.015 * sin(t * 0.07));
  float simp = 1.0 - uScroll * 0.5;          /* scroll -> geometry simplifies */

  /* only present on the home section — fade out as the page scrolls away */
  float scrollFade = 1.0 - smoothstep(0.0, 0.22, uScroll);
  if (scrollFade < 0.01) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  /* palette — muted technical blues */
  vec3 nearBlack = vec3(0.018, 0.026, 0.040);
  vec3 blueGray  = vec3(0.26, 0.36, 0.46);
  vec3 line      = vec3(0.40, 0.60, 0.72);
  vec3 cyan      = vec3(0.26, 0.80, 0.90);
  vec3 ice       = vec3(0.60, 0.80, 0.92);
  vec3 white     = vec3(0.76, 0.88, 0.96);

  /* cursor gravity — local, restrained */
  float g = 0.4 * exp(-pow(length(mu - p) / 0.42, 2.0));

  vec3 col = vec3(0.0);

  /* faint environment glow around the artifact */
  float halo = exp(-pow(b / (R0 * 1.15), 2.0));
  col += cyan * halo * 0.18 * (0.5 + 0.3 * prox);
  col += ice * halo * halo * 0.14;

  vec2 q = p / R0;
  float q2 = dot(q, q);

  if (q2 < 1.0) {
    float z = sqrt(max(0.0, 1.0 - q2));
    vec3 v0 = vec3(q.x, q.y, z);

    /* idle rotation + passive parallax (X ±3°, Y ±5°) */
    float rotY = tA * 0.20 + m.x * 0.087;
    float cy = cos(rotY), sy = sin(rotY);
    vec3 vf = vec3(v0.x * cy + v0.z * sy, v0.y, -v0.x * sy + v0.z * cy);
    float tilt = 0.30 + 0.05 * sin(t * 0.13) + m.y * 0.052;
    float ct = cos(tilt), st = sin(tilt);
    vf = vec3(vf.x, vf.y * ct - vf.z * st, vf.y * st + vf.z * ct);

    float lon = atan(vf.y, vf.x);
    float lat = acos(clamp(vf.z, -1.0, 1.0));

    /* procedural topology — quantized surface patches */
    float uCells = 20.0;
    float vCells = 11.0;
    float ud = 6.2831853 / uCells;
    float vd = 3.1415927 / vCells;
    float uc = (floor(lon / ud) + 0.5) * ud;
    float vc = (floor(lat / vd) + 0.5) * vd;
    vec3 fdir = vec3(sin(vc) * cos(uc), sin(vc) * sin(uc), cos(vc));

    /* a few cells missing — incomplete mesh, slowly rebuilt */
    float ch = hash21(vec2(floor(uc * 1.9), floor(vc * 3.1)));
    float alive = smoothstep(0.5, 0.82, ch + 0.5 * sin(t * 0.04 + ch * 6.283));

    /* eroded silhouette — surface eats inward, deeper where cells are lost */
    float dead = 1.0 - alive;
    float rSurf = 1.0 + min((de(v0, t) - 0.25) * 0.34 * simp, 0.0)
                       - dead * (0.10 + 0.16 * fract(ch * 9.37)) * simp;
    float inside = 1.0 - smoothstep(0.0, 0.02, b - R0 * rSurf);
    float frontFade = 1.0 - smoothstep(0.5, 0.92, q2);
    float presence = frontFade * inside;

    /* displacement at patch center -> flat-shaded facets */
    float disp = de(fdir, t) * 0.22 * simp;
    vec3 n = normalize(fdir * (1.0 + disp));

    /* restrained light — slow key + rim + cool fill */
    float la = t * 0.05;
    vec3 L = normalize(vec3(cos(la), sin(la * 0.7), 0.6));
    vec3 viewDir = normalize(vec3(p.x, p.y, 1.0));
    float diff = max(dot(n, L), 0.0);
    vec3 H = normalize(L + viewDir);
    float spec = pow(max(dot(n, H), 0.0), 30.0);
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
    vec3 L2 = normalize(vec3(-cos(la * 0.7), sin(la * 0.5), 0.4));
    float fill = 0.5 + 0.5 * dot(n, L2);

    /* LAYER 01 — faint shaded mesh fill */
    col += nearBlack * 0.78 * presence;
    col += blueGray * diff * 0.30 * alive * (0.5 + 0.4 * prox) * presence;
    col += blueGray * fill * 0.10 * alive * presence;
    col += ice * rim * 0.18 * alive * (0.55 + 0.35 * prox) * presence;
    col += white * spec * 0.22 * alive * (0.5 + 0.4 * prox) * presence;
    col += blueGray * (1.0 - q2) * 0.08 * alive * presence;

    /* reconstruction front — crisp line + soft band sweeping the mesh */
    float buildLat = (1.0 - fract(t * 0.003)) * 3.1415927;
    float dLat = abs(lat - buildLat);
    float front = (1.0 - smoothstep(0.0, 0.012, dLat)) * 0.10
                + (1.0 - smoothstep(0.0, 0.055, dLat)) * 0.05;
    col += cyan * front * alive * (0.6 + 0.5 * prox) * presence;

    /* LAYER 02 — wireframe edges (incomplete mesh) */
    float uu = lon + disp * 0.5;
    float dU = min(fract(uu / ud), 1.0 - fract(uu / ud));
    float dV = min(fract(lat / vd), 1.0 - fract(lat / vd));
    float edge = max(1.0 - smoothstep(0.0, 0.02, dU), 1.0 - smoothstep(0.0, 0.02, dV));
    float sel = 0.5 + 0.5 * sin(uu * 3.0 + lat * 2.0 + tA * 0.5);
    float selM = smoothstep(0.12, 0.62, sel);
    float breathe = 0.5 + 0.5 * sin(t * 0.35 + lat * 3.0);
    col += line * edge * selM * alive * presence * (0.24 + 0.07 * prox + 0.12 * g) * (0.7 + 0.3 * breathe) * simp;

    /* facet borders — subtle topology lines */
    float cellU = min(fract(lon / ud), 1.0 - fract(lon / ud));
    float cellV = min(fract(lat / vd), 1.0 - fract(lat / vd));
    float topo = max(1.0 - smoothstep(0.0, 0.007, cellU), 1.0 - smoothstep(0.0, 0.007, cellV));
    col += line * topo * alive * presence * 0.055 * (0.4 + 0.3 * prox);

    /* LAYER 03 — sparse vertex dots */
    float onU = 1.0 - smoothstep(0.0, 0.03, dU);
    float onV = 1.0 - smoothstep(0.0, 0.03, dV);
    float vtx = onU * onV;
    float tw = 0.5 + 0.5 * sin(t * 1.2 + lon * 7.0 + lat * 5.0);
    col += cyan * vtx * alive * (0.36 + 0.38 * g) * (0.5 + 0.5 * tw) * 0.7 * presence;

    /* silhouette — thin edge on the eroded boundary */
    float silEdge = 1.0 - smoothstep(0.0, 0.006, abs(b - R0 * rSurf));
    col += ice * silEdge * (0.30 + 0.14 * prox) * (0.7 + 0.3 * sin(t * 0.2));
  }

  /* vertex points + fragments only near the artifact (GPU guard) */
  if (b < R0 * 2.0) {

  /* drifting vertex points — sparse, slow, some leave the geometry */
  for (int i = 0; i < 28; i++) {
    if (uMobile > 0.5 && i >= 12) break;
    float fi = float(i);
    float pr = R0 * (0.95 + fract(fi * 0.31) * 0.30);
    float pa = fi * 2.4 + tA * (0.4 + fract(fi * 0.7) * 0.6);
    float life = fract(t * 0.012 + fi * 0.09);   /* ~80s cycle */
    float rr = pr + 0.30 * life;                 /* slow outward drift */
    vec2 pp = vec2(cos(pa), sin(pa)) * rr;
    float vis = 1.0 - smoothstep(0.55, 1.0, life);
    float size = 0.007 + fract(fi * 0.23) * 0.007;
    float dpt = length(p - pp);
    float pt = 1.0 - smoothstep(0.0, size, dpt);
    float g2 = exp(-pow(length(mu - pp) / 0.30, 2.0));
    col += blueGray * pt * vis * (0.32 + 0.10 * g2) * (0.7 + 0.35 * prox);
    col += cyan * pt * vis * g2 * 0.18;          /* active vertex response */
    float pg = exp(-pow(dpt / (size * 4.0), 2.0)) * vis * (0.5 + 0.3 * g2);
    col += ice * pg * 0.10 * (0.55 + 0.35 * prox);
  }

  /* detached fragments — small shards orbiting the artifact (signature) */
  for (int f = 0; f < 10; f++) {
    if (uMobile > 0.5 && f >= 5) break;
    float ff = float(f);
    float ang = ff * 2.399 + tA * (1.0 + fract(ff * 0.37));
    float rad = R0 * (1.24 + fract(ff * 0.61) * 0.40);
    float lift = R0 * 0.10 * sin(t * 0.05 + ff * 2.1);
    vec2 fc = vec2(cos(ang), sin(ang)) * rad + vec2(0.0, lift);
    float size = 0.026 + fract(ff * 0.29) * 0.022;
    float rot = t * 0.04 * (0.5 + fract(ff * 0.43)) + ff * 0.7;
    float phase = fract(t * 0.006 + ff * 0.13);
    float vis = (1.0 - smoothstep(0.72, 1.0, phase)) * (1.0 - smoothstep(0.0, 0.3, phase));
    if (vis >= 0.05) {
      vec2 f0 = fc + vec2(cos(rot), sin(rot)) * size;
      vec2 f1 = fc + vec2(cos(rot + 2.094), sin(rot + 2.094)) * size;
      vec2 f2 = fc + vec2(cos(rot + 4.188), sin(rot + 4.188)) * size;
      float sd = min(min(segDist(p, f0, f1), segDist(p, f1, f2)), segDist(p, f2, f0));
      float shard = 1.0 - smoothstep(0.0, 0.004, sd);
      float g3 = exp(-pow(length(mu - fc) / 0.28, 2.0));
      col += line * shard * vis * (0.18 + 0.12 * prox + 0.22 * g3);
      col += cyan * shard * vis * g3 * 0.14;
      float conn = 1.0 - smoothstep(0.0, 0.006, segDist(p, vec2(0.0), fc));
      col += line * conn * vis * 0.05 * (0.4 + 0.4 * prox);
    }
  }

  }

  /* baseline — quiet ground line */
  float by = -R0 * 1.15;
  float bl = 1.0 - smoothstep(0.0, 0.008, abs(p.y - by));
  col += blueGray * bl * (1.0 - smoothstep(R0 * 0.5, R0 * 0.9, abs(p.x))) * 0.10;

  /* coordinate triad — small technical marker */
  vec2 ab = vec2(R0 * 1.06, R0 * 0.9);
  float axX = segDist(p, ab, ab + vec2(0.13, 0.0));
  float axY = segDist(p, ab, ab + vec2(0.0, -0.13));
  float axZ = segDist(p, ab, ab + vec2(-0.10, -0.10));
  float axline = 1.0 - smoothstep(0.0, 0.007, min(min(axX, axY), axZ));
  col += line * axline * 0.16 * (0.5 + 0.3 * prox);
  col += cyan * (1.0 - smoothstep(0.0, 0.007, axZ)) * 0.10;
  float ao = length(p - ab);
  col += ice * (1.0 - smoothstep(0.0, 0.02, ao)) * 0.30;

  /* sparse background render-points — quiet */
  float leftQuiet = smoothstep(-0.45, 0.02, uv.x);
  vec2 bc = floor(uv * 55.0);
  vec2 bcf = fract(uv * 55.0) - 0.5;
  float bh = hash21(bc);
  if (bh > 0.992) {
    float sz = 0.005;
    float twb = 0.5 + 0.5 * sin(t * 0.25 + bh * 40.0);
    col += blueGray * (1.0 - smoothstep(0.0, sz, length(bcf))) * leftQuiet * (0.10 + 0.04 * twb);
  }

  col = pow(max(col, 0.0), vec3(0.95)) * scrollFade * (1.0 - 0.25 * uMobile);

  /* alpha — translucent presence + luminous detail */
  float a = 0.0;
  a = max(a, (1.0 - smoothstep(R0 * 0.97, R0 * 1.05, b)) * 0.62);
  a = max(a, (1.0 - smoothstep(0.0, 0.008, abs(b - R0 * 0.994))) * 0.7);
  a = max(a, clamp(dot(col, vec3(0.3, 0.4, 0.3)) * 1.5, 0.0, 1.0));
  a = clamp(a, 0.0, 1.0) * scrollFade * (1.0 - 0.25 * uMobile);

  gl_FragColor = vec4(col, a);
}
`

/* ------------------------------------------------------------------ */
/* Static CSS fallback (no WebGL available)                            */
/* ------------------------------------------------------------------ */
function StaticFallback() {
  return (
    <div className="hg-fallback pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="hg-fb-form" />
      <div className="hg-fb-dots" />
      <div className="hg-fb-path" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* WebGL renderer                                                      */
/* ------------------------------------------------------------------ */
function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(info || 'shader compile failed')
  }
  return sh
}

export default function HeroGeometry() {
  const { reducedMotion, isTouch, gpuMode } = useSystem()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedRef = useRef(reducedMotion)
  const touchRef = useRef(isTouch)

  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    touchRef.current = isTouch
  }, [isTouch])

  useEffect(() => {
    if (gpuMode !== 'ONLINE') return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const wrapEl = wrap
    const canvasEl = canvas
    const opts: WebGLContextAttributes = {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    }
    const gl = (canvas.getContext('webgl2', opts) ||
      canvas.getContext('webgl', opts)) as WebGLRenderingContext | null
    if (!gl) return
    const glc = gl

    glc.disable(glc.DEPTH_TEST)
    glc.enable(glc.BLEND)
    glc.blendFunc(glc.SRC_ALPHA, glc.ONE_MINUS_SRC_ALPHA)
    glc.clearColor(0, 0, 0, 0)
    glc.clear(glc.COLOR_BUFFER_BIT)

    let program: WebGLProgram
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT)
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
      program = gl.createProgram()!
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'link failed')
      }
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    } catch {
      return
    }

    /* fullscreen triangle strip quad */
    const verts = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      1, -1, 1, 1, -1, 1,
    ])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.useProgram(program)
    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uReduced = gl.getUniformLocation(program, 'uReduced')
    const uMobile = gl.getUniformLocation(program, 'uMobile')
    const uScroll = gl.getUniformLocation(program, 'uScroll')

    let raf = 0
    let running = false
    const start = performance.now()
    let last = start
    let elapsed = 0

    function resize() {
      const w = wrapEl.clientWidth
      const h = wrapEl.clientHeight
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, touchRef.current ? 1 : 1.6)
      const scale = touchRef.current ? 0.7 : 1
      canvasEl.width = Math.max(2, Math.round(w * dpr * scale))
      canvasEl.height = Math.max(2, Math.round(h * dpr * scale))
      glc.viewport(0, 0, canvasEl.width, canvasEl.height)
      glc.uniform2f(uRes, canvasEl.width, canvasEl.height)
      glc.uniform1f(uMobile, touchRef.current ? 1 : 0)
    }

    function draw(now: number) {
      if (running) raf = requestAnimationFrame(draw)
      if (!running) return
      const dt = Math.min(64, now - last) / 1000
      last = now
      if (!reducedRef.current) elapsed += dt

      const p = getPassive()
      const act = reducedRef.current ? 0 : p.cursorActive
      glc.uniform1f(uTime, elapsed)
      glc.uniform2f(
        uMouse,
        reducedRef.current ? 0 : p.cursorX * act,
        reducedRef.current ? 0 : p.cursorY * act
      )
      glc.uniform1f(uReduced, reducedRef.current ? 1 : 0)
      const span = Math.max(1, (document.documentElement.scrollHeight || 1) - window.innerHeight)
      const scroll = span > 0 ? Math.min(1, p.scrollY / span) : 0
      glc.uniform1f(uScroll, scroll)
      if (scroll < 0.5) glc.drawArrays(glc.TRIANGLES, 0, 6)
    }

    /* pause off-screen */
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          const vis = entries.some((e) => e.isIntersecting)
          running = vis
          if (vis) {
            last = performance.now()
            raf = requestAnimationFrame(draw)
          } else {
            cancelAnimationFrame(raf)
          }
        },
        { threshold: 0 }
      )
      io.observe(wrapEl)
    } else {
      running = true
      raf = requestAnimationFrame(draw)
    }

    resize()
    wrapEl.classList.add('hg-live')
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', resize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
      wrapEl.classList.remove('hg-live')
      try {
        const ext = gl.getExtension('WEBGL_lose_context')
        ext?.loseContext()
      } catch {
        /* noop */
      }
    }
  }, [gpuMode])

  return (
    <div
      ref={wrapRef}
      className="hg-root pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hg-canvas" />
      <StaticFallback />
    </div>
  )
}
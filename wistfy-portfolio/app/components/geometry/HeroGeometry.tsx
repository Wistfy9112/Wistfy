'use client'

import { useEffect, useRef } from 'react'
import { useSystem } from '@/app/system/SystemProvider'
import { getPassive } from '@/app/system/passive'

/* ================================================================== */
/* GRAPHICS LAB — a single abstract computational-geometry form        */
/* (WebGL2/GLSL ES1, single pass, transparent canvas over the grid)    */
/*                                                                     */
/* One dominant form on the right. A single deformed parametric mesh   */
/* that transitions SOLID -> WIREFRAME -> POINTS from its core out:    */
/*                                                                     */
/*   LAYER 01  near-black translucent surface, seen through a slow     */
/*             traveling directional light (diffuse + specular + rim)  */
/*   LAYER 02  sparse thin wireframe edges, only ~40% of the surface   */
/*   LAYER 03  bright vertex dots + a field of drifting vertex points  */
/*                                                                     */
/* Graphics-signature cues (not HUD): faint coordinate axes, baseline  */
/* with projection lines from the form, and a thin cyan "render path"  */
/* that travels along the surface and an entry flow from offscreen.    */
/*                                                                     */
/* Motion is extremely slow and deliberate; the cursor only adds a     */
/* tiny local gravity + brightness (3-7%). Reduced motion freezes.     */
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

/* surface normal via finite differences of the displacement */
vec3 surfN(vec3 v, float tt) {
  float e = 0.05;
  vec3 n = vec3(
    de(v + vec3(e, 0.0, 0.0), tt) - de(v - vec3(e, 0.0, 0.0), tt),
    de(v + vec3(0.0, e, 0.0), tt) - de(v - vec3(0.0, e, 0.0), tt),
    de(v + vec3(0.0, 0.0, e), tt) - de(v - vec3(0.0, 0.0, e), tt)
  );
  return normalize(n);
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

  /* dominant form — right side, firmly on the right */
  float cx = mix(0.85, 0.85, uMobile);
  vec2 center = vec2((cx * 2.0 - 1.0) * aspect, 0.0);
  vec2 p = uv - center;
  float b = length(p);

  vec2 mu = m * vec2(aspect, 1.0);
  float prox = 1.0 - smoothstep(0.15, 0.65, distance(mu, center));

  float tA = t * 0.12;                       /* extremely slow */
  float R0 = mix(0.50, 0.42, uMobile);       /* form radius */
  float simp = 1.0 - uScroll * 0.5;          /* scroll -> geometry simplifies */

  /* palette — 90% dark, 7% blue-gray, 3% cyan */
  vec3 nearBlack = vec3(0.020, 0.030, 0.045);
  vec3 blueGray  = vec3(0.26, 0.36, 0.46);
  vec3 line      = vec3(0.42, 0.64, 0.78);
  vec3 cyan      = vec3(0.24, 0.90, 1.00);
  vec3 ice       = vec3(0.66, 0.86, 0.98);
  vec3 white     = vec3(0.85, 0.96, 1.00);

  /* cursor gravity — local, a few px, exponential falloff */
  float g = exp(-pow(length(mu - p) / 0.38, 2.0));

  vec3 col = vec3(0.0);

  vec2 q = p / R0;
  float q2 = dot(q, q);

  if (q2 < 1.0) {
    float z = sqrt(max(0.0, 1.0 - q2));
    vec3 v0 = vec3(q.x, q.y, z);

    /* slow object-frame rotation (no full spin) */
    float cy = cos(tA * 0.20), sy = sin(tA * 0.20);
    vec3 vf = vec3(v0.x * cy + v0.z * sy, v0.y, -v0.x * sy + v0.z * cy);
    float tilt = 0.34 + 0.05 * sin(t * 0.13);
    float ct = cos(tilt), st = sin(tilt);
    vf = vec3(vf.x, vf.y * ct - vf.z * st, vf.y * st + vf.z * ct);

    float lon = atan(vf.y, vf.x);
    float lat = acos(clamp(vf.z, -1.0, 1.0));

    /* rare glitch — one subtle tear every ~21s, tiny region only */
    float cycle = fract(t / 21.0);
    float gt = smoothstep(0.955, 0.985, cycle) * (1.0 - smoothstep(0.985, 1.0, cycle));
    float yg = (fract(t * 0.31) - 0.5) * 1.2;
    float strip = 1.0 - smoothstep(0.0, 0.03, abs(p.y - yg));
    float lonSh = gt * strip * 0.12 * (hash21(vec2(floor(t * 24.0), 7.0)) - 0.5);

    /* displacement + normal */
    float disp = de(vf, t) * 0.16 * simp;
    vec3 n = surfN(vf, t);

    /* traveling directional light */
    float la = t * 0.05;
    vec3 L = normalize(vec3(cos(la), sin(la * 0.7), 0.75));
    vec3 viewDir = normalize(vec3(p.x, p.y, 1.0));
    float diff = max(dot(n, L), 0.0);
    vec3 H = normalize(L + viewDir);
    float spec = pow(max(dot(n, H), 0.0), 26.0);
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    /* LAYER 01 — solid: near-black translucent, seen via light */
    col += nearBlack * 0.9
         + blueGray * diff * 0.55 * (0.5 + 0.5 * prox)
         + white * spec * 0.60 * (0.5 + 0.5 * prox)
         + ice * rim * 0.50 * (0.6 + 0.4 * prox)
         + cyan * g * 0.20;
    col += blueGray * (1.0 - q2) * 0.10 * (0.5 + 0.5 * prox);   /* soft volume fill */

    /* silhouette edge — thin bright boundary so the form reads */
    float silEdge = 1.0 - smoothstep(0.0, 0.006, abs(b - R0 * 0.992));
    col += ice * silEdge * (0.45 + 0.25 * prox) * (0.6 + 0.4 * sin(t * 0.2));

    /* LAYER 02 — wireframe: thin, sparse, selected edges only */
    float uu = lon + lonSh + disp * 0.9;
    float dU = min(fract(uu / 0.35), 1.0 - fract(uu / 0.35));
    float dV = min(fract(lat / 0.35), 1.0 - fract(lat / 0.35));
    float edge = max(1.0 - smoothstep(0.0, 0.022, dU), 1.0 - smoothstep(0.0, 0.022, dV));
    float sel = 0.5 + 0.5 * sin(uu * 3.0 + lat * 2.0 + tA * 0.5);
    float selM = smoothstep(0.08, 0.55, sel);        /* ~40% coverage */
    float frontFade = 1.0 - smoothstep(0.55, 0.9, q2);
    col += line * edge * selM * frontFade * (0.30 + 0.12 * prox + 0.18 * g) * simp;

    /* LAYER 03 — vertices: bright dots at grid crossings */
    float onU = 1.0 - smoothstep(0.0, 0.03, dU);
    float onV = 1.0 - smoothstep(0.0, 0.03, dV);
    float vtx = onU * onV;
    float tw = 0.5 + 0.5 * sin(t * 1.4 + lon * 7.0 + lat * 5.0);
    col += cyan * vtx * (0.50 + 0.60 * g) * (0.5 + 0.5 * tw) * 0.95 * frontFade;

    /* render path — thin cyan flow traveling along the surface */
    float sLon = tA * 0.9;
    float dd = mod(lon - sLon, 6.2831853);
    float latc = 1.5708 + 0.30 * sin(lon * 2.0 + t * 0.10);
    float onPath = 1.0 - smoothstep(0.0, 0.05, abs(lat - latc));
    float trail = 1.0 - smoothstep(0.6, 0.75, dd);
    float head = exp(-pow(dd / 0.05, 2.0));
    col += cyan * onPath * trail * 0.75 * (0.7 + 0.3 * prox);
    col += white * onPath * head * (1.2 + 0.5 * g) * 1.0;
  }

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
    col += blueGray * pt * vis * (0.30 + 0.20 * g2) * (0.6 + 0.4 * prox);
    col += cyan * pt * vis * g2 * 0.35;          /* active vertex response */
  }

  /* projection lines from the form down to a baseline */
  float by = -R0 * 1.08;
  float bl = 1.0 - smoothstep(0.0, 0.008, abs(p.y - by));
  col += blueGray * bl * (1.0 - smoothstep(R0 * 0.6, R0 * 0.95, abs(p.x))) * 0.14;
  float ysurf = -sqrt(max(0.0, R0 * R0 - p.x * p.x));
  for (int k = 0; k < 5; k++) {
    if (uMobile > 0.5 && k >= 3) break;
    float xk = (float(k) - 2.0) / 2.0 * R0 * 0.7;
    float vl = 1.0 - smoothstep(0.0, 0.006, abs(p.x - xk));
    float seg = (1.0 - smoothstep(0.0, 0.02, p.y - by)) * (1.0 - smoothstep(0.0, 0.02, ysurf - p.y));
    col += line * vl * seg * 0.12 * (0.4 + 0.6 * prox);
  }
  float dtx = min(fract(p.x / 0.18), 1.0 - fract(p.x / 0.18));
  float tk = 1.0 - smoothstep(0.0, 0.012, dtx);
  col += blueGray * tk * bl * (0.5 + 0.5 * sin(p.x * 2.0)) * 0.09;

  /* coordinate axes — small triad near the form's top-right */
  vec2 ab = vec2(R0 * 1.02, R0 * 0.92);
  float axX = segDist(p, ab, ab + vec2(0.16, 0.0));
  float axY = segDist(p, ab, ab + vec2(0.0, -0.16));
  float axZ = segDist(p, ab, ab + vec2(-0.12, -0.12));
  float axline = 1.0 - smoothstep(0.0, 0.007, min(min(axX, axY), axZ));
  col += line * axline * 0.20 * (0.5 + 0.5 * prox);
  col += cyan * (1.0 - smoothstep(0.0, 0.007, axZ)) * 0.16;
  float ao = length(p - ab);
  col += ice * (1.0 - smoothstep(0.0, 0.02, ao)) * 0.45;

  /* render flow entering from offscreen */
  vec2 es = center + vec2(R0 * 1.65, R0 * 0.85);
  vec2 ee = center + vec2(R0 * 1.08, R0 * 0.55);
  float en = 1.0 - smoothstep(0.0, 0.006, segDist(p, es, ee));
  col += cyan * en * 0.14;
  float ey = 0.5 + 0.5 * sin(t * 0.35);
  vec2 node = mix(ee, es, ey);
  col += ice * (1.0 - smoothstep(0.0, 0.02, length(p - node))) * 0.7 * (0.4 + 0.6 * prox);

  /* sparse background render-points (spatial data) — quiet on the left */
  float leftQuiet = smoothstep(-0.45, 0.02, uv.x);
  vec2 bc = floor(uv * 55.0);
  vec2 bcf = fract(uv * 55.0) - 0.5;
  float bh = hash21(bc);
  if (bh > 0.992) {
    float sz = 0.005;
    float twb = 0.5 + 0.5 * sin(t * 0.25 + bh * 40.0);
    col += blueGray * (1.0 - smoothstep(0.0, sz, length(bcf))) * leftQuiet * (0.14 + 0.06 * twb);
  }

  col = pow(max(col, 0.0), vec3(0.92));

  /* alpha = translucent form presence + luminous detail */
  float a = 0.0;
  a = max(a, (1.0 - smoothstep(R0 * 0.97, R0 * 1.04, b)) * 0.62);
  a = max(a, (1.0 - smoothstep(0.0, 0.008, abs(b - R0 * 0.992))) * 0.9);
  a = max(a, clamp(dot(col, vec3(0.3, 0.4, 0.3)) * 1.2, 0.0, 1.0));
  a = clamp(a, 0.0, 1.0);

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
      glc.uniform1f(uScroll, span > 0 ? Math.min(1, p.scrollY / span) : 0)
      glc.drawArrays(glc.TRIANGLES, 0, 6)
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
      className="hg-root pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hg-canvas" />
      <StaticFallback />
    </div>
  )
}
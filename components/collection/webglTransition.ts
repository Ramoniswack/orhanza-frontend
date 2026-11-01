import { Renderer, Program, Mesh, Triangle, Texture, type OGLRenderingContext } from "ogl";

/**
 * Ink-blot model transition.
 *
 * Two transparent PNG cutouts are drawn as textures inside one full-stage
 * canvas (each in its own rect, so the model can swap sides while it morphs).
 *
 *   t = 0 .. 1 (the caller eases it, power3.inOut over ~1.1s)
 *
 *   outgoing:  colour -> flat light-grey silhouette  -> gone
 *   incoming:  nothing -> flat light-grey silhouette -> full colour
 *
 * Every phase is a threshold on the same fbm/simplex field, so the change
 * sweeps through the model as an irregular liquid blob. At the peak (sin(pi t))
 * the RGB channels split along the noise gradient (up to 12 css px) and the
 * sampling UVs are pushed by the gradient for a slight liquid warp.
 */

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform sampler2D tA;
uniform sampler2D tB;
uniform vec2  uRes;    // canvas size, device px
uniform vec4  uRectA;  // outgoing model rect: x, y, w, h (device px, y from top)
uniform vec4  uRectB;  // incoming model rect
uniform float uT;      // 0..1
uniform float uPx;     // device pixel ratio
uniform vec2  uSeed;
varying vec2 vUv;

// --- simplex noise 2D (Ashima Arts / Ian McEwan, MIT) -------------------
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * snoise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return s;
}

// fbm is roughly -0.9..0.9; remap to a well-spread 0..1 field
float field(vec2 p) {
  return clamp(fbm(p) * 0.62 + 0.5, 0.0, 1.0);
}

// premultiplied sample of a model texture placed in rect r
vec4 sampleRect(sampler2D t, vec4 r, vec2 p) {
  vec2 uv = (p - r.xy) / r.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture2D(t, vec2(uv.x, 1.0 - uv.y));
}

// RGB split: R and B are sampled at +o / -o, G stays put
vec4 chroma(sampler2D t, vec4 r, vec2 p, vec2 o) {
  vec4 cr = sampleRect(t, r, p + o);
  vec4 cg = sampleRect(t, r, p);
  vec4 cb = sampleRect(t, r, p - o);
  return vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a) / 3.0);
}

// soft radial falloff around a rect, used for the faint ink wash
float radial(vec4 r, vec2 p) {
  vec2 c = r.xy + r.zw * 0.5;
  float d = length((p - c) / (r.zw * vec2(0.34, 0.5)));
  return 1.0 - smoothstep(0.55, 1.0, d);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float t = uT;
  float bell = sin(3.14159265 * t);                 // 0 -> 1 -> 0

  // noise + its gradient (finite differences)
  vec2 q = p / uRes.y * 2.6 + uSeed;
  float e = 0.03;
  float n  = field(q);
  float nx = field(q + vec2(e, 0.0));
  float ny = field(q + vec2(0.0, e));
  vec2 g = vec2(nx - n, ny - n) / e;
  vec2 gdir = g / (length(g) + 0.35);               // smooth, bounded direction

  // liquid UV displacement + chromatic aberration (css px * dpr)
  vec2 pd = p + gdir * bell * 16.0 * uPx;
  vec2 co = gdir * bell * 12.0 * uPx;

  // threshold sweep
  float off = 0.28;
  float edge = 0.14;
  float x = t * (1.0 + 2.0 * off + edge);
  float nb = 1.0 - n;

  float aGrey = smoothstep(0.0, edge, x - n);
  float aGone = smoothstep(0.0, edge, x - off - n);
  float bGrey = smoothstep(0.0, edge, x - off * 0.8 - nb);
  float bCol  = smoothstep(0.0, edge, x - 2.0 * off - nb);

  vec4 A = chroma(tA, uRectA, pd, co);
  vec4 B = chroma(tB, uRectB, pd, co);

  vec3 grey = vec3(0.90);
  vec4 Ag = vec4(grey * A.a, A.a);
  vec4 Bg = vec4(grey * B.a, B.a);

  vec4 outA = mix(A, Ag, aGrey) * (1.0 - aGone);
  vec4 outB = mix(Bg, B, bCol) * bGrey;

  // faint blob of ink around each model while it is mid-change
  float washA = aGrey * (1.0 - aGone) * radial(uRectA, pd) * 0.5;
  float washB = bGrey * (1.0 - bCol)  * radial(uRectB, pd) * 0.5;
  float w = clamp(washA + washB, 0.0, 0.55);
  vec4 wash = vec4(grey * w, w);

  vec4 col = outB + outA * (1.0 - outB.a);
  col = col + wash * (1.0 - col.a);
  gl_FragColor = col;
}
`;

export type Rect = { x: number; y: number; w: number; h: number };

export class ModelTransition {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private program: Program;
  private mesh: Mesh;
  private textures: Texture[] = [];
  private destroyed = false;
  private onLost?: () => void;
  private lostHandler = (e: Event) => {
    e.preventDefault();
    this.onLost?.();
  };

  private constructor(private canvas: HTMLCanvasElement, onLost?: () => void) {
    this.onLost = onLost;
    this.renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    canvas.addEventListener("webglcontextlost", this.lostHandler as EventListener);

    const geometry = new Triangle(this.gl);
    this.program = new Program(this.gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tA: { value: null },
        tB: { value: null },
        uRes: { value: [1, 1] },
        uRectA: { value: [0, 0, 1, 1] },
        uRectB: { value: [0, 0, 1, 1] },
        uT: { value: 0 },
        uPx: { value: this.renderer.dpr },
        uSeed: { value: [0, 0] },
      },
    });
    // we output premultiplied colour ourselves
    this.program.blendFunc = { src: this.gl.ONE, dst: this.gl.ONE_MINUS_SRC_ALPHA };
    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
  }

  /** Lazy init: creates the context and uploads every texture once. */
  static async create(
    canvas: HTMLCanvasElement,
    images: HTMLImageElement[],
    onLost?: () => void
  ): Promise<ModelTransition> {
    const inst = new ModelTransition(canvas, onLost);
    const gl = inst.gl;
    inst.textures = images.map(
      (image) =>
        new Texture(gl, {
          image,
          generateMipmaps: false,
          minFilter: gl.LINEAR,
          magFilter: gl.LINEAR,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
          premultiplyAlpha: true,
          flipY: true,
        })
    );
    return inst;
  }

  /** css-pixel size of the canvas */
  resize(width: number, height: number) {
    if (this.destroyed) return;
    this.renderer.setSize(width, height);
    const d = this.renderer.dpr;
    this.program.uniforms.uRes.value = [width * d, height * d];
    this.program.uniforms.uPx.value = d;
  }

  /**
   * Draw one frame.
   *  from / to: texture indexes, fromRect / toRect: css px inside the canvas.
   */
  draw(from: number, to: number, fromRect: Rect, toRect: Rect, t: number, seed?: [number, number]) {
    if (this.destroyed) return;
    const d = this.renderer.dpr;
    const u = this.program.uniforms;
    u.tA.value = this.textures[from];
    u.tB.value = this.textures[to];
    u.uRectA.value = [fromRect.x * d, fromRect.y * d, fromRect.w * d, fromRect.h * d];
    u.uRectB.value = [toRect.x * d, toRect.y * d, toRect.w * d, toRect.h * d];
    u.uT.value = t;
    if (seed) u.uSeed.value = seed;
    this.renderer.render({ scene: this.mesh });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.canvas.removeEventListener("webglcontextlost", this.lostHandler as EventListener);
    const gl = this.gl;
    this.textures.forEach((t) => gl.deleteTexture(t.texture));
    this.textures = [];
    gl.deleteProgram(this.program.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

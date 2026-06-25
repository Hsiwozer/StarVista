import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { BlackHoleTelemetry } from "./BlackHolePage";

interface BlackHoleSceneProps {
  onTelemetry?: (telemetry: BlackHoleTelemetry) => void;
}

const blackHoleVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const blackHoleFragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uIntensity;
uniform float uZoom;
uniform float uPixelRatio;
uniform float uIntro;

varying vec2 vUv;

const float PI = 3.141592653589793;

mat2 rotate2d(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 4; i++) {
    value += noise(p) * amp;
    p *= 2.04;
    amp *= 0.52;
  }

  return value;
}

float band(float value, float inner, float outer, float softness) {
  return smoothstep(inner, inner + softness, value) *
    (1.0 - smoothstep(outer - softness, outer, value));
}

float gaussian(float value, float center, float width) {
  float x = (value - center) / max(width, 0.0001);
  return exp(-x * x);
}

float starLayer(vec2 coord, float scale, float threshold, float lens, float time) {
  vec2 cellCoord = coord * scale;
  vec2 cell = floor(cellCoord);
  float seed = hash12(cell);
  vec2 offset = vec2(
    hash12(cell + vec2(17.2, 4.7)),
    hash12(cell + vec2(8.1, 29.4))
  ) - 0.5;
  vec2 local = fract(cellCoord) - 0.5 - offset * 0.48;
  float gate = smoothstep(threshold, 1.0, seed);
  float twinkle = 0.82 + 0.18 * sin(time * (0.06 + seed * 0.08) + seed * 38.0);
  float cellAngle = atan(coord.y, coord.x);
  vec2 q = rotate2d(-cellAngle) * local;
  float tangentialStretch = 1.0 + lens * (0.9 + seed * 1.15);
  vec2 shape = vec2(q.x * (1.0 + lens * 0.45), q.y / tangentialStretch);
  float core = exp(-dot(shape, shape) * mix(132.0, 82.0, clamp(lens, 0.0, 1.0)));
  float spark = smoothstep(0.08, 0.84, core) * gate * twinkle;

  return spark * (0.34 + seed * 0.76);
}

float filamentNoise(vec2 q, float time) {
  float broad = fbm(vec2(q.x * 4.2 - time * 0.045, q.y * 35.0));
  float fine = fbm(vec2(q.x * 15.0 + time * 0.08, q.y * 118.0 - time * 0.025));
  float hair = smoothstep(0.54, 0.98, fbm(vec2(q.x * 34.0 - time * 0.12, q.y * 230.0)));
  return 0.42 + broad * 0.38 + fine * 0.24 + hair * 0.22;
}

vec3 heatRamp(float heat) {
  vec3 ember = vec3(0.20, 0.065, 0.028);
  vec3 copper = vec3(0.74, 0.31, 0.12);
  vec3 amber = vec3(1.0, 0.63, 0.30);
  vec3 cream = vec3(1.0, 0.88, 0.66);
  vec3 whiteHot = vec3(1.0, 0.965, 0.86);
  vec3 color = mix(ember, copper, smoothstep(0.05, 0.38, heat));
  color = mix(color, amber, smoothstep(0.26, 0.68, heat));
  color = mix(color, cream, smoothstep(0.52, 0.86, heat));
  color = mix(color, whiteHot, smoothstep(0.78, 1.0, heat));
  return color;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float pixel = 1.0 / max(uResolution.y * uPixelRatio, 1.0);
  float intro = smoothstep(0.0, 1.0, uIntro);
  float zoom = clamp(uZoom, 0.0, 1.0);
  float hover = clamp(uIntensity, 0.0, 1.0);

  vec2 screen = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 center = vec2(0.19 + uMouse.x * 0.008, -0.005 + uMouse.y * 0.006);
  vec2 p = (screen - center) / (1.0 + zoom * 0.105);
  float r = length(p);
  float angle = atan(p.y, p.x);
  float horizon = 0.247 + zoom * 0.015 + hover * 0.003;
  float tilt = -0.132 + uMouse.x * 0.010;
  vec2 q = rotate2d(-tilt) * p;

  float lensFalloff = 1.0 - smoothstep(horizon * 1.06, 0.82, r);
  float lensStrength = lensFalloff * (0.045 + zoom * 0.035) / (r + 0.12);
  vec2 starCoord = screen - normalize(p + vec2(0.001)) * lensStrength;
  starCoord += vec2(-uMouse.x * 0.025, -uMouse.y * 0.017);
  float stars =
    starLayer(starCoord + 8.7, 26.0, 0.965, lensFalloff * 0.35, uTime) * 0.42 +
    starLayer(starCoord * 1.48 - 3.6, 58.0, 0.986, lensFalloff * 0.55, uTime) * 0.28 +
    starLayer(starCoord * 2.1 + 19.0, 116.0, 0.994, lensFalloff * 0.7, uTime) * 0.12;

  vec3 color = vec3(0.0014, 0.0016, 0.0025);
  float backgroundDust = fbm(screen * 1.25 + vec2(-0.02 * uTime, 0.0));
  float faintMilkyWay = gaussian(screen.y + 0.04 - screen.x * 0.06, 0.0, 0.22) *
    smoothstep(0.45, 0.92, fbm(screen * 3.2 + vec2(10.0, 2.0)));
  color += vec3(0.030, 0.027, 0.030) * smoothstep(0.54, 1.0, backgroundDust) * 0.22;
  color += vec3(0.10, 0.075, 0.058) * faintMilkyWay * 0.18;
  color += vec3(0.86, 0.82, 0.76) * stars * smoothstep(horizon * 1.05, horizon * 1.65, r) * 0.68;

  float diskStart = smoothstep(-1.36, -1.0, q.x);
  float diskEnd = 1.0 - smoothstep(1.0, 1.43, q.x);
  float diskLength = diskStart * diskEnd;
  float coreBulge = exp(-pow(q.x / 0.48, 2.0));
  float rightJet = smoothstep(0.08, 0.74, q.x);
  float diskWidth = 0.028 + 0.072 * coreBulge + 0.014 * rightJet;
  float broadWidth = 0.105 + 0.100 * smoothstep(-0.95, -0.18, -q.x) + 0.040 * coreBulge;
  float diskTexture = filamentNoise(q, uTime);
  float doppler = mix(0.58, 1.95, smoothstep(-0.42, 0.72, q.x));
  float midDisk = gaussian(q.y, 0.0, diskWidth) * diskLength;
  float brightRazor = gaussian(q.y, 0.006, 0.008 + 0.009 * coreBulge) * diskLength;
  float broadSheet = gaussian(q.y + 0.060, 0.0, broadWidth) * diskLength;
  float hotKnot = gaussian(q.x, horizon * 1.2, 0.30) * gaussian(q.y, 0.0, 0.044);
  float leftFlares = smoothstep(0.72, 0.98, fbm(vec2(q.x * 12.0 + 2.0, q.y * 70.0 - uTime * 0.03))) *
    gaussian(q.y + 0.018, 0.0, 0.035) * diskLength;
  float diskHeat = clamp(midDisk * 0.56 + brightRazor * 1.22 + hotKnot * 0.62 + leftFlares * 0.48, 0.0, 1.0);
  vec3 diskColor = heatRamp(diskHeat * (0.86 + doppler * 0.18));
  vec3 copperColor = mix(vec3(0.16, 0.055, 0.027), vec3(0.74, 0.31, 0.12), diskTexture);

  float upperGate = smoothstep(0.012, 0.12, p.y) * (1.0 - smoothstep(0.76, 1.04, abs(p.x)));
  float lowerGate = smoothstep(-0.018, -0.16, p.y) * (1.0 - smoothstep(0.63, 0.90, abs(p.x)));
  float upperRingRadius = horizon * 1.55 + 0.015 * sin(angle * 2.0);
  float lowerRingRadius = horizon * 1.47;
  float upperArc = band(r, upperRingRadius - 0.075, upperRingRadius + 0.080, 0.048) * upperGate;
  float upperFilaments = filamentNoise(vec2(angle * 0.38, r * 1.85), uTime * 0.7);
  upperArc *= (0.40 + upperFilaments * 0.58) * mix(0.78, 1.44, smoothstep(-0.25, 0.66, p.x));
  float upperCrown = gaussian(r, upperRingRadius, 0.030 + pixel * 5.0) *
    smoothstep(0.0, 0.1, p.y) * (1.0 - smoothstep(0.78, 1.02, abs(p.x)));
  upperCrown *= 0.82 + 0.4 * fbm(vec2(angle * 7.0 - uTime * 0.04, r * 27.0));

  float lowerArc = gaussian(r, lowerRingRadius, 0.038 + pixel * 4.0) * lowerGate;
  lowerArc *= (0.46 + 0.34 * fbm(vec2(angle * 5.6 + uTime * 0.025, r * 18.0)));
  lowerArc *= 1.0 - smoothstep(-0.025, 0.050, q.y);
  lowerArc *= mix(0.58, 1.24, smoothstep(-0.40, 0.62, p.x));

  float backDisk = (midDisk * 0.58 + broadSheet * 0.34 + brightRazor * 0.68) * diskTexture * doppler;
  color += copperColor * broadSheet * diskTexture * mix(0.30, 0.72, doppler);
  color += diskColor * backDisk * (0.88 + hover * 0.05);
  color += vec3(1.0, 0.80, 0.55) * upperArc * (0.66 + zoom * 0.05);
  color += vec3(1.0, 0.88, 0.70) * upperCrown * 0.94;
  color += vec3(0.92, 0.45, 0.20) * lowerArc * 0.92;

  float nearHalo = gaussian(r, horizon * 1.34, 0.10) * (1.0 - smoothstep(-0.04, 0.18, q.y));
  color += vec3(0.55, 0.26, 0.13) * nearHalo * 0.32;

  float shadow = 1.0 - smoothstep(horizon * 0.992, horizon * 1.025, r);
  float penumbra = 1.0 - smoothstep(horizon * 1.02, horizon * 1.42, r);
  color *= 1.0 - penumbra * 0.40;
  color = mix(color, vec3(0.0012, 0.0010, 0.0009), shadow);

  float frontMask = smoothstep(-0.080, 0.016, -q.y + 0.025);
  float frontDisk = (brightRazor * 1.56 + midDisk * 0.58 + leftFlares * 0.7) *
    diskTexture * doppler * frontMask;
  color += diskColor * frontDisk * 0.82;
  color += vec3(1.0, 0.86, 0.64) * brightRazor * diskTexture * doppler * frontMask * 0.30;

  float photonRing = gaussian(r, horizon * 1.018, 0.0046 + pixel * 3.0);
  photonRing *= 0.86 + 0.22 * fbm(vec2(angle * 9.0 - uTime * 0.02, r * 34.0));
  photonRing *= 1.0 - smoothstep(0.28, 0.92, frontDisk);
  color += vec3(1.0, 0.78, 0.48) * photonRing * 0.74;

  float crescentGlow = gaussian(r, horizon * 1.08, 0.028) * smoothstep(-0.10, 0.24, p.y);
  color += vec3(1.0, 0.87, 0.66) * crescentGlow * 0.20;

  vec2 moonP = screen - vec2(-0.455, -0.048);
  float moonR = length(moonP);
  float moonMask = 1.0 - smoothstep(0.018, 0.0205, moonR);
  float moonRim = gaussian(moonR, 0.020, 0.0015);
  color = mix(color, vec3(0.0011, 0.0009, 0.0008), moonMask);
  color += vec3(0.60, 0.42, 0.28) * moonRim * 0.13;

  float leftDustTrail = gaussian(q.y + 0.078, 0.0, 0.15) *
    smoothstep(-1.34, -0.94, q.x) * (1.0 - smoothstep(-0.30, 0.12, q.x));
  color += vec3(0.33, 0.13, 0.055) * leftDustTrail * diskTexture * 0.42;

  float vignette = smoothstep(1.22, 0.14, length((uv - 0.5) * vec2(1.08, 1.0)));
  color *= mix(0.38 - zoom * 0.05, 1.04, vignette);
  color *= 0.96 + hover * 0.025;
  color = 1.0 - exp(-color * 1.12);
  color = pow(color, vec3(0.92));
  color *= intro;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function BlackHoleScene({ onTelemetry }: BlackHoleSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const isMobile =
      window.matchMedia("(max-width: 640px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x02030a, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uZoom: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uIntro: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: blackHoleVertexShader,
      fragmentShader: blackHoleFragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const mouseTarget = new THREE.Vector2(0, 0);
    const mouseCurrent = new THREE.Vector2(0, 0);
    const driftVector = new THREE.Vector2(0, 0);
    let hoverTarget = 0;
    let hoverCurrent = 0;
    let zoomTarget = 0;
    let zoomCurrent = 0;
    let rafId = 0;
    let lastTelemetryAt = 0;
    let pointerHeld = false;
    const startedAt = performance.now();

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
      uniforms.uPixelRatio.value = pixelRatio;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isMobile) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseTarget.set(
        THREE.MathUtils.clamp(x, -1, 1),
        THREE.MathUtils.clamp(-y, -1, 1),
      );

      hoverTarget = THREE.MathUtils.clamp(1 - Math.hypot(x, y) / 0.74, 0, 1);
    };

    const handlePointerLeave = () => {
      mouseTarget.set(0, 0);
      hoverTarget = 0;
      pointerHeld = false;
    };

    const handlePointerDown = () => {
      pointerHeld = true;
    };

    const handlePointerUp = () => {
      pointerHeld = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomTarget = THREE.MathUtils.clamp(zoomTarget - event.deltaY * 0.00125, 0, 1);
    };

    const render = (time: number) => {
      if (document.hidden) {
        rafId = 0;
        return;
      }

      const elapsed = (time - startedAt) / 1000;

      if (pointerHeld && !reducedMotion) {
        zoomTarget = THREE.MathUtils.clamp(zoomTarget + 0.0032, 0, 1);
      }

      const driftX = isMobile ? Math.sin(elapsed * 0.1) * 0.22 : mouseTarget.x;
      const driftY = isMobile ? Math.cos(elapsed * 0.085) * 0.14 : mouseTarget.y;
      driftVector.set(driftX, driftY);
      mouseCurrent.lerp(driftVector, 0.042);
      hoverCurrent = THREE.MathUtils.lerp(hoverCurrent, hoverTarget, 0.052);
      zoomCurrent = THREE.MathUtils.lerp(zoomCurrent, zoomTarget, 0.046);

      const intro = reducedMotion ? 1 : THREE.MathUtils.clamp(elapsed / 2.1, 0, 1);
      const timeScale = reducedMotion ? 0.2 : 1;
      uniforms.uTime.value = elapsed * timeScale;
      uniforms.uMouse.value.copy(mouseCurrent);
      uniforms.uIntensity.value = hoverCurrent;
      uniforms.uZoom.value = zoomCurrent;
      uniforms.uIntro.value = intro;

      renderer.render(scene, camera);

      if (time - lastTelemetryAt > 110) {
        lastTelemetryAt = time;
        onTelemetry?.({
          approach: zoomCurrent,
          timeDilation: 1 + Math.pow(zoomCurrent, 2.25) * 11.8 + hoverCurrent * 0.28,
        });
      }

      rafId = window.requestAnimationFrame(render);
    };

    const resumeRender = () => {
      if (!document.hidden && rafId === 0) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    resize();
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", resumeRender);
    rafId = window.requestAnimationFrame(render);

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", resumeRender);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onTelemetry]);

  return <div ref={containerRef} className="black-hole-scene" aria-hidden="true" />;
}

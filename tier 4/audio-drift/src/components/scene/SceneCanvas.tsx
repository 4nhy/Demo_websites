"use client";
/* eslint-disable react-hooks/immutability -- three.js objects (materials, scene, renderer) are mutated per frame in useFrame by design; this is the standard R3F pattern and never touches React state */

import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Headphone from "./Headphone";
import { DEFAULT_POSE, POSE_KEYS, samplePose, sceneState, type Pose } from "@/lib/scene-store";

const MODEL_H = 2.2;
const MODEL_W = 2.4;
const TAU = Math.PI * 2;

/** sampled once per animation frame by the driver, read by the rig */
const target: Pose = { ...DEFAULT_POSE };
let rigVisible = false;

function Driver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let id = 0;
    const loop = () => {
      samplePose(window.scrollY, target);
      if (sceneState.colorOverride !== null) target.color = sceneState.colorOverride;
      // on-demand rendering: zero GPU work while the model is hidden and settled
      if (target.vis > 0.001 || rigVisible) invalidate();
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [invalidate]);
  return null;
}

/** soft contact shadow as a gradient blob — no second render pass, unlike ContactShadows */
function BlobShadow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.45, "rgba(0,0,0,0.45)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.2, 1.6, 1]} renderOrder={-1}>
      <planeGeometry />
      <meshBasicMaterial color="#0e1b2e" alphaMap={tex} transparent opacity={0.32} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Rig({ studio }: { studio?: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const pose = useRef<Pose>({ ...DEFAULT_POSE });
  const first = useRef(true);
  const bg = useRef(new THREE.Color());
  const lastBg = useRef("");
  const focus = useRef(new THREE.Vector3());
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    if (!studio) scene.background = bg.current;
    return () => {
      scene.background = null;
      rigVisible = false;
    };
  }, [scene, studio]);

  useFrame((state, dt) => {
    if (studio) samplePose(0, target);
    const c = pose.current;
    // remove whole turns so page changes never spin the model several times
    c.ry += Math.round((target.ry - c.ry) / TAU) * TAU;
    if (first.current) {
      // snap the pose on the first frame, but always fade in rather than pop
      Object.assign(c, target);
      if (!studio) c.vis = 0;
      first.current = false;
    } else {
      const k = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
      for (const key of POSE_KEYS) c[key] += (target[key] - c[key]) * k;
    }

    const cam = camera as THREE.PerspectiveCamera;
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const vw = vh * cam.aspect;
    const unit = Math.min((vh * 0.6) / MODEL_H, (vw * 0.5) / MODEL_W);
    const t = state.clock.elapsedTime;

    if (outer.current && inner.current) {
      const bob = studio ? 0 : Math.sin(t * 0.7) * 0.025;
      outer.current.position.set((c.x * vw) / 2, (c.y * vh) / 2 + bob * c.s * unit, 0);
      outer.current.scale.setScalar(Math.max(0.0001, c.s * unit));
      inner.current.rotation.set(c.rx + sceneState.drag.y, c.ry + sceneState.drag.x, c.rz);
      // keep the focus point (model space) on the pose's screen position
      focus.current.set(c.fx, c.fy, c.fz).applyEuler(inner.current.rotation).negate();
      inner.current.position.copy(focus.current);
    }

    const wrap = gl.domElement.parentElement;
    if (wrap && !studio) wrap.style.opacity = c.vis.toFixed(3);
    rigVisible = c.vis > 0.001;

    if (!studio && sceneState.backdrop !== lastBg.current) {
      lastBg.current = sceneState.backdrop;
      bg.current.set(sceneState.backdrop);
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Headphone pose={pose} />
      </group>
      {studio ? (
        <ContactShadows position={[0, -1.2, 0]} scale={5} opacity={0.36} blur={2.6} far={2.4} resolution={256} color="#0e1b2e" />
      ) : (
        <BlobShadow />
      )}
    </group>
  );
}

class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    window.dispatchEvent(new Event("drift:scene-failed"));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneCanvas({ studio = false }: { studio?: boolean }) {
  const [canvasKey, setCanvasKey] = useState(0);
  const [lost, setLost] = useState(false);
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      cleanupRef.current?.();
      if (restoreTimer.current) clearTimeout(restoreTimer.current);
    },
    [],
  );

  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;
    cleanupRef.current?.();

    const forceRemount = () => setCanvasKey((k) => k + 1);

    const onLost = (e: Event) => {
      e.preventDefault(); // required — tells the browser to actually attempt restoration
      setLost(true);
      // if webglcontextrestored never fires, a fresh <canvas> gets a fresh context
      restoreTimer.current = setTimeout(forceRemount, 3000);
    };

    const onRestored = () => {
      if (restoreTimer.current) clearTimeout(restoreTimer.current);
      setLost(false);
      // the restored context has lost every GPU resource; remounting is the
      // reliable way to make three.js re-upload instead of drawing black
      forceRemount();
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    cleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={studio ? "absolute inset-0" : "pointer-events-none fixed inset-0 z-0"}
    >
      <SceneBoundary>
        <Canvas
          key={canvasKey}
          frameloop={studio ? "always" : "demand"}
          dpr={[1, studio ? 2 : 1.5]}
          camera={{ position: [0, 0, 8], fov: 28, near: 0.1, far: 40 }}
          gl={{ antialias: studio, alpha: studio, stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: studio }}
          onCreated={handleCreated}
        >
          {!studio && <Driver />}
          <directionalLight position={[4, 5, 6]} intensity={1.1} />
          <directionalLight position={[-5, 2, -4]} intensity={1.6} color="#dbe6ff" />
          <Suspense fallback={null}>
            <Environment files="/hdri/studio_small_09_1k.hdr" environmentIntensity={0.85} environmentRotation={[0, Math.PI / 3, 0]} />
            <Rig studio={studio} />
          </Suspense>
          {!studio && (
            <EffectComposer multisampling={4} enableNormalPass={false}>
              <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.92} luminanceSmoothing={0.12} radius={0.7} />
            </EffectComposer>
          )}
        </Canvas>
      </SceneBoundary>

      {lost && !studio && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-xs tracking-[0.12em] text-ionosphere/60 uppercase">reconnecting…</p>
        </div>
      )}
    </div>
  );
}

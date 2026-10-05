"use client";
/* eslint-disable react-hooks/immutability -- three.js objects (materials, scene, renderer) are mutated per frame in useFrame by design; this is the standard R3F pattern and never touches React state */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Pose } from "@/lib/scene-store";

/**
 * Procedural Drift One. No .glb ships with the project, so the model is built
 * from lathe/tube/torus primitives at product-render density.
 *
 * Model space: head centre at origin, earcups on ±X. Each side is mirrored
 * with scale.x = -1 so "+u" (local +X) always points away from the head.
 *
 *   side ─┬─ housing (on the headband, explodes upward with it)
 *         └─ slide (sliding yoke joint, extends down with pose.slide)
 *              └─ swivel (rotation.y = fold · 90°)
 *                   ├─ yoke fork + pivots
 *                   └─ cup (oval) ─ shell, cap, driver, grille, cushion, ANC rings
 */

const BAND_R = 1.0;
const BAND_CY = 0.15;
const YOKE_R = 0.5;
const SLIDE_TOP = -0.12;
const RING_COUNT = 5;

type Palette = { shell: string; metal: string; leather: string; sheen: string; metalness: number; roughness: number };

// slate · glacier · rosewood · graphite — pose.color interpolates through these
const PALETTES: Palette[] = [
  { shell: "#5f6a79", metal: "#c3cad3", leather: "#2f333a", sheen: "#8a93a0", metalness: 0.55, roughness: 0.36 },
  { shell: "#a9c4d6", metal: "#e6edf3", leather: "#b4c2cd", sheen: "#ffffff", metalness: 0.25, roughness: 0.42 },
  { shell: "#7d4f41", metal: "#d9ab8c", leather: "#3d231e", sheen: "#b07a66", metalness: 0.45, roughness: 0.38 },
  { shell: "#1f2226", metal: "#4d525a", leather: "#16171a", sheen: "#5a5f68", metalness: 0.5, roughness: 0.48 },
];

class Arc extends THREE.Curve<THREE.Vector3> {
  constructor(private r: number, private a0: number, private a1: number, private cy: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = this.a0 + (this.a1 - this.a0) * t;
    return target.set(Math.cos(a) * this.r, Math.sin(a) * this.r + this.cy, 0);
  }
}

function lathe(points: [number, number][], samples: number, segments: number) {
  const spline = new THREE.SplineCurve(points.map(([r, y]) => new THREE.Vector2(r, y)));
  return new THREE.LatheGeometry(spline.getPoints(samples), segments);
}

/** perforated grille: white = metal, black = hole (alphaMap reads green) */
function perforation() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, size, size);
  g.fillStyle = "#000";
  const pitch = 14;
  for (let row = 0, y = pitch / 2; y < size; row++, y += pitch * 0.866) {
    for (let x = (row % 2 ? pitch / 2 : 0) + pitch / 2; x < size; x += pitch) {
      const dx = x - size / 2;
      const dy = y - size / 2;
      if (dx * dx + dy * dy > (size * 0.46) ** 2) continue;
      g.beginPath();
      g.arc(x, y, pitch * 0.3, 0, Math.PI * 2);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function useParts() {
  return useMemo(() => {
    const g = {
      band: new THREE.TubeGeometry(new Arc(BAND_R, 0, Math.PI, BAND_CY), 180, 0.032, 20, false),
      pad: new THREE.TubeGeometry(new Arc(BAND_R - 0.05, Math.PI * 0.24, Math.PI * 0.76, BAND_CY), 120, 0.044, 20, false),
      padCap: new THREE.SphereGeometry(0.044, 20, 12),
      housing: new RoundedBoxGeometry(0.1, 0.16, 0.17, 4, 0.03),
      rod: new THREE.CylinderGeometry(0.011, 0.011, 0.3, 12),
      yoke: new THREE.TorusGeometry(YOKE_R, 0.026, 14, 96, Math.PI),
      pivot: new THREE.CylinderGeometry(0.045, 0.045, 0.09, 32),
      // shell profile (radius, u): inner lip → rounded outer wall → shoulder → cap recess
      shell: lathe(
        [
          [0.335, -0.1], [0.348, -0.126], [0.375, -0.136], [0.405, -0.13], [0.424, -0.11],
          [0.434, -0.07], [0.438, -0.01], [0.435, 0.05], [0.425, 0.095], [0.405, 0.128],
          [0.377, 0.147], [0.35, 0.153], [0.338, 0.148],
        ],
        72,
        112,
      ),
      cap: new THREE.CylinderGeometry(0.338, 0.338, 0.018, 112),
      accent: new THREE.TorusGeometry(0.27, 0.0045, 8, 160),
      pip: new THREE.CylinderGeometry(0.028, 0.028, 0.008, 32),
      cushion: new THREE.TorusGeometry(0.31, 0.088, 32, 128),
      grille: new THREE.CircleGeometry(0.3, 112),
      diaphragm: lathe(
        [[0.0, -0.036], [0.03, -0.034], [0.055, -0.027], [0.075, -0.017], [0.11, -0.01], [0.145, -0.002], [0.172, 0.006]],
        40,
        96,
      ),
      surround: new THREE.TorusGeometry(0.183, 0.014, 12, 112),
      frame: new THREE.TorusGeometry(0.205, 0.01, 10, 112),
      coil: new THREE.CylinderGeometry(0.058, 0.058, 0.05, 48, 1, true),
      magnet: new THREE.CylinderGeometry(0.11, 0.11, 0.045, 64),
      plate: new THREE.CylinderGeometry(0.122, 0.122, 0.012, 64),
      ring: new THREE.RingGeometry(0.985, 1.0, 160),
    };

    const perf = perforation();
    const m = {
      shell: new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, clearcoat: 0.55, clearcoatRoughness: 0.22 }),
      metal: new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.26, anisotropy: 0.55 }),
      // satin anodised face: rough enough to read as a surface, not a mirror of the room
      cap: new THREE.MeshPhysicalMaterial({ metalness: 0.75, roughness: 0.48, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
      leather: new THREE.MeshPhysicalMaterial({ roughness: 0.62, sheen: 1, sheenRoughness: 0.42 }),
      grille: new THREE.MeshStandardMaterial({ color: "#1c1f23", metalness: 0.85, roughness: 0.38, alphaMap: perf, alphaTest: 0.5, side: THREE.DoubleSide }),
      diaphragm: new THREE.MeshPhysicalMaterial({ color: "#c2b39c", metalness: 0.55, roughness: 0.2, clearcoat: 1, side: THREE.DoubleSide }),
      rubber: new THREE.MeshStandardMaterial({ color: "#131417", roughness: 0.92 }),
      copper: new THREE.MeshStandardMaterial({ color: "#c07a4a", metalness: 1, roughness: 0.22, emissive: "#8a3a16", emissiveIntensity: 0.6 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: "#2b2e33", metalness: 0.9, roughness: 0.34 }),
      rings: Array.from({ length: RING_COUNT }, () =>
        new THREE.MeshBasicMaterial({ color: "#ffb27a", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }),
      ),
    };
    return { g, m, perf };
  }, []);
}

type SideRefs = {
  slide: THREE.Group | null;
  swivel: THREE.Group | null;
  shell: THREE.Group | null;
  cap: THREE.Group | null;
  driver: THREE.Group | null;
  grille: THREE.Mesh | null;
  cushion: THREE.Mesh | null;
  rings: (THREE.Mesh | null)[];
};

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

export default function Headphone({ pose }: { pose: React.RefObject<Pose> }) {
  const { g, m, perf } = useParts();
  const band = useRef<THREE.Group>(null);
  const sides = useRef<SideRefs[]>([0, 1].map(() => ({ slide: null, swivel: null, shell: null, cap: null, driver: null, grille: null, cushion: null, rings: [] })));
  const lastColor = useRef(-1);

  useEffect(
    () => () => {
      Object.values(g).forEach((geo) => geo.dispose());
      Object.values(m).flat().forEach((mat) => mat.dispose());
      perf.dispose();
    },
    [g, m, perf],
  );

  useFrame(({ clock }) => {
    const p = pose.current;
    if (!p) return;
    const t = clock.elapsedTime;
    const e = p.explode;

    // colourway — only touch materials when the value actually moves
    if (Math.abs(p.color - lastColor.current) > 1e-4) {
      lastColor.current = p.color;
      const f = THREE.MathUtils.clamp(p.color, 0, PALETTES.length - 1);
      const i = Math.min(PALETTES.length - 2, Math.floor(f));
      const k = f - i;
      const a = PALETTES[i];
      const b = PALETTES[i + 1];
      m.shell.color.lerpColors(tmpA.set(a.shell), tmpB.set(b.shell), k);
      m.shell.metalness = THREE.MathUtils.lerp(a.metalness, b.metalness, k);
      m.shell.roughness = THREE.MathUtils.lerp(a.roughness, b.roughness, k);
      m.metal.color.lerpColors(tmpA.set(a.metal), tmpB.set(b.metal), k);
      m.cap.color.copy(m.metal.color);
      m.leather.color.lerpColors(tmpA.set(a.leather), tmpB.set(b.leather), k);
      m.leather.sheenColor.lerpColors(tmpA.set(a.sheen), tmpB.set(b.sheen), k);
    }

    if (band.current) band.current.position.y = e * 0.42;

    for (const s of sides.current) {
      if (s.slide) s.slide.position.y = SLIDE_TOP - p.slide * 0.14 - e * 0.05;
      if (s.swivel) s.swivel.rotation.y = -p.fold * Math.PI * 0.5;
      if (s.cap) s.cap.position.x = e * 0.62;
      if (s.shell) s.shell.position.x = e * 0.3;
      if (s.driver) s.driver.position.x = -0.06 - e * 0.22;
      if (s.grille) s.grille.position.x = -0.125 - e * 0.5;
      if (s.cushion) s.cushion.position.x = -0.18 - e * 0.8;

      // ANC: anti-noise wavefronts expanding off the outer shell
      s.rings.forEach((r, i) => {
        if (!r) return;
        const phase = (t * 0.45 + i / RING_COUNT) % 1;
        const sc = 0.46 + phase * 1.7;
        r.scale.setScalar(sc);
        r.visible = p.anc > 0.01;
        m.rings[i].opacity = p.anc * Math.pow(1 - phase, 1.6) * 0.9;
      });
    }
  });

  return (
    <group>
      {/* headband — explodes upward as one assembly with the slider housings */}
      <group ref={band}>
        <mesh geometry={g.band} material={m.metal} scale={[1, 1, 2.4]} />
        <mesh geometry={g.pad} material={m.leather} scale={[1, 1, 1.7]} />
        {[Math.PI * 0.24, Math.PI * 0.76].map((a) => (
          <mesh
            key={a}
            geometry={g.padCap}
            material={m.leather}
            position={[Math.cos(a) * (BAND_R - 0.05), Math.sin(a) * (BAND_R - 0.05) + BAND_CY, 0]}
            scale={[1, 1, 1.7]}
          />
        ))}
        {[-1, 1].map((side) => (
          <mesh key={side} geometry={g.housing} material={m.shell} position={[side * BAND_R, BAND_CY - 0.03, 0]} />
        ))}
      </group>

      {[-1, 1].map((side, si) => {
        const refs = sides.current[si];
        return (
          <group key={side} position={[side * BAND_R, 0, 0]} scale={[side, 1, 1]}>
            <group ref={(o) => { refs.slide = o; }} position={[0, SLIDE_TOP, 0]}>
              {[-0.045, 0.045].map((z) => (
                <mesh key={z} geometry={g.rod} material={m.metal} position={[0, 0.15, z]} />
              ))}
              <group ref={(o) => { refs.swivel = o; }}>
                {/* fork: upper half-torus in the YZ plane, centred on the cup */}
                <mesh geometry={g.yoke} material={m.metal} position={[0, -YOKE_R, 0]} rotation={[0, Math.PI / 2, 0]} />
                {[-1, 1].map((z) => (
                  <mesh key={z} geometry={g.pivot} material={m.darkMetal} position={[0, -YOKE_R, z * YOKE_R]} rotation={[Math.PI / 2, 0, 0]} />
                ))}

                <group position={[0, -YOKE_R, 0]} scale={[1, 1.06, 1]}>
                  {/* lathe/cylinder parts are authored around Y; rotate so Y → +u (outward) */}
                  <group ref={(o) => { refs.shell = o; }}>
                    <mesh geometry={g.shell} material={m.shell} rotation={[0, 0, -Math.PI / 2]} />
                  </group>
                  <group ref={(o) => { refs.cap = o; }}>
                    <group rotation={[0, 0, -Math.PI / 2]}>
                      <mesh geometry={g.cap} material={m.cap} position={[0, 0.142, 0]} />
                      <mesh geometry={g.accent} material={m.copper} position={[0, 0.152, 0]} rotation={[Math.PI / 2, 0, 0]} />
                      <mesh geometry={g.pip} material={m.copper} position={[0, 0.153, 0]} />
                    </group>
                    <group position={[0.16, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                      {m.rings.map((mat, i) => (
                        <mesh
                          key={i}
                          ref={(o) => { refs.rings[i] = o; }}
                          geometry={g.ring}
                          material={mat}
                          rotation={[-Math.PI / 2, 0, 0]}
                          visible={false}
                        />
                      ))}
                    </group>
                  </group>
                  <group ref={(o) => { refs.driver = o; }} position={[-0.06, 0, 0]}>
                    <group rotation={[0, 0, -Math.PI / 2]}>
                      <mesh geometry={g.diaphragm} material={m.diaphragm} />
                      <mesh geometry={g.surround} material={m.rubber} position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]} />
                      <mesh geometry={g.frame} material={m.darkMetal} position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]} />
                      <mesh geometry={g.coil} material={m.copper} position={[0, 0.022, 0]} />
                      <mesh geometry={g.magnet} material={m.darkMetal} position={[0, 0.058, 0]} />
                      <mesh geometry={g.plate} material={m.metal} position={[0, 0.084, 0]} />
                    </group>
                  </group>
                  <mesh
                    ref={(o) => { refs.grille = o; }}
                    geometry={g.grille}
                    material={m.grille}
                    position={[-0.125, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                  />
                  <mesh
                    ref={(o) => { refs.cushion = o; }}
                    geometry={g.cushion}
                    material={m.leather}
                    position={[-0.18, 0, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[1, 1, 0.78]}
                  />
                </group>
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
}

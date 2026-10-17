import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { onRender } from '../renderBus';

export type ProgressRef = { current: number };
export type MouseRef = { current: { x: number; y: number } };

type SceneProps = {
  progressRef: ProgressRef;
  mouseRef: MouseRef;
  dark: boolean;
  onReady: () => void;
  onFail: () => void;
};

const SLAB = { w: 4.4, h: 0.16, d: 2.8 };
const POSTS: Array<[number, number]> = [
  [-1.95, -1.15],
  [1.95, -1.15],
  [-1.95, 1.15],
  [1.95, 1.15],
  [0, -1.15],
  [0, 1.15],
];

function smooth(value: number, a: number, b: number) {
  return THREE.MathUtils.smoothstep(value, a, b);
}

function shadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(40, 28, 16, 0.32)');
  gradient.addColorStop(1, 'rgba(40, 28, 16, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Model({ progressRef, mouseRef, dark }: { progressRef: ProgressRef; mouseRef: MouseRef; dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const longRef = useRef<THREE.InstancedMesh>(null);
  const crossRef = useRef<THREE.InstancedMesh>(null);
  const studRef = useRef<THREE.InstancedMesh>(null);
  const postRefs = useRef<Array<THREE.Mesh | null>>([]);
  const plateRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const materials = useMemo(() => {
    const concrete = new THREE.MeshStandardMaterial({ color: '#d9d3c7', roughness: 0.92, metalness: 0.02 });
    const rebar = new THREE.MeshStandardMaterial({ color: '#c4622d', roughness: 0.28, metalness: 0.82 });
    const timber = new THREE.MeshStandardMaterial({ color: '#a56b3f', roughness: 0.78, metalness: 0.04 });
    const roofMat = new THREE.MeshStandardMaterial({
      color: '#6d7b86',
      roughness: 0.55,
      metalness: 0.2,
      transparent: true,
      opacity: 0,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: '#d5e4f2',
      roughness: 0.12,
      metalness: 0.04,
      emissive: '#8fb4d6',
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0,
    });
    const edge = new THREE.LineBasicMaterial({ color: '#a33b16' });
    return { concrete, rebar, timber, roof: roofMat, glass, edge };
  }, []);

  const geos = useMemo(() => {
    const slab = new THREE.BoxGeometry(SLAB.w, SLAB.h, SLAB.d);
    const bar = new THREE.CylinderGeometry(0.024, 0.024, 1, 8);
    const stud = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const edges = new THREE.EdgesGeometry(slab);
    return { slab, bar, stud, edges };
  }, []);

  const shadow = useMemo(() => shadowTexture(), []);

  useEffect(() => {
    materials.concrete.color.set(dark ? '#a39c92' : '#d9d3c7');
    materials.rebar.color.set(dark ? '#e28a4a' : '#c4622d');
    materials.timber.color.set(dark ? '#c48455' : '#a56b3f');
    materials.roof.color.set(dark ? '#8ea0ad' : '#6d7b86');
    materials.edge.color.set(dark ? '#ef9a55' : '#a33b16');
    invalidate();
  }, [dark, invalidate, materials]);

  useEffect(() => {
    return () => {
      materials.concrete.dispose();
      materials.rebar.dispose();
      materials.timber.dispose();
      materials.roof.dispose();
      materials.glass.dispose();
      materials.edge.dispose();
      geos.slab.dispose();
      geos.bar.dispose();
      geos.stud.dispose();
      geos.edges.dispose();
      shadow.dispose();
    };
  }, [geos, materials, shadow]);

  useEffect(() => onRender(() => invalidate()), [invalidate]);

  const apply = (progress: number) => {
    const rebarGrow = smooth(progress, 0.02, 0.62);
    const frame = smooth(progress, 0.38, 0.84);
    const roof = smooth(progress, 0.66, 1);
    const y = 0.03;

    const place = (mesh: THREE.InstancedMesh | null, count: number, kind: 'x' | 'z' | 'y') => {
      if (!mesh) return;
      for (let i = 0; i < count; i += 1) {
        const t = (i + 1) / (count + 1);
        const staggered = THREE.MathUtils.smoothstep(rebarGrow, t * 0.35, t * 0.35 + 0.5);
        const show = kind === 'y' ? staggered : Math.max(i < 2 ? 1 : 0, staggered);
        if (kind === 'x') {
          const length = SLAB.w - 0.28;
          dummy.position.set(0, y, THREE.MathUtils.lerp(-SLAB.d / 2 + 0.18, SLAB.d / 2 - 0.18, t));
          dummy.rotation.set(0, 0, Math.PI / 2);
          dummy.scale.set(1, Math.max(0.001, length * show), 1);
        } else if (kind === 'z') {
          const length = SLAB.d - 0.28;
          dummy.position.set(THREE.MathUtils.lerp(-SLAB.w / 2 + 0.18, SLAB.w / 2 - 0.18, t), y, 0);
          dummy.rotation.set(Math.PI / 2, 0, 0);
          dummy.scale.set(1, Math.max(0.001, length * show), 1);
        } else {
          const height = 0.42 * show;
          const edge = i % 2 === 0;
          const along = ((i % 10) + 1) / 11;
          dummy.position.set(
            edge ? THREE.MathUtils.lerp(-2, 2, along) : i < 16 ? -2.05 : 2.05,
            height / 2,
            edge ? (i < 10 ? -1.25 : 1.25) : THREE.MathUtils.lerp(-1.1, 1.1, along),
          );
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, Math.max(0.001, height), 1);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };

    place(longRef.current, 10, 'x');
    place(crossRef.current, 16, 'z');
    place(studRef.current, 20, 'y');

    const postH = 1.18 * frame;
    postRefs.current.forEach((mesh) => {
      if (!mesh) return;
      mesh.scale.y = Math.max(0.001, postH);
      mesh.position.y = postH / 2;
    });
    if (plateRef.current) {
      plateRef.current.position.y = postH;
      plateRef.current.visible = frame > 0.08;
    }
    if (roofRef.current) {
      roofRef.current.visible = roof > 0.04;
      roofRef.current.position.y = 0.92;
    }
    materials.roof.opacity = roof;
    materials.glass.opacity = roof;
    if (glassRef.current) glassRef.current.visible = roof > 0.05;
  };

  useLayoutEffect(() => {
    apply(progressRef.current);
  });

  useFrame((_, delta) => {
    apply(progressRef.current);
    const pivot = group.current;
    if (!pivot) return;
    const targetY = mouseRef.current.x * 0.42;
    const targetX = mouseRef.current.y * -0.1;
    const nextY = THREE.MathUtils.damp(pivot.rotation.y, targetY, 4, delta);
    const nextX = THREE.MathUtils.damp(pivot.rotation.x, targetX, 4, delta);
    const moving = Math.abs(nextY - targetY) > 0.002 || Math.abs(nextX - targetX) > 0.002;
    pivot.rotation.y = nextY;
    pivot.rotation.x = nextX;
    if (moving) invalidate();
  });

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[6.2, 4.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={geos.slab} material={materials.concrete} position={[0, -SLAB.h / 2, 0]} />
      <lineSegments geometry={geos.edges} material={materials.edge} position={[0, -SLAB.h / 2, 0]} />
      <instancedMesh ref={longRef} args={[geos.bar, materials.rebar, 10]} />
      <instancedMesh ref={crossRef} args={[geos.bar, materials.rebar, 16]} />
      <instancedMesh ref={studRef} args={[geos.stud, materials.rebar, 20]} />
      {POSTS.map(([x, z], index) => (
        <mesh
          key={`${x}-${z}`}
          ref={(node) => {
            postRefs.current[index] = node;
          }}
          position={[x, 0.5, z]}
          material={materials.timber}
        >
          <boxGeometry args={[0.12, 1, 0.12]} />
        </mesh>
      ))}
      <group ref={plateRef}>
        <mesh position={[0, 0, -1.15]} material={materials.timber}>
          <boxGeometry args={[4.05, 0.08, 0.1]} />
        </mesh>
        <mesh position={[0, 0, 1.15]} material={materials.timber}>
          <boxGeometry args={[4.05, 0.08, 0.1]} />
        </mesh>
        <mesh position={[-1.95, 0, 0]} material={materials.timber}>
          <boxGeometry args={[0.1, 0.08, 2.4]} />
        </mesh>
        <mesh position={[1.95, 0, 0]} material={materials.timber}>
          <boxGeometry args={[0.1, 0.08, 2.4]} />
        </mesh>
      </group>
      <group ref={roofRef} position={[0, 1.18, 0]}>
        <mesh position={[0, 0.42, 0.62]} rotation={[0.51, 0, 0]} material={materials.roof}>
          <boxGeometry args={[4.55, 0.05, 1.45]} />
        </mesh>
        <mesh position={[0, 0.42, -0.62]} rotation={[-0.51, 0, 0]} material={materials.roof}>
          <boxGeometry args={[4.55, 0.05, 1.45]} />
        </mesh>
      </group>
      <group ref={glassRef}>
        {[
          [-0.9, 0.62, 1.2],
          [0.9, 0.62, 1.2],
          [-0.9, 0.62, -1.2],
          [0.9, 0.62, -1.2],
        ].map(([x, y, z]) => (
          <mesh key={`${x}-${z}`} position={[x, y, z]} material={materials.glass}>
            <boxGeometry args={[0.7, 0.48, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const { invalidate } = useThree();
  useEffect(() => {
    onReady();
    invalidate();
  }, [invalidate, onReady]);
  return null;
}

class Boundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroScene({ progressRef, mouseRef, dark, onReady, onFail }: SceneProps) {
  const compact = window.matchMedia('(max-width: 800px)').matches;
  return (
    <Boundary onFail={onFail}>
      <Canvas
        dpr={compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)}
        camera={{ position: [4.15, 2.7, 4.45], fov: 30 }}
        frameloop="demand"
        gl={{ antialias: !compact, alpha: true, stencil: false, powerPreference: 'default' }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0.58, 0);
          gl.setClearColor(0x000000, 0);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.62} />
        <hemisphereLight args={['#f4efe6', '#c8bba8', 0.45]} />
        <directionalLight position={[6, 8, 4]} intensity={1.55} color="#fff4e8" />
        <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#d5e2f5" />
        <Model progressRef={progressRef} mouseRef={mouseRef} dark={dark} />
        <Ready onReady={onReady} />
      </Canvas>
    </Boundary>
  );
}

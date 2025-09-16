// ProWebStudioScene.tsx
// ProWeb Studio – "Het Prisma van Licht"
// Where light becomes meaning, and meaning becomes art
// ------------------------------------------------------------

import * as React from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import {
  OrbitControls,
  Float,
  Points,
  PointMaterial,
  MeshTransmissionMaterial,
  Sparkles,
  Trail,
  Preload,
  AdaptiveDpr,
  Line as DreiLine,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  DepthOfField,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

// Extend THREE to include TextGeometry
extend({ TextGeometry });

// ---------- Enhanced Mobile Detection & Performance Utilities ----------
const getDeviceInfo = () => {
  if (typeof window === 'undefined') return { 
    isMobile: false, 
    isIOS: false, 
    isAndroid: false, 
    performanceTier: 'high' as const,
    screenSize: 'desktop' as const 
  };
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                   window.innerWidth <= 768;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  // Enhanced performance tier detection
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  // @ts-expect-error - deviceMemory is experimental
  const deviceMemory = navigator.deviceMemory || 4;
  
  let performanceTier: 'low' | 'medium' | 'high' = 'medium';
  
  if (isMobile) {
    if (hardwareConcurrency < 4 || deviceMemory < 4) performanceTier = 'low';
    else if (hardwareConcurrency >= 6 && deviceMemory >= 6) performanceTier = 'high';
  } else {
    if (hardwareConcurrency < 4 || deviceMemory < 8) performanceTier = 'low';
    else if (hardwareConcurrency >= 8 && deviceMemory >= 16) performanceTier = 'high';
  }
  
  const screenSize = window.innerWidth <= 480 ? 'mobile' : 
                    window.innerWidth <= 768 ? 'tablet' : 'desktop';
  
  return { isMobile, isIOS, isAndroid, performanceTier, screenSize };
};

// Performance-aware configuration
const getOptimizedConfig = () => {
  const { isMobile, performanceTier } = getDeviceInfo();
  
  return {
    // Particle counts based on device capability
    dustParticles: isMobile ? 
      (performanceTier === 'low' ? 200 : performanceTier === 'medium' ? 500 : 800) : 
      (performanceTier === 'low' ? 800 : performanceTier === 'medium' ? 1500 : 2000),
    
    sparkleCount: isMobile ?
      (performanceTier === 'low' ? 10 : performanceTier === 'medium' ? 20 : 30) :
      (performanceTier === 'low' ? 20 : performanceTier === 'medium' ? 30 : 50),
      
    // Shadow resolution
    shadowMapSize: isMobile ?
      (performanceTier === 'low' ? 256 : performanceTier === 'medium' ? 512 : 1024) :
      (performanceTier === 'low' ? 512 : performanceTier === 'medium' ? 1024 : 2048),
      
    // DPR settings
    dpr: isMobile ?
      (performanceTier === 'low' ? [0.8, 1] : performanceTier === 'medium' ? [1, 1.2] : [1, 1.5]) :
      (performanceTier === 'low' ? [1, 1.5] : performanceTier === 'medium' ? [1, 1.8] : [1, 2]),
      
    // Post-processing
    enablePostProcessing: performanceTier !== 'low',
    bloomIntensity: performanceTier === 'low' ? 0.8 : performanceTier === 'medium' ? 1.2 : 1.5,
    
    // Lighting
    maxLights: isMobile ? 
      (performanceTier === 'low' ? 2 : 3) :
      (performanceTier === 'low' ? 3 : performanceTier === 'medium' ? 4 : 6),
      
    // Geometry detail
    geometryDetail: performanceTier === 'low' ? 0.5 : performanceTier === 'medium' ? 0.8 : 1.0,
  };
};

// ---------- Camera Configuration ----------
const getCameraPosition = (): [number, number, number] => {
  const { isMobile } = getDeviceInfo();
  return isMobile ? [4, 2, 6] : [5, 3, 8];
};

// ---------- Sacred Geometry & Brand Colors ----------
const PALETTES = {
  anwar: {
    bg: '#030015',
    primary: '#00D9FF',
    secondary: '#7A5CFF',
    accent: '#FF2BD6',
    glow: '#FFFFFF',
    crystal: '#E0F7FF',
    dust: '#4A90E2',
  },
  sunfire: {
    bg: '#0A0502',
    primary: '#FFB200',
    secondary: '#FF6A00',
    accent: '#FFE5B4',
    glow: '#FFF5E6',
    crystal: '#FFD700',
    dust: '#FF8C42',
  },
} as const;

// ---------- Types ----------
export type StudioAnwarSceneProps = {
  materialMode?: 'crystal' | 'energy';
  palette?: keyof typeof PALETTES;
  animationState?: 'idle' | 'active' | 'perpetual';
  interactionHeat?: number;
  autoRotate?: boolean;
};

// ---------- Calligraphic Letter Paths ----------
const createCalligraphicPaths = () => {
  // Beautiful flowing paths for each letter
  const letterPaths = {
    A: [
      new THREE.Vector3(-2.5, -0.5, 0),
      new THREE.Vector3(-2.3, 0.5, 0.1),
      new THREE.Vector3(-2.0, 1.2, 0),
      new THREE.Vector3(-1.8, 0.5, -0.1),
      new THREE.Vector3(-1.6, -0.5, 0),
      new THREE.Vector3(-1.9, 0, 0.1),
      new THREE.Vector3(-2.1, 0, -0.1),
    ],
    N: [
      new THREE.Vector3(-1.2, -0.5, 0),
      new THREE.Vector3(-1.2, 1.2, 0.1),
      new THREE.Vector3(-0.8, -0.3, -0.1),
      new THREE.Vector3(-0.4, 1.2, 0),
    ],
    W: [
      new THREE.Vector3(0, 1.2, 0),
      new THREE.Vector3(0.2, -0.5, 0.1),
      new THREE.Vector3(0.4, 0.8, -0.1),
      new THREE.Vector3(0.6, -0.5, 0.1),
      new THREE.Vector3(0.8, 1.2, 0),
    ],
    A2: [
      new THREE.Vector3(1.2, -0.5, 0),
      new THREE.Vector3(1.4, 0.5, 0.1),
      new THREE.Vector3(1.7, 1.2, 0),
      new THREE.Vector3(1.9, 0.5, -0.1),
      new THREE.Vector3(2.1, -0.5, 0),
      new THREE.Vector3(1.8, 0, 0.1),
      new THREE.Vector3(1.6, 0, -0.1),
    ],
    R: [
      new THREE.Vector3(2.5, -0.5, 0),
      new THREE.Vector3(2.5, 1.2, 0.1),
      new THREE.Vector3(2.7, 1.0, 0),
      new THREE.Vector3(2.9, 0.8, -0.1),
      new THREE.Vector3(2.7, 0.6, 0),
      new THREE.Vector3(2.5, 0.4, 0.1),
      new THREE.Vector3(2.9, -0.5, 0),
    ],
  };

  return Object.values(letterPaths).map(
    (points) => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5),
  );
};

// ---------- Mobile Controls Helper ----------
function MobileControlsHelper() {
  const { gl, camera } = useThree();
  const { isMobile } = getDeviceInfo();
  
  React.useEffect(() => {
    if (!isMobile) return;
    
    const canvas = gl.domElement;
    let isTouch = false;
    
    const handleTouchStart = (event: TouchEvent) => {
      isTouch = true;
      // Prevent context menu on long press
      event.preventDefault();
    };
    
    const handleTouchEnd = () => {
      isTouch = false;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (isTouch && event.touches.length === 2) {
        // Prevent default zoom behavior to let OrbitControls handle it
        event.preventDefault();
      }
    };
    
    // Add passive listeners for better performance
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Set initial mobile camera position
    camera.position.set(...getCameraPosition());
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gl, camera, isMobile]);
  
  // Handle responsive camera adjustments
  React.useEffect(() => {
    const handleResize = () => {
      camera.position.set(...getCameraPosition());
      if (camera instanceof THREE.PerspectiveCamera) {
        const { isMobile } = getDeviceInfo();
        camera.fov = isMobile ? 60 : 50;
        camera.updateProjectionMatrix();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);
  
  return null;
}

// ---------- The Crystal Heart (Enhanced Geometry with LOD) ----------
function CrystalPrism({
  mode,
  colors,
  pulseRef,
  transitionRef,
}: {
  mode: 'crystal' | 'energy';
  colors: (typeof PALETTES)[keyof typeof PALETTES];
  pulseRef: React.MutableRefObject<number>;
  transitionRef: React.MutableRefObject<number>;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const innerRef = React.useRef<THREE.Mesh>(null!);
  const energyLinesRef = React.useRef<THREE.Group>(null!);
  
  const config = getOptimizedConfig();

  // LOD-based geometry - reduce detail on lower performance tiers
  const outerGeo = React.useMemo(() => {
    const detail = config.geometryDetail;
    return new THREE.DodecahedronGeometry(1, Math.floor(detail * 2));
  }, [config.geometryDetail]);
  
  const innerGeo = React.useMemo(() => {
    const detail = config.geometryDetail;
    return new THREE.IcosahedronGeometry(0.6, Math.max(1, Math.floor(detail * 2)));
  }, [config.geometryDetail]);

  useFrame((state) => {
    if (!meshRef.current || !innerRef.current) return;

    const time = state.clock.elapsedTime;

    // Living rotation with heartbeat influence
    meshRef.current.rotation.y = time * 0.1 + Math.sin(time * 0.5) * 0.05;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;

    innerRef.current.rotation.y = -time * 0.15;
    innerRef.current.rotation.z = Math.cos(time * 0.08) * 0.3;

    // Breathing with pulse
    const breath = 1 + Math.sin(time * 0.5) * 0.05 + pulseRef.current * 0.2;
    meshRef.current.scale.setScalar(breath);

    // Energy crackling during transition
    if (energyLinesRef.current && transitionRef.current > 0) {
      energyLinesRef.current.visible = true;
      energyLinesRef.current.scale.setScalar(transitionRef.current);
      energyLinesRef.current.rotation.y = time * 2;
    } else if (energyLinesRef.current) {
      energyLinesRef.current.visible = false;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={outerGeo}>
        {mode === 'crystal' ? (
          <MeshTransmissionMaterial
            color={colors.crystal}
            transmission={1}
            thickness={0.5}
            roughness={0.05}
            ior={2.4}
            chromaticAberration={0.5 + transitionRef.current * 0.3}
            anisotropy={0.3}
            distortion={0.2 + transitionRef.current * 0.3}
            distortionScale={0.2}
            temporalDistortion={0.1 + transitionRef.current * 0.2}
          />
        ) : (
          <meshPhysicalMaterial
            color={colors.primary}
            emissive={colors.glow}
            emissiveIntensity={1.5 + transitionRef.current}
            metalness={0}
            roughness={0.2}
            transmission={0.5}
            thickness={1}
            ior={1.5}
          />
        )}
      </mesh>

      <mesh ref={innerRef} geometry={innerGeo}>
        <meshPhysicalMaterial
          color={colors.secondary}
          emissive={colors.primary}
          emissiveIntensity={0.5 + pulseRef.current}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Energy transition effect - reduced on low performance */}
      <group ref={energyLinesRef}>
        {[...Array(config.geometryDetail >= 0.8 ? 8 : 4)].map((_, i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / (config.geometryDetail >= 0.8 ? 4 : 2), 0]}>
            <torusGeometry args={[1.2, 0.01, config.geometryDetail >= 0.8 ? 8 : 4, 32]} />
            <meshBasicMaterial
              color={colors.accent}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Heart emission particles - optimized for mobile */}
      <Sparkles
        count={getOptimizedConfig().sparkleCount}
        scale={2.5}
        size={3}
        speed={0.4}
        color={colors.accent}
        opacity={0.6}
      />
    </group>
  );
}

// ---------- Calligraphic Light Writing ----------
function DrawingTrail({
  curve,
  progress,
  color,
}: {
  curve: THREE.CatmullRomCurve3;
  progress: number;
  color: string;
}) {
  const penRef = React.useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (penRef.current) {
      const point = curve.getPointAt(progress);
      penRef.current.position.copy(point);
    }
  });

  return (
    <mesh ref={penRef} visible={false}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="white" />
      <Trail
        width={1.5}
        length={8}
        color={color}
        attenuation={(t) => t * t * t}
      />
    </mesh>
  );
}

function CalligraphicReveal({
  colors,
  onComplete,
  perpetual = false,
}: {
  colors: (typeof PALETTES)[keyof typeof PALETTES];
  onComplete: () => void;
  perpetual?: boolean;
}) {
  const groupRef = React.useRef<THREE.Group>(null!);
  const paths = React.useMemo(() => createCalligraphicPaths(), []);
  const progressRef = React.useRef(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [cycleCount, setCycleCount] = React.useState(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Enhanced animation logic for perpetual mode
    if (perpetual) {
      // Continuous cycling animation
      progressRef.current += delta / 3; // 3 second cycles
      if (progressRef.current >= 2) {
        progressRef.current = 0;
        setCycleCount((prev) => prev + 1);
      }
    } else {
      // Original single animation
      if (progressRef.current < 1) {
        progressRef.current = Math.min(progressRef.current + delta / 4, 1);
      }
    }

    // Enhanced floating animation with interaction heat
    const baseFloat = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    const energyFloat = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    groupRef.current.position.y = baseFloat + (perpetual ? energyFloat : 0);

    // Dynamic rotation in perpetual mode
    if (perpetual) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }

    // Trigger onComplete callback for single animation
    if (!perpetual && progressRef.current >= 1 && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  });

  // Enhanced force update for perpetual mode
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => {
    const interval = perpetual ? 16 : 16; // Faster updates for perpetual
    const handle = setInterval(() => forceUpdate((c) => c + 1), interval);
    return () => clearInterval(handle);
  }, [perpetual]);

  return (
    <group ref={groupRef}>
      {paths.map((path, i) => {
        let letterProgress;

        if (perpetual) {
          // Continuous wave-like animation
          const wavePhase = (progressRef.current + i * 0.15) % 2;
          letterProgress = THREE.MathUtils.clamp(
            wavePhase < 1 ? wavePhase : 2 - wavePhase,
            0,
            1,
          );
        } else {
          // Original sequential animation
          letterProgress = THREE.MathUtils.clamp(
            (progressRef.current - i * 0.15) * 2.5,
            0,
            1,
          );
        }

        if (letterProgress <= 0) return null;

        // Enhanced color cycling in perpetual mode
        const dynamicColor = perpetual
          ? colors.glow // Use static color for now, can enhance later
          : colors.glow;

        return (
          <DrawingTrail
            key={`${i}-${cycleCount}`}
            curve={path}
            progress={letterProgress}
            color={dynamicColor}
          />
        );
      })}
    </group>
  );
}

// ---------- Living Constellation Nodes (Performance Optimized) ----------
function ConstellationNodes({
  colors,
  mousePos,
  pulseRef,
  revealActive,
}: {
  colors: (typeof PALETTES)[keyof typeof PALETTES];
  mousePos: React.MutableRefObject<THREE.Vector3>;
  pulseRef: React.MutableRefObject<number>;
  revealActive: boolean;
}) {
  const nodes = React.useRef<THREE.Group>(null!);
  const trailRefs = React.useRef<THREE.Mesh[]>([]);
  
  const config = getOptimizedConfig();

  // Sacred geometry positions - golden ratio based (reduced count on low performance)
  const nodeData = React.useMemo(() => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseNodes = [
      { pos: [phi, 1, 0], size: 0.08 },
      { pos: [-phi, -1, 0], size: 0.08 },
      { pos: [1, 0, phi], size: 0.06 },
      { pos: [-1, 0, -phi], size: 0.06 },
      { pos: [0, phi, 1], size: 0.07 },
      { pos: [0, -phi, -1], size: 0.07 },
    ];
    
    // Reduce nodes on low performance
    const nodeCount = config.geometryDetail < 0.8 ? 4 : 6;
    
    return baseNodes.slice(0, nodeCount).map((n) => ({
      ...n,
      pos: new THREE.Vector3(...n.pos).normalize().multiplyScalar(3),
    }));
  }, [config.geometryDetail]);

  useFrame((state) => {
    if (!nodes.current) return;

    const time = state.clock.elapsedTime;

    // Base rotation with acceleration during reveal
    const rotationSpeed = revealActive ? 0.15 + 0.3 : 0.03;
    nodes.current.rotation.y = time * rotationSpeed;
    nodes.current.rotation.x = Math.sin(time * 0.02) * 0.1;

    // Mouse influence
    const influence = mousePos.current.clone().multiplyScalar(0.001);
    nodes.current.position.lerp(influence, 0.02);

    // Nodes pulse with crystal heartbeat
    trailRefs.current.forEach((trail) => {
      if (trail) {
        const scale = 1 + pulseRef.current * 0.3 + (revealActive ? 0.5 : 0);
        trail.scale.setScalar(scale);
      }
    });
  });

  return (
    <group ref={nodes}>
      {nodeData.map((node, i) => (
        <group key={i} position={node.pos}>
          <Trail
            width={revealActive ? 2 : 0.5}
            length={revealActive ? 20 : 10}
            color={colors.accent}
            attenuation={(t) => t * t}
          >
            <mesh
              ref={(el) => {
                if (el) trailRefs.current[i] = el;
              }}
            >
              <sphereGeometry
                args={[
                  node.size * (revealActive ? 1.5 : 1), 
                  Math.max(8, Math.floor(16 * config.geometryDetail)), 
                  Math.max(8, Math.floor(16 * config.geometryDetail))
                ]}
              />
              <meshPhysicalMaterial
                color={colors.primary}
                emissive={revealActive ? colors.glow : colors.accent}
                emissiveIntensity={revealActive ? 2 : 1.5}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
          </Trail>
        </group>
      ))}

      {/* Energy connections between nodes */}
      <group>
        {nodeData.map((node, i) => {
          const next = nodeData[(i + 1) % nodeData.length];
          const midPoint = node.pos.clone().add(next.pos).multiplyScalar(0.5);

          return (
            <DreiLine
              key={`connection-${i}`}
              points={[node.pos, midPoint, next.pos]}
              color={colors.secondary}
              lineWidth={0.5}
              transparent
              opacity={0.3 + pulseRef.current * 0.3}
            />
          );
        })}
      </group>
    </group>
  );
}

// ---------- Living Cosmic Dust ----------
function CosmicDust({
  colors,
  mouseInfluence,
  pulseRef,
  crystalEmission,
}: {
  colors: (typeof PALETTES)[keyof typeof PALETTES];
  mouseInfluence: React.MutableRefObject<THREE.Vector2>;
  pulseRef: React.MutableRefObject<number>;
  crystalEmission: boolean;
}) {
  const points = React.useRef<THREE.Points>(null!);
  const count = getOptimizedConfig().dustParticles;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      if (crystalEmission && i < count * 0.3) {
        // Some particles start near the crystal
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1 + Math.random() * 0.5;

        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      } else {
        // Regular distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random() * 10;

        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
    }

    return pos;
  }, [crystalEmission, count]);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.elapsedTime;
    const posArray = points.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const y = posArray[idx + 1];
      const z = posArray[idx + 2];

      const dist = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);

      // Particles flow with crystal's heartbeat
      const pulseInfluence = pulseRef.current * 0.1;
      const newAngle =
        angle + 0.002 + mouseInfluence.current.x * 0.0005 + pulseInfluence;
      const newDist =
        dist + Math.sin(time * 0.5 + i * 0.01) * 0.01 * (1 + pulseInfluence);

      posArray[idx] = Math.cos(newAngle) * newDist;
      posArray[idx + 1] = y + Math.sin(time * 0.3 + i * 0.01) * 0.005;
      posArray[idx + 2] = Math.sin(newAngle) * newDist;

      // Crystal emission - particles flow outward
      if (crystalEmission && dist < 2) {
        posArray[idx] *= 1.005;
        posArray[idx + 1] += 0.001;
        posArray[idx + 2] *= 1.005;
      }

      // Boundary reset
      if (dist > 12) {
        if (crystalEmission && Math.random() < 0.3) {
          // Reset near crystal
          const resetAngle = Math.random() * Math.PI * 2;
          const resetDist = 1 + Math.random();
          posArray[idx] = Math.cos(resetAngle) * resetDist;
          posArray[idx + 1] = (Math.random() - 0.5) * 2;
          posArray[idx + 2] = Math.sin(resetAngle) * resetDist;
        } else {
          // Regular reset
          const resetAngle = Math.random() * Math.PI * 2;
          const resetDist = 2 + Math.random() * 2;
          posArray[idx] = Math.cos(resetAngle) * resetDist;
          posArray[idx + 1] = (Math.random() - 0.5) * 4;
          posArray[idx + 2] = Math.sin(resetAngle) * resetDist;
        }
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = time * 0.01;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        color={colors.dust}
        opacity={0.6}
        vertexColors={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ---------- Dynamic Lighting System (Performance Optimized) ----------
function LightingRig({
  colors,
  pulseRef,
}: {
  colors: (typeof PALETTES)[keyof typeof PALETTES];
  pulseRef: React.MutableRefObject<number>;
}) {
  const light1 = React.useRef<THREE.PointLight>(null!);
  const light2 = React.useRef<THREE.PointLight>(null!);
  const light3 = React.useRef<THREE.SpotLight>(null!);
  
  const config = getOptimizedConfig();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Orbiting lights synchronized with heartbeat
    if (light1.current) {
      const radius = 4 + pulseRef.current * 0.5;
      light1.current.position.x = Math.cos(time * 0.3) * radius;
      light1.current.position.z = Math.sin(time * 0.3) * radius;
      light1.current.position.y = Math.sin(time * 0.2) * 2;
      light1.current.intensity = 1.5 + pulseRef.current * 0.5;
    }

    if (light2.current && config.maxLights > 2) {
      const radius = 4 + pulseRef.current * 0.5;
      light2.current.position.x = Math.cos(time * 0.3 + Math.PI) * radius;
      light2.current.position.z = Math.sin(time * 0.3 + Math.PI) * radius;
      light2.current.position.y = Math.cos(time * 0.25) * 2;
      light2.current.intensity = 1 + pulseRef.current * 0.3;
    }

    if (light3.current && config.maxLights > 3) {
      light3.current.intensity = 2 + pulseRef.current;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} color={colors.bg} />

      {/* Primary light - always enabled */}
      <pointLight
        ref={light1}
        intensity={1.5}
        color={colors.primary}
        distance={8}
        decay={2}
        castShadow={config.maxLights > 2}
        shadow-mapSize={[config.shadowMapSize, config.shadowMapSize]}
      />

      {/* Secondary lights only on higher performance */}
      {config.maxLights > 2 && (
        <pointLight
          ref={light2}
          intensity={1}
          color={colors.secondary}
          distance={8}
          decay={2}
          castShadow={config.maxLights > 4}
          shadow-mapSize={[config.shadowMapSize, config.shadowMapSize]}
        />
      )}

      {config.maxLights > 3 && (
        <spotLight
          ref={light3}
          position={[0, 5, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={2}
          color={colors.glow}
          castShadow={config.maxLights > 4}
          shadow-mapSize={[config.shadowMapSize, config.shadowMapSize]}
        />
      )}

      {/* Area light only on high performance */}
      {config.maxLights > 4 && (
        <rectAreaLight
          position={[0, -3, 0]}
          width={10}
          height={10}
          intensity={0.5}
          color={colors.accent}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
    </>
  );
}

// ---------- Main Scene Orchestrator ----------
function SceneContent({
  materialMode,
  palette,
  animationState,
  interactionHeat,
  autoRotate,
}: StudioAnwarSceneProps) {
  const config = getOptimizedConfig();
  const { isMobile } = getDeviceInfo();
  const [currentColors, setCurrentColors] = React.useState(PALETTES[palette!]);
  const [transitioning, setTransitioning] = React.useState(false);
  const pulseRef = React.useRef(0);
  const transitionRef = React.useRef(0);
  const [showReveal, setShowReveal] = React.useState(false);
  const mousePos = React.useRef(new THREE.Vector3());
  const mouseInfluence = React.useRef(new THREE.Vector2(0, 0));

  // Handle palette transitions
  React.useEffect(() => {
    setTransitioning(true);
    transitionRef.current = 0;

    const interval = setInterval(() => {
      transitionRef.current = Math.min(transitionRef.current + 0.02, 1);

      if (transitionRef.current >= 1) {
        setCurrentColors(PALETTES[palette!]);
        setTransitioning(false);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [palette]);

  // Enhanced animation state handling
  React.useEffect(() => {
    if (animationState === 'active' || animationState === 'perpetual') {
      setShowReveal(true);
    } else if (animationState === 'idle') {
      setShowReveal(false);
    }
  }, [animationState]);

  // Mouse tracking
  const { mouse } = useThree();

  useFrame((state) => {
    mousePos.current.set(mouse.x * 5, mouse.y * 5, 0);
    mouseInfluence.current.lerp(mouse, 0.05);

    // Enhanced heartbeat with interaction heat
    const time = state.clock.elapsedTime;
    const heatMultiplier = 1 + (interactionHeat || 0) * 2;
    pulseRef.current = Math.sin(time * 2 * heatMultiplier) * 0.5 + 0.5;

    // Material transition
    if (transitioning) {
      transitionRef.current = Math.min(transitionRef.current + 0.02, 1);
    }
  });

  const handleRevealComplete = React.useCallback(() => {
    // Only hide if not in perpetual mode
    if (animationState !== 'perpetual') {
      setShowReveal(false);
    }
  }, [animationState]);

  // Interpolated colors during transition
  const colors = React.useMemo(() => {
    if (!transitioning) return currentColors;
    // For now, return current colors during transition
    return currentColors;
  }, [currentColors, transitioning]);

  return (
    <>
      <color attach="background" args={[colors.bg]} />

      <MobileControlsHelper />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={isMobile ? 0.1 : 0.05}
        rotateSpeed={isMobile ? 0.6 : 0.4}
        autoRotate={autoRotate}
        autoRotateSpeed={0.2}
        minDistance={isMobile ? 3 : 4}
        maxDistance={isMobile ? 12 : 15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 0.75}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        enableZoom={true}
        zoomSpeed={isMobile ? 1.2 : 1.0}
        zoomToCursor={false}
      />

      <LightingRig colors={colors} pulseRef={pulseRef} />

      <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.3}>
        <CrystalPrism
          mode={materialMode!}
          colors={colors}
          pulseRef={pulseRef}
          transitionRef={transitionRef}
        />
      </Float>

      <ConstellationNodes
        colors={colors}
        mousePos={mousePos}
        pulseRef={pulseRef}
        revealActive={showReveal}
      />

      <CosmicDust
        colors={colors}
        mouseInfluence={mouseInfluence}
        pulseRef={pulseRef}
        crystalEmission={true}
      />

      {showReveal && (
        <CalligraphicReveal
          colors={colors}
          onComplete={handleRevealComplete}
          perpetual={animationState === 'perpetual'}
        />
      )}

      {config.enablePostProcessing && (
        <EffectComposer multisampling={isMobile ? 2 : 4}>
          <Bloom
            intensity={config.bloomIntensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            kernelSize={isMobile ? KernelSize.MEDIUM : KernelSize.LARGE}
            mipmapBlur
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0005, 0.0005)}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <DepthOfField
            focusDistance={0.01}
            focalLength={0.05}
            bokehScale={isMobile ? 1 : 2}
            height={isMobile ? 240 : 480}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      )}

      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}

// ---------- Main Component Export ----------
export default function StudioAnwarScene({
  materialMode = 'crystal',
  palette = 'anwar',
  animationState = 'idle',
  interactionHeat = 0,
  autoRotate = false,
}: StudioAnwarSceneProps) {
  const config = getOptimizedConfig();
  const { isMobile } = getDeviceInfo();
  
  // Enhance with our new device capabilities hook
  const { capabilities, optimizedSettings } = useDeviceCapabilities();
  
  // Use the more sophisticated settings when available
  const finalConfig = {
    ...config,
    // Override with more accurate settings from our enhanced hook
    dpr: optimizedSettings.dpr,
    enablePostProcessing: optimizedSettings.enablePostProcessing && config.enablePostProcessing,
    shadowMapSize: optimizedSettings.shadowMapSize,
    maxLights: Math.min(config.maxLights, optimizedSettings.maxLights),
    bloomIntensity: Math.min(config.bloomIntensity, optimizedSettings.bloomIntensity),
  };
  
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 600,
        background: `radial-gradient(ellipse at center, ${PALETTES[palette].bg}00 0%, ${PALETTES[palette].bg} 100%)`,
      }}
    >
      <Canvas
        gl={{
          antialias: optimizedSettings.antialias && !isMobile, // Enhanced logic
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
          alpha: false, // Disable alpha for better performance
          preserveDrawingBuffer: false, // Disable for better performance
        }}
        dpr={finalConfig.dpr as [number, number]}
        camera={{ 
          position: getCameraPosition(), 
          fov: optimizedSettings.cameraFov, // Use enhanced FOV calculation
          near: 0.1, 
          far: 100 
        }}
        shadows={optimizedSettings.enableShadows && finalConfig.maxLights > 2}
        onCreated={(state) => {
          // Enhanced mobile optimization
          if (capabilities.isMobile || capabilities.isLowEndDevice) {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, finalConfig.dpr[1]));
            
            // Configure shadows for mobile
            if (state.gl.shadowMap && optimizedSettings.enableShadows) {
              state.gl.shadowMap.type = capabilities.isLowEndDevice ? 
                THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
            }
          }
        }}
      >
        <React.Suspense fallback={null}>
          <SceneContent
            materialMode={materialMode}
            palette={palette}
            animationState={animationState}
            interactionHeat={interactionHeat}
            autoRotate={autoRotate}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

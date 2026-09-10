"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 70;
const CONNECT_DISTANCE = 2.6;
const RADIUS = 5;

function useNetworkGeometry() {
  return useMemo(() => {
    const nodes: THREE.Vector3[] = [];

    // Generate random nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * RADIUS * 2,
          (Math.random() - 0.5) * RADIUS * 2,
          (Math.random() - 0.5) * RADIUS * 2
        )
      );
    }

    // Node positions
    const positions = new Float32Array(nodes.length * 3);

    nodes.forEach((v, i) => {
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    });

    // Connections between nearby nodes
    const linePositions: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONNECT_DISTANCE) {
          linePositions.push(
            nodes[i].x,
            nodes[i].y,
            nodes[i].z,
            nodes[j].x,
            nodes[j].y,
            nodes[j].z
          );
        }
      }
    }

    return {
      positions,
      linePositions: new Float32Array(linePositions),
    };
  }, []);
}

function NetworkGroup() {
  const group = useRef<THREE.Group>(null);

  const { positions, linePositions } = useNetworkGeometry();

  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;

    // Slowly rotate the network
    group.current.rotation.y +=
      delta * 0.06 + pointer.x * 0.0006;

    // Move slightly according to mouse position
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.2,
      0.03
    );
  });

  return (
    <group ref={group}>
      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#16a34a"
          transparent
          opacity={0.35}
        />
      </lineSegments>

      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#15803d"
          size={0.12}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [0, 0, 9],
          fov: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={0.6} />

        <NetworkGroup />
      </Canvas>
    </div>
  );
}
'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../../store/player.store';

export function PlayerController() {
  const meshRef = useRef<THREE.Mesh>(null);
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const setPlayerPosition = usePlayerStore((state) => state.setPlayerPosition);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as 'w' | 'a' | 's' | 'd' | 'shift'] = true;
      }
      if (e.key === 'Shift') {
        keys.current.shift = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as 'w' | 'a' | 's' | 'd' | 'shift'] = false;
      }
      if (e.key === 'Shift') {
        keys.current.shift = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const baseSpeed = 4;
    const speed = keys.current.shift ? baseSpeed * 1.8 : baseSpeed;
    const move = new THREE.Vector3();

    // W/S: forward/backward (Z axis)
    // A/D: left/right (X axis)
    if (keys.current.w) move.z -= 1;
    if (keys.current.s) move.z += 1;
    if (keys.current.a) move.x -= 1;
    if (keys.current.d) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      meshRef.current.position.add(move);

      // Rotate player mesh towards moving direction
      const targetAngle = Math.atan2(move.x, move.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetAngle,
        0.15
      );

      // Save position in global store
      const pos = meshRef.current.position;
      setPlayerPosition([pos.x, pos.y, pos.z]);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
      <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.1} />
      
      {/* Front indicator (acting as eyes/forward pointer) */}
      <mesh position={[0, 0.4, 0.4]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </mesh>
  );
}

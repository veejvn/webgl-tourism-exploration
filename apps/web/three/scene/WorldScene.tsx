'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Grid } from '@react-three/drei';
import { PlayerController } from '../character/PlayerController';

export default function WorldScene() {
  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 6, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Environment Sky & Lights */}
        <Sky sunPosition={[100, 20, 100]} distance={450000} mieCoefficient={0.005} mieDirectionalG={0.8} rayleigh={3} turbidity={10} />
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[12, 15, 8]}
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
        />

        {/* Floor Grid */}
        <Grid
          position={[0, -0.01, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={1}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#475569"
          fadeDistance={50}
        />
        
        {/* Floor collider plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Scenic Obstacles/Di tích du lịch mô phỏng */}
        <mesh position={[-5, 2, -5]} castShadow receiveShadow>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>

        <mesh position={[6, 1.5, -4]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 3, 32]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>

        <mesh position={[0, 1, -8]} castShadow receiveShadow>
          <coneGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="#ef4444" roughness={0.6} />
        </mesh>

        {/* Interactive Player */}
        <PlayerController />

        {/* Smooth Interactive Orbit Camera */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going underground
          minDistance={3}
          maxDistance={30}
        />
      </Canvas>

      {/* Control instructions HUD */}
      <div className="absolute bottom-4 left-4 z-10 p-4 bg-slate-900/90 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 backdrop-blur-md shadow-lg pointer-events-none">
        <h3 className="font-bold text-white mb-2">🎮 BẢNG ĐIỀU KHỂN</h3>
        <div className="space-y-1">
          <div><span className="text-blue-400 font-bold">W, A, S, D</span> : Di chuyển</div>
          <div><span className="text-blue-400 font-bold">Shift</span> : Chạy nhanh</div>
          <div><span className="text-blue-400 font-bold">Chuột trái + Kéo</span> : Xoay camera</div>
          <div><span className="text-blue-400 font-bold">Chuột phải + Kéo</span> : Di chuyển camera</div>
          <div><span className="text-blue-400 font-bold">Cuộn chuột</span> : Thu phóng</div>
        </div>
      </div>
    </div>
  );
}

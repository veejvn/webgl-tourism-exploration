'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

// Dynamically import WorldScene with SSR disabled to prevent hydration failures
const WorldScene = dynamic(() => import('../../three/scene/WorldScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
      <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-900 rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-400 font-mono animate-pulse">
        Đang khởi tạo Engine WebGL 3D...
      </p>
    </div>
  ),
});

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'hanoi';

  // Capitalize name for page heading
  const destinationName = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* 3D Scene Viewport */}
      <div className="w-full h-full">
        <WorldScene />
      </div>

      {/* Floating Header UI overlay */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        {/* Back and Title */}
        <div className="flex items-center gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl pointer-events-auto backdrop-blur-md">
          <button
            onClick={() => router.push('/map')}
            className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Quay lại bản đồ"
          >
            ⬅ Bản đồ
          </button>
          <div className="pr-2">
            <span className="text-[10px] text-blue-400 font-bold tracking-widest block uppercase">
              Không gian 3D
            </span>
            <h1 className="text-sm font-bold text-white leading-tight">
              Khám phá di sản: {destinationName === 'Hanoi' ? 'Hà Nội' : destinationName === 'Hue' ? 'Huế' : destinationName === 'Hoian' ? 'Hội An' : destinationName}
            </h1>
          </div>
        </div>

        {/* AI Guide Quick Assistant */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl pointer-events-auto backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="text-xs font-mono text-slate-300">AI Tour Guide Active</span>
          <button
            onClick={() => alert('Chức năng trợ lý AI Tour Guide sẽ sớm được kết nối với Gemini API!')}
            className="py-1 px-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-[11px] rounded-lg transition-all"
          >
            Trò chuyện 🤖
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-900 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-400 font-mono animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

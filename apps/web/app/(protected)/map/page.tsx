'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_DEFAULT_CENTER, MAPBOX_DEFAULT_ZOOM } from '@project/constants';
import { useDestinations } from '@/hooks/useDestinations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DestinationDTO } from '@project/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [selectedDest, setSelectedDest] = useState<DestinationDTO | null>(null);
  
  const { data: destinations, isLoading, error } = useDestinations();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!mapContainerRef.current || !destinations) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: MAPBOX_DEFAULT_CENTER,
      zoom: MAPBOX_DEFAULT_ZOOM - 6,
    });

    mapRef.current = map;

    map.on('load', () => {
      destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
        el.innerHTML = '📍';

        el.addEventListener('click', () => {
          setSelectedDest(dest);
          map.flyTo({
            center: [dest.longitude, dest.latitude],
            zoom: MAPBOX_DEFAULT_ZOOM - 2,
            essential: true,
          });
        });

        new mapboxgl.Marker(el)
          .setLngLat([dest.longitude, dest.latitude])
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [destinations]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-lg font-semibold animate-pulse">Đang tải dữ liệu bản đồ An Giang...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-lg font-semibold">Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-gray-900 text-white">
      <div ref={mapContainerRef} className="w-full h-full" />

      {user ? (
        <div className="absolute top-4 right-4 z-10 p-3 bg-gray-900/90 border border-gray-800 rounded-xl max-w-xs shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium">Xin chào, <span className="text-blue-400 font-bold">{user.name}</span></p>
          <Button
            variant="ghost"
            size="xs"
            onClick={logout}
            className="mt-2 w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
          >
            Đăng xuất
          </Button>
        </div>
      ) : (
        <div className="absolute top-4 right-4 z-10 p-3 bg-gray-900/90 border border-gray-800 rounded-xl shadow-2xl backdrop-blur-md">
          <Button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1 px-3 h-8 rounded-lg"
          >
            Đăng nhập
          </Button>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-900/90 border border-gray-800 rounded-xl max-w-sm shadow-2xl backdrop-blur-md">
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Bản đồ Di sản Du lịch 3D
        </h1>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Khám phá vẻ đẹp di sản An Giang trong không gian 3D tương tác thời gian thực. Chọn một điểm di tích để trải nghiệm.
        </p>
      </div>

      {selectedDest && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-10 p-5 bg-gray-900/95 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300">
          <button
            onClick={() => setSelectedDest(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
          <img
            src={selectedDest.coverImage}
            alt={selectedDest.title}
            className="w-full h-40 object-cover rounded-xl mb-4 shadow"
          />
          <h2 className="text-lg font-bold text-white">{selectedDest.title}</h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {selectedDest.description}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => router.push(`/explore?id=${selectedDest.id}`)}
              className="flex-1 py-2 px-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
            >
              🚀 Khám phá 3D
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [selectedDest.longitude, selectedDest.latitude],
                    zoom: MAPBOX_DEFAULT_ZOOM + 1,
                    essential: true,
                  });
                }
              }}
              className="h-8 rounded-xl text-xs"
            >
              🔍 Phóng to
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

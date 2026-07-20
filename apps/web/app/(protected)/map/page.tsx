'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_DEFAULT_CENTER, MAPBOX_DEFAULT_ZOOM } from '@project/constants';

// Use Mapbox token from environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MockDestination {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  coverImage: string;
}

const MOCK_DESTINATIONS: MockDestination[] = [
  {
    id: 'hanoi',
    title: 'Hà Nội',
    description: 'Thủ đô ngàn năm văn hiến với Hồ Gươm cổ kính và những ngõ nhỏ rêu phong.',
    latitude: 21.0285,
    longitude: 105.8544,
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hue',
    title: 'Cố đô Huế',
    description: 'Di sản văn hóa thế giới với những cung điện, lăng tẩm uy nghiêm cổ kính.',
    latitude: 16.4637,
    longitude: 107.5909,
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hoian',
    title: 'Phố cổ Hội An',
    description: 'Đô thị cổ bên sông Thu Bồn rực rỡ sắc đèn lồng về đêm.',
    latitude: 15.8801,
    longitude: 108.3380,
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop'
  }
];

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();
  const [selectedDest, setSelectedDest] = useState<MockDestination | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: MAPBOX_DEFAULT_CENTER,
      zoom: MAPBOX_DEFAULT_ZOOM - 6,
    });

    mapRef.current = map;

    map.on('load', () => {
      MOCK_DESTINATIONS.forEach((dest) => {
        // Create custom HTML marker element
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

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-gray-900 text-white">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Title Panel */}
      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-900/90 border border-gray-800 rounded-xl max-w-sm shadow-2xl backdrop-blur-md">
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Bản đồ Di sản Du lịch 3D
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Lựa chọn một điểm đến du lịch trên bản đồ Việt Nam để bắt đầu hành trình khám phá không gian 3D tương tác.
        </p>
      </div>

      {/* Selected Destination Panel */}
      {selectedDest && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-10 p-5 bg-gray-900/95 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0">
          <button
            onClick={() => setSelectedDest(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <img
            src={selectedDest.coverImage}
            alt={selectedDest.title}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
          <h2 className="text-lg font-bold text-white">{selectedDest.title}</h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{selectedDest.description}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => router.push(`/explore?id=${selectedDest.id}`)}
              className="flex-1 py-2 px-4 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
            >
              🚀 Khám phá 3D
            </button>
            <button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({
                    center: [selectedDest.longitude, selectedDest.latitude],
                    zoom: MAPBOX_DEFAULT_ZOOM + 1,
                    essential: true,
                  });
                }
              }}
              className="py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs rounded-xl active:scale-95 transition-transform"
            >
              🔍 Phóng to
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

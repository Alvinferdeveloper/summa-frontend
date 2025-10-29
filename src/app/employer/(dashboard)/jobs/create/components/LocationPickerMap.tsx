
'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  position: [number, number] | null;
}

function MapEvents({ onLocationSelect, position }: LocationPickerMapProps) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return position ? <Marker position={position}></Marker> : null;
}

export default function LocationPickerMap({ onLocationSelect, position }: LocationPickerMapProps) {
  return (
    <div className="h-64 w-full rounded-md border overflow-hidden">
      <MapContainer center={position || [51.505, -0.09]} zoom={position ? 13 : 2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onLocationSelect={onLocationSelect} position={position} />
      </MapContainer>
    </div>
  );
}

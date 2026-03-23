import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LiveMapProps {
  pickupCoords?: { lat: number; lng: number } | null;
  destinationCoords?: { lat: number; lng: number } | null;
}

const LiveMap: React.FC<LiveMapProps> = ({ pickupCoords, destinationCoords }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView([49.967, 7.896], 11); // Bingen coordinates, zoomed out

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB'
      }).addTo(mapRef.current);
    }

    // Ensure size is valid after mount with a delay to allow container to render
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [pickupCoords, destinationCoords]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers
    if (pickupCoords) {
      const marker = L.marker([pickupCoords.lat, pickupCoords.lng]).addTo(mapRef.current)
        .bindPopup('Abholung');
      markersRef.current.push(marker);
    }
    if (destinationCoords) {
      const marker = L.marker([destinationCoords.lat, destinationCoords.lng]).addTo(mapRef.current)
        .bindPopup('Ziel');
      markersRef.current.push(marker);
    }

    // Fit bounds
    if (pickupCoords && destinationCoords) {
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupCoords) {
      mapRef.current.setView([pickupCoords.lat, pickupCoords.lng], 15);
    }
  }, [pickupCoords, destinationCoords]);

  return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

export default LiveMap;

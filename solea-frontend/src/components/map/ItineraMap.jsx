/**
 * ItineraMap — Interactive Leaflet map for itinerary visualization
 *
 * Uses vanilla Leaflet (no react-leaflet needed) via useEffect.
 * Supports:
 * - Markers with slot-based colours (morning/afternoon/evening)
 * - Highlighted place with popup
 * - Empty state message when no coordinates available
 * - Cluster visualization
 */
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Slot-based marker colours
const SLOT_COLORS = {
    morning: '#f59e0b',   // amber / yellow
    afternoon: '#3b82f6', // blue
    evening: '#8b5cf6',   // purple
    default: '#10b981',   // green
};

/**
 * Create a coloured circle marker icon
 */
function createSlotIcon(slot, isHighlighted = false) {
    const color = SLOT_COLORS[slot] || SLOT_COLORS.default;
    const size = isHighlighted ? 18 : 12;
    const border = isHighlighted ? '3px solid white' : '2px solid white';

    return L.divIcon({
        className: 'itinera-marker',
        html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border-radius:50%;
      border:${border};
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      ${isHighlighted ? 'animation: pulse 1.5s infinite;' : ''}
    "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

/**
 * @param {{ 
 *   places: Array<{ id: string, name: string, lat?: number, lng?: number, slot?: string, address?: string }>,
 *   highlightedPlaceId?: string,
 *   clusters?: Array,
 *   height?: string
 * }} props
 */
const ItineraMap = ({ places = [], highlightedPlaceId, clusters, height = '400px' }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const [noCoords, setNoCoords] = useState(false);

    // Filter places that have valid coordinates
    const validPlaces = places.filter(p => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng));

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return; // already initialized

        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
        }).setView([48.8566, 2.3522], 13); // default: Paris

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>',
            maxZoom: 18,
        }).addTo(map);

        markersLayer.current = L.layerGroup().addTo(map);
        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Update markers when places or highlight change
    useEffect(() => {
        if (!mapInstance.current || !markersLayer.current) return;

        // Clear existing markers
        markersLayer.current.clearLayers();

        if (validPlaces.length === 0) {
            setNoCoords(true);
            return;
        }

        setNoCoords(false);

        const bounds = [];

        for (const place of validPlaces) {
            const isHighlighted = place.id === highlightedPlaceId;
            const icon = createSlotIcon(place.slot, isHighlighted);

            const marker = L.marker([place.lat, place.lng], { icon })
                .bindPopup(`
          <div style="min-width:150px">
            <strong>${place.name || place.title || 'Place'}</strong>
            ${place.slot ? `<br/><span style="color:${SLOT_COLORS[place.slot] || '#666'};font-weight:600">${place.slot}</span>` : ''}
            ${place.address ? `<br/><small>${place.address}</small>` : ''}
          </div>
        `);

            if (isHighlighted) {
                marker.openPopup();
            }

            markersLayer.current.addLayer(marker);
            bounds.push([place.lat, place.lng]);
        }

        // Fit map to show all markers
        if (bounds.length > 0) {
            mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
    }, [validPlaces.length, highlightedPlaceId, places]);

    return (
        <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            {/* Empty state overlay */}
            {noCoords && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.8)', zIndex: 1000,
                    color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px',
                }}>
                    <div>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
                        <div>Aucune coordonnée disponible pour afficher la carte</div>
                    </div>
                </div>
            )}

            {/* Legend */}
            {validPlaces.length > 0 && (
                <div style={{
                    position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000,
                    background: 'rgba(15,23,42,0.85)', borderRadius: '8px', padding: '8px 12px',
                    display: 'flex', gap: '12px', fontSize: '11px', color: '#e2e8f0',
                }}>
                    {Object.entries(SLOT_COLORS).filter(([k]) => k !== 'default').map(([slot, color]) => (
                        <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                            <span>{slot === 'morning' ? 'Matin' : slot === 'afternoon' ? 'Après-midi' : 'Soir'}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Pulse animation */}
            <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
        </div>
    );
};

export default ItineraMap;

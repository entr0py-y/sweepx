'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bounty } from '@/types';
import { getDirtLabel } from '@/lib/gameUtils';
import styles from './BountyMap.module.css';

interface BountyMapProps {
    bounties: Bounty[];
    onBountySelect?: (bounty: Bounty) => void;
    center?: [number, number];
    zoom?: number;
    height?: string;
}

// Custom marker icon
const createCustomIcon = (dirtLevel: number) => {
    const colors = ['#84cc16', '#a3e635', '#facc15', '#fb923c', '#ef4444'];
    const color = colors[dirtLevel - 1];

    return L.divIcon({
        className: styles.customMarker,
        html: `
      <div class="${styles.markerOuter}" style="background: ${color}20; border-color: ${color}">
        <div class="${styles.markerInner}" style="background: ${color}"></div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

export default function BountyMap({
    bounties,
    onBountySelect,
    center = [28.6139, 77.2090],
    zoom = 11,
    height = '100%'
}: BountyMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current, {
            center,
            zoom,
            zoomControl: false,
        });

        // Custom zoom control position
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Add tile layer with custom styling
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsLoaded(true);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [center, zoom]);

    // Add markers when bounties change
    useEffect(() => {
        if (!mapInstanceRef.current || !isLoaded) return;

        const map = mapInstanceRef.current;
        const markers: L.Marker[] = [];

        bounties.forEach(bounty => {
            const marker = L.marker([bounty.latitude, bounty.longitude], {
                icon: createCustomIcon(bounty.dirt_level),
            });

            // Create popup content
            const popupContent = `
        <div class="${styles.popup}">
          <div class="${styles.popupImage}" style="background-image: url('${bounty.image_url}')"></div>
          <div class="${styles.popupContent}">
            <h3 class="${styles.popupTitle}">${bounty.location_name}</h3>
            <div class="${styles.popupMeta}">
              <span class="${styles.popupBounty}">◈ ${bounty.bounty_amount} coins</span>
              <span class="${styles.popupDirt}">${getDirtLabel(bounty.dirt_level)}</span>
            </div>
            <div class="${styles.popupStatus} ${styles[bounty.status]}">${bounty.status.toUpperCase()}</div>
          </div>
        </div>
      `;

            marker.bindPopup(popupContent, {
                className: styles.leafletPopup,
                maxWidth: 280,
                minWidth: 240,
            });

            marker.on('click', () => {
                if (onBountySelect) {
                    onBountySelect(bounty);
                }
            });

            marker.addTo(map);
            markers.push(marker);
        });

        // Animate markers in
        markers.forEach((marker, index) => {
            setTimeout(() => {
                const element = marker.getElement();
                if (element) {
                    element.classList.add(styles.markerAnimated);
                }
            }, index * 50);
        });

        return () => {
            markers.forEach(marker => marker.remove());
        };
    }, [bounties, isLoaded, onBountySelect]);

    return (
        <div
            ref={mapRef}
            className={styles.map}
            style={{ height }}
        />
    );
}

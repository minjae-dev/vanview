"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

export default function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5, // 애니메이션 지속 시간 (초)
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

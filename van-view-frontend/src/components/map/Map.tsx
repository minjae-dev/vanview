"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

export default function MyMap(props: unknown) {
  const { position, zoom } = props as {
    position: [number, number];
    zoom: number;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{
        height: "400px",
        width: "100%",
        zIndex: 1,
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

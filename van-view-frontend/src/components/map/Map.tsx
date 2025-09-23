"use client";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapZoom from "./MapZoom";
import SearchControl from "./Search";

interface MapProps {
  position?: [number, number];
  zoom?: number;
}

interface Post {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  content: string;
}

export default function MyMap({
  position = [49.2827, -123.1207],
  zoom = 13,
}: MapProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>(position);
  const [mapZoom, setMapZoom] = useState(zoom);

  useEffect(() => {
    const fetchPosts = async () => {
      const data: Post[] = [
        {
          id: 1,
          latitude: 49.2827,
          longitude: -123.1207,
          title: "Vancouver Sushi",
          content: "Best sushi in downtown Vancouver.",
        },
        {
          id: 2,
          latitude: 49.2734,
          longitude: -123.1007,
          title: "Gastown Pizza",
          content: "Famous for wood-fired pizzas.",
        },
        {
          id: 3,
          latitude: 49.2636,
          longitude: -123.1386,
          title: "Kitsilano Cafe",
          content: "Cozy brunch spot near the beach.",
        },
      ];
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleLocationSelect = (lat: number, lng: number, title: string) => {
    setSelectedLocation({ lat, lng, title });
    setMapCenter([lat, lng]);
    setMapZoom(16);
  };

  return (
    <div className="relative w-full h-full">
      <SearchControl
        posts={posts}
        onLocationSelect={handleLocationSelect}
        className="absolute top-4 left-4 z-[1000] w-80"
      />

      <MapContainer
        center={position}
        zoom={zoom}
        style={{
          height: "400px",
          width: "100%",
          zIndex: 1,
        }}
        scrollWheelZoom={true}
      >
        <MapZoom center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {posts.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]}>
            <Popup>
              <strong>{post.title}</strong>
              <br />
              {post.content}
            </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <strong>🔍 Search Result</strong>
              <br />
              {selectedLocation.title}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* 검색 결과 정보 표시 */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Search Result</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedLocation.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                lat: {selectedLocation.lat.toFixed(6)}, lng:{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

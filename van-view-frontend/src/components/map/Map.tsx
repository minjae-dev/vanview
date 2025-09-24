"use client";
import TransitCalculator, {
  type TransitRoute,
} from "@/components/transit/TransitCalculator";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapZoom from "./MapZoom";
import RouteCalculator, {
  type RoutePoint,
  type RouteProfile,
} from "./RouteCalculator";
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
  const [showRouteCalculator, setShowRouteCalculator] = useState(false);
  const [waypoints, setWaypoints] = useState<RoutePoint[]>([]);
  const [routeProfile, setRouteProfile] = useState<RouteProfile>("walking");

  // 대중교통 관련 상태
  const [showTransit, setShowTransit] = useState(false);
  const [transitRoutes, setTransitRoutes] = useState<TransitRoute[]>([]);
  const [transitError, setTransitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const data: Post[] = [
        {
          id: 1,
          latitude: 49.2827,
          longitude: -123.1207,
          title: "Vancouver Downtown",
          content: "Downtown Vancouver - Business District",
        },
        {
          id: 2,
          latitude: 49.2734,
          longitude: -123.1007,
          title: "Gastown",
          content: "Historic Gastown district with cobblestone streets",
        },
        {
          id: 3,
          latitude: 49.2636,
          longitude: -123.1386,
          title: "Kitsilano Beach",
          content: "Popular beach and residential area",
        },
        {
          id: 4,
          latitude: 49.2876,
          longitude: -123.1205,
          title: "Stanley Park",
          content: "Large urban park with seawall",
        },
        {
          id: 5,
          latitude: 49.2496,
          longitude: -123.1193,
          title: "Queen Elizabeth Park",
          content: "Elevated park with city views",
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

  const addWaypoint = (
    lat: number,
    lng: number,
    title: string = "Waypoint"
  ) => {
    const newWaypoint: RoutePoint = { lat, lng, title };
    setWaypoints((prev) => [...prev, newWaypoint]);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
  };

  const handleTransitCalculated = (routes: TransitRoute[]) => {
    setTransitRoutes(routes);
    setTransitError(null);
  };

  const handleTransitError = (error: string) => {
    setTransitError(error);
    setTransitRoutes([]);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}분`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}시간 ${mins}분`;
  };

  const formatFare = (fare: number) => {
    return `$${fare.toFixed(2)} CAD`;
  };

  return (
    <div className="relative w-full h-full">
      <SearchControl
        posts={posts}
        onLocationSelect={handleLocationSelect}
        className="absolute top-4 left-4 z-[1000] w-80"
      />

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowRouteCalculator(!showRouteCalculator)}
          className={`px-4 py-2 rounded-lg shadow-lg font-medium transition-colors ${
            showRouteCalculator
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          {showRouteCalculator ? "Hide Routes" : "Plan Route"}
        </button>

        <button
          onClick={() => setShowTransit(!showTransit)}
          className={`px-4 py-2 rounded-lg shadow-lg font-medium transition-colors ${
            showTransit
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-white text-gray-700 hover:bg-gray-50 border"
          }`}
        >
          🚌 {showTransit ? "Hide Transit" : "Public Transit"}
        </button>
      </div>

      {/* Route Profile Selector */}
      {showRouteCalculator && (
        <div className="absolute top-16 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border mt-12">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Profile:
          </label>
          <select
            value={routeProfile}
            onChange={(e) => setRouteProfile(e.target.value as RouteProfile)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
          >
            <option value="driving">🚗 Driving</option>
            <option value="walking">🚶‍♂️ Walking</option>
            <option value="cycling">🚴‍♂️ Cycling</option>
          </select>

          <div className="space-y-2">
            <button
              onClick={() =>
                addWaypoint(mapCenter[0], mapCenter[1], "Center Point")
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Add Waypoint Here
            </button>
            <button
              onClick={clearWaypoints}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear All Waypoints
            </button>
            <div className="text-xs text-gray-500">
              Waypoints: {waypoints.length}
            </div>
          </div>
        </div>
      )}

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

        {/* RouteCalculator Component */}
        {showRouteCalculator && (
          <RouteCalculator
            waypoints={waypoints}
            profile={routeProfile}
            onRouteCalculated={(distance, duration, segments) => {
              console.log("Route calculated:", {
                distance,
                duration,
                segments,
              });
            }}
            onError={(error) => {
              console.error("Route error:", error);
            }}
          />
        )}

        {/* Transit Calculator */}
        {showTransit && waypoints.length >= 2 && (
          <TransitCalculator
            startPoint={waypoints[0]}
            endPoint={waypoints[waypoints.length - 1]}
            onTransitCalculated={handleTransitCalculated}
            onError={handleTransitError}
          />
        )}

        {posts.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]}>
            <Popup>
              <strong>{post.title}</strong>
              <br />
              {post.content}
              {showTransit && (
                <div className="mt-2">
                  <button
                    onClick={() =>
                      addWaypoint(post.latitude, post.longitude, post.title)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Add to Transit Route
                  </button>
                </div>
              )}
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

      {/* Search Result with Transit Option */}
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
            <div className="flex gap-2">
              {showRouteCalculator && (
                <button
                  onClick={() =>
                    addWaypoint(
                      selectedLocation.lat,
                      selectedLocation.lng,
                      selectedLocation.title
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add to Route
                </button>
              )}
              {showTransit && (
                <button
                  onClick={() =>
                    addWaypoint(
                      selectedLocation.lat,
                      selectedLocation.lng,
                      selectedLocation.title
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  🚌 Transit Here
                </button>
              )}
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transit Routes Display */}
      {showTransit && transitRoutes.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border max-w-sm max-h-80 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            🚌 대중교통 경로
          </h4>

          {transitRoutes.map((route, routeIndex) => (
            <div key={routeIndex} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-600">
                  경로 {routeIndex + 1}
                </span>
                <div className="text-xs text-gray-500 text-right">
                  <div>⏱️ {formatDuration(route.duration)}</div>
                  <div>💰 {formatFare(route.fare)}</div>
                  <div>🔄 환승 {route.transfers}회</div>
                </div>
              </div>

              <div className="space-y-2">
                {route.legs.map((leg, legIndex) => (
                  <div key={legIndex} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0">
                        {leg.mode === "WALK"
                          ? "🚶‍♂️"
                          : leg.mode === "BUS"
                          ? "🚌"
                          : leg.mode === "SUBWAY"
                          ? "🚇"
                          : "🚊"}
                      </span>
                      <div className="flex-1">
                        {leg.mode !== "WALK" && leg.route && (
                          <span className="font-medium text-blue-600">
                            {leg.route}
                          </span>
                        )}
                        <div className="text-gray-600">
                          {leg.from.name} → {leg.to.name}
                        </div>
                        <div className="text-gray-500">
                          {formatDuration(leg.duration)} •{" "}
                          {leg.distance.toFixed(1)}km
                        </div>
                        {leg.departureTime && leg.arrivalTime && (
                          <div className="text-gray-500">
                            {leg.departureTime} → {leg.arrivalTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {transitError && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              ⚠️ {transitError}
            </div>
          )}
        </div>
      )}

      {/* Waypoints List */}
      {(showRouteCalculator || showTransit) && waypoints.length > 0 && (
        <div
          className="absolute bottom-4 right-4 z-[999] bg-white p-4 rounded-lg shadow-lg border max-w-xs"
          style={{
            marginRight:
              showTransit && transitRoutes.length > 0 ? "400px" : "0",
          }}
        >
          <h4 className="font-semibold text-gray-900 mb-2">Route Waypoints</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {waypoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-medium">
                    {index + 1}. {point.title}
                  </span>
                  <div className="text-xs text-gray-500">
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setWaypoints((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transit Instructions */}
      {showTransit && waypoints.length < 2 && (
        <div className="absolute bottom10 left-4 right-4 z-[1000] bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-sm text-green-800 text-center">
            🚌 대중교통 경로를 보려면 최소 2개의 지점을 선택하세요. Waypoint
            추가 후 "🚌 Public Transit" 버튼을 클릭하세요.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { RoutePoint } from "../map/RouteCalculator";

interface TransitRoute {
  legs: TransitLeg[];
  duration: number;
  distance: number;
  fare: number;
  transfers: number;
  realtime?: boolean;
}

interface TransitLeg {
  mode: "WALK" | "BUS" | "RAIL" | "SUBWAY" | "SEABUS";
  route?: string;
  routeColor?: string;
  routeId?: string;
  tripId?: string;
  from: {
    name: string;
    lat: number;
    lng: number;
    stopId?: string;
  };
  to: {
    name: string;
    lat: number;
    lng: number;
    stopId?: string;
  };
  duration: number;
  distance: number;
  instructions?: string;
  departureTime?: string;
  arrivalTime?: string;
  delay?: number; // GTFS Realtime 지연 정보
  alerts?: string[]; // 서비스 알림
}

interface TransitCalculatorProps {
  startPoint: RoutePoint | null;
  endPoint: RoutePoint | null;
  onTransitCalculated?: (routes: TransitRoute[]) => void;
  onError?: (error: string) => void;
}

// GTFS Realtime 데이터 타입
interface GTFSTripUpdate {
  trip?: { trip_id: string; route_id?: string };
  stop_time_update?: Array<{
    stop_id: string;
    departure?: { delay: number };
    arrival?: { delay: number };
  }>;
}

interface GTFSVehiclePosition {
  trip?: { trip_id: string; route_id?: string };
  position?: { latitude: number; longitude: number };
  vehicle?: { id: string };
}

interface GTFSServiceAlert {
  informed_entity?: Array<{
    route_id?: string;
    stop_id?: string;
  }>;
  header_text?: {
    translation: Array<{ text: string }>;
  };
}

interface GTFSRealtimeData {
  tripUpdates: GTFSTripUpdate[];
  vehiclePositions: GTFSVehiclePosition[];
  serviceAlerts: GTFSServiceAlert[];
}

export default function TransitCalculator({
  startPoint,
  endPoint,
  onTransitCalculated,
  onError,
}: TransitCalculatorProps) {
  const map = useMap();
  const [, setIsLoading] = useState(false);
  const [, setRealtimeData] = useState<GTFSRealtimeData | null>(null);

  const fetchGTFSRealtimeData = async (): Promise<GTFSRealtimeData> => {
    // 개발 중이므로 Mock 데이터 사용 (Protocol Buffer 파싱 필요)
    console.warn(
      "Using mock GTFS Realtime data. GTFS APIs return protobuf, not JSON."
    );
    return getMockGTFSRealtimeData();
  };

  // Mock GTFS Realtime 데이터 생성
  const getMockGTFSRealtimeData = (): GTFSRealtimeData => {
    return {
      tripUpdates: [
        {
          trip: { trip_id: "TRIP_001", route_id: "99" },
          stop_time_update: [
            {
              stop_id: "STOP_001",
              departure: {
                delay:
                  Math.random() > 0.7 ? Math.floor(Math.random() * 300) : 0,
              },
            },
          ],
        },
      ],
      vehiclePositions: [
        {
          trip: { trip_id: "TRIP_001", route_id: "99" },
          position: {
            latitude: 49.2827 + (Math.random() - 0.5) * 0.1,
            longitude: -123.1207 + (Math.random() - 0.5) * 0.1,
          },
          vehicle: { id: "BUS_001" },
        },
      ],
      serviceAlerts:
        Math.random() > 0.7
          ? [
              {
                informed_entity: [{ route_id: "99" }],
                header_text: {
                  translation: [
                    { text: "99 B-Line에 경미한 지연이 발생하고 있습니다." },
                  ],
                },
              },
            ]
          : [],
    };
  };

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const calculateTransit = async () => {
      setIsLoading(true);
      try {
        const gtfsData = await fetchGTFSRealtimeData();
        setRealtimeData(gtfsData);

        const staticRoutes = await calculateStaticTransitRoute(
          startPoint,
          endPoint
        );
        const enhancedRoutes = await enhanceWithRealtimeData(
          staticRoutes,
          gtfsData
        );

        if (enhancedRoutes.length > 0) {
          drawTransitRoute(enhancedRoutes[0]);
          onTransitCalculated?.(enhancedRoutes);
        } else {
          const mockRoutes = await getMockVancouverTransit(
            startPoint,
            endPoint
          );
          drawTransitRoute(mockRoutes[0]);
          onTransitCalculated?.(mockRoutes);
          onError?.(
            "실시간 대중교통 정보를 가져올 수 없어 예상 경로를 표시합니다."
          );
        }
      } catch (error) {
        console.error("Transit calculation error:", error);

        try {
          const mockRoutes = await getEnhancedMockVancouverTransit(
            startPoint,
            endPoint
          );
          drawTransitRoute(mockRoutes[0]);
          onTransitCalculated?.(mockRoutes);
          onError?.("실시간 데이터를 가져올 수 없어 예상 경로를 표시합니다.");
        } catch {
          onError?.("대중교통 경로를 계산할 수 없습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    calculateTransit();
  }, [startPoint, endPoint]);

  const calculateStaticTransitRoute = async (
    start: RoutePoint,
    end: RoutePoint
  ): Promise<TransitRoute[]> => {
    const apiKey = process.env.NEXT_PUBLIC_TRANSLINK_API_KEY;

    try {
      const response = await fetch(
        `https://api.translink.ca/rttiapi/v1/plan?` +
          `from=${start.lat},${start.lng}&` +
          `to=${end.lat},${end.lng}&` +
          `apikey=${apiKey}`
      );

      if (response.ok) {
        await response.json();
        return parseTransLinkResponse();
      }
    } catch (error) {
      console.error("TransLink API error:", error);
    }

    return [];
  };

  const enhanceWithRealtimeData = async (
    routes: TransitRoute[],
    gtfsData: GTFSRealtimeData
  ): Promise<TransitRoute[]> => {
    return routes.map((route) => {
      const enhancedLegs = route.legs.map((leg) => {
        if (leg.mode === "WALK") return leg;

        const tripUpdate = gtfsData.tripUpdates.find(
          (update: GTFSTripUpdate) => update.trip?.trip_id === leg.tripId
        );

        const alerts = gtfsData.serviceAlerts
          .filter((alert: GTFSServiceAlert) =>
            alert.informed_entity?.some(
              (entity) => entity.route_id === leg.routeId
            )
          )
          .map(
            (alert: GTFSServiceAlert) =>
              alert.header_text?.translation?.[0]?.text
          )
          .filter((text): text is string => Boolean(text));

        let delay = 0;
        if (tripUpdate?.stop_time_update) {
          const stopUpdate = tripUpdate.stop_time_update.find(
            (update) => update.stop_id === leg.from.stopId
          );
          delay = stopUpdate?.departure?.delay || 0;
        }

        return {
          ...leg,
          delay: delay / 60, // 초를 분으로 변환
          alerts: alerts.length > 0 ? alerts : undefined,
        };
      });

      return {
        ...route,
        legs: enhancedLegs,
        realtime: true,
      };
    });
  };

  const getEnhancedMockVancouverTransit = async (
    start: RoutePoint,
    end: RoutePoint
  ): Promise<TransitRoute[]> => {
    const isVancouverArea = (lat: number, lng: number) => {
      return lat >= 49.0 && lat <= 49.4 && lng >= -123.3 && lng <= -122.8;
    };

    if (
      !isVancouverArea(start.lat, start.lng) ||
      !isVancouverArea(end.lat, end.lng)
    ) {
      throw new Error("Vancouver 지역이 아닙니다.");
    }

    const distance = calculateDistance(start.lat, start.lng, end.lat, end.lng);

    const transitOptions = [
      {
        condition: () => distance > 8,
        routes: [
          {
            mode: "SUBWAY" as const,
            route: "Expo Line",
            routeColor: "#0072CE",
            routeId: "EXPO",
            stations: [
              "King George",
              "Surrey Central",
              "Scott Road",
              "Gateway",
              "New Westminster",
              "Columbia",
              "Sapperton",
              "Braid",
              "Lougheed Town Centre",
              "Production Way-University",
              "Lake City Way",
              "Sperling-Burnaby Lake",
              "Holdom",
              "Brentwood Town Centre",
              "Gilmore",
              "Rupert",
              "Renfrew",
              "Commercial-Broadway",
              "Nanaimo",
              "29th Avenue",
              "Joyce-Collingwood",
              "Patterson",
              "Metrotown",
              "Royal Oak",
              "Edmonds",
              "22nd Street",
              "New Westminster",
              "Columbia",
              "Stadium-Chinatown",
              "Main Street-Science World",
              "Commercial-Broadway",
              "Granville",
              "Burrard",
              "Waterfront",
            ],
          },
          {
            mode: "SUBWAY" as const,
            route: "Millennium Line",
            routeColor: "#FFD700",
            routeId: "MILL",
            stations: [
              "VCC-Clark",
              "Commercial-Broadway",
              "Renfrew",
              "Rupert",
              "Gilmore",
              "Brentwood Town Centre",
              "Holdom",
              "Sperling-Burnaby Lake",
              "Lake City Way",
              "Production Way-University",
              "Lougheed Town Centre",
            ],
          },
          {
            mode: "SUBWAY" as const,
            route: "Canada Line",
            routeColor: "#009AC8",
            routeId: "CANADA",
            stations: [
              "Waterfront",
              "Vancouver City Centre",
              "Yaletown-Roundhouse",
              "Olympic Village",
              "Broadway-City Hall",
              "King Edward",
              "Oakridge-41st Avenue",
              "Langara-49th Avenue",
              "Marine Drive",
              "Bridgeport",
              "Aberdeen",
              "Lansdowne",
              "Richmond-Brighouse",
              "Templeton",
              "Sea Island Centre",
              "YVR-Airport",
            ],
          },
        ],
      },
      {
        condition: () => distance <= 15,
        routes: [
          {
            mode: "BUS" as const,
            route: "99 B-Line",
            routeColor: "#FF6B35",
            routeId: "99",
            description: "UBC - Commercial-Broadway",
          },
          {
            mode: "BUS" as const,
            route: "R4 41st Ave",
            routeColor: "#0072CE",
            routeId: "R4",
            description: "UBC - Joyce Station",
          },
          {
            mode: "BUS" as const,
            route: "20 Victoria/Downtown",
            routeColor: "#00A651",
            routeId: "20",
            description: "Victoria Dr - Downtown",
          },
          {
            mode: "BUS" as const,
            route: "25 Brentwood Station/UBC",
            routeColor: "#FF6B35",
            routeId: "25",
            description: "Brentwood - UBC",
          },
        ],
      },
    ];

    const selectedOption =
      transitOptions.find((option) => option.condition()) || transitOptions[1];
    const selectedRoute =
      selectedOption.routes[
        Math.floor(Math.random() * selectedOption.routes.length)
      ];

    const mockLegs: TransitLeg[] = [
      {
        mode: "WALK",
        from: { name: start.title, lat: start.lat, lng: start.lng },
        to: {
          name: `${selectedRoute.route} 정류장`,
          lat: start.lat + 0.001,
          lng: start.lng + 0.001,
          stopId: "STOP_001",
        },
        duration: Math.random() * 3 + 2, // 2-5분
        distance: 0.1 + Math.random() * 0.2,
        instructions: `${selectedRoute.route} 정류장까지 도보`,
      },
      {
        ...selectedRoute,
        from: {
          name: `${selectedRoute.route} 출발 정류장`,
          lat: start.lat + 0.001,
          lng: start.lng + 0.001,
          stopId: "STOP_001",
        },
        to: {
          name: `${selectedRoute.route} 도착 정류장`,
          lat: end.lat - 0.001,
          lng: end.lng - 0.001,
          stopId: "STOP_002",
        },
        duration: Math.max(
          10,
          distance * (selectedRoute.mode === "SUBWAY" ? 2 : 3)
        ),
        distance: distance * 0.9,
        departureTime: generateDepartureTime(),
        arrivalTime: generateArrivalTime(),
        tripId: `TRIP_${Math.floor(Math.random() * 1000)}`,
        delay: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0, // 30% 확률로 지연
        alerts:
          Math.random() > 0.8
            ? [`${selectedRoute.route} 노선에 경미한 지연이 있습니다.`]
            : undefined,
      },
      {
        mode: "WALK",
        from: {
          name: `${selectedRoute.route} 정류장`,
          lat: end.lat - 0.001,
          lng: end.lng - 0.001,
        },
        to: { name: end.title, lat: end.lat, lng: end.lng },
        duration: Math.random() * 3 + 2,
        distance: 0.1 + Math.random() * 0.2,
        instructions: "정류장에서 목적지까지 도보",
      },
    ];

    const totalDuration = mockLegs.reduce((sum, leg) => sum + leg.duration, 0);
    const totalDistance = mockLegs.reduce((sum, leg) => sum + leg.distance, 0);

    const calculateFare = () => {
      if (selectedRoute.mode === "SUBWAY") {
        if (distance <= 5) return 3.75; // 1 Zone
        if (distance <= 15) return 5.5; // 2 Zone
        return 7.25; // 3 Zone
      }
      return 3.75; // 버스 기본 요금
    };

    return [
      {
        legs: mockLegs,
        duration: totalDuration,
        distance: totalDistance,
        fare: calculateFare(),
        transfers: mockLegs.filter((leg) => leg.mode !== "WALK").length - 1,
        realtime: true,
      },
    ];
  };

  const getMockVancouverTransit = async (
    start: RoutePoint,
    end: RoutePoint
  ): Promise<TransitRoute[]> => {
    return getEnhancedMockVancouverTransit(start, end);
  };

  const parseTransLinkResponse = (): TransitRoute[] => {
    return [];
  };

  const generateDepartureTime = (): string => {
    const now = new Date();
    const departure = new Date(now.getTime() + Math.random() * 20 * 60000); // 0-20분 후
    return departure.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const generateArrivalTime = (): string => {
    const now = new Date();
    const arrival = new Date(now.getTime() + (20 + Math.random() * 40) * 60000); // 20-60분 후
    return arrival.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 대중교통 경로를 지도에 그리기 (기존 함수 업데이트)
  const drawTransitRoute = (route: TransitRoute) => {
    // 기존 경로 제거
    map.eachLayer((layer) => {
      if (
        layer instanceof L.Polyline &&
        layer.options.className === "transit-line"
      ) {
        map.removeLayer(layer);
      }
      if (
        layer instanceof L.Marker &&
        layer.options.icon?.options?.className === "transit-stop"
      ) {
        map.removeLayer(layer);
      }
    });

    route.legs.forEach((leg) => {
      const color = getTransitColor(leg.mode, leg.routeColor);
      const style = getTransitStyle(leg.mode);

      L.polyline(
        [
          [leg.from.lat, leg.from.lng],
          [leg.to.lat, leg.to.lng],
        ],
        {
          color: color,
          weight: style.weight,
          opacity: 0.8,
          dashArray: style.dashArray,
          className: "transit-line",
        }
      ).addTo(map);

      // 정류장 마커 추가 (실시간 정보 포함)
      if (leg.mode !== "WALK") {
        const icon = getTransitIcon(leg.mode, leg.delay);

        const popupContent = `
          <div>
            <strong>${leg.route} - ${leg.from.name}</strong><br/>
            ${leg.departureTime ? `출발: ${leg.departureTime}` : ""}<br/>
            ${
              leg.delay && leg.delay > 0
                ? `⚠️ ${leg.delay}분 지연`
                : "✅ 정시 운행"
            }<br/>
            ${leg.alerts ? `📢 ${leg.alerts.join(", ")}` : ""}
          </div>
        `;

        L.marker([leg.from.lat, leg.from.lng], {
          icon,
          // @ts-expect-error - Leaflet marker options can accept className
          className: "transit-stop",
        })
          .bindPopup(popupContent)
          .addTo(map);
      }
    });

    // 경로에 맞게 지도 범위 조정
    const allPoints = route.legs.flatMap((leg) => [
      [leg.from.lat, leg.from.lng],
      [leg.to.lat, leg.to.lng],
    ]);
    const bounds = L.latLngBounds(allPoints as [number, number][]);
    map.fitBounds(bounds, { padding: [20, 20] });
  };

  // 개선된 아이콘 생성 (지연 정보 포함)
  const getTransitIcon = (mode: string, delay?: number) => {
    const iconHtml =
      mode === "BUS"
        ? "🚌"
        : mode === "SUBWAY"
        ? "🚇"
        : mode === "SEABUS"
        ? "⛴️"
        : "🚊";
    const backgroundColor = delay && delay > 0 ? "#ff9999" : "white";
    const borderColor = delay && delay > 0 ? "#ff0000" : "#333";

    return L.divIcon({
      html: `<div style="
        background: ${backgroundColor};
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${borderColor};
        font-size: 16px;
        position: relative;
      ">
        ${iconHtml}
        ${
          delay && delay > 0
            ? `<div style="
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: white;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">!</div>`
            : ""
        }
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: "transit-stop",
    });
  };

  const getTransitColor = (mode: string, routeColor?: string) => {
    if (routeColor)
      return routeColor.startsWith("#") ? routeColor : `#${routeColor}`;

    switch (mode) {
      case "BUS":
        return "#FF6B35";
      case "SUBWAY":
        return "#0072CE";
      case "RAIL":
        return "#00A651";
      case "SEABUS":
        return "#0088CC";
      default:
        return "#666666";
    }
  };

  const getTransitStyle = (mode: string) => {
    switch (mode) {
      case "WALK":
        return { weight: 3, dashArray: "5, 5" };
      case "BUS":
        return { weight: 6, dashArray: undefined };
      case "SUBWAY":
        return { weight: 8, dashArray: undefined };
      case "SEABUS":
        return { weight: 6, dashArray: "10, 5" };
      default:
        return { weight: 4, dashArray: undefined };
    }
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return null;
}

export type { TransitLeg, TransitRoute };

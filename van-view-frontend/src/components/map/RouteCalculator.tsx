"use client";
import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export type RouteProfile = 'driving' | 'walking' | 'cycling';

export interface RoutePoint {
  lat: number;
  lng: number;
  title: string;
}

export interface RouteSegment {
  distance: number;
  duration: number;
  from: string;
  to: string;
}

interface RouteCalculatorProps {
  waypoints: RoutePoint[];
  profile: RouteProfile;
  onWaypointsChange?: (waypoints: RoutePoint[]) => void;
  onRouteCalculated?: (
    totalDistance: number, 
    totalDuration: number, 
    segments: RouteSegment[]
  ) => void;
  onError?: (error: string) => void;
}

export default function RouteCalculator({ 
  waypoints,
  profile,
  onRouteCalculated,
  onError
}: RouteCalculatorProps) {
  const map = useMap();

  useEffect(() => {
    if (waypoints.length < 2) return;

    const calculateMultiRoute = async () => {
      try {
        // 기존 경로 제거
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline && (
            layer.options.className === 'route-line' || 
            layer.options.className === 'waypoint-line'
          )) {
            map.removeLayer(layer);
          }
          // 기존 웨이포인트 마커 제거
          if (layer instanceof L.Marker && 
              layer.options.icon && 
              (layer.options.icon as any).options?.className?.includes('waypoint-marker')) {
            map.removeLayer(layer);
          }
        });

        // 모든 웨이포인트를 하나의 요청으로 처리
        const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true&annotations=true`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const routeCoordinates = route.geometry.coordinates;
          
          // 전체 경로 그리기
          const latlngs = routeCoordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          
          const colors = {
            driving: '#3B82F6',
            walking: '#10B981',
            cycling: '#F59E0B'
          };

          // 전체 경로 라인
          const mainPolyline = L.polyline(latlngs, {
            color: colors[profile],
            weight: 6,
            opacity: 0.8,
            className: 'route-line'
          }).addTo(map);

          // 구간별 정보 계산
          const segments: RouteSegment[] = [];
          const legs = route.legs || [];
          
          legs.forEach((leg: any, index: number) => {
            segments.push({
              distance: leg.distance / 1000, // km
              duration: leg.duration / 60,   // minutes
              from: waypoints[index].title,
              to: waypoints[index + 1].title
            });
          });

          // 웨이포인트 번호 표시
          waypoints.forEach((waypoint, index) => {
            const isStart = index === 0;
            const isEnd = index === waypoints.length - 1;
            
            let markerHtml = '';
            if (isStart) {
              markerHtml = `
                <div style="
                  background: #10B981;
                  color: white;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 3px solid white;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">🚩</div>
              `;
            } else if (isEnd) {
              markerHtml = `
                <div style="
                  background: #EF4444;
                  color: white;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 3px solid white;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">🏁</div>
              `;
            } else {
              markerHtml = `
                <div style="
                  background: #3B82F6;
                  color: white;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 12px;
                  border: 3px solid white;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">${index}</div>
              `;
            }

            const waypointMarker = L.divIcon({
              html: markerHtml,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              className: 'waypoint-marker'
            });

            L.marker([waypoint.lat, waypoint.lng], { 
              icon: waypointMarker,
              // @ts-ignore
              className: 'route-waypoint-marker'
            }).addTo(map);
          });

          // 지도 범위 조정
          const bounds = mainPolyline.getBounds();
          map.fitBounds(bounds, { padding: [20, 20] });

          // 총 거리와 시간 계산
          const totalDistance = route.distance / 1000;
          const totalDuration = route.duration / 60;
          
          onRouteCalculated?.(totalDistance, totalDuration, segments);
        } else {
          throw new Error('경로를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('경로 계산 오류:', error);
        
        // API 실패 시 직선 거리로 대체
        let totalDistance = 0;
        const segments: RouteSegment[] = [];
        
        for (let i = 0; i < waypoints.length - 1; i++) {
          const start = waypoints[i];
          const end = waypoints[i + 1];
          
          // 직선 거리 계산
          const distance = map.distance([start.lat, start.lng], [end.lat, end.lng]) / 1000;
          totalDistance += distance;
          
          // 도보 평균 속도 5km/h로 시간 계산
          const duration = profile === 'walking' ? (distance / 5) * 60 :
                          profile === 'cycling' ? (distance / 15) * 60 :
                          (distance / 50) * 60;
          
          segments.push({
            distance,
            duration,
            from: start.title,
            to: end.title
          });
          
          // 직선 그리기
          L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
            color: '#EF4444',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10',
            className: 'route-line'
          }).addTo(map);
        }
        
        // 웨이포인트 마커 표시 (실패 시에도)
        waypoints.forEach((waypoint, index) => {
          const isStart = index === 0;
          const isEnd = index === waypoints.length - 1;
          
          let color = '#6B7280';
          let emoji = index.toString();
          
          if (isStart) {
            color = '#10B981';
            emoji = '🚩';
          } else if (isEnd) {
            color = '#EF4444';
            emoji = '🏁';
          }
          
          const markerHtml = `
            <div style="
              background: ${color};
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${isStart || isEnd ? '14px' : '12px'};
              border: 3px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">${emoji}</div>
          `;

          const waypointMarker = L.divIcon({
            html: markerHtml,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            className: 'waypoint-marker'
          });

          L.marker([waypoint.lat, waypoint.lng], { 
            icon: waypointMarker,
            // @ts-ignore
            className: 'route-waypoint-marker'
          }).addTo(map);
        });
        
        const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
        onRouteCalculated?.(totalDistance, totalDuration, segments);
        onError?.('정확한 경로를 찾을 수 없어 직선 거리로 표시합니다.');
      }
    };

    calculateMultiRoute();

    // 클린업
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline && (
          layer.options.className === 'route-line' || 
          layer.options.className === 'waypoint-line'
        )) {
          map.removeLayer(layer);
        }
        // 웨이포인트 마커 제거
        if (layer instanceof L.Marker && 
            layer.options.icon && 
            (layer.options.icon as any).options?.className?.includes('waypoint-marker')) {
          map.removeLayer(layer);
        }
      });
    };
  }, [waypoints, profile, map, onRouteCalculated, onError]);

  return null;
}
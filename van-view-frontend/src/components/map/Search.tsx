"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

// Props 타입 정의
interface Post {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  content: string;
}

interface SearchControlProps {
  posts: Post[];
  onLocationSelect?: (lat: number, lng: number, title: string) => void;
  onSearchQueryChange?: (query: string) => void;
  className?: string;
}

export default function SearchControl({
  posts,
  onLocationSelect,
  onSearchQueryChange,
  className = "",
}: SearchControlProps) {
  const [query, setQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 포스트 필터링
  useEffect(() => {
    if (query.length > 0) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredPosts([]);
      setShowDropdown(false);
    }
  }, [query, posts]);

  // 쿼리 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onSearchQueryChange?.(query);
  }, [query, onSearchQueryChange]);

  // Nominatim API를 사용한 주소 검색
  const searchAddress = async (address: string) => {
    if (!address.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=5`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        onLocationSelect?.(parseFloat(lat), parseFloat(lon), display_name);
        setQuery(display_name);
        setShowDropdown(false);
      } else {
        alert("검색 결과를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("주소 검색 오류:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 포스트 선택 처리
  const handlePostSelect = (post: Post) => {
    onLocationSelect?.(post.latitude, post.longitude, post.title);
    setQuery(post.title);
    setShowDropdown(false);
  };

  // 검색 실행
  const handleSearch = () => {
    if (filteredPosts.length === 0) {
      // 주소 검색
      searchAddress(query);
    } else {
      // 첫 번째 포스트 선택
      handlePostSelect(filteredPosts[0]);
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 검색 입력창 */}
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="장소나 주소를 검색하세요..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg shadow-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 검색 결과 드롭다운 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[1001]">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostSelect(post)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{post.title}</div>
              <div className="text-sm text-gray-600 truncate">
                {post.content}
              </div>
            </div>
          ))}

          {/* 주소 검색 옵션 */}
          {query && filteredPosts.length === 0 && (
            <div
              onClick={handleSearch}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b-0 text-blue-600 transition-colors"
            >
              <div className="font-medium flex items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4" />"{query}" 주소 검색
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 타입 export
export type { Post as SearchPost };

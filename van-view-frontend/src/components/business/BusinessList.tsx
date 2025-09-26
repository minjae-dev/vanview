"use client";

import { useEffect, useState } from "react";
import BusinessCard from "./BusinessCard";

export interface BusinessLicense {
  folderyear: string;
  licencersn: string;
  licencenumber: string;
  licencerevisionnumber: string;
  businessname: string;
  businesstradename: string | null;
  status: string;
  issueddate: string;
  expireddate: string;
  businesstype: string;
  businesssubtype: string | null;
  unit: string | null;
  unittype: string | null;
  house: string | null;
  street: string | null;
  city: string;
  province: string;
  country: string;
  postalcode: string | null;
  localarea: string;
  numberofemployees: number;
  feepaid: string | null;
  extractdate: string;
  geom: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: object;
  } | null;
  geo_point_2d: {
    lat: number;
    lon: number;
  } | null;
}

interface BusinessListProps {
  businesses: BusinessLicense[];
  isLoading?: boolean;
  error?: string | null;
}

type ViewMode = "detailed" | "compact" | "minimal";

export default function BusinessList({
  businesses,
  isLoading = false,
  error = null,
}: BusinessListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [filteredBusinesses, setFilteredBusinesses] =
    useState<BusinessLicense[]>(businesses);
  const [searchTerm, setSearchTerm] = useState("");

  // businesses prop이 변경될 때마다 filteredBusinesses 업데이트
  useEffect(() => {
    setFilteredBusinesses(businesses);
  }, [businesses]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter(
        (business) =>
          business.businessname.toLowerCase().includes(term.toLowerCase()) ||
          business.businesstradename
            ?.toLowerCase()
            .includes(term.toLowerCase()) ||
          business.localarea.toLowerCase().includes(term.toLowerCase()) ||
          business.businesstype.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "minimal":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case "compact":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "detailed":
      default:
        return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            데이터 로드 실패
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vancouver Business Directory
        </h1>
        <p className="text-gray-600">
          Browse {businesses.length} licensed businesses in Vancouver
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search businesses, areas, or types..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: "detailed" as const, label: "Detailed", icon: "📋" },
              { key: "compact" as const, label: "Compact", icon: "📇" },
              { key: "minimal" as const, label: "Minimal", icon: "📄" },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredBusinesses.length} of {businesses.length}{" "}
            businesses
          </span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-100 rounded-full mr-1"></span>
              Active:{" "}
              {filteredBusinesses.filter((b) => b.status === "Issued").length}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-blue-100 rounded-full mr-1"></span>
              With Location:{" "}
              {filteredBusinesses.filter((b) => b.geo_point_2d).length}
            </span>
          </div>
        </div>
      </div>

      {/* Business Grid */}
      <div className={`grid ${getGridClass()} gap-6`}>
        {filteredBusinesses.map((business) => (
          <BusinessCard
            key={business.licencersn}
            business={business}
            variant={viewMode}
            showActions={viewMode === "detailed"}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBusinesses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No businesses found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => handleSearch("")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Footer Stats */}
      {businesses.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {businesses.length}
              </div>
              <div className="text-sm text-gray-600">Total Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {businesses.filter((b) => b.status === "Issued").length}
              </div>
              <div className="text-sm text-gray-600">Active Licenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {businesses.reduce((sum, b) => sum + b.numberofemployees, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(businesses.map((b) => b.localarea)).size}
              </div>
              <div className="text-sm text-gray-600">Areas Covered</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

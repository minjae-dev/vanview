import React from 'react';
import { BusinessLicense } from './BusinessList';

interface BusinessCardProps {
  business: BusinessLicense;
  variant?: 'detailed' | 'compact' | 'minimal';
  showActions?: boolean;
  onViewDetails?: (business: BusinessLicense) => void;
  onViewOnMap?: (business: BusinessLicense) => void;
}

export default function BusinessCard({
  business,
  variant = 'detailed',
  showActions = true,
  onViewDetails,
  onViewOnMap,
}: BusinessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issued':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = () => {
    const parts = [
      business.unit,
      business.house,
      business.street,
      business.city,
      business.postalcode,
    ].filter(Boolean);
    return parts.join(' ');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Minimal variant - 가장 간단한 카드
  if (variant === 'minimal') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
              {business.businesstradename || business.businessname}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {business.businesstype}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {business.localarea}
            </p>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(business.status)}`}>
            {business.status}
          </span>
        </div>
      </div>
    );
  }

  // Compact variant - 중간 크기 카드
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
              {business.businesstradename || business.businessname}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {business.businesstype}
              {business.businesssubtype && ` • ${business.businesssubtype}`}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(business.status)}`}>
            {business.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{business.localarea}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{business.numberofemployees} employees</span>
          </div>
        </div>

        {showActions && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onViewDetails?.(business)}
              className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Details
            </button>
            {business.geo_point_2d && (
              <button
                onClick={() => onViewOnMap?.(business)}
                className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Map
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed variant - 가장 상세한 카드 (기본값)
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {business.businesstradename || business.businessname}
            </h3>
            {business.businesstradename && business.businessname !== business.businesstradename && (
              <p className="text-sm text-gray-600 mb-2">
                Legal Name: {business.businessname}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">
                {business.businesstype}
              </span>
              {business.businesssubtype && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {business.businesssubtype}
                  </span>
                </>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(business.status)}`}>
            {business.status}
          </span>
        </div>

        {/* License Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">License #:</span>
            <span className="ml-2 font-mono">{business.licencenumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Employees:</span>
            <span className="ml-2 font-semibold">{business.numberofemployees}</span>
          </div>
          <div>
            <span className="text-gray-500">Issued:</span>
            <span className="ml-2">{formatDate(business.issueddate)}</span>
          </div>
          <div>
            <span className="text-gray-500">Expires:</span>
            <span className="ml-2">{formatDate(business.expireddate)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                {formatAddress() || 'Address not available'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {business.localarea}, {business.city}, {business.province}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {business.localarea}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {business.folderyear}
          </span>
          {business.geo_point_2d && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              📍 Location Available
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails?.(business)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
            {business.geo_point_2d ? (
              <button
                onClick={() => onViewOnMap?.(business)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                View on Map
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                No Location
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
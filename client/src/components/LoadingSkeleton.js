import React from 'react';

const LoadingSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-[12px] h-4"></div>
  </div>
);

export const FreelancerCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
    <div className="flex flex-wrap gap-2 mb-8">
      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
      <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-12 bg-gray-200 rounded-lg"></div>
  </div>
);

export const BookingSkeleton = () => (
  <div className="card p-6">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
    <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
    <div className="flex gap-4 h-10 bg-gray-200 rounded-lg w-full"></div>
  </div>
);

export default LoadingSkeleton;

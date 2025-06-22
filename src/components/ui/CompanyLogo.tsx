'use client';

import React, { useState } from 'react';
import { getCompanyLogo, getLogoFallback } from '@/utils/companyLogos';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  companySlug: string;
  companyName: string;
  size?: number;
  className?: string;
  showName?: boolean;
  variant?: 'circle' | 'square' | 'rounded';
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companySlug,
  companyName,
  size = 32,
  className = '',
  showName = false,
  variant = 'rounded',
}) => {
  const [logoError, setLogoError] = useState(false);
  const [loading, setLoading] = useState(true);

  const logoUrl = logoError
    ? getLogoFallback(companySlug, size)
    : getCompanyLogo(companySlug, size);

  const getVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-md';
    }
  };

  const handleImageError = () => {
    setLogoError(true);
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`relative overflow-hidden ${getVariantClasses()} bg-gray-100`}
        style={{ width: size, height: size }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Building2
              size={size * 0.5}
              className="animate-pulse text-gray-400"
            />
          </div>
        )}

        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          width={size}
          height={size}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>

      {showName && (
        <span className="truncate text-sm font-medium text-gray-900">
          {companyName}
        </span>
      )}
    </div>
  );
};

export default CompanyLogo;

'use client';

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Tool } from '@/types/tool';
import FavoritesButton from './Favorites/FavoritesButton';
import ComparisonButton from './Comparison/ComparisonButton';

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  className = ''
}) => {
  // Return null or a placeholder if tool is undefined
  if (!tool) {
    console.warn('ToolCard received undefined tool prop');
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const {
    name,
    category,
    subcategory,
    rating = 0,
    description,
    pricing,
    tags = [],
    url,
    logo,
    favicon
  } = tool;
  const categorySlug = category?.toLowerCase().replace(/\s+/g, "-") || '';
  const subcategorySlug = subcategory?.toLowerCase().replace(/\s+/g, "-") || "";
  const toolSlug = name.toLowerCase().replace(/\s+/g, "-");
  const toolId = tool.id || toolSlug; // Use provided ID or generate from name
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-slate-700/90 transition-all duration-300 transform hover:scale-[1.02] h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              {logo ? (
                <div className="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <Image
                    src={logo}
                    alt={name}
                    width={32}
                    height={32}
                    className="object-contain p-1"
                    unoptimized={logo.startsWith('http')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-logo.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{name}</h3>
                {category && (
                  <span className="text-xs text-gray-300">{category}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Interactive buttons temporarily removed for server component compatibility */}
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
            {pricing}
          </span>
          {tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-white/10 text-gray-200 text-xs font-medium rounded-full hover:bg-white/20 transition-colors truncate max-w-[100px]"
              title={tag}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full">
              +{tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {rating > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-200">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
          <Link 
            href={`/tools/${toolId}`}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
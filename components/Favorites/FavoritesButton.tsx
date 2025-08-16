'use client';

import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Tool } from '@/types/tool';
import useFavorites from '@/hooks/useFavorites';

interface FavoritesButtonProps {
  tool: Tool;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const FavoritesButton = ({
  tool,
  size = 'md',
  showLabel = true,
  className = ''
}: FavoritesButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isClient, setIsClient] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const sizeClasses: { [key: string]: string } = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconClasses: { [key: string]: string } = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setIsFavorited(isFavorite(tool.id));
  }, [isFavorite, tool.id]);

  if (!isClient) {
    return (
      <button 
        className={`inline-flex items-center ${sizeClasses[size]} ${className}`}
        disabled
      >
        <FaRegHeart className={iconClasses[size]} />
        {showLabel && <span className="ml-2">Save</span>}
      </button>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
    setIsFavorited(!isFavorited);
  };



  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center ${sizeClasses[size]} ${
        isFavorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-red-500'
      } transition-colors ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <FaHeart className={`${iconClasses[size]} fill-current`} />
      ) : (
        <FaRegHeart className={`${iconClasses[size]} fill-current`} />
      )}
      {showLabel && (
        <span className="ml-2">
          {isFavorited ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default FavoritesButton;

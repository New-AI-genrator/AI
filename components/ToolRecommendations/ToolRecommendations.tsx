'use client';

import { useState, useEffect } from 'react';
import { Tool } from '@/types/tool';
import Link from 'next/link';
import { FaArrowRight, FaRandom } from 'react-icons/fa';

interface ToolRecommendationsProps {
  currentToolId?: string;
  category?: string;
  tags?: string[];
  allTools: Tool[];
  maxTools?: number;
}

const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({
  currentToolId,
  category,
  tags = [],
  allTools,
  maxTools = 3
}) => {
  const [recommendedTools, setRecommendedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Filter out the current tool
    let tools = allTools.filter(tool => tool.id !== currentToolId);
    
    // If category is provided, filter by category
    if (category) {
      tools = tools.filter(tool => 
        tool.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // If tags are provided, sort by tag matches
    if (tags.length > 0) {
      tools = tools.sort((a, b) => {
        const aMatches = a.tags.filter(tag => tags.includes(tag)).length;
        const bMatches = b.tags.filter(tag => tags.includes(tag)).length;
        return bMatches - aMatches;
      });
    }
    
    // Take top N tools
    const selectedTools = tools.slice(0, maxTools);
    
    // If we don't have enough tools, fill with random ones
    if (selectedTools.length < maxTools) {
      const remaining = allTools
        .filter(tool => 
          !selectedTools.some(selected => selected.id === tool.id) && 
          tool.id !== currentToolId
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, maxTools - selectedTools.length);
      
      selectedTools.push(...remaining);
    }
    
    setRecommendedTools(selectedTools);
    setIsLoading(false);
  }, [currentToolId, category, tags, allTools, maxTools]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (recommendedTools.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {category ? 'Similar Tools' : 'Recommended Tools'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedTools.map((tool) => (
          <div 
            key={tool.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                {tool.logo && (
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
                    <img 
                      src={tool.logo} 
                      alt={`${tool.name} logo`} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder-logo.svg';
                      }}
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {tool.pricing}
                </span>
                <Link 
                  href={`/tools/${tool.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                >
                  View Tool <FaArrowRight className="ml-1" size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolRecommendations;

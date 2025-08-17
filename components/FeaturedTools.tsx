import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Tool } from '@/types/tool';

interface FeaturedToolsProps {
  tools?: Tool[];
  className?: string;
}

const defaultTools: Tool[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced language model with improved capabilities',
    category: 'Text Generation',
    subcategory: 'Language Models',
    url: 'https://openai.com/gpt-4',
    pricing: 'Paid',
    tags: ['ai', 'language-model', 'text-generation', 'popular'],
    rating: 4.8,
    favicon: 'https://openai.com/favicon.ico'
  },
  {
    id: 'dalle-3',
    name: 'DALL·E 3',
    description: 'Create realistic images from text descriptions',
    category: 'Image Generation',
    subcategory: 'Text-to-Image',
    url: 'https://openai.com/dall-e-3',
    pricing: 'Paid',
    tags: ['ai', 'image-generation', 'art', 'new'],
    rating: 4.7,
    favicon: 'https://openai.com/favicon.ico'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write better code',
    category: 'Developer Tools',
    subcategory: 'Code Assistant',
    url: 'https://github.com/features/copilot',
    pricing: 'Paid',
    tags: ['ai', 'developer-tools', 'programming', 'popular'],
    rating: 4.6,
    favicon: 'https://github.com/favicon.ico'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI-powered workspace for notes, docs, and tasks',
    category: 'Productivity',
    subcategory: 'Workspace',
    url: 'https://www.notion.so/product/ai',
    pricing: 'Freemium',
    tags: ['productivity', 'notes', 'ai', 'new'],
    rating: 4.5,
    favicon: 'https://www.notion.so/favicon.ico'
  }
];

const FeaturedTools: React.FC<FeaturedToolsProps> = ({ tools = defaultTools, className = '' }) => {
  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Featured AI Tools
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Discover the most popular and powerful AI tools available today
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {tool.favicon && (
                          <div className="w-6 h-6 flex-shrink-0">
                            <Image
                              src={tool.favicon}
                              alt={`${tool.name} logo`}
                              width={24}
                              height={24}
                              className="rounded"
                              onError={(e) => {
                                // Fallback to a default icon if favicon fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzR1NWE5ZSIgZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMiA2Yy0zLjMxNCAwLTYgMi42ODYtNiA2czIuNjg2IDYgNiA2IDYtMi42ODYgNi02LTIuNjg2LTYtNi02em0wIDJjMi4yMDYgMCA0IDEuNzk0IDQgNCAwIDIuMjA2LTEuNzk0IDQtNCA0LTQgMC0yLjIwNiAxLjc5NC00IDQtNHoiLz48L3N2Zz4=';
                              }}
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                      </div>
                      
                      {tool.tags?.includes('new') && (
                        <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {tool.category}
                        </span>
                        
                        {tool.rating && (
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                              {tool.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {tool.tags?.includes('popular') && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Popular
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;

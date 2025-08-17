import React from 'react';
import Link from 'next/link';
import { Category } from '../types';

interface CategoriesSectionProps {
  categories: Category[];
}

const defaultCategories: Category[] = [
  {
    id: 'text-generation',
    name: 'Text Generation',
    description: 'AI tools for generating human-like text',
    icon: '✍️',
    count: 42
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Create stunning visuals with AI',
    icon: '🖼️',
    count: 36
  },
  {
    id: 'code-assistance',
    name: 'Code Assistance',
    description: 'AI-powered coding helpers',
    icon: '💻',
    count: 28
  },
  {
    id: 'audio-processing',
    name: 'Audio Processing',
    description: 'Voice synthesis and analysis tools',
    icon: '🎵',
    count: 15
  }
];

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find the perfect AI tool for your needs
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="pt-6 pb-8 px-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-2 text-base text-gray-500">{category.description}</p>
                <div className="mt-4 text-sm text-indigo-600">
                  {category.count} tools →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link 
              href="/categories" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
            >
              View all categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;

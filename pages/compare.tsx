import { useState } from "react";
import Head from "next/head";
import { tools } from "../data/tools";
import { categories } from "../data/categories";
import Image from "next/image";

export default function ComparePage() {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  const filteredTools = tools.filter((tool) => {
    if (selectedCategory && tool.category !== selectedCategory) return false;
    if (selectedSubcategory && tool.subcategory !== selectedSubcategory) return false;
    return true;
  });

  const addTool = (toolName: string) => {
    if (!selectedTools.includes(toolName) && selectedTools.length < 4) {
      setSelectedTools([...selectedTools, toolName]);
    }
  };

  const removeTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter((t) => t !== toolName));
  };

  const selectedToolData = tools.filter((tool) => selectedTools.includes(tool.name));

  return (
    <>
      <Head>
        <title>Compare AI Tools | AI Tools Directory</title>
        <meta name="description" content="Compare AI tools side by side to find the best solution for your needs." />
      </Head>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Compare AI Tools
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Compare up to 4 AI tools side by side to find the perfect solution for your needs.
            </p>
          </div>

          {/* Tool Selection */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Select Tools to Compare</h2>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                  }}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                >
                  <option value="">All Subcategories</option>
                  {selectedCategory && categories.find(c => c.name === selectedCategory)?.subcategories?.map((sub) => (
                    <option key={sub.name} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {/* Tool Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedTools.includes(tool.name)
                        ? "bg-blue-500/20 border-blue-400"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                    onClick={() => addTool(tool.name)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={tool.favicon || "/favicon.ico"}
                        alt={tool.name + " favicon"}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{tool.name}</h3>
                        <p className="text-sm text-gray-300">{tool.category} • {tool.subcategory}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400 text-sm">★ {tool.rating}</span>
                          <span className="text-xs bg-blue-500/50 px-2 py-1 rounded">{tool.pricing}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          {selectedToolData.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 overflow-x-auto">
                <h2 className="text-xl font-bold mb-6">Tool Comparison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedToolData.map((tool) => (
                    <div key={tool.name} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={tool.favicon || "/favicon.ico"}
                            alt={tool.name + " favicon"}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div>
                            <h3 className="font-bold text-white">{tool.name}</h3>
                            <p className="text-sm text-gray-300">{tool.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTool(tool.name)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-400">Rating:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-semibold">{tool.rating}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-400">Pricing:</span>
                          <span className="text-white font-semibold">{tool.pricing}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-400">Category:</span>
                          <span className="text-white">{tool.subcategory}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-400">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tool.tags?.map((tag) => (
                              <span key={tag} className="text-xs bg-blue-500/30 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-400">Description:</span>
                          <p className="text-sm text-gray-300 mt-1">{tool.description}</p>
                        </div>
                        
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
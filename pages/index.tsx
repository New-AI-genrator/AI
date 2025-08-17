
import { useState, useEffect, useCallback } from "react";
import { default as NextHead } from "next/head";
import { GetStaticProps } from 'next';
import CategoryCard from "../components/CategoryCard";
import { ToolCard } from "../components/ToolCard";
import SmartSearch from "../components/SmartSearch/SmartSearch";
import type { Tool } from "../types/tool";

interface HomePageProps {
  categories: any[];
  tools: Tool[];
}

export default function HomePage({ categories = [], tools = [] }: HomePageProps) {
  const [search, setSearch] = useState("");
  const [pricing, setPricing] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState("SCANNING");
  const [toolOfDestiny, setToolOfDestiny] = useState("Augmented Reality Core");
  const [liveStats, setLiveStats] = useState({
    professionals: "4.8M+",
    toolsForged: "1,000+",
    newToolTime: "47",
    seoWeapon: "Backlink Annihilator"
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // Biometric initiation sequence
    setTimeout(() => {
      setBiometricStatus("AUTHORIZED");
      setIsLoaded(true);
    }, 2000);

    // Live stats updates
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        professionals: `${(4.8 + Math.random() * 0.1).toFixed(1)}M+`,
        newToolTime: `${Math.floor(40 + Math.random() * 20)}`
      }));
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(statsInterval);
    };
  }, []);

  // Enhanced filter function with support for natural language queries
  const filterTools = useCallback((searchQuery: string, filters: any) => {
    const q = searchQuery.toLowerCase().trim();
    
    // Extract potential filters from natural language query
    const priceKeywords = {
      free: 'Free',
      freemium: 'Freemium',
      paid: 'Paid',
      contact: 'Contact',
      'open source': 'Open Source'
    };
    
    // Check if query contains any price keywords
    const priceInQuery = Object.entries(priceKeywords).find(([key]) => 
      q.includes(key)
    )?.[1];
    
    // Check for rating in query (e.g., "4 star tools")
    const ratingMatch = q.match(/(\d+)\s*(?:star|★|⭐)/i);
    const ratingInQuery = ratingMatch ? parseInt(ratingMatch[1], 10) : null;
    
    // Extract tags from query (words starting with #)
    const tagsInQuery = q.match(/#(\w+)/g)?.map(tag => tag.slice(1).toLowerCase()) || [];
    
    return tools.filter((tool) => {
      // Apply search query
      const matchesSearch = q === '' || 
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.tags && tool.tags.some(tag => 
          tag.toLowerCase().includes(q) ||
          q.includes(tag.toLowerCase())
        ));
      
      // Apply filters from UI
      const matchesPricing = filters.pricing.length === 0 || 
        (priceInQuery ? 
          tool.pricing === priceInQuery : 
          filters.pricing.includes(tool.pricing)
        );
        
      const minRatingValue = ratingInQuery || filters.minRating;
      const matchesRating = minRatingValue === 0 || (tool.rating || 0) >= minRatingValue;
      
      const tagsToCheck = [...(filters.tags || []), ...tagsInQuery];
      const matchesTags = tagsToCheck.length === 0 || 
        (tool.tags && tagsToCheck.every(tag => 
          tool.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        ));
      
      return matchesSearch && matchesPricing && matchesRating && matchesTags;
    });
  }, []);
  
  // Filter tools based on search and filters
  const filteredTools = filterTools(search, { pricing, minRating, tags: selectedTags });

  const allTags = Array.from(new Set(tools.flatMap((tool) => tool.tags || [])));

  return (
    <>
      <NextHead>
        <title>AI Tools Directory - Digital Superorganism</title>
        <meta name="description" content="Not a Website – A Digital Superorganism. 1000+ Battle-Tested Digital Weapons - Zero Mercy Edition." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </NextHead>

      {/* Ultra-Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dynamic Mouse-Following Gradient */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 25%, rgba(236, 72, 153, 0.3) 50%, rgba(34, 197, 94, 0.3) 75%, rgba(59, 130, 246, 0.3) 100%)`,
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative z-10">
        {/* THE ASCENSION PORTAL - Biometric Initiation */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Biometric Scanner Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-2000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-blue-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👁️</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BIOMETRIC INITIATION
              </h2>
              <p className="text-xl text-gray-300 mb-8">{biometricStatus}</p>
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Hero Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            {/* Main Title with Ultra-Premium Animation */}
            <div className={`transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-shine drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(59, 130, 246, 0.8)'}}>
                  DIGITAL
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-text-shine-delayed drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(168, 85, 247, 0.8)'}}>
                  SUPERORGANISM
                </span>
              </h1>
              
              {/* Subtitle with Premium Typography */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 font-bold" style={{textShadow: '0 0 20px rgba(239, 68, 68, 0.6)'}}>Not a Website</span> – 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-bold" style={{textShadow: '0 0 20px rgba(59, 130, 246, 0.6)'}}> A Digital Superorganism</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-bold" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.6)'}}>1,000+ Battle-Tested Digital Weapons - Zero Mercy Edition</span>
              </p>

              {/* Tool of Destiny - Central Holographic Display */}
              <div className="relative max-w-4xl mx-auto mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👑</div>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" style={{textShadow: '0 0 25px rgba(251, 191, 36, 0.8)'}}>
                      TOOL OF DESTINY
                    </h3>
                    <p className="text-xl text-gray-300 mb-4">{toolOfDestiny}</p>
                    <div className="text-sm text-gray-400">Geelgrantißel Ceaocry Yeepsrtey Fe 80 oji Hodos</div>
                  </div>
                </div>
              </div>

              {/* Live Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                  { 
                    number: liveStats.professionals, 
                    label: "Professionals", 
                    icon: "⚙️",
                    subtitle: "Browting Historg:"
                  },
                  { 
                    number: liveStats.toolsForged, 
                    label: "Tools Forged", 
                    icon: "🔨",
                    subtitle: "Digital Arsenal"
                  },
                  { 
                    number: `${liveStats.newToolTime}min`, 
                    label: "New Tool Time", 
                    icon: "🚀",
                    subtitle: "Forging Speed"
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform transition-all duration-1000 hover:scale-110 hover:bg-white/20 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-gray-300">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.subtitle}</div>
                  </div>
                ))}
              </div>

              {/* Smart Search 2.0 */}
              <div className="w-full max-w-4xl mx-auto mb-12 px-4">
                <SmartSearch
                  search={search}
                  onSearchChange={setSearch}
                  onFilterChange={(filters) => {
                    setPricing(filters.pricing || []);
                    setMinRating(filters.minRating || 0);
                    setSelectedTags(filters.tags || []);
                  }}
                  allTags={allTags}
                  tools={tools}
                />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* THE DARK ARMORY - Status Management */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                THE DARK ARMORY
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Tools so powerful they require 2FA + blood sample. Auto-delete after use.
              </p>
            </div>

            {/* Status Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  STATUS MANAGEMENT
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🧠</div>
                  <div>
                    <div className="text-lg font-semibold">Most Devastating SEO Weapon</div>
                    <div className="text-gray-300">Current: {liveStats.seoWeapon}</div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-600 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI TOOL OF THE CENTURY
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🌍</div>
                  <div>
                    <div className="text-lg font-semibold">Global Activation Map</div>
                    <div className="text-gray-300">Real-time tool activations</div>
                  </div>
                </div>
                <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">🌍 Live World Map</span>
                </div>
              </div>
            </div>

            {/* VIP War Room */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
              <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                VIP WAR ROOM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">👑</div>
                  <div className="text-xl font-semibold">Platinum Members</div>
                  <div className="text-gray-300">Elite Access</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚔️</div>
                  <div className="text-xl font-semibold">Battle-Tested</div>
                  <div className="text-gray-300">Proven Results</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <div className="text-xl font-semibold">Secure Access</div>
                  <div className="text-gray-300">2FA Required</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GEFORE HALL OF TOOLS */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                GEFORE HALL OF TOOLS
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover AI tools organized across cutting-edge categories, from traditional applications to the latest quantum computing innovations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className={`transform transition-all duration-1000 hover:scale-105 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CategoryCard
                    icon={category.icon}
                    name={category.name}
                    toolCount={category.toolCount}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PSYCHOLOGICAL POWER ZONES */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                PSYCHOLOGICAL POWER ZONES
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Handpicked AI tools that are revolutionizing industries and transforming the way we work.
              </p>
            </div>

            {/* Premium Filters */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-12">
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>

                <div className="flex gap-2">
                  {["Free", "Freemium", "Paid"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricing(pricing.includes(p) ? pricing.filter(price => price !== p) : [...pricing, p])}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        pricing.includes(p)
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedTags[0] || ""}
                  onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                >
                  <option value="">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.slice(0, 9).map((tool, index) => (
                <div
                  key={tool.name}
                  className={`transform transition-all duration-1000 hover:scale-105 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <ToolCard
                    name={tool.name}
                    category={tool.category}
                    subcategory={tool.subcategory}
                    rating={tool.rating}
                    description={tool.description}
                    pricing={tool.pricing}
                    tags={tool.tags}
                    url={tool.url}
                    favicon={tool.favicon}
                  />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                View All Tools
              </button>
            </div>
          </div>
        </section>

        {/* WAR CRY GENERATOR */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                WAR CRY GENERATOR
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                AI creates personalized battle chants from your data profile.
              </p>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
                <p className="text-lg text-gray-200 italic">
                  "Sarah from Marketing needs the 'Chainsword SEO' tool NOW"
                </p>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105">
                GENERATE WAR CRY
              </button>
            </div>
          </div>
        </section>

        {/* Ultra-Premium Newsletter Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get the latest AI tools and industry insights delivered to your inbox.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
                 </section>

        {/* THE OBLIVION BUTTON */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-red-500/20 to-black/20 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                THE OBLIVION BUTTON
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                One click nukes all competitors' sites. (Actually just books a strategy call)
              </p>
              <button className="px-12 py-6 bg-gradient-to-r from-red-600 to-black text-white font-bold rounded-2xl hover:from-red-700 hover:to-black transition-all duration-300 transform hover:scale-105 border border-red-500/50">
                ACTIVATE OBLIVION
              </button>
            </div>
          </div>
                 </section>

         {/* Ultra-Premium Footer */}
         <footer className="relative z-10 py-20 px-4 bg-black/20 backdrop-blur-xl border-t border-white/10">
           <div className="max-w-7xl mx-auto">
             {/* Main Footer Content */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
               {/* Brand Section */}
               <div className="lg:col-span-2">
                 <div className="flex items-center gap-3 mb-6">
                   <span className="text-3xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    DIGITAL SUPERORGANISM
                   </span>
                   <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                     2025
                   </span>
                 </div>
                 <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  Not a Website – A Digital Superorganism. The ultimate destination for discovering, comparing, and mastering the best AI tools across all industries and use cases.
                 </p>
                 <div className="flex gap-4">
                   <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                     <span className="text-xl">🐦</span>
                   </a>
                   <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                     <span className="text-xl">💼</span>
                   </a>
                   <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                     <span className="text-xl">📺</span>
                   </a>
                   <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                     <span className="text-xl">📷</span>
                   </a>
                 </div>
               </div>

               {/* Quick Links */}
               <div>
                 <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
                 <ul className="space-y-4">
                   <li><a href="/compare" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Compare Tools</a></li>
                   <li><a href="/new-tools" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">New Tools</a></li>
                   <li><a href="/suggest-tool" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Suggest a Tool</a></li>
                   <li><a href="#blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Blog</a></li>
                   <li><a href="#community" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Community</a></li>
                 </ul>
               </div>

               {/* Categories */}
               <div>
                 <h4 className="text-xl font-bold text-white mb-6">Top Categories</h4>
                 <ul className="space-y-4">
                   <li><a href="/ai-tools/writing-&-content" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Writing & Content</a></li>
                   <li><a href="/ai-tools/image-generation" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Image Generation</a></li>
                   <li><a href="/ai-tools/video-animation" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Video Animation</a></li>
                   <li><a href="/ai-tools/productivity" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Productivity</a></li>
                   <li><a href="/ai-tools/ai-agents-&-automation" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">AI Agents</a></li>
                 </ul>
               </div>
             </div>

             {/* Premium Stats Section */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
                 <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                   1000+
                 </div>
                 <div className="text-gray-300 text-sm">AI Tools</div>
               </div>
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
                 <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                   300+
                 </div>
                 <div className="text-gray-300 text-sm">Categories</div>
               </div>
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
                 <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                   50+
                 </div>
                 <div className="text-gray-300 text-sm">Industries</div>
               </div>
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
                 <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                   24/7
                 </div>
                 <div className="text-gray-300 text-sm">Updated</div>
               </div>
             </div>

             {/* Newsletter Section */}
             <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12">
               <div className="text-center">
                 <h3 className="text-2xl font-bold text-white mb-4">Stay Ahead of AI Innovation</h3>
                 <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                   Get exclusive access to the latest AI tools, expert reviews, and industry insights delivered straight to your inbox.
                 </p>
                 <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                   <input
                     type="email"
                     placeholder="Enter your email address"
                     className="flex-1 px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                   />
                   <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                     Subscribe
                   </button>
                 </div>
               </div>
             </div>

             {/* Bottom Bar */}
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
               <div className="text-gray-400 text-sm">
                © 2025 Digital Superorganism. All rights reserved. | Made with ❤️ for the AI community
               </div>
               <div className="flex gap-6 text-sm text-gray-400">
                 <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                 <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                 <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
                 <a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a>
               </div>
             </div>
           </div>
         </footer>
        </div>

      {/* Ultra-Premium CSS Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes text-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes text-shine-delayed {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-text-shine {
          background-size: 200% 200%;
          animation: text-shine 3s ease-in-out infinite;
        }
        
        .animate-text-shine-delayed {
          background-size: 200% 200%;
          animation: text-shine-delayed 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </>
  );
}

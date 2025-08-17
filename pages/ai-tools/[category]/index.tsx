import { useRouter } from "next/router";
import Head from "next/head";
import { categories } from "../../../data/categories";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const categoryData = categories.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === category
  );

  if (!categoryData) {
    return <div className="text-center py-20 text-2xl text-white">Category not found.</div>;
  }

  return (
    <>
      <Head>
        <title>{categoryData.name} | AI Tools Directory</title>
        <meta name="description" content={`Explore all subcategories for ${categoryData.name}.`} />
      </Head>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 flex flex-col items-center justify-center animate-fade-in-up">
            <span className="text-6xl mb-4">{categoryData.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {categoryData.name}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mb-4">
              Explore all subcategories and discover the best AI tools for <span className="font-semibold text-blue-300">{categoryData.name}</span>.
            </p>
            <button
              className="mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push(`/`)}
            >
              ← Back to All Categories
            </button>
          </div>
          {/* Subcategory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryData.subcategories?.map((sub, i) => (
              <a
                key={sub.name}
                href={`/ai-tools/${category}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-rotate-2">
                  <h3 className="text-lg font-bold mb-2 text-white">{sub.name}</h3>
                </div>
              </a>
            ))}
          </div>
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
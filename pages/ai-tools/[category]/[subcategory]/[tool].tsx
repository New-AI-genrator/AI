import { useRouter } from "next/router";
import Head from "next/head";
import { tools } from "../../../../data/tools";
import Image from "next/image";
import { useState } from "react";

const mockReviews = [
  { name: "Alice", rating: 5, comment: "Amazing tool! Helped me write blog posts 10x faster." },
  { name: "Bob", rating: 4, comment: "Very useful for copywriting. UI could be improved." },
  { name: "Charlie", rating: 4.5, comment: "Great features and easy to use." },
];

export default function ToolDetailPage() {
  const router = useRouter();
  const { tool, category, subcategory } = router.query;
  const toolData = tools.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, "-") === tool
  );

  const [reviews, setReviews] = useState(mockReviews);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  if (!toolData) {
    return <div className="text-center py-20 text-2xl text-white">Tool not found.</div>;
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };
  const handleRatingChange = (r: number) => {
    setReviewForm({ ...reviewForm, rating: r });
  };
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviews([{ ...reviewForm, rating: Number(reviewForm.rating) }, ...reviews]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setReviewForm({ name: "", rating: 5, comment: "" });
  };

  return (
    <>
      <Head>
        <title>{toolData.name} | AI Tools Directory</title>
        <meta name="description" content={toolData.description} />
      </Head>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center mb-10 animate-fade-in-up">
            <div className="mb-4">
              <Image
                src={toolData.favicon || "/favicon.ico"}
                alt={toolData.name + " favicon"}
                width={64}
                height={64}
                className="rounded shadow"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {toolData.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                {toolData.category}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-full">
                {toolData.subcategory}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full">
                {toolData.pricing}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-semibold rounded-full">
                {toolData.rating}★
              </span>
            </div>
            <a
              href={toolData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Visit Website ↗
            </a>
          </div>
          {/* Description */}
          <p className="text-lg text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>{toolData.description}</p>
          {/* Tags */}
          {toolData.tags && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-xl font-bold mb-2 text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {toolData.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Screenshots & Demos Placeholder */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-xl font-bold mb-2 text-white">Screenshots & Demos</h3>
            <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-gray-400">Coming soon: screenshots, demo videos, and more!</div>
          </div>
          {/* User Reviews Section */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <h3 className="text-xl font-bold mb-4 text-white">User Reviews</h3>
            <div className="flex flex-col gap-4 mb-8">
              {reviews.length === 0 && <div className="text-gray-400">No reviews yet. Be the first to review!</div>}
              {reviews.map((r, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4 text-left flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{r.name}</span>
                    <span className="text-yellow-400 font-semibold">{r.rating}★</span>
                  </div>
                  <div className="text-gray-200">{r.comment}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-2 text-white">Leave a Review</h4>
              <input
                type="text"
                name="name"
                placeholder="Your Name*"
                value={reviewForm.name}
                onChange={handleReviewChange}
                required
                className="px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-500 transition-all duration-300"
              />
              <div className="flex items-center gap-2">
                <span className="text-white">Rating:</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRatingChange(r)}
                    className={`text-2xl ${reviewForm.rating >= r ? "text-yellow-400" : "text-gray-400"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                name="comment"
                placeholder="Your Review*"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                required
                rows={3}
                className="px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Submit Review
              </button>
              {submitted && <div className="text-green-400 font-semibold text-center mt-2">Thank you for your review!</div>}
            </form>
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { queryDocuments, COLLECTIONS } from "../services/firebase/firestore";
import { where } from "firebase/firestore";
import OpportunitiesCTA from "../components/OpportunitiesCTA";
import { useSEO } from "../hooks/useSEO";

export default function BusinessNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // SEO for Business News page
  useSEO({
    title: 'Business News - Economic Insights & Market Analysis',
    description: 'Stay ahead with the latest business trends, market analysis, startup stories, and economic developments in Cameroon and across Africa.',
    keywords: 'business news, Cameroon business, African economy, market analysis, startup news, economic trends, business opportunities, Apple Fam TV',
    image: 'https://applefamtv.com/assets/apple-tv-logo.png',
    type: 'website'
  });

  useEffect(() => {
    fetchBusinessNews();
  }, []);

  const fetchBusinessNews = async () => {
    try {
      setLoading(true);
      const filters = [
        where("category", "==", "Business"),
        where("status", "==", "active")
      ];
      const data = await queryDocuments(COLLECTIONS.ARTICLES, filters);
      console.log('Fetched business articles:', data);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching business news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradientBackground = (title) => {
    const gradients = [
      'linear-gradient(135deg, #002fa7 0%, #001f73 100%)',
      'linear-gradient(135deg, #1e40af 0%, #002fa7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #002fa7 100%)',
      'linear-gradient(135deg, #2563eb 0%, #002fa7 100%)',
      'linear-gradient(135deg, #1d4ed8 0%, #002fa7 100%)',
    ];
    const index = title.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#001f73] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Economic Insights
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Business <span className="italic">News</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Stay ahead with the latest business trends, market analysis, startup stories, and economic developments in Cameroon and across Africa.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading business news...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[18px] text-[#5a6073]">No business news available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Featured Stories */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Market Leaders</h2>
                <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Trending</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {articles.slice(0, 3).map((article) => (
                  <Link to={`/article/${article.id}`} key={article.id}>
                    <div className="group cursor-pointer">
                      <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                        {article.imageUrl ? (
                          <>
                            <img 
                              src={article.imageUrl} 
                              alt={article.title} 
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${article.isSensitive ? 'blur-lg' : ''}`} 
                            />
                            {article.isSensitive && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full transition-transform duration-300 group-hover:scale-105" style={{ background: getGradientBackground(article.title) }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded bg-[#002fa7]">
                            Business
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-[14px] text-[#2c3348]/60">
                Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, articles.length)}</span> of <span className="font-semibold text-[#002fa7]">{articles.length}</span> business stories
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentArticles.map((article) => (
                <Link to={`/article/${article.id}`} key={article.id}>
                  <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      {article.imageUrl ? (
                        <>
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${article.isSensitive ? 'blur-lg' : ''}`} 
                          />
                          {article.isSensitive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-300" style={{ background: getGradientBackground(article.title) }} />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded bg-[#002fa7]">
                          Business
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-medium text-[#8b91a5]">
                          {article.createdAt 
                            ? new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              }) 
                            : 'Recently'
                          }
                        </span>
                        <span className="text-[11px] text-[#8b91a5]">•</span>
                        <span className="text-[11px] font-medium text-[#2c3348]">{article.author}</span>
                      </div>
                      <h3 className="text-[18px] font-playfair font-bold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-[14px] text-[#2c3348]/70 leading-[1.6]">
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-[13px] font-semibold rounded transition-all ${
                          currentPage === pageNum
                            ? "bg-[#002fa7] text-white"
                            : "text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-[#8b91a5]">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-[13px] font-semibold text-[#2c3348] border border-[#e3e6ee] rounded hover:border-[#002fa7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <OpportunitiesCTA
        eyebrow="Business Insights"
        headline="Stay Ahead in "
        highlightText="Business"
        description="Get exclusive access to market analysis, startup stories, investment opportunities, and economic trends that drive success in Cameroon and Africa."
        primaryButtonText="Subscribe to Business News"
        accentColor="#002fa7"
      />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll, COLLECTIONS } from "../services/firebase/firestore";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function RegionalNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Cameroon regions
  const regions = [
    { id: 1, name: "All Regions", color: "#002fa7" },
    { id: 2, name: "Adamawa", color: "#002fa7" },
    { id: 3, name: "Centre", color: "#002fa7" },
    { id: 4, name: "East", color: "#002fa7" },
    { id: 5, name: "Far North", color: "#002fa7" },
    { id: 6, name: "Littoral", color: "#002fa7" },
    { id: 7, name: "North", color: "#002fa7" },
    { id: 8, name: "Northwest", color: "#002fa7" },
    { id: 9, name: "South", color: "#002fa7" },
    { id: 10, name: "Southwest", color: "#002fa7" },
    { id: 11, name: "West", color: "#002fa7" },
  ];

  useEffect(() => {
    fetchRegionalNews();
  }, []);

  const fetchRegionalNews = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      // Filter for regional news - articles that have region information or are tagged as regional
      const regionalArticles = data.filter(article => 
        article.status === "active" && 
        (article.region || article.category === "Regional" || article.tags?.includes("regional"))
      );
      console.log('Fetched regional articles:', regionalArticles);
      setArticles(regionalArticles);
    } catch (error) {
      console.error('Error fetching regional news:', error);
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

  const filteredArticles = selectedRegion === "All Regions"
    ? articles
    : articles.filter(article => article.region === selectedRegion);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#001f73] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Local Coverage
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            Regional <span className="italic">News</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Stay connected with stories from all 10 regions of Cameroon. Local news, community events, and regional developments that matter to you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading regional news...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[18px] text-[#5a6073]">No regional news available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Featured Stories */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Regional Highlights</h2>
                <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Local Focus</span>
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
                            {article.region || "Regional"}
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

            {/* Region Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionChange(region.name)}
                  className={`px-5 py-2.5 text-[13px] font-semibold rounded transition-all duration-200 ${
                    selectedRegion === region.name
                      ? "bg-[#002fa7] text-white"
                      : "bg-white text-[#2c3348] border border-[#e3e6ee] hover:border-[#002fa7]"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-[14px] text-[#2c3348]/60">
                Showing <span className="font-semibold text-[#002fa7]">{startIndex + 1}-{Math.min(endIndex, filteredArticles.length)}</span> of <span className="font-semibold text-[#002fa7]">{filteredArticles.length}</span> regional stories
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
                          {article.region || "Regional"}
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
        eyebrow="Local Stories"
        headline="Stay Connected to Your "
        highlightText="Region"
        description="Get the latest news from your region and stay informed about local developments, community events, and stories that impact your area."
        primaryButtonText="Subscribe to Regional News"
        accentColor="#002fa7"
      />
    </div>
  );
}
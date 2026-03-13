import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll, COLLECTIONS } from "../services/firebase/firestore";

export default function LatestNews() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      const activeArticles = data.filter(article => article.status === "active");
      // Shuffle articles randomly
      const shuffled = activeArticles.sort(() => Math.random() - 0.5);
      setNewsArticles(shuffled);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradientBackground = (title) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ];
    const index = title.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const displayedArticles = newsArticles.slice(0, visibleCount);
  const featuredArticle = displayedArticles[0];
  const trendingArticles = displayedArticles.slice(1, 5);
  const hasMore = visibleCount < newsArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (loading) {
    return (
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading headlines...</p>
        </div>
      </section>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center py-20">
          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4">Latest News</h2>
          <p className="text-[16px] text-[#5a6073] max-w-[600px] mx-auto">
            Stay tuned for the latest news and updates from Apple Fam TV. We're committed to bringing you timely, accurate, and engaging stories that matter to you and your community.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-8">Latest News</h2>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Story */}
        {featuredArticle && (
          <Link to={`/article/${featuredArticle.id}`} className="lg:col-span-2 group cursor-pointer block">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
              {featuredArticle.imageUrl ? (
                <>
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${featuredArticle.isSensitive ? 'blur-xl' : ''}`}
                  />
                  {featuredArticle.isSensitive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="text-center text-white">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-semibold">Sensitive Content</p>
                        <p className="text-xs mt-1">Click to view</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full" style={{ background: getGradientBackground(featuredArticle.title) }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded bg-[#002fa7]">
                  {featuredArticle.category}
                </span>
              </div>
            </div>
            <h2 className="text-[28px] font-playfair font-black leading-[1.2] mb-3 transition-colors" style={{ color: "#0b1020" }}>
              {featuredArticle.title}
            </h2>
            <p className="text-[15px] text-[#5a6073] leading-relaxed mb-4">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center gap-3 text-[13px] text-[#8b91a5]">
              <span className="font-medium text-[#2c3348]">{featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.createdAt ? new Date(featuredArticle.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
            </div>
          </Link>
        )}

        {/* Trending Stories */}
        {trendingArticles.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] mb-4">
              More Stories
            </h3>
            {trendingArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`} className="group cursor-pointer block">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                    {article.imageUrl ? (
                      <>
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${article.isSensitive ? 'blur-lg' : ''}`}
                        />
                        {article.isSensitive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full" style={{ background: getGradientBackground(article.title) }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] font-semibold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#8b91a5]">
                      <span>{article.createdAt ? new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors"
          >
            Load More Stories
          </button>
        </div>
      )}
    </section>
  );
}

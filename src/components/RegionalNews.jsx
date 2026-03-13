import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll, COLLECTIONS } from "../services/firebase/firestore";

export default function RegionalNews({ displayedArticleIds = [] }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      const activeArticles = data.filter(article => article.status === "active");
      
      // Get regional articles
      const regionalArticles = activeArticles.filter(article => article.category === "Regional");
      
      // Get other articles not displayed above
      const otherArticles = activeArticles
        .filter(article => 
          article.category !== "Regional" && 
          !displayedArticleIds.includes(article.id)
        )
        .sort(() => Math.random() - 0.5);
      
      // Combine: regional first, then fill with random others to get at least 1 article
      const combined = [...regionalArticles, ...otherArticles].slice(0, Math.max(regionalArticles.length, 1));
      
      setArticles(combined);
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

  if (loading) {
    return (
      <section className="py-16 bg-[#f8f9fb]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading regional news...</p>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-16 bg-[#f8f9fb]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-20">
            <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4">
              News Across <span className="text-[#002fa7]">Cameroon</span>
            </h2>
            <p className="text-[16px] text-[#5a6073] max-w-[600px] mx-auto">
              Stay informed with stories from every corner of the nation.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];

  return (
    <section className="py-16 bg-[#f8f9fb]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#002fa7]" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#002fa7]/60">
              Regional Coverage
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                className="text-[clamp(32px,4vw,44px)] font-black text-[#0b1020] leading-[1.1] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                News Across{" "}
                <span className="text-[#002fa7] italic">Cameroon</span>
              </h2>
              <p className="text-[15px] text-[#2c3348]/70 max-w-[600px]">
                Stay informed with stories from every corner of the nation.
              </p>
            </div>
            <Link 
              to="/regional-news" 
              className="text-[14px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors whitespace-nowrap"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Featured Story */}
        <Link to={`/article/${featuredArticle.id}`} className="no-underline">
          <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                {featuredArticle.imageUrl ? (
                  <>
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${featuredArticle.isSensitive ? 'blur-lg' : ''}`}
                    />
                    {featuredArticle.isSensitive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full" style={{ background: getGradientBackground(featuredArticle.title) }} />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded bg-[#002fa7]">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-medium text-[#8b91a5] uppercase tracking-wide">
                    {featuredArticle.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#e3e6ee]" />
                  <span className="text-[11px] text-[#8b91a5]">
                    {featuredArticle.createdAt ? new Date(featuredArticle.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                  </span>
                </div>

                <h3
                  className="text-[clamp(20px,3vw,28px)] font-bold text-[#0b1020] leading-[1.2] mb-4 group-hover:text-[#002fa7] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {featuredArticle.title}
                </h3>

                <p className="text-[15px] text-[#2c3348]/70 leading-[1.7] mb-6">
                  {featuredArticle.excerpt}
                </p>

                <span
                  className="text-[13px] font-semibold text-[#002fa7] group-hover:text-[#ff0800] transition-colors inline-flex items-center gap-1.5 w-fit"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Read Full Story
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}

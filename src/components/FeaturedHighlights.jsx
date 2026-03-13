import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll, COLLECTIONS } from "../services/firebase/firestore";

export default function FeaturedHighlights({ displayedArticleIds = [] }) {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      const activeArticles = data
        .filter(article => 
          article.status === "active" && 
          !displayedArticleIds.includes(article.id)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      setHighlights(activeArticles);
    } catch (error) {
      console.error('Error fetching highlights:', error);
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
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[14px] text-[#5a6073]">Loading highlights...</p>
          </div>
        </div>
      </section>
    );
  }

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <Link
              key={item.id}
              to={`/article/${item.id}`}
              className="group cursor-pointer no-underline block"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${item.isSensitive ? 'blur-lg' : ''}`}
                    />
                    {item.isSensitive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full" style={{ background: getGradientBackground(item.title) }} />
                )}
              </div>

              {/* Headline */}
              <h3
                className="text-[20px] font-bold text-[#0b1020] leading-[1.3] group-hover:text-[#002fa7] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

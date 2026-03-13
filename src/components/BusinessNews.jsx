import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { queryDocuments, COLLECTIONS } from "../services/firebase/firestore";
import { where } from "firebase/firestore";

export default function BusinessNews() {
  const [businessNews, setBusinessNews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setBusinessNews(data.slice(0, 6)); // Limit to 6 articles
    } catch (error) {
      console.error('Error fetching business news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradientBackground = (title) => {
    const gradients = [
      'linear-gradient(135deg, #047857 0%, #065f46 100%)',
      'linear-gradient(135deg, #059669 0%, #047857 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    ];
    const index = title.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (loading) {
    return (
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#047857] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading business news...</p>
        </div>
      </section>
    );
  }

  if (businessNews.length === 0) {
    return (
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-8">Business News</h2>
        <div className="text-center py-12">
          <p className="text-[16px] text-[#5a6073]">No business news available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[28px] font-playfair font-black text-[#0b1020]">Business News</h2>
        <Link 
          to="/business-news" 
          className="text-[14px] font-semibold text-[#047857] hover:text-[#065f46] transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessNews.map((article) => (
          <Link key={article.id} to={`/article/${article.id}`} className="group cursor-pointer block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                {article.imageUrl ? (
                  <>
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${article.isSensitive ? 'blur-lg' : ''}`}
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
                  <div className="w-full h-full" style={{ background: getGradientBackground(article.title) }} />
                )}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded bg-[#047857]">
                    Business
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-[16px] font-semibold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#047857] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[14px] text-[#5a6073] leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[12px] text-[#8b91a5]">
                  <span className="font-medium text-[#2c3348]">{article.author}</span>
                  <span>•</span>
                  <span>
                    {article.createdAt 
                      ? new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) 
                      : 'Recently'
                    }
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
import { useState } from "react";
import { newsArticles, categories } from "../constants/news";

export default function LatestNews() {
  const [activeCategory, setActiveCategory] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredArticles = activeCategory === "Latest" 
    ? newsArticles 
    : newsArticles.filter((article) => article.category === activeCategory);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const featuredArticle = displayedArticles[0];
  const trendingArticles = displayedArticles.slice(1, 5);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const activeCategoryColor = categories.find(cat => cat.name === activeCategory)?.color || "#002fa7";

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-6 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`text-[14px] font-semibold tracking-[0.02em] whitespace-nowrap pb-2 border-b-2 transition-all duration-200 ${
              activeCategory === category.name
                ? "border-current"
                : "text-[#8b91a5] border-transparent hover:text-[#2c3348]"
            }`}
            style={{
              color: activeCategory === category.name ? category.color : undefined,
            }}
            onClick={() => {
              setActiveCategory(category.name);
              setVisibleCount(5);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Story */}
        {featuredArticle && (
          <div className="lg:col-span-2 group cursor-pointer">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span 
                  className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded"
                  style={{ backgroundColor: activeCategoryColor }}
                >
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
              <span>{featuredArticle.timestamp}</span>
            </div>
          </div>
        )}

        {/* Trending Stories */}
        <div className="space-y-6">
          <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#8b91a5] mb-4">
            Trending Now
          </h3>
          {trendingArticles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <span 
                    className="inline-block px-2 py-0.5 text-white text-[9px] font-bold tracking-[0.1em] uppercase rounded mb-2 opacity-90"
                    style={{ backgroundColor: categories.find(cat => cat.name === article.category)?.color || "#002fa7" }}
                  >
                    {article.category}
                  </span>
                  <h4 className="text-[15px] font-semibold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#8b91a5]">
                    <span>{article.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  
    </section>
  );
}

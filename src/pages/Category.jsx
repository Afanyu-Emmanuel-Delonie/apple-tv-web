import { useParams } from 'react-router-dom'
import { useState } from 'react'
import NoContent from '../components/NoContent'
import { newsArticles, categories } from '../constants/news'
import { Link } from 'react-router-dom'
import OpportunitiesCTA from '../components/OpportunitiesCTA'

const prettyName = (value) =>
  value
    ?.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export default function Category() {
  const { slug } = useParams()
  const categoryName = prettyName(slug)
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 6
  
  // Filter articles by category
  const categoryArticles = newsArticles.filter(
    article => article.category.toLowerCase() === categoryName.toLowerCase()
  )
  
  const categoryColor = categories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  )?.color || '#002fa7'

  // Pagination
  const totalPages = Math.ceil(categoryArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = categoryArticles.slice(startIndex, endIndex)

  // Category stats
  const categoryStats = [
    { label: "Total Stories", value: `${categoryArticles.length}` },
    { label: "This Week", value: "5+" },
    { label: "Contributors", value: "8" },
    { label: "Categories", value: "5" },
  ]

  // If no articles, show NoContent component
  if (categoryArticles.length === 0) {
    return (
      <NoContent
        category={categoryName}
        message={`No ${categoryName} Stories Yet`}
        description={`We're currently curating the best ${categoryName.toLowerCase()} content for you. Our editorial team is working to bring you comprehensive coverage soon.`}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div 
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Category
            </span>
          </div>
          <h1 
            className="text-[clamp(32px,6vw,56px)] font-black text-white leading-[1.05] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {categoryName}
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            Comprehensive coverage and in-depth analysis of {categoryName.toLowerCase()} news from around the world.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Top Stories Highlights */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020]">Top {categoryName} Stories</h2>
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8b91a5]">Featured</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {categoryArticles.slice(0, 3).map((article) => (
              <Link to={`/article/${article.id}`} key={article.id} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-[20px] font-playfair font-black text-white leading-[1.2] group-hover:text-[#ffd700] transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[14px] text-[#2c3348]/60">
            Showing <span className="font-semibold" style={{ color: categoryColor }}>{startIndex + 1}-{Math.min(endIndex, categoryArticles.length)}</span> of <span className="font-semibold" style={{ color: categoryColor }}>{categoryArticles.length}</span> {categoryArticles.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentArticles.map((article) => (
            <Link to={`/article/${article.id}`} key={article.id} className="group">
              <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-[11px] text-[#8b91a5]">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.timestamp}</span>
                  </div>
                  <h3
                    className="text-[18px] font-bold text-[#0b1020] leading-[1.3] mb-2 transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
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
              const pageNum = index + 1
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 text-[13px] font-semibold rounded transition-all`}
                    style={{
                      backgroundColor: currentPage === pageNum ? categoryColor : 'transparent',
                      color: currentPage === pageNum ? 'white' : '#2c3348',
                      border: currentPage === pageNum ? 'none' : '1px solid #e3e6ee'
                    }}
                  >
                    {pageNum}
                  </button>
                )
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="text-[#8b91a5]">...</span>
              }
              return null
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

        {/* Related Categories */}
        <div className="bg-white border border-[#e3e6ee] rounded-2xl p-8">
          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4 text-center">Explore Other Categories</h2>
          <p className="text-[15px] text-[#5a6073] text-center mb-8">Discover more stories across different topics</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(cat => cat.name !== 'Latest' && cat.name.toLowerCase() !== categoryName.toLowerCase()).map((category) => {
              const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-')
              const categoryArticleCount = newsArticles.filter(a => a.category === category.name).length
              return (
                <Link
                  key={category.name}
                  to={`/category/${categorySlug}`}
                  className="group relative p-6 bg-gradient-to-br from-white to-[#f8f9fa] border-2 border-[#e3e6ee] rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: '#e3e6ee',
                  }}
                >
                  <div className="text-center">
                    <div className="text-[20px] font-black text-[#0b1020] mb-1">{category.name}</div>
                    <div className="text-[12px] font-semibold" style={{ color: category.color }}>
                      {categoryArticleCount} {categoryArticleCount === 1 ? 'story' : 'stories'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <OpportunitiesCTA />
    </div>
  )
}

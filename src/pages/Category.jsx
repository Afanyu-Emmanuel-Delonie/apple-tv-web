import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NoContent from '../components/NoContent'
import { categories } from '../constants/news'
import { Link } from 'react-router-dom'
import OpportunitiesCTA from '../components/OpportunitiesCTA'
import { getAll, COLLECTIONS } from '../services/firebase/firestore'
import { slugToCategory, categoryToSlug } from '../utils/categoryUtils'

export default function Category() {
  const { slug } = useParams()
  const categoryName = slugToCategory(slug)
  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const articlesPerPage = 6
  
  useEffect(() => {
    fetchArticles()
  }, [categoryName])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await getAll(COLLECTIONS.ARTICLES)
      const categoryArticles = data.filter(
        article => 
          article.status === 'active' && 
          article.category.toLowerCase() === categoryName.toLowerCase()
      )
      setArticles(categoryArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGradientBackground = (title) => {
    const gradients = [
      'linear-gradient(135deg, #002fa7 0%, #001f73 100%)',
      'linear-gradient(135deg, #1e40af 0%, #002fa7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #002fa7 100%)',
      'linear-gradient(135deg, #2563eb 0%, #002fa7 100%)',
      'linear-gradient(135deg, #1d4ed8 0%, #002fa7 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ]
    const index = title.charCodeAt(0) % gradients.length
    return gradients[index]
  }
  
  const categoryColor = categories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  )?.color || '#002fa7'

  // Pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = articles.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading {categoryName} articles...</p>
        </div>
      </div>
    )
  }

  // If no articles, show NoContent component
  if (articles.length === 0) {
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
            {articles.slice(0, 3).map((article) => (
              <Link to={`/article/${article.id}`} key={article.id} className="group no-underline">
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
                    <div className="w-full h-full" style={{ background: getGradientBackground(article.title) }} />
                  )}
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
            Showing <span className="font-semibold" style={{ color: categoryColor }}>{startIndex + 1}-{Math.min(endIndex, articles.length)}</span> of <span className="font-semibold" style={{ color: categoryColor }}>{articles.length}</span> {articles.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentArticles.map((article) => (
            <Link to={`/article/${article.id}`} key={article.id} className="group no-underline">
              <article className="bg-white rounded-lg overflow-hidden border border-[#e3e6ee] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
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
                    <div className="w-full h-full" style={{ background: getGradientBackground(article.title) }} />
                  )}
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
                    <span>{article.createdAt ? new Date(article.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
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
              const categorySlug = categoryToSlug(category.name)
              return (
                <Link
                  key={category.name}
                  to={`/category/${categorySlug}`}
                  className="group relative p-6 bg-gradient-to-br from-white to-[#f8f9fa] border-2 border-[#e3e6ee] rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 no-underline"
                >
                  <div className="text-center">
                    <div className="text-[20px] font-black text-[#0b1020] mb-1">{category.name}</div>
                    <div className="text-[12px] font-semibold" style={{ color: category.color }}>
                      View Stories
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

import { useParams, Link } from "react-router-dom";
import { newsArticles, categories } from "../constants/news";
import { regionalStories } from "../constants/regionalNews";
import { useState } from "react";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const article = newsArticles.find((a) => a.id === parseInt(id)) || regionalStories.find((s) => s.id === parseInt(id));
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-playfair font-black mb-4">Article Not Found</h1>
          <Link to="/" className="text-[#002fa7] hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const categoryColor = categories.find((cat) => cat.name === article.category)?.color || "#002fa7";
  const relatedArticles = newsArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);

  const currentUrl = window.location.href;
  const shareText = `Check out this article: ${article.title}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, "_blank");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-black">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[900px] mx-auto px-6 pb-12">
          <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded mb-4" style={{ backgroundColor: categoryColor }}>
            {article.category}
          </span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-playfair font-black text-white leading-[1.1] mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-[14px]">
            <span className="font-medium text-white">{article.author}</span>
            <span>•</span>
            <span>{article.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-[900px] mx-auto px-6 py-12">
        <p className="text-[20px] md:text-[24px] font-medium text-[#2c3348] leading-[1.6] mb-8">
          {article.excerpt}
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Video Section - Mobile */}
          <div className="my-8 md:hidden">
            <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
              <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="text-sm">Video Player</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[13px] text-[#8b91a5] mt-2 italic">Video: {article.title}</p>
          </div>

          {/* Video Section - Desktop/Tablet */}
          <div className="my-8 hidden md:block">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="text-lg">Video Player</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[14px] text-[#8b91a5] mt-3 italic">Video: {article.title}</p>
          </div>

          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mt-10 mb-4">Key Developments</h2>
          <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>

          <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mt-10 mb-4">Looking Ahead</h2>
          <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6">
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>
        </div>

        {/* Share Section */}
        <div className="border-t border-b border-[#e5e7eb] py-6 my-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-[14px] font-semibold text-[#2c3348]">Share this article</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleWhatsAppShare}
                className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </button>
              <button 
                onClick={handleFacebookShare}
                className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button 
                onClick={handleTwitterShare}
                className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button 
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full bg-[#5a6073] text-white flex items-center justify-center hover:opacity-90 transition-opacity relative"
                title="Copy Link"
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {copied && (
            <div className="text-center mt-2">
              <span className="text-[12px] text-[#047857] font-medium">Link copied to clipboard!</span>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-[#f8f9fa] py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} to={`/article/${related.id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2 py-1 text-white text-[9px] font-bold tracking-[0.1em] uppercase rounded mb-3" style={{ backgroundColor: categoryColor }}>
                        {related.category}
                      </span>
                      <h3 className="text-[18px] font-semibold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-[14px] text-[#5a6073] line-clamp-2">{related.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <OpportunitiesCTA />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll, COLLECTIONS } from "../services/firebase/firestore";

export default function Hero() {
  const [headlines, setHeadlines] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.ARTICLES);
      const headlineArticles = data
        .filter(article => article.status === "active" && article.category === "Headlines")
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 3);
      setHeadlines(headlineArticles);
    } catch (error) {
      console.error('Error fetching headlines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (headlines.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % headlines.length);
      }, 300000);
      return () => clearInterval(interval);
    }
  }, [headlines.length]);

  const getGradientBackground = (title) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    const index = title.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (loading) {
    return (
      <div className="relative w-full h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/latest-news/g20-sumit.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative h-full w-full max-w-[1200px] mx-auto px-6 flex flex-col justify-end pb-16 md:pb-20">
          <div className="inline-block px-2.5 py-1 bg-[#ff0800] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-[3px] mb-4 w-fit">
            Apple Fam TV
          </div>
          <h1 className="font-playfair font-black text-white leading-[1.1] tracking-[-0.03em] max-w-[800px] text-[clamp(32px,5vw,56px)] mb-4">
            Your Trusted Source for News & Updates
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/90 max-w-[600px] leading-relaxed">
            Stay informed with the latest headlines from Cameroon and around the world.
          </p>
        </div>
      </div>
    );
  }

  if (headlines.length === 0) {
    return (
      <div className="relative w-full h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/latest-news/g20-sumit.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative h-full w-full max-w-[1200px] mx-auto px-6 flex flex-col justify-end pb-16 md:pb-20">
          <div className="inline-block px-2.5 py-1 bg-[#ff0800] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-[3px] mb-4 w-fit">
            Apple Fam TV
          </div>
          <h1 className="font-playfair font-black text-white leading-[1.1] tracking-[-0.03em] max-w-[800px] text-[clamp(32px,5vw,56px)] mb-4">
            Your Trusted Source for News & Updates
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/90 max-w-[600px] leading-relaxed">
            Stay informed with the latest headlines from Cameroon and around the world. Apple Fam TV brings you timely, accurate, and engaging stories that matter.
          </p>
        </div>
      </div>
    );
  }

  const currentHeadline = headlines[currentSlide];

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {headlines.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/latest-news/g20-sumit.png)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative h-full w-full max-w-[1200px] mx-auto px-6 flex flex-col justify-end pb-16 md:pb-20">
            <div className="inline-block px-2.5 py-1 bg-[#ff0800] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-[3px] mb-4 w-fit">
              Breaking News
            </div>
            <h1 className="font-playfair font-black text-white leading-[1.1] tracking-[-0.03em] max-w-[800px] text-[clamp(32px,5vw,56px)] mb-4">
              {slide.title}
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/90 max-w-[600px] leading-relaxed mb-6">
              {slide.excerpt}
            </p>
            <Link
              to={`/article/${slide.id}`}
              className="px-6 py-3 bg-[#002fa7] text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer border-none transition-all duration-150 hover:bg-[#0026c4] w-fit no-underline"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Read More
            </Link>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      {headlines.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {headlines.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

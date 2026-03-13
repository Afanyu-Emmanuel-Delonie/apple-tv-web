import { useState, useEffect } from "react";

const heroSlides = [
  {
    id: 1,
    image: "/src/assets/latest-news/g20-sumit.png",
    title: "Global Markets React to New Economic Policy Shifts",
    subtitle: "Investors worldwide respond as major central banks coordinate an unprecedented monetary response ahead of the G20 summit.",
  },
  {
    id: 2,
    image: "/src/assets/latest-news/g20-sumit.png",
    title: "Breaking: Technology Giants Announce Major Partnership",
    subtitle: "Leading tech companies join forces to develop next-generation sustainable computing solutions.",
  },
  {
    id: 3,
    image: "/src/assets/latest-news/g20-sumit.png",
    title: "Climate Summit Reaches Historic Agreement",
    subtitle: "World leaders commit to ambitious new targets in landmark environmental accord.",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
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
              {slide.subtitle}
            </p>
            <button
              type="button"
              className="px-6 py-3 bg-[#002fa7] text-white text-[13px] font-semibold tracking-[0.06em] uppercase rounded cursor-pointer border-none transition-all duration-150 hover:bg-[#0026c4] w-fit"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Read More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

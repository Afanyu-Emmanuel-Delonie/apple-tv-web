import { featuredHighlights } from "../constants/highlights";

export default function FeaturedHighlights() {
  return (
    <section className="py-10  bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHighlights.map((item) => (
            <article
              key={item.id}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                <img
                  src={item.image}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Headline */}
              <h3
                className="text-[20px] font-bold text-[#0b1020] leading-[1.3] group-hover:text-[#002fa7] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.headline}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

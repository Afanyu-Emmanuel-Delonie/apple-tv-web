import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getById, getAll, COLLECTIONS } from "../services/firebase/firestore";
import { eventCategories } from "../constants/events";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await getById(COLLECTIONS.EVENTS, id);
      setEvent(eventData);

      if (eventData) {
        const allEvents = await getAll(COLLECTIONS.EVENTS);
        const related = allEvents.filter(
          (e) => e.category === eventData.category && e.id !== id && e.status === "active"
        ).slice(0, 3);
        setRelatedEvents(related);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#002fa7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[14px] text-[#5a6073]">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-playfair font-black mb-4">Event Not Found</h1>
          <Link to="/events" className="text-[#002fa7] hover:underline">Return to Events</Link>
        </div>
      </div>
    );
  }

  const categoryColor = eventCategories.find((cat) => cat.name === event.category)?.color || "#002fa7";
  const imageUrl = event.imageUrl;
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA';
  const currentUrl = window.location.href;
  const shareText = `Check out this event: ${event.title}`;

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
      {/* Back Button */}
      <div className="bg-white border-b border-[#e3e6ee]">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#002fa7] hover:text-[#0026c4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-black">
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full opacity-80" style={{ background: getGradientBackground(event.title) }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[900px] mx-auto px-6 pb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded" style={{ backgroundColor: categoryColor }}>
              {event.category}
            </span>
            {event.price === "Free" && (
              <span className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded bg-[#047857]">
                FREE
              </span>
            )}
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-playfair font-black text-white leading-[1.1] mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-[14px]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-white">{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <article className="max-w-[900px] mx-auto px-6 py-12">
        {/* Event Details Card */}
        <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e8eef5] rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-[#002fa7] mx-auto mb-3" />
              <div className="text-[13px] text-[#8b91a5] uppercase tracking-wide mb-1">Date</div>
              <div className="text-[18px] font-bold text-[#0b1020]">{formattedDate}</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-[#002fa7] mx-auto mb-3" />
              <div className="text-[13px] text-[#8b91a5] uppercase tracking-wide mb-1">Location</div>
              <div className="text-[18px] font-bold text-[#0b1020]">{event.location}</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-[#002fa7] mx-auto mb-3" />
              <div className="text-[13px] text-[#8b91a5] uppercase tracking-wide mb-1">Price</div>
              <div className="text-[18px] font-bold text-[#002fa7]">{event.price}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4">About This Event</h2>
            <p className="text-[17px] text-[#5a6073] leading-[1.8] mb-6 whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}

        {/* Video Section - Only show if videoUrl exists */}
        {event.videoUrl && (
          <div className="bg-white border border-[#e3e6ee] rounded-2xl p-6 sm:p-8 mb-8">
            <h2 className="text-[24px] sm:text-[28px] font-playfair font-black text-[#0b1020] mb-6">Event Video</h2>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
                {event.videoUrl.includes('youtube.com') || event.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={event.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={event.title}
                  />
                ) : (
                  <video
                    src={event.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    poster={imageUrl}
                  />
                )}
              </div>
            </div>
          </div>
        )}



        {/* Registration CTA */}
        <div className="bg-gradient-to-br from-[#002fa7] to-[#0066cc] rounded-2xl p-8 mb-8 text-center">
          <h3 className="text-[28px] font-playfair font-black text-white mb-3">Ready to Join?</h3>
          <p className="text-[16px] text-white/80 mb-6 max-w-[600px] mx-auto">
            Secure your spot now and be part of this amazing event. Registration is quick and easy.
          </p>
          <button 
            onClick={() => event.registrationLink && window.open(event.registrationLink, '_blank')}
            className="px-8 py-4 bg-white text-[#002fa7] text-[14px] font-bold rounded hover:bg-[#f8f9fa] transition-all duration-200 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Register Now
          </button>
        </div>

        {/* Share Section */}
        <div className="border-t border-b border-[#e5e7eb] py-6 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-[14px] font-semibold text-[#2c3348]">Share this event</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleWhatsAppShare}
                className="w-10 h-10 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
              <button 
                onClick={handleFacebookShare}
                className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={handleTwitterShare}
                className="w-10 h-10 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
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

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="bg-[#f8f9fa] py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-8">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((related) => {
                const relatedImageUrl = related.imageUrl;
                const relatedDate = related.date ? new Date(related.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBA';
                const relatedExcerpt = related.description ? related.description.substring(0, 100) + '...' : 'No description available';
                return (
                  <Link key={related.id} to={`/event/${related.id}`} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        {relatedImageUrl ? (
                          <img src={relatedImageUrl} alt={related.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full transition-transform duration-300 group-hover:scale-105" style={{ background: getGradientBackground(related.title) }} />
                        )}
                      </div>
                      <div className="p-5">
                        <span className="inline-block px-2 py-1 text-white text-[9px] font-bold tracking-[0.1em] uppercase rounded mb-3" style={{ backgroundColor: categoryColor }}>
                          {related.category}
                        </span>
                        <h3 className="text-[18px] font-semibold text-[#0b1020] leading-[1.3] mb-2 group-hover:text-[#002fa7] transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-[14px] text-[#5a6073] line-clamp-2 mb-3">{relatedExcerpt}</p>
                        <div className="flex items-center justify-between text-[12px] text-[#8b91a5]">
                          <span>{relatedDate}</span>
                          <span className="font-bold text-[#002fa7]">{related.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <OpportunitiesCTA />
    </div>
  );
}

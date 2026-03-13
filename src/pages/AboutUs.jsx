import { Link } from "react-router-dom";
import OpportunitiesCTA from "../components/OpportunitiesCTA";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#0066cc] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70">
              Who We Are
            </span>
          </div>
          <h1 className="text-[clamp(28px,6vw,56px)] font-playfair font-black text-white leading-[1.05] mb-4">
            About <span className="italic">Apple Fam TV</span>
          </h1>
          <p className="text-[16px] text-white/80 max-w-[700px] leading-relaxed">
            A fast-growing digital media platform dedicated to informing, educating, and entertaining the public.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#f0f4ff] to-[#e8eef5] rounded-2xl p-8">
            <div className="w-16 h-16 bg-[#002fa7] rounded-full flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-full bg-white" />
            </div>
            <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4">Our Mission</h2>
            <p className="text-[15px] text-[#2c3348] leading-relaxed">
              Apple Fam TV is a fast-growing digital media platform dedicated to informing, educating, and entertaining the public. We give the public a voice by allowing users to submit news, stories, and updates, helping us keep the community informed and connected.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#f0f4ff] to-[#e8eef5] rounded-2xl p-8">
            <div className="w-16 h-16 bg-[#002fa7] rounded-full flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-full bg-white" />
            </div>
            <h2 className="text-[28px] font-playfair font-black text-[#0b1020] mb-4">Our Vision</h2>
            <p className="text-[15px] text-[#2c3348] leading-relaxed">
              To build a trusted community where people can access reliable news, opportunities, and valuable life insights. We strive to be the go-to platform for Cameroonians and the global community seeking credible information and meaningful connections.
            </p>
          </div>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-8 text-center">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">News & Updates</h3>
              <p className="text-[14px] text-[#5a6073]">Cameroon and world news, international updates, business news, and entertainment.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">Opportunities</h3>
              <p className="text-[14px] text-[#5a6073]">Jobs, events, and career opportunities to help you grow professionally.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#002fa7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 rounded-full bg-[#002fa7]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#0b1020] mb-2">Life Insights</h3>
              <p className="text-[14px] text-[#5a6073]">Financial advice, relationship discussions, and valuable life tips.</p>
            </div>
          </div>
        </div>

        {/* Community Voice */}
        <div className="bg-white border border-[#e3e6ee] rounded-2xl p-8 text-center">
          <h2 className="text-[32px] font-playfair font-black text-[#0b1020] mb-4">Your Voice Matters</h2>
          <p className="text-[16px] text-[#2c3348] max-w-[700px] mx-auto leading-relaxed mb-6">
            Apple Fam TV gives the public a voice. We encourage our community to submit news, stories, and updates, helping us keep everyone informed and connected. Together, we build a stronger, more informed community.
          </p>
          <Link
            to="/submit-story"
            className="inline-block px-8 py-4 bg-[#002fa7] text-white text-[14px] font-semibold rounded hover:bg-[#0026c4] transition-colors no-underline"
          >
            Submit Your Story
          </Link>
        </div>
      </div>

      {/* CTA */}
      <OpportunitiesCTA
        eyebrow="Join Our Community"
        headline="Stay Connected with "
        highlightText="Apple Fam TV"
        description="Get the latest news, opportunities, and insights delivered straight to your phone. Be part of a trusted community that values reliable information."
        primaryButtonText="Join Our Community"
        accentColor="#002fa7"
      />
    </div>
  );
}

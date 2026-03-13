import { useSEO } from '../hooks/useSEO';

export default function TermsOfService() {
  useSEO({
    title: 'Terms of Service - Apple Fam TV',
    description: 'Read the terms and conditions for using Apple Fam TV services. Understand your rights and responsibilities as a user.',
    keywords: 'terms of service, terms and conditions, Apple Fam TV, user agreement, legal terms',
    type: 'website'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#001f73] py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-[clamp(32px,5vw,48px)] font-playfair font-black text-white leading-[1.1] mb-4">
            Terms of Service
          </h1>
          <p className="text-[16px] text-white/80 leading-relaxed">
            Please read these terms carefully before using our services. By using Apple Fam TV, you agree to these terms.
          </p>
          <p className="text-[14px] text-white/60 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Agreement to Terms</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              These Terms of Service ("Terms") govern your use of Apple Fam TV's website, services, and content (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Description of Service</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              Apple Fam TV is a digital media platform that provides:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>News and information from Cameroon and around the world</li>
              <li>Regional news coverage from all 10 regions of Cameroon</li>
              <li>Job opportunities, internships, and career resources</li>
              <li>Event listings and community announcements</li>
              <li>User-generated content submission platform</li>
              <li>Educational and entertainment content</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">User Accounts</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Safeguarding your password and account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Maintaining the accuracy of your account information</li>
            </ul>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
            </p>
          </section>

          {/* Content Submission */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Content Submission and Guidelines</h2>
            
            <h3 className="text-[22px] font-semibold text-[#0b1020] mb-4">User-Generated Content</h3>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              By submitting content to Apple Fam TV, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and distribute your content. You represent that:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>You own or have the right to submit the content</li>
              <li>Your content does not infringe on third-party rights</li>
              <li>Your content is accurate and not misleading</li>
              <li>Your content complies with applicable laws</li>
            </ul>

            <h3 className="text-[22px] font-semibold text-[#0b1020] mb-4">Prohibited Content</h3>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              You may not submit content that:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Contains false, misleading, or defamatory information</li>
              <li>Promotes hate speech, discrimination, or violence</li>
              <li>Violates intellectual property rights</li>
              <li>Contains explicit or inappropriate material</li>
              <li>Promotes illegal activities or substances</li>
              <li>Contains spam, malware, or malicious code</li>
              <li>Violates privacy rights of individuals</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Intellectual Property Rights</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Apple Fam TV and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
            </p>
          </section>

          {/* User Conduct */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">User Conduct</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Collect or harvest personal information from other users</li>
              <li>Use automated systems to access the Service</li>
              <li>Engage in any form of harassment or abuse</li>
            </ul>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Privacy</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Disclaimers</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, Apple Fam TV:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Excludes all representations and warranties relating to this Service</li>
              <li>Does not guarantee the accuracy or completeness of information</li>
              <li>Is not responsible for third-party content or external links</li>
              <li>Does not warrant that the Service will be uninterrupted or error-free</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Limitation of Liability</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              In no event shall Apple Fam TV, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              Our total liability to you for all claims arising from the use of the Service shall not exceed the amount you paid us, if any, for accessing the Service.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Indemnification</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              You agree to defend, indemnify, and hold harmless Apple Fam TV and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Termination</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
            </p>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Governing Law</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              These Terms shall be interpreted and governed by the laws of Cameroon, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Changes to Terms</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Contact Information</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-[#f8f9fa] border border-[#e3e6ee] rounded-lg p-6">
              <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-2">
                <strong>Apple Fam TV</strong>
              </p>
              <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-2">
                Email: <a href="mailto:legal@appletv.cm" className="text-[#002fa7] hover:underline">legal@appletv.cm</a>
              </p>
              <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-2">
                Phone: <a href="tel:+237699242382" className="text-[#002fa7] hover:underline">+237 6 99 24 23 82</a>
              </p>
              <p className="text-[16px] text-[#2c3348] leading-[1.8]">
                Address: Cameroon
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
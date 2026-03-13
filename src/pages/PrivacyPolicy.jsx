import { useSEO } from '../hooks/useSEO';

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy - Apple Fam TV',
    description: 'Learn how Apple Fam TV collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
    keywords: 'privacy policy, data protection, Apple Fam TV, personal information, cookies, data security',
    type: 'website'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#002fa7] to-[#001f73] py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-[clamp(32px,5vw,48px)] font-playfair font-black text-white leading-[1.1] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[16px] text-white/80 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Introduction</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              Apple Fam TV ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our content.
            </p>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Information We Collect</h2>
            
            <h3 className="text-[22px] font-semibold text-[#0b1020] mb-4">Personal Information</h3>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Submit stories or content through our platform</li>
              <li>Subscribe to our newsletter or notifications</li>
              <li>Contact us through our contact forms</li>
              <li>Create an account or profile</li>
              <li>Participate in surveys or feedback forms</li>
            </ul>

            <h3 className="text-[22px] font-semibold text-[#0b1020] mb-4">Automatically Collected Information</h3>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              When you visit our website, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">How We Use Your Information</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Publishing and managing submitted content</li>
              <li>Sending newsletters and updates</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Improving our website and user experience</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Information Sharing and Disclosure</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
              <li><strong>Service providers:</strong> With trusted third-party service providers who assist us in operating our website</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Cookies and Tracking Technologies</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality and performance</li>
            </ul>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Data Security</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Your Rights and Choices</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-[16px] text-[#2c3348] leading-[1.8] mb-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Third-Party Links</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Children's Privacy</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Changes to This Privacy Policy</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8]">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-[28px] font-playfair font-bold text-[#0b1020] mb-6">Contact Us</h2>
            <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[#f8f9fa] border border-[#e3e6ee] rounded-lg p-6">
              <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-2">
                <strong>Apple Fam TV</strong>
              </p>
              <p className="text-[16px] text-[#2c3348] leading-[1.8] mb-2">
                Email: <a href="mailto:privacy@appletv.cm" className="text-[#002fa7] hover:underline">privacy@appletv.cm</a>
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
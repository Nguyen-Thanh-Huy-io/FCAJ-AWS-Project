import React, { useEffect } from 'react';

export const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - PubliCast";
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="bg-zinc-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">PubliCast</div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-800">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last updated: July 23, 2026</p>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to PubliCast. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              or use our application, especially regarding our integrations with third-party social media platforms like 
              Facebook, Instagram, YouTube, and TikTok.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
            <p className="mb-2">When you connect your social media accounts to PubliCast, we may collect and store:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Your name, email address, profile picture, and platform user IDs.</li>
              <li><strong>Social Media Pages & Channels:</strong> Information about the Pages, Channels, or Groups you manage (e.g., Facebook Pages, YouTube Channels).</li>
              <li><strong>Posts and Content:</strong> Media, text, links, and metadata of the posts you schedule or publish through our platform.</li>
              <li><strong>Analytics Data:</strong> Engagement metrics such as likes, comments, shares, reach, and impressions from your connected social platforms.</li>
              <li><strong>Access Tokens:</strong> Secure OAuth tokens used to communicate with platform APIs on your behalf.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
            <p className="mb-2">We use the collected data strictly to provide and improve our services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To authenticate your identity and maintain your session.</li>
              <li>To publish posts, videos, and stories to your connected social media accounts based on your schedules.</li>
              <li>To aggregate and display analytics and performance metrics on your dashboard.</li>
              <li>To provide customer support and respond to your requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data 
              from unauthorized access, alteration, disclosure, or destruction. Access tokens are encrypted securely 
              within our database. We only retain your data for as long as necessary to fulfill the purposes we collected it for.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p>
              Our platform integrates with Meta (Facebook & Instagram), Google (YouTube), and TikTok. 
              Your use of these integrations is also governed by their respective Privacy Policies and Terms of Service. 
              We do not sell your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Data Deletion</h2>
            <p>
              You have the right to access, correct, or delete your personal data. 
              If you wish to revoke our access to your Facebook data or request complete deletion of your information 
              from our servers, please visit our <a href="/data-deletion" className="text-blue-600 hover:underline">Data Deletion Instructions</a> page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at: <br/>
              <strong>Email:</strong> privacy@publicast.com
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} PubliCast Global. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

import React, { useEffect } from 'react';

export const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service - PubliCast";
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-8"><strong>Effective Date:</strong> July 26, 2026</p>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              Welcome to PubliCast ("we," "our," or "us"). By accessing or using our social media management platform 
              located at <a href="https://publicast.trinhquoccongvinh.id.vn" className="text-blue-600 hover:underline">https://publicast.trinhquoccongvinh.id.vn</a> (the "Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, you may not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              PubliCast is a social media management platform that allows users to connect and manage multiple social media accounts, 
              including but not limited to Facebook, Instagram, Threads, and TikTok. Users can create, schedule, publish, and manage 
              posts across supported platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Authentication and Data Usage</h2>
            <p className="mb-2">
              To utilize our Service, you must authenticate using OAuth provided by each respective social platform. By connecting your accounts, you understand and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>PubliCast stores OAuth access tokens securely to perform actions authorized by you on your behalf.</li>
              <li>We may collect basic profile information and account identifiers necessary for authentication and platform integration.</li>
              <li>PubliCast does not sell your personal information to third parties.</li>
              <li>You may disconnect your social media accounts and request the deletion of your stored data at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Platform Compliance</h2>
            <p>
              Our Service interacts with third-party platforms. You are strictly required to comply with the Terms of Service and Community Guidelines of any connected platforms, including but not limited to Meta (Facebook, Instagram, Threads) and TikTok. Any violation of these third-party terms may result in the suspension of your PubliCast account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use and Prohibited Activities</h2>
            <p className="mb-2">You are solely responsible for all content you publish through connected social media accounts using our Service. You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Publish, distribute, or share illegal, harmful, or defamatory content.</li>
              <li>Violate any applicable local, state, national, or international law or regulation.</li>
              <li>Infringe upon the intellectual property rights, privacy rights, or other rights of third parties.</li>
              <li>Distribute spam, unauthorized advertising, or engage in malicious behavior such as distributing viruses or malware.</li>
              <li>Attempt to gain unauthorized access to the Service, other users' accounts, or our computer systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Account Security Responsibilities</h2>
            <p>
              You are responsible for safeguarding the password and credentials that you use to access the Service and for any activities or actions under your account. You agree to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
            <p>
              The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of PubliCast and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of PubliCast. You retain full ownership and intellectual property rights to any content you create and publish via our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms of Service or abuse the Service. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. PubliCast makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein. You expressly agree that your use of the Service, its content, and any services or items obtained from us is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall PubliCast, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) unauthorized access, use or alteration of your transmissions or content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the applicable laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>Website:</strong> <a href="https://publicast.trinhquoccongvinh.id.vn" className="text-blue-600 hover:underline">https://publicast.trinhquoccongvinh.id.vn</a></li>
              <li><strong>Email:</strong> <a href="mailto:23110227@student.hcmute.edu.vn" className="text-blue-600 hover:underline">23110227@student.hcmute.edu.vn</a></li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} PubliCast. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

import React, { useCallback } from 'react';
import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const LegalCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string, context: string) => {
    console.error(`Legal documentation error [${context}]: ${error}`);
  }, []);

  const handleSuccess = useCallback((action: string) => {
    console.warn(`Legal documentation success: ${action}`);
  }, []);
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-4xl space-y-8">
            <div className="text-center">
              <h1 className="heading-main mb-6">Legal Information</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                All legal documents and policies for this website and associated services.
              </p>
              <div className="text-sm opacity-75 mt-8">
                <div className="inline-block px-4 py-2 bg-gray-800 rounded-full">
                  ⚖️ Legal Compliance Center
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-glass p-6 text-center">
                <h3 className="heading-card mb-4">📄 Privacy Policy</h3>
                <p className="text-sm opacity-75">How we collect, use, and protect your data</p>
              </div>

              <div className="card-glass p-6 text-center">
                <h3 className="heading-card mb-4">🍪 Cookie Policy</h3>
                <p className="text-sm opacity-75">Information about cookies and tracking</p>
              </div>

              <div className="card-glass p-6 text-center">
                <h3 className="heading-card mb-4">ℹ️ Imprint</h3>
                <p className="text-sm opacity-75">Legal business information and contact details</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="heading-section">Privacy Policy</h2>
            <div className="card-anthracite p-6 space-y-4 text-sm leading-relaxed">
              <h3 className="text-lg font-semibold text-metallic mb-3">Data Collection</h3>
              <p>
                We collect information you provide directly to us, such as when you create an
                account, make a purchase, or contact us for support.
              </p>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">
                How We Use Your Information
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>To provide and maintain our services</li>
                <li>To process transactions and send related information</li>
                <li>To send you technical notices and support messages</li>
                <li>To respond to your comments and questions</li>
              </ul>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as described in this policy.
              </p>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Contact</h3>
              <p>
                If you have questions about this Privacy Policy, please contact us at
                privacy@rawfiction.eu
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookie Policy',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="heading-section">Cookie Policy</h2>
            <div className="card-anthracite p-6 space-y-4 text-sm leading-relaxed">
              <h3 className="text-lg font-semibold text-metallic mb-3">What Are Cookies</h3>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when
                you visit a website. They are widely used to make websites work more efficiently and
                to provide information to website owners.
              </p>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">How We Use Cookies</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Essential Cookies:</strong> These are necessary for the website to
                  function properly
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> These help us understand how visitors use our
                  website
                </li>
                <li>
                  <strong>Preference Cookies:</strong> These remember your settings and preferences
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Managing Cookies</h3>
              <p>
                You can control and/or delete cookies as you wish. You can delete all cookies that
                are already on your computer and you can set most browsers to prevent them from
                being placed.
              </p>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Contact</h3>
              <p>
                If you have questions about our use of cookies, please contact us at
                cookies@rawfiction.eu
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'imprint',
      title: 'Imprint',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="heading-section">Legal Information</h2>
            <div className="card-anthracite p-6 space-y-4 text-sm leading-relaxed">
              <h3 className="text-lg font-semibold text-metallic mb-3">Business Information</h3>
              <div className="space-y-2">
                <p>
                  <strong>Company:</strong> Raw Fiction e.U.
                </p>
                <p>
                  <strong>Owner:</strong> Raphael Hulan
                </p>
                <p>
                  <strong>Address:</strong> Wien, Austria
                </p>
              </div>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> why@rawfiction.me
                </p>
                <p>
                  <strong>Phone:</strong> +43 670 606 6149
                </p>
              </div>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">
                Business Registration
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Registration Number:</strong> FN 519455f
                </p>
                <p>
                  <strong>VAT ID:</strong> ATU81854646
                </p>
                <p>
                  <strong>Jurisdiction:</strong> Austria
                </p>
              </div>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Copyright</h3>
              <p>© 2025 Raw Fiction e.U. All rights reserved.</p>

              <h3 className="text-lg font-semibold text-metallic mb-3 mt-6">Disclaimer</h3>
              <p>
                The information contained in this website is for general information purposes only.
                While we endeavor to keep the information up to date and correct, we make no
                representations or warranties of any kind about the completeness, accuracy,
                reliability, or availability of the website or the information contained on the
                website.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration for legal documentation
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'privacy', title: 'Privacy Policy', priority: 'preload' as const },
      { id: 'cookies', title: 'Cookie Policy', priority: 'preload' as const },
      { id: 'imprint', title: 'Imprint', priority: 'lazy' as const },
    ],
    images: [
      // Legal documents typically don't have images, but placeholder for compliance assets
      {
        id: 'legal-seal-1',
        src: '/placeholder/legal-seal.png',
        alt: 'Legal Compliance Seal',
        priority: 'low' as const,
        tabId: 'imprint',
      },
    ],
  };

  return (
    <ContentWrapper
      id="legal-documentation"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
      loadingConfig={loadingConfig}
    />
  );
};

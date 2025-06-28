import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const ConfidentialCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {

  // Define tabs for the luxury fashion brand
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-2xl text-center space-y-8">
            <h1 className="heading-main mb-6">[Confidential]</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              A luxury fashion brand that pushes the boundaries of contemporary design while
              maintaining the highest standards of craftsmanship and exclusivity.
            </p>
            <div className="text-sm opacity-75 mt-8">
              <div className="inline-block px-4 py-2 bg-gray-800 rounded-full">
                🔒 Exclusive Access Required
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'philosophy',
      title: 'Philosophy',
      content: (
        <div className="h-full w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="heading-main mb-4">Brand Philosophy</h2>
              <p className="text-lg opacity-90">Redefining luxury through timeless innovation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">Design Excellence</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Creating timeless pieces that embody sophistication and innovation, designed for
                  those who appreciate the finer aspects of fashion.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Artisanal craftsmanship</div>
                  <div>• Premium materials</div>
                  <div>• Contemporary aesthetics</div>
                </div>
              </div>

              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">Exclusive Access</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Our collections are available by invitation only, ensuring exclusivity and
                  personalized service for our discerning clientele.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Invitation-only collections</div>
                  <div>• Personal styling services</div>
                  <div>• Private showings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'collections',
      title: 'Collections',
      content: (
        <div className="h-full w-full p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-main mb-4">Exclusive Collections</h2>
              <p className="text-lg opacity-90">Curated luxury for the discerning individual</p>
            </div>

            <div className="space-y-6">
              <div className="card-anthracite p-8">
                <h3 className="heading-card mb-6">Current Collections</h3>
                <div className="space-y-4 text-sm opacity-90">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <div>
                      <div className="font-semibold">Haute Couture</div>
                      <div className="text-xs opacity-60">Bespoke luxury pieces</div>
                    </div>
                    <span className="text-metallic px-3 py-1 bg-gray-800 rounded">
                      Limited Edition
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <div>
                      <div className="font-semibold">Ready-to-Wear</div>
                      <div className="text-xs opacity-60">Contemporary essentials</div>
                    </div>
                    <span className="text-metallic px-3 py-1 bg-gray-800 rounded">Seasonal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Accessories</div>
                      <div className="text-xs opacity-60">Luxury finishing touches</div>
                    </div>
                    <span className="text-metallic px-3 py-1 bg-gray-800 rounded">Curated</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-glass p-6 text-center">
                  <div className="text-2xl mb-3">👑</div>
                  <h4 className="heading-card text-sm mb-2">Couture</h4>
                  <p className="text-xs opacity-60">One-of-a-kind pieces</p>
                </div>
                <div className="card-glass p-6 text-center">
                  <div className="text-2xl mb-3">💎</div>
                  <h4 className="heading-card text-sm mb-2">Jewelry</h4>
                  <p className="text-xs opacity-60">Exquisite adornments</p>
                </div>
                <div className="card-glass p-6 text-center">
                  <div className="text-2xl mb-3">🎭</div>
                  <h4 className="heading-card text-sm mb-2">Limited</h4>
                  <p className="text-xs opacity-60">Exclusive releases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'access',
      title: 'Access',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-2xl text-center space-y-8">
            <div className="text-4xl mb-6">🔐</div>
            <h2 className="heading-main mb-4">Exclusive Access</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-8">
              Access to our collections is by invitation only. We maintain the highest standards of
              exclusivity for our discerning clientele.
            </p>

            <div className="card-anthracite p-8 space-y-4">
              <h3 className="heading-card mb-4">How to Gain Access</h3>
              <div className="space-y-3 text-sm opacity-75 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-metallic">1.</span>
                  <span>Request an invitation through our exclusive referral network</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-metallic">2.</span>
                  <span>Schedule a private consultation with our styling team</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-metallic">3.</span>
                  <span>Experience personalized luxury fashion curation</span>
                </div>
              </div>
            </div>

            <div className="text-xs opacity-50">
              All inquiries are handled with the utmost discretion and confidentiality.
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration for the luxury brand content
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'philosophy', title: 'Philosophy', priority: 'preload' as const },
      {
        id: 'collections',
        title: 'Collections',
        hasGallery: true,
        imageCount: 6,
        priority: 'preload' as const,
      },
      { id: 'access', title: 'Access', priority: 'lazy' as const },
    ],
    images: [
      // Placeholder image configs for potential future gallery integration
      {
        id: 'couture-1',
        src: '/placeholder/couture-1.jpg',
        alt: 'Haute Couture Piece',
        priority: 'high' as const,
        tabId: 'collections',
      },
      {
        id: 'couture-2',
        src: '/placeholder/couture-2.jpg',
        alt: 'Limited Edition',
        priority: 'medium' as const,
        tabId: 'collections',
      },
      {
        id: 'accessories-1',
        src: '/placeholder/accessories-1.jpg',
        alt: 'Luxury Accessories',
        priority: 'low' as const,
        tabId: 'collections',
      },
    ],
  };

  return (
    <ContentWrapper
      id="confidential-luxury-brand"
      tabs={tabs}
      className="h-full w-full"
      loadingConfig={loadingConfig}
    />
  );
};

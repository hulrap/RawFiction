import React, { useCallback } from 'react';
import Image from 'next/image';
import { ContentWrapper } from './Wrapper';
import { ImageGallery } from './ImageGallery';
import type { ProjectProps, TabItem } from '../../shared/types';

export const RawFictionCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string, context: string) => {
    // Production-grade error logging for fashion brand
    const errorReport = {
      error,
      context,
      brand: 'Raw Fiction',
      timestamp: Date.now(),
    };

    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.error('Raw Fiction error:', errorReport);
    }
  }, []);

  const handleSuccess = useCallback((_action: string) => {
    // Production-grade success tracking without console pollution
    // Could send to analytics service here
    if (process.env.NODE_ENV === 'development') {
      // Development-only success logging
    }
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">Raw Fiction</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Raw Fiction is a cutting-edge fashion brand that pushes the boundaries of
                contemporary design. Our collections blend raw materials with sophisticated
                craftsmanship to create pieces that tell stories.
              </p>
              <div className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full text-sm font-medium text-white">
                High Fashion • Digital Art • Luxury Collections
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {[
                { name: 'Garbage Planet', subtitle: 'Sustainability Focus' },
                { name: 'Pride', subtitle: 'Identity & Expression' },
                { name: 'Pure Chlorine', subtitle: 'Capsule Collection' },
                { name: 'Racism', subtitle: 'Social Commentary' },
                { name: 'Archive', subtitle: 'Digital Heritage' },
              ].map(collection => (
                <div
                  key={collection.name}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-white font-semibold text-sm">RF</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{collection.name}</h3>
                  <p className="text-xs text-gray-400">{collection.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-4">Brand Philosophy</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  We believe fashion should be a form of artistic expression that challenges
                  conventional norms while maintaining wearability and comfort. Each piece is a
                  statement of individuality and creative rebellion.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-4">Digital Collections</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Our extensive digital archives contain hundreds of high-resolution fashion images,
                  behind-the-scenes content, and exclusive editorial footage. Experience luxury
                  fashion through immersive digital galleries.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'garbage-planet',
      title: 'Garbage Planet',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Garbage Planet</h2>
              <p className="text-lg text-gray-300 mb-8">
                Sustainability • Environmental Awareness • Ethical Fashion
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Wir Menschen haben einzeln viele positive und negative Seiten. Doch durch die Gier
                  von Wenigen und die Bequemlichkeit vieler, ist die Menschheit als Ganzes einfach
                  Garbage. Wir verschmutzen und verpesten unseren Planeten auf unerträgliche Weise
                  und in unvorstellbarem Ausmaß. Der Mist landet im Meer, in Flüssen, in Wäldern und
                  auf Wiesen.
                </p>
                <p className="text-sm text-gray-300 leading-relaxed mt-3">
                  Mit unserer Kollektion wollen wir auf die Miststände und den Dreck den wir
                  hinterlassen aufmerksam machen. Unsere Kleidung ist zu 100% umweltfreundlich und
                  fair produziert und verschmutzt weder das Grundwasser, noch enthält sie
                  Plastikfasern.
                </p>
              </div>
            </div>
            <ImageGallery
              componentId="raw-fiction-garbage-planet"
              collectionId="garbage-planet"
              title="Garbage Planet Collection"
              mode="collection"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'pride',
      title: 'Pride',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pride Collection</h2>
              <p className="text-lg text-gray-300 mb-8">
                Identity • Expression • Celebration of Diversity
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </div>
            </div>
            <ImageGallery
              componentId="raw-fiction-pride"
              collectionId="pride"
              title="Pride Collection"
              mode="collection"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'pure-chlorine',
      title: 'Pure Chlorine',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pure Chlorine (Capsule)</h2>
              <p className="text-lg text-gray-300 mb-8">
                Limited Edition • Exclusive Design • Premium Materials
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </p>
              </div>
            </div>
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">RF</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">This capsule collection is currently in development</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'racism',
      title: 'Racism',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Racism Collection</h2>
              <p className="text-lg text-gray-300 mb-8">
                Social Commentary • Awareness • Change Through Fashion
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sunt in culpa qui officia
                  deserunt mollit anim id est laborum. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </div>
            </div>
            <ImageGallery
              componentId="raw-fiction-racism"
              collectionId="racism"
              title="Racism Collection"
              mode="collection"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'garbage-planet-2',
      title: 'Garbage Planet 2.0',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Garbage Planet 2.0</h2>
              <p className="text-lg text-gray-300 mb-8">
                Evolution • Next Chapter • Advanced Sustainability
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">RF</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">In Development</h3>
              <p className="text-gray-400">The next evolution of our environmental message</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'editorial-shoots',
      title: 'Editorial',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Editorial Shoots</h2>
              <p className="text-lg text-gray-300 mb-8">
                Professional Photography • Behind the Scenes • Creative Vision
              </p>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">Photo Credits</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Photographer:</span>
                    <div className="font-medium">Marcel Bernard</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Models:</span>
                    <div className="font-medium">Romana Binder, Vladimir Cabak, Raphael Hulan</div>
                  </div>
                </div>
              </div>
            </div>
            <ImageGallery
              componentId="raw-fiction-editorial"
              collectionId="garbage-planet-1"
              title="Editorial Photography"
              mode="editorial"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'digital-archives',
      title: 'Archives',
      content: (
        <div className="h-full w-full relative">
          <ImageGallery
            componentId="raw-fiction-archives"
            collectionId="archives"
            title="Digital Fashion Archives"
            mode="archive"
          />
        </div>
      ),
    },
    {
      id: 'vintage-site',
      title: 'Vintage Site',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Original Raw Fiction Website</h2>
              <p className="text-sm text-gray-400">
                Archived from our early days - a snapshot of fashion history
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-8">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-600/30 relative mb-6">
                <Image
                  src="/placeholder/vintage-fashion-website.jpg"
                  alt="Vintage Raw Fiction Website Screenshot"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Raw Fiction v1.0</h3>
                    <p className="text-sm text-gray-300">
                      Archived: 2023 • Original Design Platform
                    </p>
                  </div>
                </div>
              </div>
              <ImageGallery
                componentId="raw-fiction-vintage"
                collectionId="vintage"
                title="Vintage Website Archive"
                mode="vintage"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration for the new collections
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      {
        id: 'garbage-planet',
        title: 'Garbage Planet',
        hasGallery: true,
        imageCount: 72,
        priority: 'preload' as const,
      },
      {
        id: 'pride',
        title: 'Pride',
        hasGallery: true,
        imageCount: 25,
        priority: 'preload' as const,
      },
      {
        id: 'pure-chlorine',
        title: 'Pure Chlorine',
        priority: 'lazy' as const,
      },
      {
        id: 'racism',
        title: 'Racism',
        hasGallery: true,
        imageCount: 32,
        priority: 'preload' as const,
      },
      {
        id: 'garbage-planet-2',
        title: 'Garbage Planet 2.0',
        priority: 'lazy' as const,
      },
      {
        id: 'editorial-shoots',
        title: 'Editorial',
        hasGallery: true,
        imageCount: 148,
        priority: 'lazy' as const,
      },
      {
        id: 'digital-archives',
        title: 'Archives',
        hasGallery: true,
        imageCount: 500,
        priority: 'lazy' as const,
      },
      {
        id: 'vintage-site',
        title: 'Vintage Site',
        hasGallery: true,
        imageCount: 34,
        priority: 'lazy' as const,
      },
    ],
    images: [
      // Garbage Planet Collection
      ...Array.from({ length: 72 }, (_, i) => ({
        id: `garbage-planet-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/garbage-planet-1/${i <= 45 ? 'GB' : 'GP'}${Math.ceil((i + 1) / 3)}-${(i % 3) + 1}.jpg`,
        alt: `Garbage Planet Product ${i + 1}`,
        priority: 'high' as const,
        tabId: 'garbage-planet',
        galleryId: 'garbage-planet-main',
      })),

      // Pride Collection
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `pride-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/product-${i + 1}.jpg`,
        alt: `Pride Collection ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),

      // Racism Collection
      ...Array.from({ length: 32 }, (_, i) => ({
        id: `racism-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/racism/R${Math.ceil((i + 1) / 4)}-${(i % 4) + 1}.jpg`,
        alt: `Racism Collection ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'racism',
        galleryId: 'racism-main',
      })),

      // Editorial Images
      ...Array.from({ length: 148 }, (_, i) => ({
        id: `editorial-${i + 1}`,
        src: `/projects/raw-fiction-content/archive/editorial/garbage-planet-1/Editorial_${i + 1}.jpg`,
        alt: `Editorial ${i + 1}`,
        priority: 'low' as const,
        tabId: 'editorial-shoots',
        galleryId: 'editorial-main',
      })),

      // Vintage Images
      ...Array.from({ length: 34 }, (_, i) => ({
        id: `vintage-${i + 1}`,
        src: `/projects/raw-fiction-content/vintage-site/rawfiction${i + 1}.png`,
        alt: `Vintage Raw Fiction Website Screenshot ${i + 1}`,
        priority: 'low' as const,
        tabId: 'vintage-site',
        galleryId: 'vintage-main',
      })),
    ],
  };

  return (
    <ContentWrapper
      id="raw-fiction"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
      loadingConfig={loadingConfig}
    />
  );
};

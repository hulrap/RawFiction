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
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Humanity as a whole has become garbage. Through the greed of few and the
                  convenience of many, we pollute and contaminate our planet in unbearable ways and
                  unimaginable scales. With our collection, we want to draw attention to these
                  grievances and the dirt we leave behind. Our clothing is 100% environmentally
                  friendly and fairly produced, containing no plastic fibers and not polluting
                  groundwater. Our packaging is made 100% from production remnants that would
                  otherwise end up in trash. Additionally, Raw Fiction supports &ldquo;The Ocean
                  Cleanup&rdquo; with parts of our proceeds to help clean the world&apos;s largest
                  ocean garbage patches.
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
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Until this day, many LGBTQIA+ individuals around the globe are being cast aside
                  from their peers when outing themselves. Whole societies follow their leaders when
                  it comes to violently persecuting LGBTQIA+ people for &quot;being different&quot;.
                  Today 68 countries still criminalize LGBTQIA+ identity. With our collection we
                  want to gather donations to make a difference and raise awareness about the
                  life-threatening conditions for LGBTQIA+ people at the same time. Because LGBTQIA+
                  asylum seekers are still marginalized and harassed when reaching their final
                  destination, we chose Micro Rainbow as our partner NGO for the Pride Collection to
                  support those who need safety and acceptance.
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
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">Brand Collaboration</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                We did a lovely brand collaboration with Pure Chlorine, an alt-pop band that creates
                moody but high-energetic music. Heavy guitar-riffs meet pulsating EDM-sounds, while
                peroxide blonde hair meets black leather jackets. Pure Chlorine creates pop songs
                with a &quot;fuck you&quot; attitude towards the stigma of mental illness and the
                everlasting silence about it. This limited capsule collection embodies that
                rebellious spirit and authentic artistic expression.
              </p>
            </div>
            <ImageGallery
              componentId="raw-fiction-pure-chlorine"
              collectionId="pure-chlorine"
              title="Pure Chlorine Collection"
              mode="collection"
            />
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
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  This collection addresses one of the most persistent social issues of our time.
                  Through powerful statement pieces, we challenge racism and promote equality in all
                  its forms. Each garment is ethically produced with 100% organic cotton and
                  supports ENAR (European Network Against Racism) through direct donations. From
                  accessible shirts to premium handcrafted pieces, this collection embodies our
                  commitment to social justice while planting a tree for every piece sold. Fashion
                  becomes a tool for change, awareness, and progress toward a more equitable world.
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
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  The evolution of sustainable fashion. Featuring advanced materials like European
                  hemp and stainless steel armor, this collection pushes the boundaries of
                  eco-conscious design. From limited edition metal mesh armor to innovative wrap
                  garments, each piece represents the next chapter in environmental awareness
                  through fashion.
                </p>
              </div>
            </div>
            <ImageGallery
              componentId="raw-fiction-garbage-planet-2"
              collectionId="garbage-planet-2"
              title="Garbage Planet 2.0 Collection"
              mode="collection"
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
      id: 'website-archive',
      title: 'Website Archive',
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
                  src="/projects/raw-fiction-content/website-archive/rawfiction1.png"
                  alt="Vintage Raw Fiction Website Screenshot"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Raw Fiction v1.0</h3>
                    <p className="text-sm text-gray-300">Archived: 2019-2022 • Shopify Website</p>
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
        hasGallery: true,
        imageCount: 12,
        priority: 'preload' as const,
      },
      {
        id: 'racism',
        title: 'Racism',
        hasGallery: true,
        imageCount: 8,
        priority: 'preload' as const,
      },
      {
        id: 'garbage-planet-2',
        title: 'Garbage Planet 2.0',
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
        id: 'website-archive',
        title: 'Website Archive',
        hasGallery: true,
        imageCount: 34,
        priority: 'lazy' as const,
      },
    ],
    images: [
      // Garbage Planet Collection - GB1-GB15 (3 variants each) + GP16-GP23 (4 variants each)
      // GB1-1, GB1-2, GB1-3, GB2-1, GB2-2, GB2-3, ..., GB15-1, GB15-2, GB15-3
      ...Array.from({ length: 45 }, (_, i) => {
        const productNum = Math.floor(i / 3) + 1;
        const variant = (i % 3) + 1;
        return {
          id: `garbage-planet-gb${productNum}-${variant}`,
          src: `/projects/raw-fiction-content/collections/garbage-planet-1/GB${productNum}-${variant}.jpg`,
          alt: `Garbage Planet Product GB${productNum} Variant ${variant}`,
          priority: 'high' as const,
          tabId: 'garbage-planet',
          galleryId: 'garbage-planet-main',
        };
      }),
      // GP16-1, GP16-2, GP16-3, GP16-4, GP17-1, GP17-2, ..., GP23-1, GP23-2, GP23-3, GP23-4
      ...Array.from({ length: 32 }, (_, i) => {
        const productNum = Math.floor(i / 4) + 16;
        const variant = (i % 4) + 1;
        return {
          id: `garbage-planet-gp${productNum}-${variant}`,
          src: `/projects/raw-fiction-content/collections/garbage-planet-1/GP${productNum}-${variant}.jpg`,
          alt: `Garbage Planet Product GP${productNum} Variant ${variant}`,
          priority: 'high' as const,
          tabId: 'garbage-planet',
          galleryId: 'garbage-planet-main',
        };
      }),

      // Pride Collection - actual file names
      // crop-1 to crop-4
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `pride-crop-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/crop-${i + 1}.jpg`,
        alt: `Pride Collection Crop ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),
      // tee-1 to tee-4
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `pride-tee-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/tee-${i + 1}.jpg`,
        alt: `Pride Collection Tee ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),
      // harness1-1 to harness1-4
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `pride-harness1-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/harness1-${i + 1}.jpg`,
        alt: `Pride Collection Harness1 ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),
      // harness2-1 to harness2-4
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `pride-harness2-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/harness2-${i + 1}.jpg`,
        alt: `Pride Collection Harness2 ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),
      // harness3-1 to harness3-2
      ...Array.from({ length: 2 }, (_, i) => ({
        id: `pride-harness3-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/harness3-${i + 1}.jpg`,
        alt: `Pride Collection Harness3 ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),
      // belt-1
      {
        id: 'pride-belt-1',
        src: '/projects/raw-fiction-content/collections/pride/belt-1.jpg',
        alt: 'Pride Collection Belt 1',
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      },
      // painting1 to painting3
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `pride-painting-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pride/painting${i + 1}.jpg`,
        alt: `Pride Collection Painting ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pride',
        galleryId: 'pride-main',
      })),

      // Pure Chlorine Collection - PURECROP_1 to PURECROP_6, HER_1 to HER_6
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `pure-chlorine-purecrop-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pure-chlorine/PURECROP_${i + 1}.jpg`,
        alt: `Pure Chlorine Collection Pure Crop ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pure-chlorine',
        galleryId: 'pure-chlorine-main',
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `pure-chlorine-her-${i + 1}`,
        src: `/projects/raw-fiction-content/collections/pure-chlorine/HER_${i + 1}.jpg`,
        alt: `Pure Chlorine Collection Her ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'pure-chlorine',
        galleryId: 'pure-chlorine-main',
      })),

      // Racism Collection - R1-1 to R1-4, R2-1 to R2-4, etc.
      ...['R1', 'R2', 'R4', 'R7', 'R9', 'R10', 'R11', 'R12'].flatMap(code =>
        Array.from({ length: 4 }, (_, i) => ({
          id: `racism-${code.toLowerCase()}-${i + 1}`,
          src: `/projects/raw-fiction-content/collections/racism/${code}-${i + 1}.jpg`,
          alt: `Racism Collection ${code} Variant ${i + 1}`,
          priority: 'medium' as const,
          tabId: 'racism',
          galleryId: 'racism-main',
        }))
      ),

      // Vintage Images
      ...Array.from({ length: 34 }, (_, i) => ({
        id: `vintage-${i + 1}`,
        src: `/projects/raw-fiction-content/website-archive/rawfiction${i + 1}.png`,
        alt: `Vintage Raw Fiction Website Screenshot ${i + 1}`,
        priority: 'low' as const,
        tabId: 'website-archive',
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

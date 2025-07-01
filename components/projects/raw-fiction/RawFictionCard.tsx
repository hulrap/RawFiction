import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { TabContainer } from '../../shared/TabContainer';
import { ImageGallery } from './ImageGallery';
import type { ProjectProps, TabItem } from '../../shared/types';

// Background Video Component for the entire Raw Fiction window
const BackgroundVideo: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-15 scale-125"
      preload="auto"
    >
      <source src="/projects/raw-fiction-content/rawfiction-background.mp4" type="video/mp4" />
    </video>

    {/* Subtle overlay to blend with content */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
);

export const RawFictionCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigateToTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">RAW FICTION</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Raw Fiction is a cutting-edge fashion brand that pushes the boundaries of
                contemporary design. Our collections blend raw materials with sophisticated
                craftsmanship to create pieces that tell stories.
              </p>
              <div className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-full text-sm font-medium text-white">
                eco - fair - handmade - vegan
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {[
                {
                  name: 'GARBAGE PLANET',
                  backgroundImage:
                    '/projects/raw-fiction-content/archive/editorial/garbage-planet-1/Editorial_25.jpg',
                },
                {
                  name: 'PRIDE',
                  backgroundImage:
                    '/projects/raw-fiction-content/archive/editorial/pride/IMG_9332.JPG',
                },
                {
                  name: 'PURE CHLORINE',
                  backgroundImage:
                    '/projects/raw-fiction-content/archive/editorial/pure-chlorine/MG_7391 (12).jpg',
                },
                {
                  name: 'RACISM',
                  backgroundImage:
                    '/projects/raw-fiction-content/archive/editorial/racism/BLICKWINKEL-2.jpg',
                },
                {
                  name: 'ARCHIVE',
                  backgroundImage:
                    '/projects/raw-fiction-content/archive/editorial/garbage-planet-1/Editorial_87.jpg',
                },
              ].map(collection => {
                const getTabId = (name: string) => {
                  switch (name) {
                    case 'GARBAGE PLANET':
                      return 'garbage-planet';
                    case 'PRIDE':
                      return 'pride';
                    case 'PURE CHLORINE':
                      return 'pure-chlorine';
                    case 'RACISM':
                      return 'racism';
                    case 'ARCHIVE':
                      return 'digital-archives';
                    default:
                      return 'overview';
                  }
                };

                return (
                  <div
                    key={collection.name}
                    className="relative rounded-lg overflow-hidden h-48 group cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${collection.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    onClick={() => handleNavigateToTab(getTabId(collection.name))}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-xl font-bold text-white text-center px-4 drop-shadow-lg">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-4">Brand Philosophy</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  We believe fashion should be a form of artistic expression that challenges
                  conventional norms while maintaining wearability and comfort. Each piece is a
                  statement of individuality and creative rebellion.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
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
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-8 text-center">
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
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-8 text-center">
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
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-8 text-center">
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
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-8 text-center">
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
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Collection Story</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  The evolution of sustainable fashion. Featuring advanced materials like European
                  hemp and stainless steel armor, this collection pushes the boundaries of
                  eco-conscious design. From limited edition metal mesh armor to innovative wrap
                  garments, each piece represents the next chapter in environmental awareness
                  through fashion.
                </p>
              </div>

              {/* Credits Section */}
              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Photography</h4>
                    <p className="text-white text-lg">Ivana Dzoic</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-3">Models</h4>
                    <div className="space-y-1">
                      <p className="text-white">Nabé Begle</p>
                      <p className="text-white">Celina Abaez</p>
                      <p className="text-white">Liam Solbjerg</p>
                    </div>
                  </div>
                </div>
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
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
              <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-700/30 relative mb-6">
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

  return (
    <div className="h-full w-full relative">
      {/* Background Video */}
      <BackgroundVideo />

      {/* Main Content */}
      <div className="relative z-10 h-full">
        <TabContainer tabs={tabs} defaultTab={activeTab} className="h-full w-full" />
      </div>
    </div>
  );
};

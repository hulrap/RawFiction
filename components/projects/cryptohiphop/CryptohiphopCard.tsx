import React, { useCallback } from 'react';
import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const CryptohiphopCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string, context: string) => {
    console.error(`Crypto Hip Hop error [${context}]: ${error}`);
  }, []);

  const handleSuccess = useCallback((action: string) => {
    console.log(`Crypto Hip Hop success: ${action}`);
  }, []);

  // Define tabs for the crypto hip hop platform
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-4xl text-center space-y-8">
            <h1 className="heading-main mb-6">Crypto Hip Hop</h1>
            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              Where blockchain meets beats. Crypto Hip Hop is a revolutionary platform connecting
              artists, collectors, and fans in the digital music ecosystem.
            </p>
            <div className="text-sm opacity-75 mt-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full">
                <span>🚀</span>
                <span>Next-Gen Music Platform</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'artists',
      title: 'Artists',
      content: (
        <div className="h-full w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="heading-main mb-4">🎵 For Artists</h2>
              <p className="text-lg opacity-90">
                Empower your creativity with blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">💰 Monetize Your Music</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Tokenize your tracks and connect directly with fans through NFTs and exclusive
                  releases. Keep more of your earnings with smart contract royalties.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Direct fan engagement</div>
                  <div>• Smart contract royalties</div>
                  <div>• Exclusive NFT drops</div>
                </div>
              </div>

              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">🔥 Build Your Brand</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Create limited edition content, collaborate with other artists, and build a loyal
                  community around your music.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Limited edition releases</div>
                  <div>• Artist collaborations</div>
                  <div>• Community building tools</div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-8">
              <h3 className="heading-card mb-6">Artist Tools</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-3">🎚️</div>
                  <h4 className="heading-card text-sm mb-2">Studio Integration</h4>
                  <p className="text-xs opacity-60">Upload directly from your DAW</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-3">📊</div>
                  <h4 className="heading-card text-sm mb-2">Analytics</h4>
                  <p className="text-xs opacity-60">Track performance & earnings</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-3">🤝</div>
                  <h4 className="heading-card text-sm mb-2">Collaboration</h4>
                  <p className="text-xs opacity-60">Connect with other artists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'collectors',
      title: 'Collectors',
      content: (
        <div className="h-full w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="heading-main mb-4">💎 For Collectors</h2>
              <p className="text-lg opacity-90">Discover and collect unique musical experiences</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">🎯 Rare Finds</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Discover unique musical NFTs, rare tracks, and exclusive artist collaborations on
                  the blockchain. Be the first to own limited drops.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Limited edition tracks</div>
                  <div>• Artist collaborations</div>
                  <div>• Exclusive content access</div>
                </div>
              </div>

              <div className="card-glass p-8">
                <h3 className="heading-card mb-6">📈 Investment Potential</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Build a valuable collection of music NFTs. Support emerging artists and
                  potentially profit as their careers grow.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Portfolio tracking</div>
                  <div>• Artist career support</div>
                  <div>• Resale marketplace</div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-8">
              <h3 className="heading-card mb-6">Collection Features</h3>
              <div className="space-y-4 text-sm opacity-90">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div className="flex items-center space-x-3">
                    <span>🎵</span>
                    <div>
                      <div className="font-semibold">Music NFTs</div>
                      <div className="text-xs opacity-60">Original tracks & remixes</div>
                    </div>
                  </div>
                  <span className="text-yellow-400 px-3 py-1 bg-gray-800 rounded">Hot 🔥</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div className="flex items-center space-x-3">
                    <span>🎤</span>
                    <div>
                      <div className="font-semibold">Live Recordings</div>
                      <div className="text-xs opacity-60">Exclusive concert captures</div>
                    </div>
                  </div>
                  <span className="text-yellow-400 px-3 py-1 bg-gray-800 rounded">Rare 💎</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span>🎛️</span>
                    <div>
                      <div className="font-semibold">Studio Sessions</div>
                      <div className="text-xs opacity-60">Behind-the-scenes content</div>
                    </div>
                  </div>
                  <span className="text-yellow-400 px-3 py-1 bg-gray-800 rounded">Premium ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'community',
      title: 'Community',
      content: (
        <div className="h-full w-full p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="heading-main mb-4">🎤 Community</h2>
              <p className="text-lg opacity-90">Join the movement reshaping the music industry</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-glass p-6 text-center">
                <div className="text-2xl mb-3">🌍</div>
                <h4 className="heading-card text-sm mb-2">Global Network</h4>
                <p className="text-xs opacity-60">Hip hop enthusiasts worldwide</p>
              </div>
              <div className="card-glass p-6 text-center">
                <div className="text-2xl mb-3">🎧</div>
                <h4 className="heading-card text-sm mb-2">Producers Hub</h4>
                <p className="text-xs opacity-60">Beats, samples, and collaboration</p>
              </div>
              <div className="card-glass p-6 text-center">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="heading-card text-sm mb-2">Crypto Natives</h4>
                <p className="text-xs opacity-60">Blockchain music pioneers</p>
              </div>
            </div>

            <div className="card-anthracite p-8 space-y-6">
              <h3 className="heading-card mb-6">Platform Features</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">NFT Music Drops</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">Artist Royalties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">Community Governance</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">Exclusive Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">Fan Engagement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span className="text-sm">Blockchain Integration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="card-glass p-6 inline-block">
                <h4 className="heading-card text-sm mb-2">Ready to Join?</h4>
                <p className="text-xs opacity-75 mb-4">
                  Connect your wallet and start exploring the future of hip hop
                </p>
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <span>🚀</span>
                  <span className="text-sm font-semibold">Launch the Beat Revolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration for the crypto hip hop platform
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'artists', title: 'Artists', priority: 'preload' as const },
      {
        id: 'collectors',
        title: 'Collectors',
        hasGallery: true,
        imageCount: 8,
        priority: 'preload' as const,
      },
      { id: 'community', title: 'Community', priority: 'lazy' as const },
    ],
    images: [
      // Placeholder image configs for potential future NFT gallery integration
      {
        id: 'nft-1',
        src: '/placeholder/nft-track-1.jpg',
        alt: 'Hip Hop NFT Track',
        priority: 'high' as const,
        tabId: 'collectors',
      },
      {
        id: 'nft-2',
        src: '/placeholder/nft-track-2.jpg',
        alt: 'Exclusive Beat Drop',
        priority: 'medium' as const,
        tabId: 'collectors',
      },
      {
        id: 'artist-1',
        src: '/placeholder/artist-collab-1.jpg',
        alt: 'Artist Collaboration',
        priority: 'medium' as const,
        tabId: 'artists',
      },
      {
        id: 'community-1',
        src: '/placeholder/community-event-1.jpg',
        alt: 'Community Event',
        priority: 'low' as const,
        tabId: 'community',
      },
    ],
  };

  return (
    <ContentWrapper
      id="crypto-hiphop-platform"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
      loadingConfig={loadingConfig}
    />
  );
};

import React from 'react';
import { ProjectProps } from '../../shared/types';

export const CryptohiphopCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full p-8 flex items-center justify-center">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="heading-main mb-6">Crypto Hip Hop</h1>
        <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
          Where blockchain meets beats. Crypto Hip Hop is a revolutionary platform 
          connecting artists, collectors, and fans in the digital music ecosystem.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">🎵 Artists</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Empowering hip hop artists to tokenize their music and connect 
              directly with fans through NFTs and exclusive releases.
            </p>
          </div>
          
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">💎 Collectors</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Discover and collect unique musical NFTs, rare tracks, and 
              exclusive artist collaborations on the blockchain.
            </p>
          </div>

          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">🎤 Community</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Join a vibrant community of hip hop enthusiasts, producers, 
              and crypto natives reshaping the music industry.
            </p>
          </div>
        </div>

        <div className="card-anthracite p-8">
          <h3 className="heading-card mb-6">Platform Features</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">NFT Music Drops</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">Artist Royalties</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">Community Governance</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">Exclusive Content</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">Fan Engagement</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                <span className="text-sm">Blockchain Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
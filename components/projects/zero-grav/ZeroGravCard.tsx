import React from 'react';
import { TabContainer } from '../../shared/TabContainer';
import { ZeroGravWebsite } from './ZeroGravWebsite';
import { ProjectProps, TabItem } from '../../shared/types';

export const ZeroGravCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const OpenseaViewer: React.FC = () => (
    <div className="h-full w-full">
      <div className="website-container">
        <div className="p-6 text-center">
          <h3 className="heading-card mb-4">OpenSea Collection</h3>
          <p className="text-sm opacity-75 mb-6">
            View the 1080 Zero Grav collection on OpenSea. Note: This is a view-only 
            experience - wallet connection and purchasing features are disabled.
          </p>
          
          <div className="card-glass p-6 mb-6">
            <h4 className="font-semibold text-metallic mb-3">Collection Features</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <div className="font-medium mb-2">• Unique gravitational fields</div>
                <div className="font-medium mb-2">• Interactive 3D models</div>
                <div className="font-medium mb-2">• Physics-based animations</div>
              </div>
              <div className="text-left">
                <div className="font-medium mb-2">• Rarity-based traits</div>
                <div className="font-medium mb-2">• Metaverse integration</div>
                <div className="font-medium mb-2">• Exclusive holder benefits</div>
              </div>
            </div>
          </div>

          <a
            href="https://opensea.io/collection/zero-grav-1080"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            View on OpenSea
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="mt-8 text-xs opacity-60">
            Note: External links open in new tabs. Wallet features are disabled for viewing only.
          </div>
        </div>
      </div>
    </div>
  );

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="heading-main mb-6">1080 Zero Grav</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              1080 Zero Grav is an innovative NFT collection that explores the concept 
              of weightlessness in digital space. Each piece represents a unique 
              gravitational field in the metaverse.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Collection Concept</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Zero Grav explores the physics of digital space, where traditional 
                laws of gravity don't apply. Each NFT represents a unique gravitational 
                field with its own properties and interactions.
              </p>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Dual Platform</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Experience our collection both on our dedicated website and through 
                OpenSea's marketplace. Each platform offers unique features and 
                viewing experiences.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">1080</div>
              <div className="text-sm opacity-75">Unique NFTs</div>
            </div>
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">0G</div>
              <div className="text-sm opacity-75">Gravity</div>
            </div>
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">∞</div>
              <div className="text-sm opacity-75">Possibilities</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'website',
      title: 'Zero Grav Site',
      content: <ZeroGravWebsite />
    },
    {
      id: 'opensea',
      title: 'OpenSea Collection',
      content: <OpenseaViewer />
    },
    {
      id: 'about',
      title: 'About',
      content: (
        <div className="space-y-6">
          <h2 className="heading-section">About the Collection</h2>
          <div className="space-y-4 text-sm leading-relaxed opacity-90">
            <p>
              1080 Zero Grav represents a breakthrough in digital art and physics 
              simulation. Each NFT in the collection contains unique gravitational 
              properties that can be experienced in virtual environments.
            </p>
            <p>
              The collection was created using advanced physics simulations and 
              generative algorithms that ensure each piece has distinct gravitational 
              characteristics. No two Zero Grav NFTs behave the same way.
            </p>
            <p>
              Holders of Zero Grav NFTs gain access to exclusive virtual spaces 
              where they can experience their gravitational fields in interactive 
              3D environments.
            </p>
          </div>
          
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">Technical Specifications</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-metallic mb-2">Blockchain</div>
                <div className="opacity-75">Ethereum</div>
              </div>
              <div>
                <div className="font-semibold text-metallic mb-2">Token Standard</div>
                <div className="opacity-75">ERC-721</div>
              </div>
              <div>
                <div className="font-semibold text-metallic mb-2">Total Supply</div>
                <div className="opacity-75">1,080 NFTs</div>
              </div>
              <div>
                <div className="font-semibold text-metallic mb-2">Format</div>
                <div className="opacity-75">Interactive 3D</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full w-full p-8 overflow-hidden">
      <TabContainer tabs={tabs} defaultTab="overview" className="h-full" />
    </div>
  );
}; 
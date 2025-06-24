import React from 'react';

export const OpenseaViewer: React.FC = () => {
  return (
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
}; 
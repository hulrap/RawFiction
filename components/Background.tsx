import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(/images/background.png)',
          filter: 'grayscale(100%) contrast(140%) brightness(0.3)'
        }}
      />
      
      {/* Anthracite Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            var(--brand-anthracite-dark) 0%, 
            var(--brand-bg) 25%, 
            var(--brand-anthracite-dark) 50%, 
            var(--brand-bg) 75%, 
            var(--brand-anthracite-dark) 100%
          )`,
          opacity: 0.95
        }}
      />
      
      {/* Technical Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--brand-glass) 1px, transparent 1px),
            linear-gradient(to bottom, var(--brand-glass) 1px, transparent 1px),
            linear-gradient(to right, var(--brand-metallic)20 1px, transparent 1px),
            linear-gradient(to bottom, var(--brand-metallic)20 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 200px 200px, 200px 200px'
        }}
      />
      
      {/* Fine Technical Grid Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--brand-glass-dark) 0.5px, transparent 0.5px),
            linear-gradient(to bottom, var(--brand-glass-dark) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '25px 25px'
        }}
      />

      {/* Metallic Shine Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, var(--brand-metallic)10 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--brand-metallic)08 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, var(--brand-metallic)05 0%, transparent 60%)
          `
        }}
      />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, var(--brand-bg) 100%)',
          opacity: 0.6
        }}
      />
    </div>
  );
}; 
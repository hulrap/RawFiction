import React from 'react';
import { ProjectProps } from '../../shared/types';

export const ConfidentialCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full p-8 flex items-center justify-center">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="heading-main mb-6">[Confidential]</h1>
        <p className="text-xl opacity-90 leading-relaxed">
          A luxury fashion brand that pushes the boundaries of contemporary design 
          while maintaining the highest standards of craftsmanship and exclusivity.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">Brand Philosophy</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Creating timeless pieces that embody sophistication and innovation, 
              designed for those who appreciate the finer aspects of fashion.
            </p>
          </div>
          
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">Exclusive Access</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Our collections are available by invitation only, ensuring exclusivity 
              and personalized service for our discerning clientele.
            </p>
          </div>
        </div>

        <div className="card-anthracite p-8">
          <h3 className="heading-card mb-4">Collections</h3>
          <div className="space-y-4 text-sm opacity-90">
            <div className="flex justify-between items-center">
              <span>Haute Couture</span>
              <span className="text-metallic">Limited Edition</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ready-to-Wear</span>
              <span className="text-metallic">Seasonal</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Accessories</span>
              <span className="text-metallic">Curated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
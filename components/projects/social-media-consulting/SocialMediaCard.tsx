import React from 'react';
import { ProjectProps } from '../../shared/types';

export const SocialMediaCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  return (
    <div className="h-full w-full p-8 flex items-center justify-center">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="heading-main mb-6">Social Media Consulting</h1>
        <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
          Strategic social media consulting and traffic generation services 
          for businesses looking to amplify their digital presence and reach.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">📈 Traffic Generation</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Proven strategies to drive high-quality traffic to your website 
              and convert visitors into customers through targeted campaigns.
            </p>
          </div>
          
          <div className="card-glass p-6">
            <h3 className="heading-card mb-4">🎯 Strategy Consulting</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Comprehensive social media strategies tailored to your brand's 
              unique voice and business objectives across all platforms.
            </p>
          </div>
        </div>

        <div className="card-anthracite p-8">
          <h3 className="heading-card mb-6">Services</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-metallic mb-2">Content Strategy</div>
              <div className="text-sm opacity-75">Creating engaging content that resonates with your audience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-metallic mb-2">Paid Advertising</div>
              <div className="text-sm opacity-75">ROI-focused ad campaigns across multiple platforms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-metallic mb-2">Analytics & Growth</div>
              <div className="text-sm opacity-75">Data-driven insights to optimize performance</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="card-glass p-4 text-center">
            <div className="text-lg font-bold text-metallic">500%</div>
            <div className="text-xs opacity-75">Avg. Traffic Increase</div>
          </div>
          <div className="card-glass p-4 text-center">
            <div className="text-lg font-bold text-metallic">50+</div>
            <div className="text-xs opacity-75">Satisfied Clients</div>
          </div>
          <div className="card-glass p-4 text-center">
            <div className="text-lg font-bold text-metallic">24/7</div>
            <div className="text-xs opacity-75">Campaign Monitoring</div>
          </div>
          <div className="card-glass p-4 text-center">
            <div className="text-lg font-bold text-metallic">3-5x</div>
            <div className="text-xs opacity-75">ROI Average</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
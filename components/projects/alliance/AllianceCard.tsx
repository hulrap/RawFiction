import React from 'react';
import { TabContainer } from '../../shared/TabContainer';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import { ProjectProps, TabItem } from '../../shared/types';

export const AllianceCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="heading-main mb-6">Alliance</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Alliance is a platform fostering inclusive communities and supporting 
              underrepresented voices in technology, creativity, and social impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">🤝 Community</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Building bridges between diverse communities and creating spaces 
                where everyone can thrive and contribute their unique perspectives.
              </p>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">🌟 Empowerment</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Providing resources, mentorship, and opportunities to amplify 
                voices that are often underrepresented in traditional spaces.
              </p>
            </div>
          </div>

          <div className="card-anthracite p-8">
            <h3 className="heading-card mb-6">Core Values</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Inclusivity & Accessibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Authentic Representation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Collaborative Growth</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Social Impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Innovation & Creativity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full"></span>
                  <span>Sustainable Change</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'website',
      title: 'Alliance Website',
      content: (
        <EmbeddedWebsiteFrame
          url="https://queer-alliance.com"
          title="Alliance"
          isActive={isActive}
          allowScrolling={true}
        />
      )
    },
    {
      id: 'impact',
      title: 'Impact',
      content: (
        <div className="space-y-6">
          <h2 className="heading-section">Making a Difference</h2>
          <div className="space-y-4 text-sm leading-relaxed opacity-90">
            <p>
              Alliance has been instrumental in creating meaningful connections 
              and opportunities within diverse communities, particularly focusing 
              on LGBTQ+ rights and inclusion.
            </p>
            <p>
              Through workshops, mentorship programs, and community events, we've 
              helped hundreds of individuals find their voice and build successful 
              careers in technology and creative industries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card-glass p-4 text-center">
              <div className="text-2xl font-bold text-metallic">500+</div>
              <div className="text-sm opacity-75">Community Members</div>
            </div>
            <div className="card-glass p-4 text-center">
              <div className="text-2xl font-bold text-metallic">50+</div>
              <div className="text-sm opacity-75">Events Hosted</div>
            </div>
            <div className="card-glass p-4 text-center">
              <div className="text-2xl font-bold text-metallic">100%</div>
              <div className="text-sm opacity-75">Inclusive</div>
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
import React, { useCallback } from 'react';
import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const SocialMediaCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string, context: string) => {
    console.error(`Social Media Consulting error [${context}]: ${error}`);
  }, []);

  const handleSuccess = useCallback((action: string) => {
    console.info(`Social Media Consulting success: ${action}`);
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-4xl text-center space-y-8">
            <div className="text-center">
              <h1 className="heading-main mb-6 text-white">Social Media Consulting</h1>
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full text-sm font-medium mb-8">
                Facebook Strategy • Event Marketing • Traffic Generation
              </div>
              <p className="text-lg text-white opacity-100 leading-relaxed max-w-3xl mx-auto">
                Between 2012 and 2016, I created and ran a network of social media accounts,
                specializing in event marketing and traffic generation during Facebook&apos;s early
                monetization phase.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'strategy',
      title: 'Strategy',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="heading-section">Marketing Strategy</h2>
              <p className="text-lg opacity-90">Early Facebook marketing and traffic generation</p>
            </div>

            <div className="card-glass p-8">
              <p className="text-base opacity-90 leading-relaxed text-center">
                Between 2012 and 2016 I have created and ran a network of social media accounts,
                auto-befriending other users who attended specific events. This was at a time where
                Facebook did not offer any advertising options yet and was still in the middle of
                figuring out how to monetize the platform properly. Initially, all event attenders
                to a Facebook event were visible to everyone. This made it possible to add all
                attendees of a specific event and create specialized genre-specific geographical
                targeting as an &quot;owned&quot; audience. Javascript made it possible to invite
                all friends of an account to a Facebook event without spending hours. During this
                phase of Facebook, I have consulted numerous clubbings and locations in Vienna
                regarding their online strategy and acted as a traffic seller, offering up to 50,000
                real invites for a single event, a significant portion of the entire
                Facebook-registered youth in Vienna at that time (30% of all 18-24 individuals
                living in the metropole).
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-glass p-6 text-center">
                <h3 className="text-lg font-semibold text-brand-accent mb-3">Network Strategy</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Built specialized social media networks targeting event attendees with
                  genre-specific geographical focus.
                </p>
              </div>

              <div className="card-glass p-6 text-center">
                <h3 className="text-lg font-semibold text-brand-metallic mb-3">Automation</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Developed JavaScript solutions for mass event invitations, reaching thousands of
                  users efficiently.
                </p>
              </div>

              <div className="card-glass p-6 text-center">
                <h3 className="text-lg font-semibold text-brand-accent mb-3">Market Impact</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Reached 30% of Vienna&apos;s 18-24 demographic, offering up to 50,000 real invites
                  per event.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'results',
      title: 'Results',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="heading-section">Campaign Results</h2>
              <p className="text-lg opacity-90">Key metrics and achievements</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8 text-center hover:bg-slate-900/20 transition-colors group">
                <div className="text-5xl font-bold text-brand-accent mb-4 group-hover:scale-110 transition-transform">
                  63
                </div>
                <div className="text-lg font-medium mb-2">Events Served</div>
                <div className="text-sm opacity-75">Clubs and venues in Vienna</div>
              </div>

              <div className="card-glass p-8 text-center hover:bg-zinc-900/20 transition-colors group">
                <div className="text-5xl font-bold text-brand-metallic mb-4 group-hover:scale-110 transition-transform">
                  1.3M
                </div>
                <div className="text-lg font-medium mb-2">Total Event Invites</div>
                <div className="text-sm opacity-75">Real invitations delivered</div>
              </div>
            </div>

            <div className="card-anthracite p-8 space-y-6">
              <h3 className="heading-card">Impact Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Penetration</span>
                    <span className="font-semibold text-brand-accent">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Age Group Reach</span>
                    <span className="font-semibold text-brand-metallic">18-24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Geographic Focus</span>
                    <span className="font-semibold">Vienna</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Invites per Event</span>
                    <span className="font-semibold text-brand-accent">50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Campaign Duration</span>
                    <span className="font-semibold text-brand-metallic">4 Years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Period</span>
                    <span className="font-semibold">2012-2016</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'technology',
      title: 'Technology',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="heading-section">Technical Implementation</h2>
              <p className="text-lg opacity-90">Tools and automation systems</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-6 text-center">
                <h3 className="heading-card mb-4">JavaScript Automation</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Developed custom scripts to automate friend requests and event invitations,
                  scaling operations to handle thousands of users efficiently.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Automated friend requests</div>
                  <div>• Mass event invitations</div>
                  <div>• Audience targeting</div>
                </div>
              </div>

              <div className="card-glass p-6 text-center">
                <h3 className="heading-card mb-4">Network Management</h3>
                <p className="text-sm opacity-75 leading-relaxed mb-4">
                  Coordinated multiple social media accounts with specialized targeting for
                  different event genres and geographical areas.
                </p>
                <div className="space-y-2 text-xs opacity-60">
                  <div>• Multi-account coordination</div>
                  <div>• Genre-specific targeting</div>
                  <div>• Geographic segmentation</div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-6 text-center">
              <h3 className="heading-card mb-4">Platform Evolution</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                This work was conducted during Facebook&apos;s early monetization phase (2012-2016),
                before the platform introduced formal advertising options. The strategies utilized
                the platform&apos;s open API access and public event visibility, which were later
                restricted as Facebook evolved its privacy and advertising policies.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'strategy', title: 'Strategy', priority: 'preload' as const },
      { id: 'results', title: 'Results', priority: 'preload' as const },
      { id: 'technology', title: 'Technology', priority: 'lazy' as const },
    ],
    images: [
      // No images for this card, but required for the loading config
    ],
  };

  return (
    <ContentWrapper
      id="social-media-consulting"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
      loadingConfig={loadingConfig}
    />
  );
};

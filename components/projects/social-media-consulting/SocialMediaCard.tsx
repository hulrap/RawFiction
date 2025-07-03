import React from 'react';
import type { ProjectProps } from '../../shared/types';

export const SocialMediaCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="heading-main mb-6 bg-gradient-to-r from-brand-accent to-brand-metallic bg-clip-text text-transparent">
            Social Media Consulting
          </h1>
          <div className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full text-sm font-medium">
            Facebook Strategy • Event Marketing • Traffic Generation
          </div>
        </div>

        <div className="card-glass p-8">
          <p className="text-lg opacity-90 leading-relaxed text-center">
            Between 2012 and 2016 I have created and ran a network of social media accounts,
            auto-befriending other users who attended specific events. This was at a time where
            Facebook did not offer any advertising options yet and was still in the middle of
            figuring out how to monetize the platform properly. Initially, all event attenders to a
            Facebook event were visible to everyone. This made it possible to add all attendees of a
            specific event and create specialized genre-specific geographical targeting as an
            &quot;owned&quot; audience. Javascript made it possible to invite all friends of an
            account to a Facebook event without spending hours. During this phase of Facebook, I
            have consulted numerous clubbings and locations in Vienna regarding their online
            strategy and acted as a traffic seller, offering up to 50.000 real invites for a single
            event, a significant portion of the entire Facebook-registered youth in Vienna at that
            time (30% of all 18-24 individuals living in the metropole).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-glass p-8 text-center hover:bg-slate-900/20 transition-colors group">
            <div className="text-4xl font-bold text-brand-accent mb-3 group-hover:scale-110 transition-transform">
              63
            </div>
            <div className="text-sm opacity-75 font-medium">Events Served</div>
          </div>
          <div className="card-glass p-8 text-center hover:bg-zinc-900/20 transition-colors group">
            <div className="text-4xl font-bold text-brand-metallic mb-3 group-hover:scale-110 transition-transform">
              1.3M
            </div>
            <div className="text-sm opacity-75 font-medium">Total Event Invites</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-glass p-6 text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Network Strategy</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Built specialized social media networks targeting event attendees with genre-specific
              geographical focus.
            </p>
          </div>

          <div className="card-glass p-6 text-center">
            <h3 className="text-lg font-semibold text-brand-metallic mb-3">Automation</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Developed JavaScript solutions for mass event invitations, reaching thousands of users
              efficiently.
            </p>
          </div>

          <div className="card-glass p-6 text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Market Impact</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Reached 30% of Vienna&apos;s 18-24 demographic, offering up to 50,000 real invites per
              event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

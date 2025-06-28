import React from 'react';
import { ContentWrapper } from './Wrapper';
import { EmbeddedWebsiteFrame } from '../../shared/EmbeddedWebsiteFrame';
import type { ProjectProps, TabItem } from '../../shared/types';
const MANNER_EVENTS = [
  { id: '1', title: 'Spring Gathering', description: 'Early season garden conversations' },
  { id: '2', title: 'Summer Workshop', description: 'Intensive gardening techniques' },
  { id: '3', title: 'Harvest Festival', description: 'Celebrating the season&apos;s bounty' },
  { id: '4', title: 'Autumn Reflection', description: 'Contemplating growth and change' },
  { id: '5', title: 'Winter Planning', description: 'Preparing for the next cycle' },
  { id: '6', title: 'Community Build', description: 'Creating shared garden spaces' },
  { id: '7', title: 'Knowledge Share', description: 'Exchanging gardening wisdom' },
  { id: '8', title: 'Future Vision', description: 'Planning sustainable gardening futures' },
];

export const MannerImGartenCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 flex items-center justify-center">
          <div className="max-w-4xl space-y-8">
            <div className="text-center">
              <h1 className="heading-main mb-6">Männer im Garten</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                Männer im Garten is an event series exploring masculinity, nature, and community
                through the lens of gardening and environmental stewardship.
              </p>
              <div className="text-sm opacity-75 mt-8">
                <div className="inline-block px-4 py-2 bg-green-800 rounded-full">
                  🌱 Growing Community & Connection
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MANNER_EVENTS.map((event, _index) => (
                <div
                  key={event.id}
                  className="card-glass p-4 text-center hover:bg-green-900/20 transition-colors"
                >
                  <div className="text-lg font-bold text-green-400 mb-2">Event {_index + 1}</div>
                  <div className="text-sm font-medium mb-1">{event.title}</div>
                  <div className="text-xs opacity-75">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    ...MANNER_EVENTS.slice(0, 4).map((event, _index) => ({
      id: event.id,
      title: event.title,
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="heading-section">{event.title}</h2>
            <p className="text-lg opacity-90">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-anthracite p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Event Focus</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  This event brings together men from diverse backgrounds to explore themes of
                  growth, nurturing, and connection with nature through hands-on gardening
                  experiences.
                </p>
              </div>

              <div className="card-glass p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Community Impact</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Participants learn sustainable gardening practices while building meaningful
                  relationships and exploring new perspectives on masculinity and environmental
                  care.
                </p>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm opacity-75">
                <div className="space-y-2">
                  <div>🌱 Hands-on gardening workshops</div>
                  <div>🤝 Community building activities</div>
                  <div>🌿 Sustainable growing techniques</div>
                </div>
                <div className="space-y-2">
                  <div>💬 Meaningful conversations</div>
                  <div>🌳 Environmental stewardship</div>
                  <div>🌺 Seasonal garden planning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    })),
    {
      id: 'website',
      title: 'Website',
      content: (
        <div className="h-full w-full relative">
          <EmbeddedWebsiteFrame
            url="https://www.maenner-im-garten.com/"
            title="Männer im Garten Website"
          />
        </div>
      ),
    },
  ];

  // Loading configuration for garden events and website
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: '1', title: 'Spring Gathering', priority: 'preload' as const },
      { id: '2', title: 'Summer Workshop', priority: 'preload' as const },
      { id: '3', title: 'Harvest Festival', priority: 'preload' as const },
      { id: '4', title: 'Autumn Reflection', priority: 'lazy' as const },
      { id: 'website', title: 'Website', hasGallery: false, priority: 'lazy' as const },
    ],
    images: [
      // Garden event images
      {
        id: 'spring-garden-1',
        src: '/placeholder/spring-garden.jpg',
        alt: 'Spring Garden Scene',
        priority: 'high' as const,
        tabId: '1',
      },
      {
        id: 'summer-workshop-1',
        src: '/placeholder/summer-workshop.jpg',
        alt: 'Summer Workshop',
        priority: 'medium' as const,
        tabId: '2',
      },
      {
        id: 'harvest-festival-1',
        src: '/placeholder/harvest-festival.jpg',
        alt: 'Harvest Festival',
        priority: 'medium' as const,
        tabId: '3',
      },
      {
        id: 'autumn-reflection-1',
        src: '/placeholder/autumn-garden.jpg',
        alt: 'Autumn Garden',
        priority: 'low' as const,
        tabId: '4',
      },
      {
        id: 'community-garden-1',
        src: '/placeholder/community-garden.jpg',
        alt: 'Community Garden',
        priority: 'low' as const,
        tabId: 'overview',
      },
    ],
  };

  return (
    <ContentWrapper
      id="manner-im-garten"
      tabs={tabs}
      className="h-full w-full"
      loadingConfig={loadingConfig}
    />
  );
};

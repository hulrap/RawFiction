import React from 'react';
import { TabContainer } from '../../shared/TabContainer';
import { ProjectProps, TabItem } from '../../shared/types';

const MANNER_EVENTS = [
  { id: '1', title: 'Spring Gathering', description: 'Early season garden conversations' },
  { id: '2', title: 'Summer Workshop', description: 'Intensive gardening techniques' },
  { id: '3', title: 'Harvest Festival', description: 'Celebrating the season\'s bounty' },
  { id: '4', title: 'Autumn Reflection', description: 'Contemplating growth and change' },
  { id: '5', title: 'Winter Planning', description: 'Preparing for the next cycle' },
  { id: '6', title: 'Community Build', description: 'Creating shared garden spaces' },
  { id: '7', title: 'Knowledge Share', description: 'Exchanging gardening wisdom' },
  { id: '8', title: 'Future Vision', description: 'Planning sustainable gardening futures' }
];

export const MannerImGartenCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="heading-main mb-6">Männer im Garten</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Männer im Garten is an event series exploring masculinity, nature, and 
              community through the lens of gardening and environmental stewardship.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MANNER_EVENTS.map((event, index) => (
              <div key={event.id} className="card-glass p-4 text-center">
                <div className="text-lg font-bold text-metallic mb-2">
                  Event {index + 1}
                </div>
                <div className="text-sm font-medium mb-1">{event.title}</div>
                <div className="text-xs opacity-75">{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    ...MANNER_EVENTS.map((event, index) => ({
      id: event.id,
      title: event.title,
      content: (
        <div className="space-y-6">
          <h2 className="heading-section">{event.title}</h2>
          <p className="text-lg opacity-90">{event.description}</p>
          <div className="card-anthracite p-6">
            <p className="text-sm opacity-75">
              This event brings together men from diverse backgrounds to explore 
              themes of growth, nurturing, and connection with nature.
            </p>
          </div>
        </div>
      )
    }))
  ];

  return (
    <div className="h-full w-full p-8 overflow-hidden">
      <TabContainer tabs={tabs} defaultTab="overview" className="h-full" />
    </div>
  );
}; 
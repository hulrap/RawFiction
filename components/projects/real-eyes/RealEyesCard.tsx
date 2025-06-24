import React, { useState } from 'react';
import { TabContainer } from '../../shared/TabContainer';
import { ProjectProps, TabItem, EventData, REAL_EYES_EVENTS } from '../../shared/types';

export const RealEyesCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const EventDisplay: React.FC<{ event: EventData }> = ({ event }) => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-section mb-2">{event.title}</h2>
        {event.date && (
          <div className="text-sm opacity-75 mb-4">
            {new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
        <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
          {event.description}
        </p>
      </div>

      {event.images && event.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.images.map((image, index) => (
            <div
              key={index}
              className="card-glass p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`${event.title} - Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {event.details && event.details.length > 0 && (
        <div className="card-anthracite p-6">
          <h3 className="heading-card mb-4">Event Highlights</h3>
          <ul className="space-y-3">
            {event.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm opacity-90 leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-glass p-4 text-center">
          <div className="text-xl font-bold text-metallic mb-1">4h</div>
          <div className="text-sm opacity-75">Duration</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="text-xl font-bold text-metallic mb-1">50+</div>
          <div className="text-sm opacity-75">Participants</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="text-xl font-bold text-metallic mb-1">Mixed</div>
          <div className="text-sm opacity-75">Format</div>
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
            <h1 className="heading-main mb-6">Real Eyes</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Real Eyes is a transformative event series that explores the intersection 
              of technology, consciousness, and human experience through immersive experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Our Mission</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                To create spaces where people can explore new perspectives on reality, 
                technology, and human potential through carefully curated experiences.
              </p>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Event Series</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Seven unique events, each exploring a different aspect of human 
                consciousness and technological integration.
              </p>
            </div>
          </div>

          <div className="card-anthracite p-8 text-center">
            <h3 className="heading-card mb-4">7 Events</h3>
            <p className="text-sm opacity-75 mb-6">
              Each event offers a unique journey into the realms of consciousness, 
              technology, and human experience.
            </p>
            <div className="grid grid-cols-7 gap-2">
              {REAL_EYES_EVENTS.map((event: EventData, index: number) => (
                <div key={event.id} className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-accent to-brand-metallic rounded-full flex items-center justify-center text-xs font-bold text-brand-bg mx-auto mb-1">
                    {index + 1}
                  </div>
                  <div className="text-xs opacity-75">{event.title.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    ...REAL_EYES_EVENTS.map((event: EventData, index: number) => ({
      id: event.id,
      title: `Event ${index + 1}`,
      content: <EventDisplay event={event} />
    }))
  ];

  return (
    <div className="h-full w-full p-8 overflow-hidden">
      <TabContainer tabs={tabs} defaultTab="overview" className="h-full" />
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="card-glass p-6 max-w-4xl max-h-full overflow-auto">
            <img
              src={selectedImage}
              alt="Event Image"
              className="w-full h-auto max-h-96 object-contain mb-4"
            />
            <button
              className="btn-primary"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 
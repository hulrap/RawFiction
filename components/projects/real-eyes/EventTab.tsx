import React, { useState } from 'react';
import { EventData } from '../../shared/types';

interface EventTabProps {
  event: EventData;
}

export const EventTab: React.FC<EventTabProps> = ({ event }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
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

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="card-glass p-6 max-w-4xl max-h-full overflow-auto">
            <img
              src={selectedImage}
              alt={event.title}
              className="w-full h-auto max-h-96 object-contain mb-4"
            />
            <h3 className="heading-card mb-2">{event.title}</h3>
            <p className="text-sm opacity-75 mb-4">{event.description}</p>
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
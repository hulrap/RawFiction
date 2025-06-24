import React, { useState } from 'react';

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

// Placeholder images - replace with actual Raw Fiction images
const GALLERY_IMAGES: ImageItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    alt: 'Raw Fiction Collection 1',
    title: 'Urban Textures',
    description: 'Exploring the intersection of city life and fashion'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    alt: 'Raw Fiction Collection 2',
    title: 'Natural Elements',
    description: 'Incorporating organic materials into contemporary design'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    alt: 'Raw Fiction Collection 3',
    title: 'Minimalist Approach',
    description: 'Clean lines meet raw materials'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    alt: 'Raw Fiction Collection 4',
    title: 'Street Style',
    description: 'Fashion that moves with urban culture'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1564584217132-2271339c0e3a?w=800&q=80',
    alt: 'Raw Fiction Collection 5',
    title: 'Avant-Garde',
    description: 'Pushing the boundaries of traditional fashion'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    alt: 'Raw Fiction Collection 6',
    title: 'Artisanal Craft',
    description: 'Hand-crafted details in every piece'
  }
];

export const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-section">Collection Gallery</h2>
        <p className="text-sm opacity-75 max-w-2xl mx-auto">
          Explore our latest collections showcasing the raw beauty of contemporary fashion
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map((image) => (
          <div
            key={image.id}
            className="card-glass p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-sm text-metallic mb-1">
                {image.title}
              </h3>
              <p className="text-xs opacity-75">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="card-glass p-6 max-w-4xl max-h-full overflow-auto">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-96 object-contain mb-4"
            />
            <h3 className="heading-card mb-2">{selectedImage.title}</h3>
            <p className="text-sm opacity-75">{selectedImage.description}</p>
            <button
              className="btn-primary mt-4"
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
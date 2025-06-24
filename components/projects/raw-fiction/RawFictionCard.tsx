import React, { useState } from 'react';
import { TabContainer } from '../../shared/TabContainer';
import { ImageGallery } from './ImageGallery';
import { ProjectProps, TabItem } from '../../shared/types';

export const RawFictionCard: React.FC<ProjectProps> = ({ isActive = true }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
  } | null>(null);

  const videoData = [
    {
      id: '1',
      title: 'Raw Fiction SS24 Campaign',
      description: 'Behind the scenes of our Spring/Summer 2024 collection shoot',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2:30'
    },
    {
      id: '2',
      title: 'Design Process',
      description: 'From concept to creation - our design philosophy',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:45'
    },
    {
      id: '3',
      title: 'Sustainable Fashion',
      description: 'Our commitment to environmental responsibility',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '4:15'
    },
    {
      id: '4',
      title: 'Street Style Lookbook',
      description: 'Raw Fiction pieces styled for urban life',
      thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '1:55'
    }
  ];

  const VideoGallery: React.FC = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-section">Video Gallery</h2>
        <p className="text-sm opacity-75 max-w-2xl mx-auto">
          Dive deeper into the Raw Fiction world through our curated video content
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {videoData.map((video) => (
          <div
            key={video.id}
            className="card-glass overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-metallic mb-2">{video.title}</h3>
              <p className="text-sm opacity-75">{video.description}</p>
            </div>
          </div>
        ))}
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
            <h1 className="heading-main mb-6">Raw Fiction</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Raw Fiction is a cutting-edge fashion brand that pushes the boundaries 
              of contemporary design. Our collections blend raw materials with 
              sophisticated craftsmanship to create pieces that tell stories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Brand Philosophy</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                We believe fashion should be a form of artistic expression that 
                challenges conventional norms while maintaining wearability and comfort.
              </p>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="heading-card mb-4">Collections</h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Our seasonal collections feature sustainable materials and 
                innovative designs that reflect current cultural movements.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'images',
      title: 'Gallery',
      content: <ImageGallery />
    },
    {
      id: 'videos',
      title: 'Videos',
      content: <VideoGallery />
    },
    {
      id: 'about',
      title: 'About',
      content: (
        <div className="space-y-6">
          <h2 className="heading-section">About Raw Fiction</h2>
          <div className="space-y-4 text-sm leading-relaxed opacity-90">
            <p>
              Founded in 2023, Raw Fiction emerged from a desire to create fashion 
              that speaks to the modern individual's need for authenticity and 
              self-expression.
            </p>
            <p>
              Our design team draws inspiration from urban landscapes, natural 
              textures, and the raw beauty of unfinished materials. Each piece 
              is carefully crafted to embody the tension between refinement and rawness.
            </p>
            <p>
              We work exclusively with sustainable materials and ethical production 
              methods, ensuring that our impact on the environment is minimal while 
              our impact on fashion is maximal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">2023</div>
              <div className="text-sm opacity-75">Founded</div>
            </div>
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">100%</div>
              <div className="text-sm opacity-75">Sustainable</div>
            </div>
            <div className="card-anthracite p-4 text-center">
              <div className="text-2xl font-bold text-metallic">50+</div>
              <div className="text-sm opacity-75">Unique Pieces</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full w-full p-8 overflow-hidden">
      <TabContainer tabs={tabs} defaultTab="overview" className="h-full" />
      
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="card-glass p-6 max-w-4xl w-full max-h-full overflow-auto">
            <div className="aspect-video mb-4">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="heading-card mb-2">{selectedVideo.title}</h3>
            <p className="text-sm opacity-75 mb-4">{selectedVideo.description}</p>
            <button
              className="btn-primary"
              onClick={() => setSelectedVideo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 
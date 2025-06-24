import React, { useState } from 'react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

// Placeholder videos - replace with actual Raw Fiction videos
const GALLERY_VIDEOS: VideoItem[] = [
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

export const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-section">Video Gallery</h2>
        <p className="text-sm opacity-75 max-w-2xl mx-auto">
          Dive deeper into the Raw Fiction world through our curated video content
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {GALLERY_VIDEOS.map((video) => (
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
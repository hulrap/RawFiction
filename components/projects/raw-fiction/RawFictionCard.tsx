import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { ContentWrapper } from './Wrapper';
import { ImageGallery } from './ImageGallery';
import type { ProjectProps, TabItem } from '../../shared/types';

export const RawFictionCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
  } | null>(null);

  const handleError = useCallback((error: string, context: string) => {
    // Production-grade error logging for fashion brand
    const errorReport = {
      error,
      context,
      brand: 'Raw Fiction',
      timestamp: Date.now(),
    };

    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.error('Raw Fiction error:', errorReport);
    }
  }, []);

  const handleSuccess = useCallback((_action: string) => {
    // Production-grade success tracking without console pollution
    // Could send to analytics service here
    if (process.env.NODE_ENV === 'development') {
      // Development-only success logging
    }
  }, []);

  const videoData = [
    {
      id: '1',
      title: 'Raw Fiction SS24 Campaign',
      description: 'Behind the scenes of our Spring/Summer 2024 collection shoot',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2:30',
    },
    {
      id: '2',
      title: 'Design Process',
      description: 'From concept to creation - our design philosophy',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:45',
    },
    {
      id: '3',
      title: 'Sustainable Fashion',
      description: 'Our commitment to environmental responsibility',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '4:15',
    },
    {
      id: '4',
      title: 'Street Style Lookbook',
      description: 'Raw Fiction pieces styled for urban life',
      thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '1:55',
    },
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
        {videoData.map(video => (
          <div
            key={video.id}
            className="card-glass overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
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
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="heading-main mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Raw Fiction
              </h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Raw Fiction is a cutting-edge fashion brand that pushes the boundaries of
                contemporary design. Our collections blend raw materials with sophisticated
                craftsmanship to create pieces that tell stories.
              </p>
              <div className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-medium">
                ✨ High Fashion • Digital Art • Luxury Collections
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {['SS24', 'AW23', 'Resort', 'Capsule', 'Archive'].map((collection, index) => (
                <div
                  key={collection}
                  className="card-glass p-6 text-center hover:bg-purple-900/20 transition-colors group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {index === 0
                      ? '🌸'
                      : index === 1
                        ? '🍂'
                        : index === 2
                          ? '🏖️'
                          : index === 3
                            ? '💎'
                            : '📚'}
                  </div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">{collection}</h3>
                  <p className="text-xs opacity-75">Collection {index + 1}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                <h3 className="heading-card mb-4 text-purple-300">Brand Philosophy</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  We believe fashion should be a form of artistic expression that challenges
                  conventional norms while maintaining wearability and comfort. Each piece is a
                  statement of individuality and creative rebellion.
                </p>
              </div>

              <div className="card-glass p-8 bg-gradient-to-br from-pink-900/20 to-purple-900/20">
                <h3 className="heading-card mb-4 text-pink-300">Digital Collections</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Our extensive digital archives contain hundreds of high-resolution fashion images,
                  behind-the-scenes content, and exclusive runway footage. Experience luxury fashion
                  through immersive digital galleries.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'collections-ss24',
      title: 'SS24',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="heading-section text-pink-300">Spring/Summer 2024</h2>
              <p className="text-lg opacity-90 mb-8">
                Ethereal Romance • Urban Edge • Sustainable Luxury
              </p>
            </div>
            <ImageGallery
              componentId="raw-fiction-ss24"
              collectionId="ss24"
              title="Spring/Summer 2024 Collection"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'collections-aw23',
      title: 'AW23',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="heading-section text-amber-300">Autumn/Winter 2023</h2>
              <p className="text-lg opacity-90 mb-8">
                Dark Academia • Structured Silhouettes • Rich Textures
              </p>
            </div>
            <ImageGallery
              componentId="raw-fiction-aw23"
              collectionId="aw23"
              title="Autumn/Winter 2023 Collection"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'digital-archives',
      title: 'Archives',
      content: (
        <div className="h-full w-full relative">
          <ImageGallery
            componentId="raw-fiction-archives"
            collectionId="archives"
            title="Digital Fashion Archives"
            desktopMode={true}
          />
        </div>
      ),
    },
    {
      id: 'vintage-site',
      title: 'Vintage Site',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-section text-indigo-300">Original Raw Fiction Website</h2>
              <p className="text-sm opacity-75">
                Archived from our early days - a snapshot of fashion history
              </p>
            </div>
            <div className="card-glass p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-indigo-500/30 relative">
                <Image
                  src="/placeholder/vintage-fashion-website.jpg"
                  alt="Vintage Raw Fiction Website Screenshot"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Raw Fiction v1.0</h3>
                    <p className="text-sm text-gray-300">
                      Archived: 2023 • Original Design Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'videos',
      title: 'Videos',
      content: <VideoGallery />,
    },
  ];

  // Sophisticated loading configuration for heavy fashion content
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      {
        id: 'collections-ss24',
        title: 'SS24',
        hasGallery: true,
        imageCount: 150,
        priority: 'preload' as const,
      },
      {
        id: 'collections-aw23',
        title: 'AW23',
        hasGallery: true,
        imageCount: 120,
        priority: 'preload' as const,
      },
      {
        id: 'digital-archives',
        title: 'Archives',
        hasGallery: true,
        imageCount: 500,
        priority: 'lazy' as const,
      },
      { id: 'vintage-site', title: 'Vintage Site', priority: 'lazy' as const },
      {
        id: 'videos',
        title: 'Videos',
        hasGallery: true,
        imageCount: 25,
        priority: 'lazy' as const,
      },
    ],
    images: [
      // SS24 Collection - High Priority Fashion Images
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `ss24-hero-${i + 1}`,
        src: `/placeholder/ss24-fashion-${i + 1}.jpg`,
        alt: `SS24 Fashion Look ${i + 1}`,
        priority: 'high' as const,
        tabId: 'collections-ss24',
        galleryId: 'ss24-main',
      })),

      // AW23 Collection
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `aw23-hero-${i + 1}`,
        src: `/placeholder/aw23-fashion-${i + 1}.jpg`,
        alt: `AW23 Fashion Look ${i + 1}`,
        priority: 'medium' as const,
        tabId: 'collections-aw23',
        galleryId: 'aw23-main',
      })),

      // Digital Archives - Hundreds of images
      ...Array.from({ length: 50 }, (_, i) => ({
        id: `archive-fashion-${i + 1}`,
        src: `/placeholder/archive-fashion-${i + 1}.jpg`,
        alt: `Archive Fashion ${i + 1}`,
        priority: 'low' as const,
        tabId: 'digital-archives',
        galleryId: 'archive-main',
      })),

      // Video Thumbnails
      ...videoData.map(video => ({
        id: `video-thumb-${video.id}`,
        src: video.thumbnail,
        alt: `${video.title} Thumbnail`,
        priority: 'low' as const,
        tabId: 'videos',
        galleryId: 'video-gallery',
      })),
    ],
  };

  return (
    <>
      <ContentWrapper
        id="raw-fiction"
        tabs={tabs}
        className="h-full w-full"
        onError={handleError}
        onSuccess={handleSuccess}
        loadingConfig={loadingConfig}
      />

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="card-glass p-6 max-w-5xl w-full max-h-full overflow-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="heading-card mb-2 text-purple-300">{selectedVideo.title}</h3>
            <p className="text-sm opacity-75 mb-4">{selectedVideo.description}</p>
            <button
              className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setSelectedVideo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

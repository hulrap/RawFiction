import React, { useState, useCallback } from 'react';
import { LazyImage } from '../../shared/LazyImage';

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  collection?: string;
  category: string;
  fileSize?: string;
  resolution?: string;
}

interface FolderItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'image' | 'video';
  itemCount?: number;
  size?: string;
  images?: ImageItem[];
}

// Fashion Collection Data Generator
const generateCollectionImages = (collectionId: string, count: number): ImageItem[] => {
  const collections = {
    ss24: {
      prefix: 'SS24',
      themes: [
        'Ethereal Romance',
        'Urban Edge',
        'Sustainable Luxury',
        'Minimalist Chic',
        'Avant-Garde',
      ],
      colors: ['Spring Pastels', 'Urban Neutrals', 'Botanical Greens', 'Sunset Hues'],
    },
    aw23: {
      prefix: 'AW23',
      themes: [
        'Dark Academia',
        'Structured Silhouettes',
        'Rich Textures',
        'Gothic Romance',
        'Modern Victorian',
      ],
      colors: ['Deep Burgundy', 'Midnight Black', 'Forest Green', 'Golden Bronze'],
    },
    archives: {
      prefix: 'Archive',
      themes: [
        'Vintage Couture',
        'Editorial Shoots',
        'Runway Backstage',
        'Designer Sketches',
        'Fashion Week',
      ],
      colors: ['Classic Black', 'Vintage Sepia', 'Studio White', 'Film Noir'],
    },
  };

  const collection = collections[collectionId as keyof typeof collections] ?? collections.archives;

  return Array.from({ length: count }, (_, i) => {
    const theme = collection.themes[i % collection.themes.length] ?? 'Fashion';
    const color = collection.colors[i % collection.colors.length] ?? 'neutral';

    return {
      id: `${collectionId}-${i + 1}`,
      src: `/placeholder/${collectionId}-fashion-${i + 1}.jpg`,
      alt: `${collection.prefix} Look ${i + 1}`,
      title: `${theme} ${i + 1}`,
      description: `High fashion piece featuring ${color.toLowerCase()} tones`,
      collection: collection.prefix,
      category: theme,
      fileSize: `${Math.floor(Math.random() * 15) + 8}MB`,
      resolution: '4K Ultra HD',
    };
  });
};

// Desktop Folder Structure for Archives
const ARCHIVE_FOLDERS: FolderItem[] = [
  {
    id: 'runway-2024',
    name: 'Runway 2024',
    icon: '🚶‍♀️',
    type: 'folder',
    itemCount: 247,
    size: '2.1GB',
    images: generateCollectionImages('runway-2024', 25),
  },
  {
    id: 'editorial-shoots',
    name: 'Editorial Shoots',
    icon: '📸',
    type: 'folder',
    itemCount: 189,
    size: '1.8GB',
    images: generateCollectionImages('editorial', 30),
  },
  {
    id: 'backstage-footage',
    name: 'Backstage',
    icon: '🎬',
    type: 'folder',
    itemCount: 156,
    size: '3.2GB',
    images: generateCollectionImages('backstage', 20),
  },
  {
    id: 'designer-sketches',
    name: 'Design Process',
    icon: '✏️',
    type: 'folder',
    itemCount: 94,
    size: '425MB',
    images: generateCollectionImages('sketches', 15),
  },
  {
    id: 'lookbook-archive',
    name: 'Lookbook Archive',
    icon: '📖',
    type: 'folder',
    itemCount: 312,
    size: '2.7GB',
    images: generateCollectionImages('lookbook', 35),
  },
  {
    id: 'fashion-week-coverage',
    name: 'Fashion Week',
    icon: '🏆',
    type: 'folder',
    itemCount: 428,
    size: '4.1GB',
    images: generateCollectionImages('fashion-week', 40),
  },
];

interface ImageGalleryProps {
  componentId?: string;
  collectionId?: string;
  title?: string;
  desktopMode?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  componentId = 'raw-fiction-gallery',
  collectionId = 'default',
  title = 'Fashion Gallery',
  desktopMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');

  // Generate images based on collection
  const collectionImages = generateCollectionImages(
    collectionId,
    collectionId === 'archives' ? 25 : 12
  );

  const openFolder = useCallback((folder: FolderItem) => {
    setCurrentFolder(folder);
  }, []);

  const closeFolder = useCallback(() => {
    setCurrentFolder(null);
  }, []);

  // Desktop Mode - Folder Explorer Interface
  if (desktopMode) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black p-6">
        {/* Desktop Header */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">💎</div>
            <div>
              <h2 className="text-lg font-bold text-purple-300">{title}</h2>
              <p className="text-xs text-gray-400">
                {currentFolder
                  ? `${currentFolder.name} • ${currentFolder.itemCount} items`
                  : `${ARCHIVE_FOLDERS.length} folders • ${ARCHIVE_FOLDERS.reduce((acc, f) => acc + (f.itemCount || 0), 0)} total items`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 bg-purple-600/50 hover:bg-purple-600/70 rounded text-xs transition-colors"
            >
              {viewMode === 'grid' ? '📋' : '⬜'} {viewMode === 'grid' ? 'List' : 'Grid'}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-2 py-1 bg-purple-600/50 rounded text-xs border-none text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {currentFolder && (
          <div className="flex items-center space-x-2 mb-4 text-sm">
            <button
              onClick={closeFolder}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              📁 Archives
            </button>
            <span className="text-gray-500">&gt;</span>
            <span className="text-pink-400">
              {currentFolder.icon} {currentFolder.name}
            </span>
          </div>
        )}

        {/* Folder/Image Grid */}
        <div
          className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}`}
        >
          {!currentFolder
            ? // Folder view
              ARCHIVE_FOLDERS.map(folder => (
                <div
                  key={folder.id}
                  className={`${viewMode === 'grid' ? 'card-glass p-4 text-center cursor-pointer hover:bg-purple-900/30 transition-colors group' : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-900/30 cursor-pointer transition-colors'}`}
                  onClick={() => openFolder(folder)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {folder.icon}
                      </div>
                      <h3 className="text-sm font-medium text-purple-300 mb-1">{folder.name}</h3>
                      <p className="text-xs text-gray-400">{folder.itemCount} items</p>
                      <p className="text-xs text-gray-500">{folder.size}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl">{folder.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-purple-300">{folder.name}</div>
                        <div className="text-xs text-gray-400">
                          {folder.itemCount} items • {folder.size}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Folder</div>
                    </>
                  )}
                </div>
              ))
            : // Image view within folder
              currentFolder.images?.map(image => (
                <div
                  key={image.id}
                  className={`${viewMode === 'grid' ? 'card-glass p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-900/30 cursor-pointer transition-colors'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <LazyImage
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-32 object-cover"
                        componentId={`${componentId}-${currentFolder.id}`}
                      />
                      <div className="p-3">
                        <h3 className="text-xs font-medium text-purple-300 mb-1 truncate">
                          {image.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{image.fileSize}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <LazyImage
                        src={image.src}
                        alt={image.alt}
                        className="w-12 h-12 object-cover rounded"
                        componentId={`${componentId}-${currentFolder.id}`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-purple-300 truncate">
                          {image.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {image.resolution} • {image.fileSize}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Image</div>
                    </>
                  )}
                </div>
              ))}
        </div>

        {/* High-Fashion Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="card-glass p-8 max-w-6xl max-h-full overflow-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-400/50">
              <LazyImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain mb-6 rounded-lg"
                componentId={`${componentId}-modal`}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-300 mb-2">{selectedImage.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{selectedImage.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Collection:</span>
                    <span className="text-pink-300">{selectedImage.collection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-purple-300">{selectedImage.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">File Size:</span>
                    <span className="text-gray-300">{selectedImage.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-gray-300">{selectedImage.resolution}</span>
                  </div>
                </div>
              </div>
              <button
                className="btn-primary mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => setSelectedImage(null)}
              >
                Close Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Gallery Mode for Collections
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-section bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-sm opacity-75 max-w-3xl mx-auto leading-relaxed">
          Experience raw fiction through high-resolution fashion photography. Each image captures
          the essence of contemporary luxury and artistic expression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionImages.map(image => (
          <div
            key={image.id}
            className="card-glass p-0 overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 group bg-gradient-to-br from-purple-900/20 to-pink-900/20"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative">
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                componentId={componentId}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs font-medium">{image.collection}</div>
                <div className="text-xs opacity-75">
                  {image.fileSize} • {image.resolution}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-purple-300 mb-2 text-sm">{image.title}</h3>
              <p className="text-xs opacity-75 leading-relaxed">{image.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-pink-400">{image.category}</span>
                <span className="text-gray-500">{image.fileSize}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Fashion Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="card-glass p-8 max-w-5xl max-h-full overflow-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-400/50">
            <LazyImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain mb-6 rounded-lg shadow-2xl"
              componentId={`${componentId}-modal`}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">{selectedImage.title}</h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Collection:</span>
                  <span className="text-pink-300">{selectedImage.collection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-purple-300">{selectedImage.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-gray-300">{selectedImage.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-gray-300">{selectedImage.resolution}</span>
                </div>
              </div>
            </div>
            <button
              className="btn-primary mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setSelectedImage(null)}
            >
              Close Gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

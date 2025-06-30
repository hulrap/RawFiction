import React, { useState, useCallback } from 'react';
import { LazyImage } from '../../shared/LazyImage';
import { generateGarbagePlanetProducts } from './collections/GarbagePlanetCollection';
import { generatePrideProducts } from './collections/PrideCollection';
import { generateRacismProducts } from './collections/RacismCollection';
import { generateEditorialImages } from './collections/EditorialCollection';
import type { ProductItem } from './collections/GarbagePlanetCollection';
import type { EditorialItem } from './collections/EditorialCollection';

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
  hasDescription?: boolean;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'video';
  itemCount?: number;
  size?: string;
  images?: ImageItem[];
  editorialImages?: EditorialItem[];
  productImages?: ProductItem[];
}

// Collection definitions based on actual content
const COLLECTIONS_DATA = {
  'garbage-planet': {
    name: 'Garbage Planet',
    description:
      'Sustainable fashion collection featuring handcrafted pieces made from 100% organic linen. Each garment is produced in Vienna, Austria with high environmental and social standards. The collection includes shirts (GB1-GB15) and detailed fashion pieces (GP16-GP23) with complete sustainability features.',
    productCount: 23,
  },
  'garbage-planet-2': {
    name: 'Garbage Planet 2.0',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.',
    productCount: 0,
  },
  pride: {
    name: 'Pride',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate.',
  },
  'pure-chlorine': {
    name: 'Pure Chlorine (Capsule)',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.',
    productCount: 0,
  },
  racism: {
    name: 'Racism',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sunt in culpa qui officia deserunt mollit anim.',
  },
};

// Archive folder structure
const ARCHIVE_FOLDERS: FolderItem[] = [
  {
    id: 'editorial-shoots',
    name: 'Editorial Shoots',
    type: 'folder',
    itemCount: 5,
    size: '2.3GB',
  },
  {
    id: 'backstage',
    name: 'Behind the Scenes',
    type: 'folder',
    itemCount: 0,
    size: '1.2GB',
  },
  {
    id: 'product-archive',
    name: 'Product Archive',
    type: 'folder',
    itemCount: 150,
    size: '3.1GB',
  },
];

interface ImageGalleryProps {
  componentId?: string;
  collectionId?: string;
  title?: string;
  mode?: 'collection' | 'editorial' | 'archive' | 'vintage';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  componentId = 'raw-fiction-gallery',
  collectionId = 'garbage-planet',
  title = 'Collection Gallery',
  mode = 'collection',
}) => {
  const [selectedImage, setSelectedImage] = useState<
    ImageItem | ProductItem | EditorialItem | null
  >(null);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');

  const openFolder = useCallback((folder: FolderItem) => {
    setCurrentFolder(folder);
  }, []);

  const closeFolder = useCallback(() => {
    setCurrentFolder(null);
  }, []);

  // Get images based on mode and collection
  const getImages = useCallback(() => {
    switch (mode) {
      case 'collection':
        switch (collectionId) {
          case 'garbage-planet':
            return generateGarbagePlanetProducts();
          case 'pride':
            return generatePrideProducts();
          case 'racism':
            return generateRacismProducts();
          default:
            return [];
        }
      case 'editorial':
        return generateEditorialImages(collectionId);
      case 'vintage':
        return Array.from({ length: 34 }, (_, i) => ({
          id: `vintage-${i + 1}`,
          src: `/projects/raw-fiction-content/website-archive/rawfiction${i + 1}.png`,
          alt: `Vintage Raw Fiction Website Screenshot ${i + 1}`,
          title: `Vintage Site ${i + 1}`,
          collection: 'Vintage Website',
          category: 'Archive',
          fileSize: `${Math.floor(Math.random() * 800 + 200)}KB`,
          resolution: 'Web Resolution',
          description: 'Original Raw Fiction website archive screenshot',
        }));
      default:
        return [];
    }
  }, [mode, collectionId]);

  const images = getImages();

  // Archive Mode - Folder Explorer Interface
  if (mode === 'archive') {
    return (
      <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black p-6">
        {/* Archive Header */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-lg p-4 border border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">RF</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-200">{title}</h2>
              <p className="text-xs text-gray-400">
                {currentFolder
                  ? `${currentFolder.name} • ${currentFolder.itemCount} items`
                  : `${ARCHIVE_FOLDERS.length} folders • Digital Archive`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600/70 rounded text-xs transition-colors text-white"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-2 py-1 bg-gray-600/50 rounded text-xs border-none text-white"
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
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Archives
            </button>
            <span className="text-gray-500">&gt;</span>
            <span className="text-gray-200">{currentFolder.name}</span>
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
                  className={`${viewMode === 'grid' ? 'bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700/50 transition-colors group' : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors'}`}
                  onClick={() => openFolder(folder)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-semibold">RF</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-200 mb-1">{folder.name}</h3>
                      <p className="text-xs text-gray-400">{folder.itemCount} items</p>
                      <p className="text-xs text-gray-500">{folder.size}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">RF</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-200">{folder.name}</div>
                        <div className="text-xs text-gray-400">
                          {folder.itemCount} items • {folder.size}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Folder</div>
                    </>
                  )}
                </div>
              ))
            : // Placeholder for folder contents
              Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className={`${viewMode === 'grid' ? 'bg-gray-800/50 border border-gray-700/50 rounded-lg p-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors'}`}
                  onClick={() =>
                    setSelectedImage({
                      id: `archive-${i}`,
                      src: `/placeholder/archive-${i}.jpg`,
                      alt: `Archive Item ${i}`,
                      title: `Archive ${i + 1}`,
                      category: 'Archive',
                      fileSize: '2.1MB',
                      resolution: '4K',
                      description: 'Archive content from Raw Fiction digital collection',
                    })
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <LazyImage
                        src={`/placeholder/archive-${i}.jpg`}
                        alt={`Archive Item ${i}`}
                        className="w-full h-32 object-cover"
                        componentId={`${componentId}-${currentFolder.id}`}
                      />
                      <div className="p-3">
                        <h3 className="text-xs font-medium text-gray-200 mb-1 truncate">
                          Archive {i + 1}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">2.1MB</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <LazyImage
                        src={`/placeholder/archive-${i}.jpg`}
                        alt={`Archive Item ${i}`}
                        className="w-12 h-12 object-cover rounded"
                        componentId={`${componentId}-${currentFolder.id}`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-200 truncate">
                          Archive {i + 1}
                        </div>
                        <div className="text-xs text-gray-400">4K • 2.1MB</div>
                      </div>
                      <div className="text-xs text-gray-500">Image</div>
                    </>
                  )}
                </div>
              ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="bg-gray-900/95 border border-gray-700/50 rounded-xl p-8 max-w-6xl max-h-full overflow-auto backdrop-blur-lg">
              <LazyImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain mb-6 rounded-lg"
                componentId={`${componentId}-modal`}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-sm text-gray-300 mb-4">{selectedImage.description}</p>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Collection:</span>
                    <span className="text-white">{selectedImage.collection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{selectedImage.category}</span>
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
                className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vintage Mode - Simple vertical image layout
  if (mode === 'vintage') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300 mb-6">{images.length} archived website screenshots</p>
        </div>

        <div className="space-y-8">
          {images.map((image, index) => (
            <div key={image.id} className="space-y-4">
              <div className="text-sm text-gray-400 font-mono">
                Screenshot {index + 1} of {images.length}
              </div>
              <div
                className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-800/30 cursor-pointer hover:border-gray-600/70 transition-colors"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal for vintage */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-7xl max-h-full overflow-auto">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <button
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Collection/Editorial Mode
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        {mode === 'collection' &&
          COLLECTIONS_DATA[collectionId as keyof typeof COLLECTIONS_DATA] && (
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {COLLECTIONS_DATA[collectionId as keyof typeof COLLECTIONS_DATA].description}
            </p>
          )}
      </div>

      {/* Collection Statistics */}
      {mode === 'collection' && (
        <div className="flex justify-center space-x-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{images.length}</div>
            <div className="text-gray-400">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {images.filter(img => 'hasDescription' in img && img.hasDescription).length}
            </div>
            <div className="text-gray-400">With Descriptions</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map(image => (
          <div
            key={image.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-white text-sm text-center">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-gray-900/95 border border-gray-700/50 rounded-xl p-8 max-w-6xl max-h-full overflow-auto backdrop-blur-lg"
            onClick={e => e.stopPropagation()}
          >
            <LazyImage
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[60vh] object-contain mb-4 rounded-lg shadow-2xl"
              componentId={`${componentId}-modal`}
            />

            {/* Image Variants Gallery */}
            {'imageVariants' in selectedImage &&
              selectedImage.imageVariants &&
              selectedImage.imageVariants.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Product Variants ({selectedImage.imageVariants.length} images)
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedImage.imageVariants.map((variant, index) => (
                      <img
                        key={index}
                        src={variant}
                        alt={`${selectedImage.title} variant ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-600 hover:border-gray-400 cursor-pointer flex-shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedImage({ ...selectedImage, src: variant });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                {'productCode' in selectedImage && (
                  <p className="text-sm text-gray-400 font-mono mb-2">
                    {selectedImage.productCode}
                  </p>
                )}
                {selectedImage.description && (
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}

                {/* Editorial Credits */}
                {'credits' in selectedImage && selectedImage.credits && (
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-white mb-2">Credits</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Photographer:</span>
                        <span className="text-white">{selectedImage.credits.photographer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Models:</span>
                        <span className="text-white">
                          {selectedImage.credits.models.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Specifications */}
                {'specifications' in selectedImage && selectedImage.specifications && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Product Details</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedImage.specifications).map(([key, value]) => {
                        if (!value) return null;
                        const displayKey =
                          key === 'sex'
                            ? 'Fit'
                            : key === 'content'
                              ? 'Material'
                              : key === 'emissions'
                                ? 'Sustainability'
                                : key.replace(/([A-Z])/g, ' $1');
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{displayKey}:</span>
                            <span className="text-white text-right max-w-xs">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Collection:</span>
                  <span className="text-white">{selectedImage.collection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{selectedImage.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-gray-300">{selectedImage.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-gray-300">{selectedImage.resolution}</span>
                </div>
                {'hasDescription' in selectedImage && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span
                      className={selectedImage.hasDescription ? 'text-green-400' : 'text-red-400'}
                    >
                      {selectedImage.hasDescription ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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

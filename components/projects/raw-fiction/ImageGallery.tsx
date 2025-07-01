/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback, memo } from 'react';
import { generateGarbagePlanetProducts } from './collections/GarbagePlanetCollection';
import { generateGarbagePlanet2Products } from './collections/GarbagePlanet2Collection';
import { generatePrideProducts } from './collections/PrideCollection';
import { generateRacismProducts } from './collections/RacismCollection';
import { generatePureChlorineProducts } from './collections/PureChlorineCollection';
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
  credits?: {
    photographer: string;
    models: string[];
  };
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

// Archive folder structure
const ARCHIVE_FOLDERS: FolderItem[] = [
  {
    id: 'editorials',
    name: 'Editorials',
    type: 'folder',
    itemCount: 4,
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
  {
    id: 'videos',
    name: 'Videos',
    type: 'folder',
    itemCount: 0,
    size: '500MB',
  },
];

// Editorial collections within the Archive
const EDITORIAL_COLLECTIONS: FolderItem[] = [
  {
    id: 'garbage-planet-1-editorial',
    name: 'Garbage Planet 1.0 Editorial',
    type: 'folder',
    itemCount: 148,
    size: '1.8GB',
    images: Array.from({ length: 148 }, (_, i) => ({
      id: `gp1-editorial-${i + 1}`,
      src: `/projects/raw-fiction-content/archive/editorial/garbage-planet-1/Editorial_${i + 1}.jpg`,
      alt: `Garbage Planet Editorial ${i + 1}`,
      title: `Photocredits`,
      collection: 'Garbage Planet 1.0 Editorial',
      category: 'Editorial',
      description: 'Marcel Bernard',
      credits: {
        photographer: 'Marcel Bernard',
        models: ['Vladimir Cabak', 'Romana Binder', 'Sophie Mann', 'Raphael Hulan'],
      },
    })),
  },
  {
    id: 'pride-editorial',
    name: 'Pride Editorial',
    type: 'folder',
    itemCount: 9,
    size: '54MB',
    images: [
      'IMG_9277.JPG',
      'IMG_9280.JPG',
      'IMG_9332.JPG',
      'IMG_9335.JPG',
      'IMG_9339.JPG',
      'IMG_9362.JPG',
      'IMG_9374.JPG',
      'IMG_9384.JPG',
      'IMG_9390.JPG',
    ].map((filename, i) => ({
      id: `pride-editorial-${i + 1}`,
      src: `/projects/raw-fiction-content/archive/editorial/pride/${filename}`,
      alt: `Pride Editorial ${i + 1}`,
      title: `Photocredits`,
      collection: 'Pride Editorial',
      category: 'Editorial',
      description: 'Marcel Bernard',
      credits: {
        photographer: 'Marcel Bernard',
        models: ['Dennis Bernard', 'Gamze'],
      },
    })),
  },
  {
    id: 'pure-chlorine-editorial',
    name: 'Pure Chlorine Editorial',
    type: 'folder',
    itemCount: 42,
    size: '218MB',
    images: Array.from({ length: 44 }, (_, i) => {
      const imageNumber = i + 1;
      // Skip numbers 45 and 46 since they don't exist
      if (imageNumber === 45 || imageNumber === 46) return null;
      return {
        id: `pure-chlorine-editorial-${imageNumber}`,
        src: `/projects/raw-fiction-content/archive/editorial/pure-chlorine/MG_7391 (${imageNumber}).jpg`,
        alt: `Pure Chlorine Editorial ${imageNumber}`,
        title: `Photocredits`,
        collection: 'Pure Chlorine Editorial',
        category: 'Editorial',
        description: 'Marcel Bernard',
        credits: {
          photographer: 'Marcel Bernard',
          models: ['Pure Chlorine Artists'],
        },
      };
    }).filter(Boolean) as ImageItem[],
  },
  {
    id: 'racism-editorial',
    name: 'Racism Editorial',
    type: 'folder',
    itemCount: 100,
    size: '156MB',
    images: [
      // BLICKWINKEL files first (14 files)
      ...[
        'BLICKWINKEL.jpg',
        'BLICKWINKEL-2.jpg',
        'BLICKWINKEL-3.jpg',
        'BLICKWINKEL-4.jpg',
        'BLICKWINKEL-5.jpg',
        'BLICKWINKEL-6.jpg',
        'BLICKWINKEL-7.jpg',
        'BLICKWINKEL-8.jpg',
        'BLICKWINKEL-9.jpg',
        'BLICKWINKEL-12.jpg',
        'BLICKWINKEL-12_guy.jpg',
        'BLICKWINKEL-13.jpg',
        'BLICKWINKEL-14.jpg',
        'BLICKWINKEL-15.jpg',
      ].map((filename, i) => ({
        id: `racism-editorial-blickwinkel-${i + 1}`,
        src: `/projects/raw-fiction-content/archive/editorial/racism/${filename}`,
        alt: `Racism Editorial BLICKWINKEL ${i + 1}`,
        title: `Photocredits`,
        collection: 'Racism Editorial',
        category: 'Editorial',
        description: 'Marcel Bernard',
        credits: {
          photographer: 'Marcel Bernard',
          models: ['Tom Gailer', 'Celina Abaez', 'Jide Zaïn', 'Lydia Uroko'],
        },
      })),
      // MG_8433 series (based on folder contents - available numbers)
      ...[1, 6, 8, 9, 10, 12, 14, 15, 19, 20, 22, 24, 26, 29, 33, 36, 38].map((num, i) => ({
        id: `racism-editorial-mg8433-${i + 1}`,
        src: `/projects/raw-fiction-content/archive/editorial/racism/MG_8433 (${num}).jpg`,
        alt: `Racism Editorial MG_8433 ${num}`,
        title: `Photocredits`,
        collection: 'Racism Editorial',
        category: 'Editorial',
        description: 'Marcel Bernard',
        credits: {
          photographer: 'Marcel Bernard',
          models: ['Tom Gailer', 'Celina Abaez', 'Jide Zaïn', 'Lydia Uroko'],
        },
      })),
      // MG_8891 series (1-26)
      ...Array.from({ length: 26 }, (_, i) => ({
        id: `racism-editorial-mg8891-${i + 1}`,
        src: `/projects/raw-fiction-content/archive/editorial/racism/MG_8891 (${i + 1}).jpg`,
        alt: `Racism Editorial MG_8891 ${i + 1}`,
        title: `Photocredits`,
        collection: 'Racism Editorial',
        category: 'Editorial',
        description: 'Marcel Bernard',
        credits: {
          photographer: 'Marcel Bernard',
          models: ['Tom Gailer', 'Celina Abaez', 'Jide Zaïn', 'Lydia Uroko'],
        },
      })),
      // MG_8950 series (1-43)
      ...Array.from({ length: 43 }, (_, i) => ({
        id: `racism-editorial-mg8950-${i + 1}`,
        src: `/projects/raw-fiction-content/archive/editorial/racism/MG_8950 (${i + 1}).jpg`,
        alt: `Racism Editorial MG_8950 ${i + 1}`,
        title: `Photocredits`,
        collection: 'Racism Editorial',
        category: 'Editorial',
        description: 'Marcel Bernard',
        credits: {
          photographer: 'Marcel Bernard',
          models: ['Tom Gailer', 'Celina Abaez', 'Jide Zaïn', 'Lydia Uroko'],
        },
      })),
    ],
  },
];

// Optimized Product Card Component with performance improvements
const ProductCard = memo<{
  image: ImageItem | ProductItem | EditorialItem;
  index: number;
  onSelect: (image: ImageItem | ProductItem | EditorialItem, index?: number) => void;
}>(({ image, index, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 will-change-transform"
      onClick={() => onSelect(image, index)}
    >
      <div className="relative h-48 bg-gray-900">
        {/* Loading Placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Error Placeholder */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Failed to load</div>
          </div>
        )}

        {/* Optimized Image */}
        <img
          src={image.src}
          alt={image.alt}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ contentVisibility: 'auto' }}
        />

        {/* Optimized Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white text-sm text-center truncate">{image.title}</h3>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Optimized Archive Image Card for editorial collections
const ArchiveImageCard = memo<{
  image: ImageItem;
  index: number;
  viewMode: 'grid' | 'list';
  onSelect: (image: ImageItem, index: number) => void;
}>(({ image, index, viewMode, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
        onClick={() => onSelect(image, index)}
      >
        <div className="relative w-12 h-12 bg-gray-900 rounded overflow-hidden flex-shrink-0">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          {imageError && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-xs">✕</span>
            </div>
          )}
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-200 truncate">
            Editorial Image {index + 1}
          </div>
        </div>
        <div className="text-xs text-gray-500">Image</div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform duration-150 will-change-transform"
      onClick={() => onSelect(image, index)}
    >
      <div className="relative h-32 bg-gray-900">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 border border-gray-600 border-t-gray-400 rounded-full animate-spin" />
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-xs">Failed</span>
          </div>
        )}
        <img
          src={image.src}
          alt={image.alt}
          className={`w-full h-32 object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ contentVisibility: 'auto' }}
        />
      </div>
    </div>
  );
});

ArchiveImageCard.displayName = 'ArchiveImageCard';

interface ImageGalleryProps {
  componentId?: string;
  collectionId?: string;
  title?: string;
  mode?: 'collection' | 'editorial' | 'archive' | 'vintage';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  componentId: _componentId = 'raw-fiction-gallery',
  collectionId = 'garbage-planet',
  title = 'Collection Gallery',
  mode = 'collection',
}) => {
  const [selectedImage, setSelectedImage] = useState<
    ImageItem | ProductItem | EditorialItem | null
  >(null);
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);

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
          case 'garbage-planet-2':
            return generateGarbagePlanet2Products();
          case 'pride':
            return generatePrideProducts();
          case 'racism':
            return generateRacismProducts();
          case 'pure-chlorine':
            return generatePureChlorineProducts();
          default:
            return [];
        }
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

  // Get current images array for navigation
  const getCurrentImages = useCallback(() => {
    if (mode === 'archive' && currentFolder?.images) {
      return currentFolder.images;
    }
    return images;
  }, [mode, currentFolder, images]);

  // Navigation functions
  const navigateToImage = useCallback(
    (direction: 'prev' | 'next') => {
      // Check if we're viewing a product with variants
      if (selectedImage && 'imageVariants' in selectedImage && selectedImage.imageVariants) {
        const variants = selectedImage.imageVariants;
        const newVariantIndex =
          direction === 'prev'
            ? Math.max(0, currentVariantIndex - 1)
            : Math.min(variants.length - 1, currentVariantIndex + 1);

        setCurrentVariantIndex(newVariantIndex);
        return;
      }

      // Default navigation for non-product items
      const currentImages = getCurrentImages();
      if (!currentImages.length) return;

      const newIndex =
        direction === 'prev'
          ? Math.max(0, currentImageIndex - 1)
          : Math.min(currentImages.length - 1, currentImageIndex + 1);

      setCurrentImageIndex(newIndex);
      const nextImage = currentImages[newIndex];
      if (nextImage) {
        setSelectedImage(nextImage);
      }
    },
    [
      getCurrentImages,
      currentImageIndex,
      selectedImage,
      currentVariantIndex,
      setCurrentVariantIndex,
    ]
  );

  // Handle image selection with index tracking
  const handleImageSelect = useCallback(
    (image: ImageItem | ProductItem | EditorialItem, index?: number) => {
      const currentImages = getCurrentImages();
      const imageIndex =
        index !== undefined ? index : currentImages.findIndex(img => img.id === image.id);
      setCurrentImageIndex(imageIndex);
      setSelectedImage(image);
      // Reset variant index when selecting a new image
      setCurrentVariantIndex(0);
    },
    [getCurrentImages, setCurrentVariantIndex]
  );

  // Keyboard navigation
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!selectedImage) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateToImage('prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateToImage('next');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedImage(null);
        setCurrentVariantIndex(0);
      }
    },
    [selectedImage, navigateToImage]
  );

  // Add keyboard event listener and scroll management when modal is open
  React.useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);

      // Prevent body scrolling when modal is open
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        // Restore body scrolling
        document.body.style.overflow = originalStyle;
      };
    }
    return undefined;
  }, [selectedImage, handleKeyPress]);

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

        {/* Credits Section - Show when inside an editorial collection */}
        {currentFolder &&
          currentFolder.images &&
          currentFolder.images.length > 0 &&
          currentFolder.images[0]?.credits && (
            <div className="mb-6 bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Photography</h4>
                  <p className="text-white">{currentFolder.images[0]?.credits?.photographer}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Models</h4>
                  <div className="space-y-1">
                    {currentFolder.images[0]?.credits?.models.map(
                      (model: string, index: number) => (
                        <p key={index} className="text-white">
                          {model}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Folder/Image Grid */}
        <div
          className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}`}
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: viewMode === 'grid' ? '200px' : '60px',
            contain: 'layout style paint',
          }}
        >
          {!currentFolder
            ? // Main archive folders
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
            : currentFolder.id === 'editorials'
              ? // Editorial collections subfolder
                EDITORIAL_COLLECTIONS.map(collection => (
                  <div
                    key={collection.id}
                    className={`${viewMode === 'grid' ? 'bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700/50 transition-colors group' : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors'}`}
                    onClick={() => openFolder(collection)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <span className="text-white text-xs font-semibold">GP</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-200 mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-xs text-gray-400">{collection.itemCount} images</p>
                        <p className="text-xs text-gray-500">{collection.size}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">GP</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-200">{collection.name}</div>
                          <div className="text-xs text-gray-400">
                            {collection.itemCount} images • {collection.size}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Collection</div>
                      </>
                    )}
                  </div>
                ))
              : // Image contents of selected collection
                currentFolder.images?.map((image, index) => (
                  <ArchiveImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    viewMode={viewMode}
                    onSelect={(img: ImageItem, idx: number) => handleImageSelect(img, idx)}
                  />
                )) || []}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            style={{ margin: 0, padding: '1rem' }}
            onClick={() => {
              setSelectedImage(null);
              setCurrentVariantIndex(0);
            }}
          >
            <div
              className="bg-gray-900/95 border border-gray-700/50 rounded-xl backdrop-blur-lg relative"
              style={{
                padding: '1.5rem',
                maxWidth: '90%',
                maxHeight: '90%',
                width: 'auto',
                height: 'auto',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Navigation Arrows */}
              {getCurrentImages().length > 1 && (
                <>
                  {/* Previous Arrow */}
                  {currentImageIndex > 0 && (
                    <button
                      className="absolute left-2 md:left-4 top-1/3 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('prev');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Next Arrow */}
                  {currentImageIndex < getCurrentImages().length - 1 && (
                    <button
                      className="absolute right-2 md:right-4 top-1/3 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('next');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}

              <img
                src={
                  selectedImage && 'imageVariants' in selectedImage && selectedImage.imageVariants
                    ? selectedImage.imageVariants[currentVariantIndex] || selectedImage.src
                    : selectedImage.src
                }
                alt={selectedImage.alt}
                className="rounded-lg"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '55%',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  flexShrink: 0,
                }}
                loading="eager"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-sm text-gray-300 mb-4">{selectedImage.description}</p>
                )}
              </div>
              <button
                className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                onClick={() => {
                  setSelectedImage(null);
                  setCurrentVariantIndex(0);
                }}
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
                onClick={() => handleImageSelect(image, index)}
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
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
            style={{ margin: 0, padding: '0.75rem' }}
            onClick={() => {
              setSelectedImage(null);
              setCurrentVariantIndex(0);
            }}
          >
            <div
              className="overflow-auto relative"
              style={{
                maxWidth: '95%',
                maxHeight: '95%',
                width: 'auto',
                height: 'auto',
              }}
            >
              {/* Navigation Arrows */}
              {getCurrentImages().length > 1 && (
                <>
                  {/* Previous Arrow */}
                  {currentImageIndex > 0 && (
                    <button
                      className="absolute left-2 md:left-4 top-1/3 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('prev');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Next Arrow */}
                  {currentImageIndex < getCurrentImages().length - 1 && (
                    <button
                      className="absolute right-2 md:right-4 top-1/3 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('next');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}

              <img
                src={
                  selectedImage && 'imageVariants' in selectedImage && selectedImage.imageVariants
                    ? selectedImage.imageVariants[currentVariantIndex] || selectedImage.src
                    : selectedImage.src
                }
                alt={selectedImage.alt}
                className="rounded-lg"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '75%',
                  objectFit: 'contain',
                }}
              />
              <div className="text-center mt-4">
                <button
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  onClick={() => {
                    setSelectedImage(null);
                    setCurrentVariantIndex(0);
                  }}
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
      {/* Only show title and description for editorial mode */}
      {mode === 'editorial' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        </div>
      )}

      {/* Collection Statistics */}
      {mode === 'collection' && (
        <div className="flex justify-center text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{images.length}</div>
            <div className="text-gray-400">Products</div>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '300px' }}
      >
        {images.map((image, index) => (
          <ProductCard key={image.id} image={image} index={index} onSelect={handleImageSelect} />
        ))}
      </div>

      {/* Enhanced Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ margin: 0, padding: '0.75rem' }}
          onClick={() => {
            setSelectedImage(null);
            setCurrentVariantIndex(0);
          }}
        >
          <div
            className="bg-gray-900/95 border border-gray-700/50 rounded-xl backdrop-blur-lg relative"
            style={{
              padding: '1.5rem',
              maxWidth: '90%',
              maxHeight: '90%',
              width: 'auto',
              height: 'auto',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Navigation Arrows */}
            {(() => {
              // Check if we're viewing a product with variants
              const hasVariants =
                selectedImage &&
                'imageVariants' in selectedImage &&
                selectedImage.imageVariants &&
                selectedImage.imageVariants.length > 1;
              const canNavigate = hasVariants || getCurrentImages().length > 1;

              if (!canNavigate) return null;

              const canGoPrev = hasVariants ? currentVariantIndex > 0 : currentImageIndex > 0;
              const canGoNext = hasVariants
                ? currentVariantIndex < (selectedImage.imageVariants?.length || 0) - 1
                : currentImageIndex < getCurrentImages().length - 1;

              return (
                <>
                  {/* Previous Arrow */}
                  {canGoPrev && (
                    <button
                      className="absolute left-2 md:left-4 top-1/4 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('prev');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Next Arrow */}
                  {canGoNext && (
                    <button
                      className="absolute right-2 md:right-4 top-1/4 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10 shadow-lg"
                      onClick={e => {
                        e.stopPropagation();
                        navigateToImage('next');
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="md:w-5 md:h-5"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </>
              );
            })()}

            <img
              src={
                selectedImage && 'imageVariants' in selectedImage && selectedImage.imageVariants
                  ? selectedImage.imageVariants[currentVariantIndex] || selectedImage.src
                  : selectedImage.src
              }
              alt={selectedImage.alt}
              className="rounded-lg shadow-2xl"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '45%',
                objectFit: 'contain',
                marginBottom: '1rem',
                flexShrink: 0,
              }}
              loading="eager"
            />

            <div
              className="grid md:grid-cols-2 gap-6"
              style={{
                flex: '1 1 auto',
                overflow: 'auto',
                minHeight: 0,
              }}
            >
              {/* Left Side - Description and Product Details */}
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
                  <>
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-white mb-2">Photography</h4>
                      <div className="text-sm">
                        <span className="text-white">{selectedImage.credits.photographer}</span>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-white mb-2">Models</h4>
                      <div className="space-y-1 text-sm">
                        {selectedImage.credits.models.map((model, index) => (
                          <div key={index} className="text-white">
                            {model}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
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

              {/* Right Side - Images and Metadata Tags */}
              <div>
                {/* Image Variants Gallery */}
                {'imageVariants' in selectedImage &&
                  selectedImage.imageVariants &&
                  selectedImage.imageVariants.length > 1 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Images ({selectedImage.imageVariants.length} images)
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

                {/* Metadata Tags */}
                <div className="space-y-2 text-sm">
                  {/* Only show category for non-editorial images, or if it's not just "Editorial" */}
                  {selectedImage.category && selectedImage.category !== 'Editorial' && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{selectedImage.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              onClick={() => {
                setSelectedImage(null);
                setCurrentVariantIndex(0);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export interface EditorialItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  collection?: string;
  category: string;
  fileSize?: string;
  resolution?: string;
  credits?: {
    photographer: string;
    models: string[];
  };
  editorialDescription?: string;
}

// Generate editorial images
export const generateEditorialImages = (collectionId: string): EditorialItem[] => {
  const editorialCounts = {
    'garbage-planet-1': 148,
    'garbage-planet-2': 0,
    pride: 0,
    'pure-chlorine': 0,
    racism: 0,
  };

  const count = editorialCounts[collectionId as keyof typeof editorialCounts] || 0;
  if (count === 0) return [];

  return Array.from({ length: count }, (_, i) => ({
    id: `editorial-${collectionId}-${i + 1}`,
    src: `/projects/raw-fiction-content/archive/editorial/${collectionId}/Editorial_${i + 1}.jpg`,
    alt: `Editorial ${collectionId} ${i + 1}`,
    title: `Editorial ${i + 1}`,
    collection: collectionId,
    category: 'Editorial',
    credits: {
      photographer: 'Marcel Bernard',
      models: ['Romana Binder', 'Vladimir Cabak', 'Raphael Hulan'],
    },
    editorialDescription: 'Professional editorial photography showcasing Raw Fiction designs',
    fileSize: '1.2MB',
    resolution: '4K',
  }));
};

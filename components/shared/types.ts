export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface ProjectProps {
  isActive?: boolean;
}

export interface EventData {
  id: string;
  title: string;
  date?: string;
  description: string;
  images?: string[];
  details?: string[];
}

export interface WebsiteEmbedProps {
  url: string;
  title: string;
  isActive: boolean;
  allowScrolling?: boolean;
}

// Real Eyes Events Data
export const REAL_EYES_EVENTS: EventData[] = [
  {
    id: 'awakening',
    title: 'Digital Awakening',
    date: '2024-03-15',
    description: 'An exploration of consciousness in the digital age',
    details: [
      'Interactive installations merging physical and digital realms',
      'Discussions on AI consciousness and human awareness',
      'Immersive experiences with cutting-edge technology',
      'Workshops on mindfulness in digital spaces'
    ],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    ]
  },
  {
    id: 'synthesis',
    title: 'Neural Synthesis',
    date: '2024-04-20',
    description: 'Bridging the gap between human and artificial intelligence',
    details: [
      'Brain-computer interface demonstrations',
      'Collaborative AI art creation sessions',
      'Neurofeedback meditation experiences',
      'Panel discussions with AI researchers'
    ],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    ]
  },
  {
    id: 'perception',
    title: 'Altered Perception',
    date: '2024-05-25',
    description: 'Exploring different ways of seeing and understanding reality',
    details: [
      'VR experiences that challenge perception',
      'Augmented reality art installations',
      'Discussions on consciousness and reality',
      'Interactive exhibits on sensory experience'
    ],
    images: [
      'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&q=80',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80'
    ]
  },
  {
    id: 'connection',
    title: 'Quantum Connection',
    date: '2024-06-30',
    description: 'Understanding interconnectedness in the quantum realm',
    details: [
      'Quantum physics and consciousness workshops',
      'Meditation and quantum field experiences',
      'Interactive demonstrations of quantum phenomena',
      'Discussions on non-local consciousness'
    ],
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80',
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80'
    ]
  },
  {
    id: 'transcendence',
    title: 'Digital Transcendence',
    date: '2024-08-15',
    description: 'Moving beyond traditional boundaries of self and technology',
    details: [
      'Immersive virtual reality experiences',
      'AI-assisted consciousness exploration',
      'Digital art and music creation',
      'Workshops on technological spirituality'
    ],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    ]
  },
  {
    id: 'integration',
    title: 'Conscious Integration',
    date: '2024-09-20',
    description: 'Integrating digital and physical consciousness',
    details: [
      'Hybrid reality experiences',
      'Biofeedback and digital meditation',
      'AI-human collaboration workshops',
      'Discussions on future consciousness'
    ],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    ]
  },
  {
    id: 'evolution',
    title: 'Evolutionary Convergence',
    date: '2024-10-25',
    description: 'The next stage of human and technological evolution',
    details: [
      'Presentations on future consciousness',
      'Interactive timelines of human-AI evolution',
      'Collaborative visioning sessions',
      'Celebration of human-technology synthesis'
    ],
    images: [
      'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&q=80',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80'
    ]
  }
];

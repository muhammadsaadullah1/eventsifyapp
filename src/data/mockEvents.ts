import { ImageSourcePropType } from 'react-native';

export interface EventLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface EventAttendee {
  id: string;
  name: string;
  avatar: string;
  status: 'going' | 'interested' | 'invited';
}

export interface EventMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export type EventCategory = 
  | 'Music' 
  | 'Food & Drink' 
  | 'Business' 
  | 'Sports' 
  | 'Arts & Culture'
  | 'Charity'
  | 'Technology'
  | 'Education'
  | 'Health & Wellness'
  | 'Fashion'
  | 'Community'
  | 'Nightlife'
  | 'Travel & Outdoor'
  | 'Family & Kids';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: EventLocation;
  category: EventCategory;
  subcategory?: string;
  tags: string[];
  coverImage: string;  // URL to image
  bannerImage?: string; // URL to banner image for promotions
  price: number | 'free';
  capacity: number; // Maximum attendees allowed
  availableSpots?: number; // Remaining spots available
  organizer: {
    id: string;
    name: string;
    logo?: string;
    contactEmail?: string;
    phoneNumber?: string;
  };
  attendees: EventAttendee[];
  isHot: boolean;
  isFeatured: boolean;
  media: EventMedia[];
  distance?: number; // Distance from user's location in kilometers
  shareableLink?: string; // URL that can be shared on social media
  highlights?: string[]; // Key highlights/features of the event
  faqs?: Array<{question: string, answer: string}>; // Frequently asked questions
  sponsors?: Array<{id: string, name: string, logo: string}>; // Event sponsors
  virtualEvent?: boolean; // Whether this is a virtual event
  streamUrl?: string; // URL for virtual events
}

// Mock data for events near Karachi, Pakistan
const mockEvents: Event[] = [
  {
    id: 'event-001',
    bannerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1287&auto=format&fit=crop',
    capacity: 2000,
    highlights: [
      'Over 50 food stalls featuring international and local cuisines',
      'Live cooking demonstrations by celebrity chefs',
      'Food competitions with prizes',
      'Kids zone with child-friendly activities'
    ],
    faqs: [
      {question: 'Is entry free for children?', answer: 'Yes, children under 12 enter free'},
      {question: 'Are pets allowed?', answer: 'Unfortunately, no pets are allowed at the food festival'}
    ],
    sponsors: [
      {id: 'sp-001', name: 'Karachi Eats', logo: 'https://example.com/logos/karachi-eats.png'},
      {id: 'sp-002', name: 'Food Network Pakistan', logo: 'https://example.com/logos/food-network.png'}
    ],
    title: 'Karachi Food Festival 2025',
    description: 'Experience the vibrant flavors of Karachi\'s diverse culinary scene. This three-day festival features top chefs, food stalls, cooking demonstrations, and live music. Indulge in traditional Pakistani dishes, street food favorites, and international cuisines all in one place.',
    date: new Date(2025, 5, 15, 12, 0), // June 15, 2025 at 12 PM
    endDate: new Date(2025, 5, 17, 22, 0), // June 17, 2025 at 10 PM
    location: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Beach Park, Clifton',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Food & Drink',
    tags: ['food', 'festival', 'cuisine', 'music'],
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    price: 1500,
    organizer: {
      id: 'org-001',
      name: 'Karachi Food Network',
      logo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    attendees: [
      { id: 'user-101', name: 'Fatima Ahmed', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
      { id: 'user-102', name: 'Ali Khan', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'going' },
      { id: 'user-103', name: 'Zainab Malik', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', status: 'interested' },
      { id: 'user-104', name: 'Omar Shah', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'going' },
      { id: 'user-105', name: 'Aisha Imran', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', status: 'invited' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-001', type: 'image', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
      { id: 'media-002', type: 'image', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
      { id: 'media-003', type: 'image', url: 'https://images.unsplash.com/photo-1567188040759-fb8a9eddc10d' },
      { id: 'media-004', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-eating-pizza-together-at-a-restaurant-37053-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40' },
      { id: 'media-005', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-indian-traditional-food-of-spicy-curry-in-a-professional-43215-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' }
    ],
    distance: 2.4
  },
  {
    id: 'event-002',
    bannerImage: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
    capacity: 1500,
    title: 'Tech Innovators Summit',
    description: 'Join the biggest tech conference in Pakistan. Network with industry leaders, attend workshops on AI, blockchain, and cybersecurity, and discover the latest innovations. Perfect for entrepreneurs, developers, and tech enthusiasts looking to stay at the cutting edge.',
    date: new Date(2025, 5, 20, 9, 0), // June 20, 2025 at 9 AM
    endDate: new Date(2025, 5, 21, 18, 0), // June 21, 2025 at 6 PM
    location: {
      latitude: 24.8297,
      longitude: 67.0812,
      address: 'Expo Center, University Road',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Technology',
    tags: ['tech', 'conference', 'innovation', 'networking'],
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    price: 5000,
    organizer: {
      id: 'org-002',
      name: 'TechPak',
      logo: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    attendees: [
      { id: 'user-106', name: 'Hassan Ahmed', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', status: 'going' },
      { id: 'user-107', name: 'Sara Khan', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', status: 'interested' },
      { id: 'user-108', name: 'Bilal Raza', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', status: 'going' },
      { id: 'user-109', name: 'Hina Shah', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', status: 'going' }
    ],
    isHot: true,
    isFeatured: false,
    media: [
      { id: 'media-005', type: 'image', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
      { id: 'media-006', type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' },
      { id: 'media-007', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-people-working-on-their-laptops-in-a-workspace-environment-27023-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' }
    ],
    distance: 7.8
  },
  {
    id: 'event-003',
    capacity: 3000,
    bannerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
    title: 'Beachside Music Festival',
    description: 'Dance to the rhythm of the waves at Karachi\'s premier beachside music festival. With multiple stages featuring local and international artists, this vibrant event combines the best of electronic, pop, and traditional music. Enjoy food stalls, art installations, and an unforgettable sunset experience.',
    date: new Date(2025, 5, 25, 16, 0), // June 25, 2025 at 4 PM
    endDate: new Date(2025, 5, 26, 2, 0), // June 26, 2025 at 2 AM
    location: {
      latitude: 24.7914,
      longitude: 66.9947,
      address: 'Sea View Beach',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Music',
    tags: ['music', 'festival', 'beach', 'nightlife'],
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
    price: 3000,
    organizer: {
      id: 'org-003',
      name: 'Karachi Beats',
      logo: 'https://randomuser.me/api/portraits/women/11.jpg'
    },
    attendees: [
      { id: 'user-110', name: 'Kamran Ali', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', status: 'going' },
      { id: 'user-111', name: 'Amina Farooq', avatar: 'https://randomuser.me/api/portraits/women/13.jpg', status: 'going' },
      { id: 'user-112', name: 'Faisal Khan', avatar: 'https://randomuser.me/api/portraits/men/14.jpg', status: 'interested' },
      { id: 'user-113', name: 'Nadia Malik', avatar: 'https://randomuser.me/api/portraits/women/15.jpg', status: 'going' },
      { id: 'user-114', name: 'Tariq Jamil', avatar: 'https://randomuser.me/api/portraits/men/16.jpg', status: 'going' },
      { id: 'user-115', name: 'Sana Ahmed', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', status: 'interested' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-008', type: 'image', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea' },
      { id: 'media-009', type: 'image', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819' },
      { id: 'media-010', type: 'image', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063' },
      { id: 'media-011', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-of-a-band-seen-from-the-middle-of-the-crowd-4716-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a' }
    ],
    distance: 5.1
  },
  {
    id: 'event-004',
    bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
    title: 'Art & Culture Exhibition',
    capacity: 1000,
    description: 'Immerse yourself in Pakistan\'s rich cultural heritage at this comprehensive art exhibition. Featuring works from established and emerging artists, traditional crafts, calligraphy, and contemporary installations. Interactive workshops offer hands-on experience with various art forms.',
    date: new Date(2025, 6, 3, 10, 0), // July 3, 2025 at 10 AM
    endDate: new Date(2025, 6, 10, 20, 0), // July 10, 2025 at 8 PM
    location: {
      latitude: 24.8546,
      longitude: 67.0289,
      address: 'National Art Gallery, Frere Hall',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Arts & Culture',
    tags: ['art', 'culture', 'exhibition', 'workshops'],
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
    price: 'free',
    organizer: {
      id: 'org-004',
      name: 'Pakistan Arts Council',
      logo: 'https://randomuser.me/api/portraits/men/18.jpg'
    },
    attendees: [
      { id: 'user-116', name: 'Samina Khan', avatar: 'https://randomuser.me/api/portraits/women/19.jpg', status: 'going' },
      { id: 'user-117', name: 'Adeel Hassan', avatar: 'https://randomuser.me/api/portraits/men/20.jpg', status: 'interested' },
      { id: 'user-118', name: 'Lubna Qazi', avatar: 'https://randomuser.me/api/portraits/women/21.jpg', status: 'going' }
    ],
    isHot: false,
    isFeatured: true,
    media: [
      { id: 'media-012', type: 'image', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5' },
      { id: 'media-013', type: 'image', url: 'https://images.unsplash.com/photo-1594008636413-3f134a14d49c' },
      { id: 'media-014', type: 'image', url: 'https://images.unsplash.com/photo-1585958284437-1cf80033edda' },
      { id: 'media-015', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-exhibition-of-different-hand-crafted-elements-12772-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1585958284437-1cf80033edda' }
    ],
    distance: 3.2
  },
  {
    id: 'event-005',
    title: 'Karachi Marathon 2025',
    description: 'Challenge yourself in Karachi\'s biggest running event of the year. Choose from 5K, 10K, half marathon, or full marathon distances. The scenic route takes you through historical landmarks and along the beautiful coastline. Participate for fun, fitness, or competition, with prizes for top finishers in all categories.',
    date: new Date(2025, 6, 12, 6, 0), // July 12, 2025 at 6 AM
    location: {
      latitude: 24.8700,
      longitude: 67.0211,
      address: 'Mazar-e-Quaid',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Sports',
    capacity: 5000,
    tags: ['marathon', 'running', 'fitness', 'competition'],
    coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    price: 2000,
    organizer: {
      id: 'org-005',
      name: 'Karachi Athletics Association',
      logo: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    attendees: [
      { id: 'user-119', name: 'Imran Sheikh', avatar: 'https://randomuser.me/api/portraits/men/23.jpg', status: 'going' },
      { id: 'user-120', name: 'Rabia Malik', avatar: 'https://randomuser.me/api/portraits/women/24.jpg', status: 'going' },
      { id: 'user-121', name: 'Salman Ahmed', avatar: 'https://randomuser.me/api/portraits/men/25.jpg', status: 'going' },
      { id: 'user-122', name: 'Ayesha Hassan', avatar: 'https://randomuser.me/api/portraits/women/26.jpg', status: 'interested' }
    ],
    isHot: false,
    isFeatured: false,
    media: [
      { id: 'media-010', type: 'image', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' },
      { id: 'media-011', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-dj-working-with-audio-mixer-and-laptop-in-night-club-6740-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' },
      { id: 'media-016', type: 'image', url: 'https://images.unsplash.com/photo-1584086823488-b9bcee77b207' },
      { id: 'media-017', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-marathon-athletes-running-in-a-race-on-a-bridge-32880-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e' }
    ],
    distance: 4.9
  },
  {
    id: 'event-006',
    capacity: 250,
    bannerImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop',
    title: 'Business Networking Gala',
    description: 'Turn your idea into reality in just 54 hours. Work with mentors, build a prototype, and pitch to investors at this intense entrepreneurship event. Perfect for aspiring entrepreneurs, designers, developers, and marketers wanting to test their ideas in a supportive environment.',
    date: new Date(2025, 6, 18, 17, 0), // July 18, 2025 at 5 PM
    endDate: new Date(2025, 6, 20, 21, 0), // July 20, 2025 at 9 PM
    location: {
      latitude: 24.8604,
      longitude: 67.0109,
      address: 'National Incubation Center, NED University',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Business',
    tags: ['startup', 'entrepreneurship', 'networking', 'pitching'],
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    price: 2500,
    organizer: {
      id: 'org-006',
      name: 'Startup Karachi',
      logo: 'https://randomuser.me/api/portraits/men/27.jpg'
    },
    attendees: [
      { id: 'user-123', name: 'Danish Ali', avatar: 'https://randomuser.me/api/portraits/men/28.jpg', status: 'going' },
      { id: 'user-124', name: 'Mehwish Khan', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', status: 'interested' },
      { id: 'user-125', name: 'Usman Farooq', avatar: 'https://randomuser.me/api/portraits/men/30.jpg', status: 'invited' }
    ],
    isHot: true,
    isFeatured: false,
    media: [
      { id: 'media-018', type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644' },
      { id: 'media-019', type: 'image', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5' },
      { id: 'media-020', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-marathon-runners-racing-on-a-crowded-city-street-5133-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5' },
      { id: 'media-021', type: 'image', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7' }
    ],
    distance: 6.3
  },
  {
    id: 'event-007',
    capacity: 120,
    bannerImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1820&auto=format&fit=crop',
    title: 'Wellness & Yoga Retreat',
    description: 'Escape the city hustle for a day of mindfulness and relaxation. This beachside retreat offers yoga sessions, meditation workshops, nutritional guidance, and holistic healing therapies. Suitable for all experience levels, with expert instructors to guide beginners. Leave feeling rejuvenated and centered.',
    date: new Date(2025, 6, 5, 7, 0), // July 5, 2025 at 7 AM
    endDate: new Date(2025, 6, 5, 19, 0), // July 5, 2025 at 7 PM
    location: {
      latitude: 24.7925,
      longitude: 66.9873,
      address: 'Sandspit Beach',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan'
    },
    category: 'Health & Wellness',
    tags: ['yoga', 'wellness', 'meditation', 'retreat'],
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    price: 3500,
    organizer: {
      id: 'org-007',
      name: 'Mindful Living',
      logo: 'https://randomuser.me/api/portraits/women/31.jpg'
    },
    attendees: [
      { id: 'user-126', name: 'Saima Iqbal', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', status: 'going' },
      { id: 'user-127', name: 'Fahad Khan', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', status: 'interested' },
      { id: 'user-128', name: 'Natasha Ali', avatar: 'https://randomuser.me/api/portraits/women/34.jpg', status: 'going' }
    ],
    isHot: false,
    isFeatured: true,
    media: [
      { id: 'media-021', type: 'image', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b' },
      { id: 'media-022', type: 'image', url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f' },
      { id: 'media-023', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-in-an-interior-garden-4179-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a' }
    ],
    distance: 9.7
  }
];

// Helper function to calculate available spots based on capacity and current attendees
const calculateAvailableSpots = (event: Event): number => {
  return event.capacity - event.attendees.length;
};

// Update available spots for all events
mockEvents.forEach(event => {
  event.availableSpots = calculateAvailableSpots(event);
});

// Helper functions for working with mock events
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getEventsByCategory = (category: EventCategory): Event[] => {
  return mockEvents.filter(event => event.category === category);
};

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.isFeatured);
};

export const getHotEvents = (): Event[] => {
  return mockEvents.filter(event => event.isHot);
};

export const getNearbyEvents = (lat: number, lng: number, radius: number = 10): Event[] => {
  // Calculate distance for each event
  const eventsWithDistance = mockEvents.map(event => {
    const distance = calculateDistance(lat, lng, event.location.latitude, event.location.longitude);
    return { ...event, distance };
  });
  
  // Filter by radius and sort by distance
  return eventsWithDistance
    .filter(event => event.distance !== undefined && event.distance <= radius)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

export const searchEvents = (query: string): Event[] => {
  const normalizedQuery = query.toLowerCase();
  return mockEvents.filter(event => {
    return (
      event.title.toLowerCase().includes(normalizedQuery) ||
      event.description.toLowerCase().includes(normalizedQuery) ||
      event.category.toLowerCase().includes(normalizedQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
      event.location.city.toLowerCase().includes(normalizedQuery)
    );
  });
};

// Calculate distance between two coordinates (in kilometers)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Function to let a user join an event
export const joinEvent = (eventId: string, userId: string, userName: string, userAvatar: string = 'https://i.pravatar.cc/150'): Event | undefined => {
  const event = getEventById(eventId);
  
  if (!event) {
    console.error(`Event with ID ${eventId} not found`);
    return undefined;
  }
  
  // Check if user is already attending
  const existingAttendee = event.attendees.find(attendee => attendee.id === userId);
  if (existingAttendee) {
    console.log(`User ${userName} is already attending this event`);
    return event;
  }
  
  // Check if there are available spots
  if (event.availableSpots && event.availableSpots <= 0) {
    console.error(`Event ${event.title} is already at full capacity`);
    return event;
  }
  
  // Add user to attendees
  event.attendees.push({
    id: userId,
    name: userName,
    avatar: userAvatar,
    status: 'going'
  });
  
  // Update available spots
  event.availableSpots = calculateAvailableSpots(event);
  
  console.log(`User ${userName} successfully joined event ${event.title}`);
  return event;
};

// Function to generate a shareable link for an event
export const generateShareableLink = (eventId: string): string => {
  const event = getEventById(eventId);
  if (!event) {
    return '';
  }
  
  // If the event already has a shareable link, return it
  if (event.shareableLink) {
    return event.shareableLink;
  }
  
  // Generate a new shareable link
  const baseUrl = 'https://eventsify.app/event/';
  const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const link = `${baseUrl}${slug}-${eventId}`;
  
  // Save the link to the event
  event.shareableLink = link;
  
  return link;
};

// Generate shareable links for all events
mockEvents.forEach(event => {
  if (!event.shareableLink) {
    event.shareableLink = generateShareableLink(event.id);
  }
});

export default mockEvents;

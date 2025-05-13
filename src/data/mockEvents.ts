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

// Mock data for events in the United States
const mockEvents: Event[] = [
  {
    id: 'event-001',
    bannerImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1470&auto=format&fit=crop',
    capacity: 60000,
    highlights: [
      'Headlining performance by Grammy award-winning artists',
      'Multiple stages featuring diverse music genres',
      'Gourmet food and beverage options',
      'Interactive art installations and merchandise village'
    ],
    faqs: [
      {question: 'Is there an age restriction?', answer: 'Yes, attendees must be 18+ or accompanied by an adult'},
      {question: 'Can I bring my own food/drinks?', answer: 'No outside food or beverages are permitted'}
    ],
    sponsors: [
      {id: 'sp-001', name: 'LiveNation', logo: 'https://example.com/logos/livenation.png'},
      {id: 'sp-002', name: 'Spotify', logo: 'https://example.com/logos/spotify.png'}
    ],
    title: 'Coachella Valley Music Festival 2025',
    description: 'Experience the world-famous Coachella Valley Music and Arts Festival, featuring the hottest artists across multiple genres. This three-day event combines cutting-edge musical performances with breathtaking art installations in the beautiful desert landscape of Indio, California.',
    date: new Date(2025, 3, 11, 12, 0), // April 11, 2025 at 12 PM
    endDate: new Date(2025, 3, 13, 23, 59), // April 13, 2025 at 11:59 PM
    location: {
      latitude: 33.6823,
      longitude: -116.2380,
      address: 'Empire Polo Club',
      city: 'Indio',
      state: 'California',
      country: 'United States'
    },
    category: 'Music',
    tags: ['music', 'festival', 'concert', 'arts', 'celebrity'],
    coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
    price: 499,
    organizer: {
      id: 'org-001',
      name: 'Goldenvoice',
      logo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    attendees: [
      { id: 'user-101', name: 'Emma Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'going' },
      { id: 'user-102', name: 'Michael Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'going' },
      { id: 'user-103', name: 'Sofia Chen', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', status: 'interested' },
      { id: 'user-104', name: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'going' },
      { id: 'user-105', name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', status: 'invited' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-001', type: 'image', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063' },
      { id: 'media-002', type: 'image', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819' },
      { id: 'media-003', type: 'image', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec' },
      { id: 'media-004', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-partying-at-a-concert-4196-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3' },
      { id: 'media-005', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-in-a-concert-with-light-effects-4818-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063' }
    ],
    distance: 2.4
  },
  {
    id: 'event-002',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop',
    capacity: 5000,
    highlights: [
      '48-hour nonstop coding competition',
      'Over $100,000 in prizes and sponsor awards',
      'Workshops led by industry experts from leading tech companies',
      'Networking opportunities with tech recruiters and VCs'
    ],
    faqs: [
      {question: 'Do I need a team to participate?', answer: 'Teams of up to 4 are recommended, but we also have team matching events'},
      {question: 'What should I bring?', answer: 'Laptop, chargers, personal items - meals and snacks are provided'}
    ],
    sponsors: [
      {id: 'sp-003', name: 'Google', logo: 'https://example.com/logos/google.png'},
      {id: 'sp-004', name: 'Microsoft', logo: 'https://example.com/logos/microsoft.png'},
      {id: 'sp-005', name: 'Amazon Web Services', logo: 'https://example.com/logos/aws.png'}
    ],
    title: 'HackMIT 2025',
    description: 'Join over 1,000 talented student hackers for one of the largest collegiate hackathons in the world. This 48-hour event brings together tech enthusiasts, developers, designers, and entrepreneurs to build innovative solutions to real-world problems. With mentorship from industry leaders, workshops, and substantial prizes, this is your chance to showcase your skills and network with top tech companies.',
    date: new Date(2025, 8, 15, 18, 0), // September 15, 2025 at 6 PM
    endDate: new Date(2025, 8, 17, 18, 0), // September 17, 2025 at 6 PM
    location: {
      latitude: 42.3601,
      longitude: -71.0942,
      address: 'MIT Johnson Athletic Center',
      city: 'Cambridge',
      state: 'Massachusetts',
      country: 'United States'
    },
    category: 'Technology',
    tags: ['hackathon', 'coding', 'tech', 'students', 'competition'],
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    price: 'free',
    organizer: {
      id: 'org-002',
      name: 'MIT HackMIT Team',
      logo: 'https://randomuser.me/api/portraits/men/6.jpg',
      contactEmail: 'hackmit@mit.edu'
    },
    attendees: [
      { id: 'user-106', name: 'Ethan Williams', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', status: 'going' },
      { id: 'user-107', name: 'Ava Garcia', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', status: 'interested' },
      { id: 'user-108', name: 'Jackson Brown', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', status: 'going' },
      { id: 'user-109', name: 'Isabella Lee', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', status: 'going' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-006', type: 'image', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d' },
      { id: 'media-007', type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
      { id: 'media-008', type: 'image', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5' },
      { id: 'media-009', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-young-people-working-with-their-laptops-4790-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' }
    ],
    distance: 1.2
  },
  {
    id: 'event-003',
    capacity: 50000,
    bannerImage: 'https://images.unsplash.com/photo-1591189824361-e61daf9c5a6c?q=80&w=1470&auto=format&fit=crop',
    title: 'Climate Action March DC 2025',
    description: 'Join thousands of activists, community leaders, and concerned citizens for the largest climate protest of the year. March from the White House to the Capitol to demand urgent action on climate change. This peaceful demonstration will include speeches from environmental experts, climate activists, and political leaders committed to fighting for a sustainable future.',
    date: new Date(2025, 3, 22, 10, 0), // April 22, 2025 at 10 AM (Earth Day)
    endDate: new Date(2025, 3, 22, 18, 0), // April 22, 2025 at 6 PM
    location: {
      latitude: 38.8977,
      longitude: -77.0365,
      address: 'National Mall',
      city: 'Washington',
      state: 'DC',
      country: 'United States'
    },
    category: 'Community',
    tags: ['protest', 'activism', 'climate', 'march', 'politics'],
    coverImage: 'https://images.unsplash.com/photo-1591189824361-e61daf9c5a6c',
    price: 'free',
    organizer: {
      id: 'org-003',
      name: 'Climate Action Coalition',
      logo: 'https://randomuser.me/api/portraits/women/11.jpg',
      contactEmail: 'info@climateactioncoalition.org'
    },
    attendees: [
      { id: 'user-110', name: 'Noah Thompson', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', status: 'going' },
      { id: 'user-111', name: 'Madison Parker', avatar: 'https://randomuser.me/api/portraits/women/13.jpg', status: 'interested' },
      { id: 'user-112', name: 'Gabriel Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/14.jpg', status: 'going' },
      { id: 'user-113', name: 'Zoe Mitchell', avatar: 'https://randomuser.me/api/portraits/women/15.jpg', status: 'interested' },
      { id: 'user-114', name: 'Lucas Cooper', avatar: 'https://randomuser.me/api/portraits/men/16.jpg', status: 'invited' },
      { id: 'user-115', name: 'Abigail Turner', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', status: 'going' },
      { id: 'user-116', name: 'Maya Johnson', avatar: 'https://randomuser.me/api/portraits/women/20.jpg', status: 'going' },
      { id: 'user-117', name: 'Elijah Washington', avatar: 'https://randomuser.me/api/portraits/men/21.jpg', status: 'going' }
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
    capacity: 500,
    bannerImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop',
    title: 'Silicon Valley StartupWeekend 2025',
    description: 'Turn your idea into reality in just 54 hours. Work with mentors from Google, Apple, and Meta to build a prototype and pitch to top-tier venture capitalists at this intense entrepreneurship event. Perfect for aspiring entrepreneurs, designers, developers, and marketers wanting to test their ideas in a supportive environment.',
    date: new Date(2025, 6, 18, 17, 0), // July 18, 2025 at 5 PM
    endDate: new Date(2025, 6, 20, 21, 0), // July 20, 2025 at 9 PM
    location: {
      latitude: 37.3882,
      longitude: -122.0833,
      address: 'Googleplex, 1600 Amphitheatre Parkway',
      city: 'Mountain View',
      state: 'CA',
      country: 'United States'
    },
    category: 'Business',
    tags: ['startup', 'entrepreneurship', 'networking', 'pitching', 'silicon valley'],
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    price: 249,
    organizer: {
      id: 'org-006',
      name: 'Techstars Silicon Valley',
      logo: 'https://randomuser.me/api/portraits/men/27.jpg',
      contactEmail: 'startups@techstarssv.org'
    },
    attendees: [
      { id: 'user-123', name: 'Brandon Mitchell', avatar: 'https://randomuser.me/api/portraits/men/28.jpg', status: 'going' },
      { id: 'user-124', name: 'Jessica Wong', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', status: 'interested' },
      { id: 'user-125', name: 'Tyler Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/30.jpg', status: 'invited' },
      { id: 'user-126', name: 'Emma Chen', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', status: 'going' }
    ],
    isHot: true,
    isFeatured: false,
    media: [
      { id: 'media-018', type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644' },
      { id: 'media-019', type: 'image', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5' },
      { id: 'media-020', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-adults-brainstorming-ideas-in-a-meeting-at-the-office-41703-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5' },
      { id: 'media-021', type: 'image', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7' }
    ],
    distance: 6.3
  },
  {
    id: 'event-007',
    capacity: 35000,
    bannerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1820&auto=format&fit=crop',
    title: 'SXSW Music Festival 2025',
    description: 'Experience the world\'s premier gathering for music, technology, and film. SXSW brings together artists, innovators, and thinkers from across the globe for ten days of performances, panel discussions, screenings, and networking events. Discover emerging talent and industry leaders in Austin\'s vibrant cultural scene.',
    date: new Date(2025, 2, 13, 10, 0), // March 13, 2025 at 10 AM
    endDate: new Date(2025, 2, 22, 23, 0), // March 22, 2025 at 11 PM
    location: {
      latitude: 30.2672,
      longitude: -97.7431,
      address: 'Austin Convention Center',
      city: 'Austin',
      state: 'TX',
      country: 'United States'
    },
    category: 'Music',
    tags: ['festival', 'music', 'technology', 'film', 'networking'],
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    price: 1695,
    organizer: {
      id: 'org-007',
      name: 'SXSW LLC',
      logo: 'https://randomuser.me/api/portraits/women/31.jpg',
      contactEmail: 'info@sxsw.com'
    },
    attendees: [
      { id: 'user-127', name: 'Jordan Smith', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', status: 'going' },
      { id: 'user-128', name: 'Olivia Martinez', avatar: 'https://randomuser.me/api/portraits/women/34.jpg', status: 'interested' },
      { id: 'user-129', name: 'Ryan Thompson', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', status: 'going' },
      { id: 'user-130', name: 'Sarah Lee', avatar: 'https://randomuser.me/api/portraits/women/36.jpg', status: 'going' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-024', type: 'image', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3' },
      { id: 'media-025', type: 'image', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4' },
      { id: 'media-026', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-concert-4815-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7' },
      { id: 'media-027', type: 'image', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec' }
    ],
    distance: 7.8
  },
  {
    id: 'event-008',
    capacity: 20000,
    bannerImage: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1770&auto=format&fit=crop',
    title: 'Chicago Food Festival 2025',
    description: 'Indulge in Chicago\'s most diverse culinary experience featuring over 200 local restaurants, celebrity chef demonstrations, and food competitions. Sample everything from deep-dish pizza to haute cuisine while enjoying live music and entertainment. A must-attend event for foodies and culinary enthusiasts.',
    date: new Date(2025, 7, 8, 11, 0), // August 8, 2025 at 11 AM
    endDate: new Date(2025, 7, 10, 22, 0), // August 10, 2025 at 10 PM
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: 'Grant Park',
      city: 'Chicago',
      state: 'IL',
      country: 'United States'
    },
    category: 'Food & Drink',
    tags: ['food', 'festival', 'culinary', 'tasting', 'chicago'],
    coverImage: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852',
    price: 75,
    organizer: {
      id: 'org-008',
      name: 'Chicago Culinary Events',
      logo: 'https://randomuser.me/api/portraits/men/40.jpg',
      contactEmail: 'info@chicagofoodfest.com'
    },
    attendees: [
      { id: 'user-131', name: 'Michael Wilson', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', status: 'going' },
      { id: 'user-132', name: 'Jennifer Davis', avatar: 'https://randomuser.me/api/portraits/women/42.jpg', status: 'interested' },
      { id: 'user-133', name: 'David Johnson', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', status: 'going' }
    ],
    isHot: true,
    isFeatured: true,
    media: [
      { id: 'media-028', type: 'image', url: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852' },
      { id: 'media-029', type: 'image', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
      { id: 'media-030', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-eating-pizza-while-hanging-out-together-at-home-6550-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1573225342350-16731dd9bf3d' },
      { id: 'media-031', type: 'image', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }
    ],
    distance: 12.1
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
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

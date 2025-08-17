export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  favicon?: string;
  category: string;
  subcategory: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Contact' | 'Open Source' | string;
  pricingPeriod?: string;
  pricingDescription?: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
  languages?: string[];
  platforms?: string[];
  integrations?: string[];
  pricingDetails?: {
    type: string;
    price?: string;
    description?: string;
  }[];
  alternatives?: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  apiAvailable?: boolean;
  launchDate?: string;
  apiDocsUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  youtubeUrl?: string;
  blogUrl?: string;
  documentationUrl?: string;
  status?: 'Active' | 'Beta' | 'Alpha' | 'In Development' | 'Discontinued';
  founded?: string;
  teamSize?: number;
  funding?: {
    amount?: string;
    series?: string;
    investors?: string[];
    date?: string;
  };
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

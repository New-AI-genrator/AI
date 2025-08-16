export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;

  // Professional Information
  industry: string;
  role: string;
  company: string;
  experience: 'beginner' | 'intermediate' | 'expert';
  teamSize: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';

  // Budget & Preferences
  budget: {
    monthly: number;
    annual: number;
    currency: string;
  };

  // Goals & Objectives
  primaryGoals: string[];
  currentProjects: string[];
  painPoints: string[];

  // Tool Preferences
  currentTools: string[];
  preferredCategories: string[];
  toolPreferences: {
    easeOfUse: number; // 1-10
    priceSensitivity: number; // 1-10
    featureRichness: number; // 1-10
    integrationNeeds: number; // 1-10
  };

  // AI Learning Data
  searchHistory: SearchQuery[];
  toolInteractions: ToolInteraction[];
  recommendations: ToolRecommendation[];

  // Premium Features
  isPremium: boolean;
  premiumTier: 'basic' | 'pro' | 'enterprise';
  aiAssistantMemory: AIMemory[];

  createdAt: Date;
  updatedAt: Date;
}

export interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  results: string[];
  clickedTools: string[];
  sessionDuration: number;
}

export interface ToolInteraction {
  id: string;
  toolId: string;
  interactionType: 'view' | 'like' | 'bookmark' | 'review' | 'demo' | 'purchase';
  timestamp: Date;
  duration?: number;
  rating?: number;
  review?: string;
}

export interface ToolRecommendation {
  id: string;
  toolId: string;
  confidence: number; // 0-1
  reasoning: string;
  alternatives: string[];
  estimatedROI: number;
  timeToValue: number; // days
  learningCurve: 'easy' | 'medium' | 'hard';
  recommendedFor: string[];
  timestamp: Date;
}

export interface AIMemory {
  id: string;
  context: string;
  userPreference: string;
  timestamp: Date;
  confidence: number;
}

export interface ToolStack {
  id: string;
  userId: string;
  name: string;
  description: string;
  tools: ToolStackItem[];
  estimatedCost: number;
  estimatedROI: number;
  complexity: 'simple' | 'moderate' | 'complex';
  useCase: string;
  isPublic: boolean;
  likes: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolStackItem {
  toolId: string;
  role: string;
  priority: 'essential' | 'important' | 'nice-to-have';
  integrationNotes: string;
}

export interface ExpertProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  verified: boolean;
  rating: number;
  reviews: number;
  consultationRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  specializations: string[];
  certifications: string[];
  yearsOfExperience: number;
  bio: string;
  avatar: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Storyblok API configuration and utilities
import { ISbStoriesParams } from '@storyblok/react';

// Storyblok configuration
export const storyblokConfig = {
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || 'your-preview-token',
  use: [],
  apiOptions: {
    region: 'us', // or 'eu' depending on your Storyblok space region
  }
};

// API base URL
const STORYBLOK_API_URL = 'https://api.storyblok.com/v2/cdn';

// Types for Storyblok content
export interface StoryblokStory {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  content: {
    component: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface StoryblokResponse {
  story: StoryblokStory;
  stories: StoryblokStory[];
  total: number;
  perPage: number;
}

// Storyblok API client class
export class StoryblokAPI {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || storyblokConfig.accessToken;
    this.baseUrl = STORYBLOK_API_URL;
  }

  // Get a single story by slug
  async getStory(slug: string, params?: ISbStoriesParams): Promise<StoryblokStory | null> {
    try {
      const url = new URL(`${this.baseUrl}/stories/${slug}`);
      url.searchParams.append('token', this.accessToken);
      url.searchParams.append('version', 'draft'); // Use 'published' for production
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StoryblokResponse = await response.json();
      return data.story;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  }

  // Get multiple stories
  async getStories(params?: ISbStoriesParams): Promise<StoryblokStory[]> {
    try {
      const url = new URL(`${this.baseUrl}/stories`);
      url.searchParams.append('token', this.accessToken);
      url.searchParams.append('version', 'draft'); // Use 'published' for production
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StoryblokResponse = await response.json();
      return data.stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  // Get emergency content (for emergency instructions, hospital info, etc.)
  async getEmergencyContent(): Promise<any> {
    try {
      const story = await this.getStory('emergency-content');
      return story?.content || null;
    } catch (error) {
      console.error('Error fetching emergency content:', error);
      return null;
    }
  }

  // Get user guide content
  async getUserGuide(): Promise<any> {
    try {
      const story = await this.getStory('user-guide');
      return story?.content || null;
    } catch (error) {
      console.error('Error fetching user guide:', error);
      return null;
    }
  }

  // Get app configuration from Storyblok
  async getAppConfig(): Promise<any> {
    try {
      const story = await this.getStory('app-config');
      return story?.content || {
        emergency_number: '911',
        response_timeout: 30,
        auto_call_enabled: true,
        location_sharing_enabled: true
      };
    } catch (error) {
      console.error('Error fetching app config:', error);
      return {
        emergency_number: '911',
        response_timeout: 30,
        auto_call_enabled: true,
        location_sharing_enabled: true
      };
    }
  }

  // Get user profile by slug
  async getUserProfile(slug: string = 'test-user'): Promise<any> {
    try {
      console.log('Attempting to fetch user profile with slug:', slug);
      // Stories are in root, not in folders
      const story = await this.getStory(slug);
      console.log('User profile found:', story?.name);
      return story?.content || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Get emergency contacts
  async getEmergencyContacts(): Promise<any[]> {
    try {
      console.log('Fetching emergency contacts...');
      // Get all stories and filter by content type
      const allStories = await this.getStories();
      const contactStories = allStories.filter(story => 
        story.content?.component === 'emergency_contact'
      );
      console.log('Emergency contacts found:', contactStories.length);
      return contactStories.map(story => ({
        ...story.content,
        id: story.id,
        slug: story.slug,
        name: story.name
      }));
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }
  }

  // Get hospitals
  async getHospitals(): Promise<any[]> {
    try {
      console.log('Fetching hospitals...');
      // Get all stories and filter by content type
      const allStories = await this.getStories();
      const hospitalStories = allStories.filter(story => 
        story.content?.component === 'hospital'
      );
      console.log('Hospitals found:', hospitalStories.length);
      return hospitalStories.map(story => ({
        ...story.content,
        id: story.id,
        slug: story.slug,
        name: story.name
      }));
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      return [];
    }
  }

  // Get emergency logs
  async getEmergencyLogs(_userId?: string): Promise<any[]> {
    try {
      console.log('Fetching emergency logs...');
      // Get all stories and filter by content type
      const allStories = await this.getStories();
      const logStories = allStories.filter(story => 
        story.content?.component === 'emergency_log'
      );
      console.log('Emergency logs found:', logStories.length);
      return logStories.map(story => ({
        ...story.content,
        id: story.id,
        slug: story.slug,
        name: story.name,
        created_at: story.created_at
      }));
    } catch (error) {
      console.error('Error fetching emergency logs:', error);
      return [];
    }
  }

  // Create new emergency log (for future use)
  async createEmergencyLog(logData: any): Promise<any> {
    // Note: This would require the Management API, not just CDN API
    // For hackathon, we'll focus on reading data
    console.log('Emergency log data to create:', logData);
    return logData;
  }
}

// Create a singleton instance
export const storyblokApi = new StoryblokAPI();

// Utility functions for working with Storyblok content
export const storyblokUtils = {
  // Extract image URL from Storyblok asset
  getImageUrl: (asset: any, size?: string): string => {
    if (!asset || !asset.filename) return '';
    
    if (size) {
      return `${asset.filename}/m/${size}`;
    }
    
    return asset.filename;
  },

  // Format date from Storyblok
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  },

  // Get rich text content as HTML
  getRichText: (richTextField: any): string => {
    // This would normally use Storyblok's richtext resolver
    // For now, return a simple string representation
    if (typeof richTextField === 'string') {
      return richTextField;
    }
    
    if (richTextField && richTextField.content) {
      return richTextField.content
        .map((item: any) => item.content?.map((text: any) => text.text).join(''))
        .join(' ');
    }
    
    return '';
  },

  // Check if content is published
  isPublished: (story: StoryblokStory): boolean => {
    return !!story.published_at;
  },

  // Get story URL
  getStoryUrl: (story: StoryblokStory): string => {
    return `/${story.full_slug}`;
  }
};

// Default/fallback content when Storyblok is not available
export const fallbackContent = {
  emergencyInstructions: {
    title: 'Emergency Instructions',
    steps: [
      'Stay calm and assess the situation',
      'Press the emergency button on your device',
      'Speak clearly when emergency services answer',
      'Provide your location and describe the emergency',
      'Follow the operator\'s instructions',
      'Stay on the line until help arrives'
    ]
  },
  
  appSettings: {
    emergency_number: '911',
    response_timeout: 30,
    auto_call_enabled: true,
    location_sharing_enabled: true,
    emergency_message: 'This is an emergency alert from Life guardpro. Immediate assistance is needed.'
  }
};

export default storyblokApi;
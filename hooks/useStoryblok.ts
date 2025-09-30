'use client';

import { useState, useEffect, useCallback } from 'react';
import { storyblokApi, type StoryblokStory } from '../lib/storyblok';

// Storyblok hook types
interface UseStoryblokState {
  story: StoryblokStory | null;
  stories: StoryblokStory[];
  loading: boolean;
  error: string | null;
}

interface UseStoryblokOptions {
  version?: 'draft' | 'published';
  resolveRelations?: string[];
  resolveLinks?: 'url' | 'story';
  language?: string;
}

// Main Storyblok hook
export function useStoryblok(slug?: string, options: UseStoryblokOptions = {}) {
  const [state, setState] = useState<UseStoryblokState>({
    story: null,
    stories: [],
    loading: false,
    error: null
  });

  const fetchStory = useCallback(async (storySlug: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const story = await storyblokApi.getStory(storySlug, {
        version: options.version || 'draft',
        resolve_relations: options.resolveRelations?.join(','),
        resolve_links: options.resolveLinks,
        language: options.language
      });

      if (story) {
        setState(prev => ({ ...prev, story, loading: false }));
      } else {
        setState(prev => ({ 
          ...prev, 
          story: null, 
          loading: false, 
          error: 'Story not found' 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, [options.version, options.resolveRelations, options.resolveLinks, options.language]);

  const fetchStories = useCallback(async (params: any = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stories = await storyblokApi.getStories({
        version: options.version || 'draft',
        resolve_relations: options.resolveRelations?.join(','),
        resolve_links: options.resolveLinks,
        language: options.language,
        ...params
      });

      setState(prev => ({ ...prev, stories, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, [options.version, options.resolveRelations, options.resolveLinks, options.language]);

  const refresh = useCallback(() => {
    if (slug) {
      fetchStory(slug);
    }
  }, [slug, fetchStory]);

  useEffect(() => {
    if (slug) {
      fetchStory(slug);
    }
  }, [slug, fetchStory]);

  return {
    ...state,
    fetchStory,
    fetchStories,
    refresh
  };
}

// Hook for user profile data
export function useUserProfile(slug: string = 'test-user') {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await storyblokApi.getUserProfile(slug);
      
      if (profileData) {
        setProfile(profileData);
      } else {
        setError('User profile not found');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { profile, loading, error, refresh: fetchUserProfile };
}

// Hook for emergency data
export function useEmergencyData() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergencyData = useCallback(async () => {
    try {
      setLoading(true);
      const [contactsData, hospitalsData, logsData] = await Promise.all([
        storyblokApi.getEmergencyContacts(),
        storyblokApi.getHospitals(),
        storyblokApi.getEmergencyLogs()
      ]);

      setContacts(contactsData);
      setHospitals(hospitalsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Error fetching emergency data:', err);
      setError('Failed to load emergency data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmergencyData();
  }, [fetchEmergencyData]);

  return { contacts, hospitals, logs, loading, error, refresh: fetchEmergencyData };
}

// Hook for app configuration from Storyblok
export function useAppConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const appConfig = await storyblokApi.getAppConfig();
      setConfig(appConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch app config');
      // Fallback to default config
      setConfig({
        emergency_number: '911',
        response_timeout: 30,
        auto_call_enabled: true,
        location_sharing_enabled: true,
        emergency_message: 'This is an emergency alert from LifeGuard Pro. Immediate assistance is needed.',
        features: {
          fall_detection: true,
          voice_activation: true,
          smartwatch_integration: false,
          family_sharing: true,
          medical_integration: false
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppConfig();
  }, [fetchAppConfig]);

  return {
    config,
    loading,
    error,
    refresh: fetchAppConfig
  };
}

// Hook for user guide content
export function useUserGuide() {
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGuide = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userGuide = await storyblokApi.getUserGuide();
      setGuide(userGuide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user guide');
      // Fallback to default guide
      setGuide({
        getting_started: {
          title: 'Getting Started',
          steps: [
            'Create your account and verify your phone number',
            'Add emergency contacts and medical information',
            'Test your emergency button to ensure it works',
            'Familiarize yourself with the app features',
            'Set up location sharing for faster response times'
          ]
        },
        using_panic_button: {
          title: 'Using the Panic Button',
          instructions: [
            'Press and hold the red emergency button',
            'Wait for the countdown to complete (3 seconds)',
            'Speak clearly when connected to emergency services',
            'Provide your location and describe the emergency',
            'Stay calm and follow the operator\'s instructions'
          ]
        },
        faq: [
          {
            question: 'What happens when I press the panic button?',
            answer: 'Emergency services will be contacted, your location will be shared, and your emergency contacts will be notified.'
          },
          {
            question: 'Can I cancel an emergency alert?',
            answer: 'Yes, you have a 3-second window to cancel the alert by pressing the button again.'
          },
          {
            question: 'Will my location be shared?',
            answer: 'Yes, if location sharing is enabled, your current location will be shared with emergency services to help them find you quickly.'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserGuide();
  }, [fetchUserGuide]);

  return {
    guide,
    loading,
    error,
    refresh: fetchUserGuide
  };
}

// Hook for dynamic content based on story type
export function useStoryblokContent(contentType: string, filters: any = {}) {
  const [content, setContent] = useState<StoryblokStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stories = await storyblokApi.getStories({
        starts_with: contentType,
        is_startpage: false,
        ...filters
      });
      setContent(stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, filters]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refresh: fetchContent
  };
}

// Hook for live preview (for content editors)
export function useStoryblokLivePreview(story: StoryblokStory | null) {
  const [liveStory, setLiveStory] = useState<StoryblokStory | null>(story);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).storyblok) {
      // Initialize Storyblok bridge for live preview
      (window as any).storyblok.init({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
      });

      // Listen for story changes
      (window as any).storyblok.on(['input', 'published', 'change'], (event: any) => {
        if (event.action === 'input') {
          if (event.story.id === story?.id) {
            setLiveStory(event.story);
          }
        } else {
          // Reload for published/change events
          window.location.reload();
        }
      });
    }
  }, [story?.id]);

  useEffect(() => {
    setLiveStory(story);
  }, [story]);

  return liveStory;
}

// Hook for Storyblok search
export function useStoryblokSearch() {
  const [results, setResults] = useState<StoryblokStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, searchOptions: any = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stories = await storyblokApi.getStories({
        search_term: query,
        ...searchOptions
      });
      setResults(stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearSearch
  };
}

export default useStoryblok;
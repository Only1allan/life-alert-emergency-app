// Utility functions for the LifeGuard Pro App

// Utility function to merge classes (simplified version without external deps)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Date and time utilities
export const dateUtils = {
  // Format date to readable string
  formatDate: (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
    const d = new Date(date);
    
    switch (format) {
      case 'short':
        return d.toLocaleDateString();
      case 'long':
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return d.toLocaleDateString();
    }
  },

  // Get time ago string
  timeAgo: (date: string | Date): string => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  },

  // Check if date is today
  isToday: (date: string | Date): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  },

  // Get current timestamp
  now: (): string => new Date().toISOString(),

  // Add time to date
  addTime: (date: string | Date, amount: number, unit: 'minutes' | 'hours' | 'days'): Date => {
    const d = new Date(date);
    switch (unit) {
      case 'minutes':
        d.setMinutes(d.getMinutes() + amount);
        break;
      case 'hours':
        d.setHours(d.getHours() + amount);
        break;
      case 'days':
        d.setDate(d.getDate() + amount);
        break;
    }
    return d;
  }
};

// Phone number utilities
export const phoneUtils = {
  // Format phone number
  format: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    return phone; // Return original if can't format
  },

  // Validate phone number
  isValid: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
  },

  // Clean phone number (remove all non-digits except leading +)
  clean: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  }
};

// Location utilities
export const locationUtils = {
  // Calculate distance between two points (Haversine formula)
  calculateDistance: (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number, 
    unit: 'miles' | 'km' = 'miles'
  ): number => {
    const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Format coordinates
  formatCoordinates: (lat: number, lon: number): string => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  },

  // Get location accuracy description
  getAccuracyDescription: (accuracy: number): string => {
    if (accuracy <= 5) return 'Very High';
    if (accuracy <= 20) return 'High';
    if (accuracy <= 100) return 'Medium';
    return 'Low';
  }
};

// Emergency utilities
export const emergencyUtils = {
  // Get emergency type color
  getEmergencyTypeColor: (type: string): string => {
    switch (type.toLowerCase()) {
      case 'panic_button':
      case 'medical_emergency':
        return 'bg-red-100 text-red-800';
      case 'fall_detection':
        return 'bg-orange-100 text-orange-800';
      case 'fire':
        return 'bg-red-200 text-red-900';
      case 'security':
        return 'bg-purple-100 text-purple-800';
      case 'test_alert':
        return 'bg-blue-100 text-blue-800';
      case 'false_alarm':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  // Get status color
  getStatusColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'dispatched':
      case 'en_route':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_scene':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  // Generate emergency ID
  generateEmergencyId: (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `EMG-${timestamp.slice(-8)}-${random.toUpperCase()}`;
  },

  // Calculate response time
  calculateResponseTime: (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.floor((end.getTime() - start.getTime()) / 1000); // seconds
  },

  // Format response time
  formatResponseTime: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }
};

// Form validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password strength validation
  isValidPassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Required field validation
  isRequired: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }
};

// Storage utilities (for localStorage)
export const storageUtils = {
  // Set item in localStorage
  setItem: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get item from localStorage
  getItem: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Device detection utilities
export const deviceUtils = {
  // Check if mobile device
  isMobile: (): boolean => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  },

  // Check if iOS
  isIOS: (): boolean => {
    return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Check if Android
  isAndroid: (): boolean => {
    return typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
  },

  // Get device info
  getDeviceInfo: () => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return {
        userAgent: '',
        platform: '',
        screenResolution: '',
        timezone: ''
      };
    }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
};

// API utilities
export const apiUtils = {
  // Create API error response
  createErrorResponse: (message: string, code?: string): any => {
    return {
      success: false,
      error: {
        message,
        code: code || 'UNKNOWN_ERROR'
      },
      timestamp: new Date().toISOString()
    };
  },

  // Create API success response
  createSuccessResponse: (data: any, message?: string): any => {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  },

  // Handle API response
  handleResponse: async (response: Response): Promise<any> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Text utilities
export const textUtils = {
  // Truncate text
  truncate: (text: string, maxLength: number, suffix = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (text: string): string => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Extract initials
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
};

// Generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  cn,
  dateUtils,
  phoneUtils,
  locationUtils,
  emergencyUtils,
  validationUtils,
  storageUtils,
  deviceUtils,
  apiUtils,
  textUtils,
  generateId,
  debounce,
  throttle
};
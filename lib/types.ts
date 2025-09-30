// Type definitions for the Life guardpro App

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  weight?: number;
  height?: number;
  insuranceInfo?: InsuranceInfo;
  emergencyMedicalNotes?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  memberName: string;
}

// Emergency Contact types
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  isActive: boolean;
  notificationPreferences: ContactNotificationPreferences;
}

export interface ContactNotificationPreferences {
  sms: boolean;
  call: boolean;
  email: boolean;
  priority: number; // 1 = highest priority
}

// Emergency and Alert types
export interface EmergencyAlert {
  id: string;
  userId: string;
  type: EmergencyType;
  status: EmergencyStatus;
  location: Location;
  timestamp: string;
  resolvedAt?: string;
  description?: string;
  responseTime?: number; // in seconds
  responders: Responder[];
  audioRecording?: string;
  notes?: string[];
}

export type EmergencyType = 
  | 'panic_button'
  | 'fall_detection'
  | 'medical_emergency'
  | 'fire'
  | 'security'
  | 'test_alert'
  | 'false_alarm';

export type EmergencyStatus = 
  | 'active'
  | 'dispatched'
  | 'en_route'
  | 'on_scene'
  | 'resolved'
  | 'cancelled';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number; // in meters
  timestamp: string;
  source: 'gps' | 'network' | 'manual';
}

export interface Responder {
  id: string;
  type: ResponderType;
  name: string;
  phone?: string;
  status: ResponderStatus;
  estimatedArrival?: string;
  actualArrival?: string;
}

export type ResponderType = 
  | 'emergency_services'
  | 'emergency_contact'
  | 'medical_professional'
  | 'security'
  | 'fire_department'
  | 'police';

export type ResponderStatus = 
  | 'notified'
  | 'acknowledged'
  | 'en_route'
  | 'arrived'
  | 'completed';

// Medical facility types
export interface MedicalFacility {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: Location;
  distance?: number; // in miles/km
  services: MedicalService[];
  rating?: number;
  hasEmergencyRoom: boolean;
  operatingHours?: OperatingHours;
}

export interface MedicalService {
  name: string;
  isAvailable: boolean;
  specialNotes?: string;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  is24Hours: boolean;
  isClosed: boolean;
}

// Device and system types
export interface Device {
  id: string;
  userId: string;
  type: DeviceType;
  name: string;
  batteryLevel?: number;
  status: DeviceStatus;
  lastSeen: string;
  firmwareVersion?: string;
  serialNumber?: string;
}

export type DeviceType = 
  | 'panic_button'
  | 'fall_detector'
  | 'mobile_app'
  | 'smartwatch'
  | 'home_monitor';

export type DeviceStatus = 
  | 'online'
  | 'offline'
  | 'low_battery'
  | 'error'
  | 'maintenance';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Geolocation types
export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationResult {
  location: Location;
  error?: GeolocationError;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// VAPI (Voice AI) types
export interface VAPICall {
  id: string;
  userId: string;
  emergencyId?: string;
  status: VAPICallStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  transcript?: string;
  audioUrl?: string;
  confidence?: number;
}

export type VAPICallStatus = 
  | 'initiated'
  | 'connecting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface VAPIConfiguration {
  assistantId: string;
  phoneNumber: string;
  voice: VoiceConfig;
  transcriber: TranscriberConfig;
  model: ModelConfig;
}

export interface VoiceConfig {
  provider: string;
  voiceId: string;
  speed?: number;
  pitch?: number;
}

export interface TranscriberConfig {
  provider: string;
  model: string;
  language: string;
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// App configuration types
export interface AppConfig {
  emergencyNumber: string;
  responseTimeout: number; // in seconds
  autoCallEnabled: boolean;
  locationSharingEnabled: boolean;
  emergencyMessage: string;
  testModeEnabled: boolean;
  features: FeatureFlags;
}

export interface FeatureFlags {
  fallDetection: boolean;
  voiceActivation: boolean;
  smartwatchIntegration: boolean;
  familySharing: boolean;
  medicalIntegration: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export type NotificationType = 
  | 'emergency_alert'
  | 'system_status'
  | 'device_update'
  | 'test_reminder'
  | 'battery_warning'
  | 'maintenance'
  | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// Form types
export interface ContactForm {
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
}

export interface MedicalForm {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  weight?: number;
  emergencyMedicalNotes?: string;
}

// Component prop types
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DataTableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Database model types (for when using a database)
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseUser extends BaseModel {
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  address: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  isActive: boolean;
}

// Event types for analytics
export interface AnalyticsEvent {
  eventName: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, any>;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  screenResolution: string;
  timezone: string;
}

// Export all types as a namespace for convenience
export * from './types';
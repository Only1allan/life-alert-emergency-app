# LifeGuard Pro: Storyblok Integration Documentation

## Overview

LifeGuard Pro leverages Storyblok as a **dynamic database and content management system** for a mission-critical emergency response application. This innovative use of Storyblok goes beyond traditional CMS functionality, serving as the backbone for user profiles, emergency logs, hospital data, and real-time emergency workflows.

## Core Innovation: Storyblok as Emergency Database

Unlike traditional CMS usage, LifeGuard Pro uses Storyblok as:
- **Dynamic User Database**: Store and manage user profiles with medical information
- **Emergency Logging System**: Real-time emergency incident tracking and history
- **Hospital Management**: Live hospital availability and contact information
- **Template Engine**: Dynamic emergency notification templates
- **Content-Driven Decision Engine**: AI-powered emergency routing based on Storyblok content

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI    │◄──►│   Storyblok CMS  │◄──►│   VAPI AI Agent │
│                 │    │   (Database)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Emergency APIs  │    │  Webhook System  │    │ External Services│
│                 │    │                  │    │ (SMS, Email)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Content Types & Data Models

### 1. User Profile (`user_profile`)
**Purpose**: Store comprehensive user medical and personal information
**Usage**: Dashboard displays user info, VAPI AI agent references medical conditions, emergency routing uses address

### 2. Emergency Contact (`emergency_contact`)
**Purpose**: Manage emergency contact hierarchy and preferences
**Usage**: Emergency notification system uses contact hierarchy, dashboard displays contact information, VAPI agent references contact preferences

### 3. Hospital (`hospital`)
**Purpose**: Real-time hospital availability and contact management
**Usage**: Hospital finder displays real-time availability, emergency routing considers hospital capacity, webhook updates hospital status

### 4. Emergency Log (`emergency_log`)
**Purpose**: Comprehensive emergency incident tracking and analytics
**Usage**: Emergency history viewer displays all incidents, analytics dashboard shows response times, AI learning from past patterns

### 5. Message Template (`message_template`)
**Purpose**: Dynamic emergency notification templates
**Usage**: Emergency notifications use severity-appropriate templates, multi-channel messaging (email, SMS, push), template variables populated with real emergency data

## API Integration Patterns

### 1. Data Fetching Hooks (`/hooks/useStoryblok.ts`)
- `useStoryblok(slug, options)` - Main hook for story retrieval
- `useUserProfile(slug)` - User profile data
- `useEmergencyData()` - Contacts, hospitals, logs
- `useAppConfig()` - Application configuration
- `useUserGuide()` - Help content and instructions
- `useStoryblokContent(contentType, filters)` - Dynamic content filtering

### 2. Storyblok API Client (`/lib/storyblok.ts`)
- `getStory(slug, params)` - Single story retrieval
- `getStories(params)` - Multiple stories with filtering
- `getUserProfile(slug)` - User profile data
- `getEmergencyContacts()` - Emergency contact data
- `getHospitals()` - Hospital information
- `getEmergencyLogs(userId)` - Emergency incident logs
- `getAppConfig()` - Application settings

### 3. Emergency Workflow Integration
- **Panic Button Flow**: User location → Load profile from Storyblok → VAPI call → Decision tree → Log to Storyblok
- **Emergency Logging**: Creates emergency log entries, links to user profile and contacts, triggers notifications
- **Notification System**: Fetches message templates, renders with emergency data, logs status back to Storyblok

## Real-Time Features

### 1. Webhook System (`/app/api/storyblok/webhook/route.ts`)
- `handleEmergencyLogWebhook()` - Process new emergency logs
- `handleHospitalUpdateWebhook()` - Update hospital availability
- `handleProtocolUpdateWebhook()` - Update emergency protocols
- Critical emergency alerts to emergency services
- Hospital availability updates
- Emergency dashboard updates

### 2. Live Preview Support
- `useStoryblokLivePreview(story)` - Real-time content updates during editing
- Storyblok bridge integration
- Automatic content refresh on changes

## Content Management Features

### 1. Dynamic Content Filtering
- Severity-based template selection
- Emergency type matching
- Active status filtering
- User-specific content filtering

### 2. Content Setup & Management
- Automated content type creation
- Sample data population
- Schema definition and validation
- Bulk content operations

## Advanced Integration Patterns

### 1. Content-Driven Decision Engine
- VAPI agent references Storyblok content for context
- Medical conditions inform emergency assessment
- Hospital availability affects routing decisions
- Contact preferences guide notification strategy

### 2. Multi-Channel Content Delivery
- HTML email templates with variable substitution
- SMS message templates
- Push notification templates
- Severity-based template selection

### 3. Analytics & Reporting
- Response time tracking
- Success rate monitoring
- Geographic emergency patterns
- AI decision accuracy

## Innovation Highlights

### 1. Non-Traditional CMS Usage
- **Database Alternative**: Using Storyblok as primary data store
- **Real-Time Updates**: Live content changes affecting emergency workflows
- **Content-Driven Logic**: Emergency decisions based on CMS content
- **Scalable Architecture**: Mission-critical application on CMS platform

### 2. Emergency Response Innovation
- **AI Integration**: VAPI agent uses Storyblok content for context
- **Dynamic Routing**: Hospital and contact selection based on live data
- **Template System**: Severity-based notification templates
- **Comprehensive Logging**: Full emergency incident tracking

### 3. Technical Achievements
- **Type Safety**: Full TypeScript integration with Storyblok
- **Error Resilience**: Graceful degradation and fallback systems
- **Real-Time Features**: Webhook-driven live updates
- **Content Management**: Non-technical users can update emergency protocols

## Conclusion

LifeGuard Pro demonstrates Storyblok's versatility beyond traditional marketing websites, showcasing its capability to power mission-critical applications with real-time data management, complex content relationships, dynamic content-driven workflows, and scalable architecture for critical applications.

This innovative use of Storyblok as a dynamic database and content management system for emergency response represents a paradigm shift in CMS usage, proving that modern headless CMS platforms can power applications far beyond traditional content marketing needs.

# Life GuardPro Panic Button MVP - Technical Requirements Document

## Executive Summary
A comprehensive emergency response system leveraging Storyblok CMS for content management, VAPI for AI voice assistance, and Next.js for the frontend. The system enables users to trigger emergency assistance through a panic button that initiates an intelligent workflow to connect them with the most appropriate help.

## Project Overview

### Core Concept
- **Problem**: Traditional Life GuardPro systems are expensive and limited in functionality
- **Solution**: Web-based panic button with AI-driven emergency assessment and response
- **Target**: Elderly users, people with medical conditions, individuals living alone
- **Hackathon Goal**: Demonstrate Storyblok's versatility in mission-critical applications

### Key Differentiators for Storyblok Hackathon
1. **Content-Driven Emergency Response**: All user profiles, hospital data, and emergency logs managed through Storyblok
2. **Real-time Decision Engine**: AI agent uses Storyblok content to make intelligent routing decisions
3. **Dynamic Content Updates**: Hospital availability, contact preferences, and medical info updated in real-time
4. **Scalable Architecture**: Demonstrates Storyblok's capability for critical, data-intensive applications

## Technical Architecture

### System Components
```
User Interface (Next.js) ←→ Storyblok CMS ←→ AI Agent (VAPI) ←→ External Services
                                    ↓
                            Emergency Workflow Engine
                                    ↓
                        [Hospital API | Contact SMS | 911 Integration]
```

### Technology Stack
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **CMS**: Storyblok (Content Types, Stories, API)
- **AI Voice**: VAPI for emergency assessment and routing
- **Maps**: Google Maps API for location and hospital finder
- **Notifications**: Web Push API, SMS (Twilio), Email
- **Deployment**: Vercel (integrates seamlessly with Storyblok)

## Storyblok Content Strategy

### Content Types (Blocks) Created
1. **User Profile** (`user_profile`)
   - Personal info, medical data, insurance details
   - References to emergency contacts and preferred hospital
   
2. **Emergency Contact** (`emergency_contact`)
   - Contact details, relationship, priority level
   
3. **Hospital** (`hospital`)
   - Location data, specialties, availability status, emergency numbers
   
4. **Emergency Log** (`emergency_log`)
   - Incident records, AI decisions, response times, outcomes

### Content Structure
```
📁 User Profiles/
  └── mary-johnson-profile (test user)
📁 Emergency Contacts/
  ├── john-doe-primary (spouse)
  └── jane-smith-secondary (daughter)
📁 Hospitals/
  ├── general-hospital-downtown
  ├── city-medical-center
  └── st-marys-emergency
📁 Emergency Logs/
  ├── mary-emergency-001
  └── mary-emergency-002
```

## Emergency Workflow Logic

### Decision Tree Implementation
```
PANIC BUTTON PRESSED
    ↓
1. Get User Location (GPS/Browser)
    ↓
2. Load User Profile from Storyblok
    ↓
3. VAPI AI Assessment Call
    ↓
4. Severity Evaluation:
   - HIGH SEVERITY → Call 911 immediately
   - MEDIUM SEVERITY → Route through preference hierarchy
   - LOW SEVERITY → Contact primary emergency contact
    ↓
5. Preference Hierarchy (Medium Severity):
   a. Try Preferred Hospital (if available)
   b. Try Primary Emergency Contact
   c. Try Secondary Emergency Contact
   d. Find Nearest Hospital (Google Maps)
   e. Fallback to 911
    ↓
6. Log Decision & Actions in Storyblok
    ↓
7. Send Status Updates via Push Notifications
```

### VAPI Integration Points
- **Initial Assessment**: "What's your emergency? Rate severity 1-10"
- **Medical Check**: Reference user's medical conditions from Storyblok
- **Location Confirmation**: Verify address from user profile
- **Contact Preferences**: Use emergency contact hierarchy
- **Hospital Selection**: Check availability status in Storyblok

## 10-Day Development Plan

### Days 1-2: Foundation & Storyblok Setup ✅
- [x] Storyblok space configuration
- [x] Content types and test data creation
- [x] Next.js project structure
- [x] Basic UI components with dummy data

### Days 3-4: Storyblok Integration & Real Data
- [ ] Fix Storyblok API connection and data fetching
- [ ] Replace dummy data with real Storyblok content
- [ ] Implement user profile display
- [ ] Create emergency contacts and hospital management

### Days 5-6: Panic Button Core Functionality
- [ ] Implement panic button component with countdown
- [ ] Add geolocation services
- [ ] Create emergency state management
- [ ] Build decision engine logic

### Days 7-8: VAPI AI Integration
- [ ] Set up VAPI account and configuration
- [ ] Create emergency assessment prompts
- [ ] Implement AI call initiation
- [ ] Build severity evaluation logic
- [ ] Connect AI decisions to routing logic

### Days 9-10: Hospital/Contact Integration & Polish
- [ ] Implement hospital finder with Google Maps
- [ ] Add SMS/call integration for contacts
- [ ] Create emergency logging to Storyblok
- [ ] Add push notifications
- [ ] Testing, bug fixes, and demo preparation

## Detailed Feature Specifications

### 1. User Dashboard
**Components:**
- Profile summary with medical info from Storyblok
- System status indicators
- Emergency contact verification
- Large, prominent panic button
- Emergency history from Storyblok logs

**Storyblok Integration:**
- Fetch user profile: `storyblokApi.getUserProfile()`
- Display emergency contacts with real phone numbers
- Show preferred hospital information
- Real-time status updates

### 2. Panic Button Component
**Functionality:**
- 3-second countdown with cancel option
- Visual/audio feedback during activation
- Location capture and user confirmation
- Immediate emergency state initiation

**Data Flow:**
```javascript
PanicButton.onClick() → 
  getUserLocation() → 
  loadUserProfile(storyblok) → 
  initiateVAPICall() → 
  executeDecisionTree() → 
  logEmergency(storyblok)
```

### 3. AI Voice Agent (VAPI)
**Assessment Questions:**
1. "What type of emergency are you experiencing?"
2. "On a scale of 1-10, how severe is this situation?"
3. "Are you able to move around safely?"
4. "Do you need immediate medical attention?"

**Decision Logic:**
- Severity 8-10: Immediate 911 call
- Severity 5-7: Hospital preference workflow
- Severity 1-4: Emergency contact notification

**Integration with Storyblok:**
- Pull user medical conditions for context
- Reference preferred hospital availability
- Use emergency contact priority order

### 4. Hospital Finder & Integration
**Features:**
- Real-time hospital availability from Storyblok
- Distance calculation from user location
- Specialty matching (emergency, cardiology, etc.)
- Direct emergency line calling

**Data Source:**
- Hospital content type in Storyblok
- Google Maps API for directions
- Live availability status updates

### 5. Emergency Contacts System
**Functionality:**
- Priority-based contact sequence
- Multiple contact methods (call, SMS, email)
- Automatic escalation if no response
- Status tracking and notifications

**Storyblok Integration:**
- Store contact preferences
- Track contact history
- Update availability status

### 6. Emergency Logging & History
**Log Data:**
- Timestamp and location
- AI assessment results
- Actions taken (hospital called, contact reached)
- Response times and outcomes
- User feedback

**Storyblok Storage:**
- Create emergency log entries
- Link to user profile and contacts
- Generate reports and analytics

## API Integration Requirements

### Storyblok API Calls
```javascript
// Core data fetching
storyblokApi.getUserProfile(userId)
storyblokApi.getEmergencyContacts(userId)
storyblokApi.getHospitals(location, radius)
storyblokApi.createEmergencyLog(logData)

// Real-time updates
storyblokApi.updateHospitalAvailability(hospitalId, status)
storyblokApi.updateContactStatus(contactId, reachable)
```

### VAPI Integration
```javascript
// Emergency call initiation
vapiApi.initiateEmergencyCall({
  userData: userProfile,
  location: currentLocation,
  medicalInfo: medicalConditions,
  emergencyContacts: contactList
})

// Assessment handling
vapiApi.handleAssessmentResponse(severity, type, context)
```

### External Services
- **Google Maps**: Hospital finder, directions, distance calculation
- **Twilio**: SMS notifications to emergency contacts
- **Web Push**: Browser notifications for status updates
- **Geolocation**: Browser GPS for precise location

## Security & Privacy Considerations

### Data Protection
- HIPAA-compliant medical data handling
- Encrypted storage of personal information
- Secure API communication (HTTPS only)
- User consent for location sharing

### Emergency Override
- Bypass authentication in true emergencies
- Guest/anonymous emergency button option
- Public device compatibility

### Data Retention
- Emergency logs kept for legal/medical records
- User control over data deletion
- Regular security audits

## Success Metrics for Hackathon

### Technical Achievements
- ✅ Complete Storyblok content type implementation
- ✅ Real-time data fetching and display
- 🎯 Working panic button with AI integration
- 🎯 End-to-end emergency workflow execution
- 🎯 Hospital finder with real data

### Innovation Points
- Content-driven emergency response (unique use of CMS)
- AI decision engine using Storyblok data
- Real-time hospital availability management
- Scalable architecture for critical applications

### Demo Flow
1. User login → Mary Johnson's profile loads from Storyblok
2. Panic button press → 3-second countdown
3. VAPI call → AI assessment with medical context
4. Decision execution → Hospital contact or 911 call
5. Logging → Emergency record created in Storyblok
6. Notifications → Status updates to family

## Deployment Strategy

### Vercel Integration
- Automatic Storyblok webhook handling
- Preview deployments for content changes
- Environment variable management
- Global CDN for fast response times

### Production Considerations
- Health monitoring and alerting
- Backup emergency numbers (911 failsafe)
- Performance optimization for critical path
- Multi-region deployment for reliability

## Risk Mitigation

### Technical Risks
- **API Failures**: Fallback to 911 always available
- **Location Issues**: Manual address entry option
- **Network Problems**: Offline mode with cached contacts
- **VAPI Downtime**: Direct call routing as backup

### Regulatory Compliance
- Not a replacement for professional medical alert systems
- Clear disclaimers about service limitations
- User education about when to call 911 directly

## Conclusion

This Life GuardPro MVP demonstrates Storyblok's versatility beyond traditional marketing sites, showcasing its capability to power mission-critical applications with real-time data management, complex content relationships, and seamless API integration. The combination of AI-driven assessment, content-managed emergency routing, and scalable architecture creates a compelling solution that could genuinely save lives while highlighting Storyblok's potential in unexpected domains.

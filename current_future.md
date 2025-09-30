### Project Overview: Life guardpro App

This document provides an overview of the "Life guardpro App," its current architecture, and the roadmap for its future development.

The core idea is to provide a modern, web-based personal emergency response system. A user can signal for help, and the system will automatically notify their designated contacts with critical information.

### Current Architecture & Tech Stack

The application is built on a modern, scalable, and developer-friendly stack:

*   **Framework**: [Next.js 14](https://nextjs.org/) with the App Router. This provides server-side rendering, API routes, and a great developer experience.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and maintainability.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for our component library. This allows for rapid, consistent, and accessible UI development.
*   **CMS**: [Storyblok](https://www.storyblok.com/). This is currently used for managing content, allowing for updates to UI text and instructional content without deploying new code.
*   **Deployment**: Vercel, which is a natural fit for a Next.js application.

### Core Components & Features

The key parts of the application as it stands today are:

1.  **User Management (`/app/profile`, `/app/login`)**: Basic pages for user registration, login, and profile management.
2.  **The Panic Button (`/components/PanicButton.tsx`)**: The core feature. When triggered, it uses the `useEmergency` hook and the `/app/api/make-call` API route to start the notification process.
3.  **Geolocation (`/hooks/useGeolocation.ts`)**: Captures the user's real-time location during an emergency.
4.  **Emergency Information (`/components/EmergencyContacts.tsx`, `/components/HospitalInfo.tsx`)**: Allows users to pre-fill their emergency contacts and preferred hospital.
5.  **Emergency Log (`/app/emergency-log`)**: A history of past alerts for record-keeping.

### The Roadmap: From Prototype to Production

To evolve this prototype into a production-ready application, the following roadmap is proposed:

#### 1. Refine the Core Emergency Workflow

*   **Multi-Channel Notifications**: Integrate with services like [Twilio](https://www.twilio.com/) to send SMS, automated voice calls, and emails to emergency contacts. The messages should include the user's name, a map link with their location, and any pre-saved medical notes.
*   **"I'm Safe" and "False Alarm" Flow**: Implement a way for users to de-escalate a situation, triggering an "All Clear" notification to contacts.
*   **Status Dashboard for Contacts**: Create a temporary, secure web page for contacts to view the user's live location and a log of events during an alert.

#### 2. Improve Reliability and Resilience

*   **Real-time Updates with WebSockets**: Use WebSockets (e.g., with [Pusher](https://pusher.com/) or [Ably](https://ably.com/)) for live location tracking and status updates.
*   **Offline Support (Progressive Web App - PWA)**: Convert the application into a PWA to ensure the core "Panic" functionality is cached and can work offline.
*   **Database and Backend**: Migrate from using a CMS for data storage to a robust database like **PostgreSQL** with **Prisma** as the ORM for secure and scalable data management.

#### 3. Expand the Feature Set

*   **Wearable Device Integration**: Develop companion apps for smartwatches (Apple Watch, Wear OS) to trigger alerts and leverage features like fall detection.
*   **"Check on Me" Timers**: Allow users to set timers for activities, which trigger an alert if not canceled.
*   **Geofencing and Safe Zones**: Enable users to define "safe zones" and automatically notify contacts if they leave during unusual hours.
*   **Professional Monitoring Integration**: Offer a premium tier with 24/7 professional monitoring services that can dispatch emergency services.

import { NextResponse } from 'next/server';
import { getStoryblokApi } from '@storyblok/react/rsc';

// This would typically be dynamic based on the logged-in user
const EMERGENCY_CONTACTS_SLUG = 'emergency-contacts-john-doe';

export async function GET() {
  try {
    const storyblokApi = getStoryblokApi();

    try {
      const { data } = await storyblokApi.get(`cdn/stories/${EMERGENCY_CONTACTS_SLUG}`, {
        version: 'draft',
      });

      if (data && data.story && data.story.content.contacts) {
        const contacts = data.story.content.contacts || [];
        return NextResponse.json(contacts);
      }
    } catch (storyblokError) {
      // Storyblok unavailable, fallback to environment email
    }

    // Get your email from environment variables
    const yourEmail = process.env.EMAIL_USER || process.env.NEXT_PUBLIC_EMAIL_USER;
    
    if (!yourEmail) {
      return NextResponse.json([]);
    }

    // Only send to YOUR email
    const yourContact = [
      {
        contact_name: "Emergency Contact",
        email: yourEmail,
        phone_number: "+1234567890",
        relationship: "Primary",
        is_primary: true
      }
    ];

    return NextResponse.json(yourContact);

  } catch (error) {
    // Even if everything fails, try to get your email
    const yourEmail = process.env.EMAIL_USER || process.env.NEXT_PUBLIC_EMAIL_USER;
    
    if (yourEmail) {
      const fallbackContacts = [
        {
          contact_name: "Emergency Contact",
          email: yourEmail,
          phone_number: "+1234567899",
          relationship: "Primary",
          is_primary: true
        }
      ];
      return NextResponse.json(fallbackContacts);
    }
    
    // Last resort - return empty array
    return NextResponse.json([]);
  }
}

// Note: POST, PUT, DELETE operations for contacts would require using the Storyblok Management API,
// which is more complex and requires an OAuth token. For this example, we'll stick to GET.
// In a real application, you would have a backend service to handle these operations securely.

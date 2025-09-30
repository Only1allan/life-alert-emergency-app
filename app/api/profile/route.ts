import { NextResponse } from 'next/server';
import { getStoryblokApi } from '@storyblok/react/rsc';

// This would typically be dynamic based on the logged-in user
const USER_PROFILE_SLUG = 'user-profile-john-doe';

export async function GET() {
  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${USER_PROFILE_SLUG}`, {
      version: 'draft',
    });

    if (!data || !data.story) {
      // As a fallback for the demo, return some default data
      // In a real app, you'd return a 404
      return NextResponse.json({
        name: 'John Doe',
        phone: '+1234567890', // A verified number for Twilio
        medicalInfo: 'Diabetes, High Blood Pressure',
      });
    }

    const userProfile = data.story.content;

    return NextResponse.json({
      name: userProfile.name || 'N/A',
      phone: userProfile.phone || 'N/A',
      medicalInfo: userProfile.medical_info || 'N/A',
    });

  } catch (error) {
    console.error('Error fetching user profile from Storyblok:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: `Failed to fetch user profile. ${errorMessage}` }, { status: 500 });
  }
}

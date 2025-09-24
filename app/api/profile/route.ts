import { NextResponse } from 'next/server';
import { storyblokApi } from '@/lib/storyblok';

// This would typically be dynamic based on the logged-in user
const USER_PROFILE_SLUG = 'test-user';

export async function GET() {

  try {
    const userProfile = await storyblokApi.getUserProfile(USER_PROFILE_SLUG);

    if (!userProfile) {
      // As a fallback for the demo, return some default data
      // In a real app, you'd return a 404
      return NextResponse.json({
        name: 'John Doe',
        phone: '+1234567890', // A verified number for Twilio
        medicalInfo: 'Diabetes, High Blood Pressure',
      });
    }

    return NextResponse.json({
      name: userProfile.full_name || 'N/A',
      phone: userProfile.phone_number || 'N/A',
      medicalInfo: userProfile.medical_conditions || 'N/A',
      age: userProfile.age || 'N/A',
      address: userProfile.address || 'N/A',
      allergies: userProfile.allergies || 'N/A',
      medications: userProfile.medications || 'N/A',
      insurance: userProfile.insurance_provider || 'N/A'
    });

  } catch (error) {
    console.error('Error fetching user profile from Storyblok:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: `Failed to fetch user profile. ${errorMessage}` }, { status: 500 });
  }
}

'use client';

import { useState, useEffect } from 'react';
import { storyblokApi } from '../../lib/storyblok';

export default function DebugPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllStories() {
      try {
        setLoading(true);
        console.log('Fetching all stories from Storyblok...');
        
        const allStories = await storyblokApi.getStories();
        console.log('All stories fetched:', allStories);
        
        setStories(allStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    }

    fetchAllStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-xl font-semibold">Debugging Storyblok Connection...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl font-semibold text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Storyblok Debug - All Stories</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-green-600 font-medium">✅ Successfully connected to Storyblok!</p>
          <p className="text-sm text-gray-600">Found {stories.length} stories in your space.</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">All Stories in Your Space</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stories.map((story, index) => (
                  <tr key={story.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {story.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {story.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {story.full_slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {story.content?.component || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {story.published_at ? (
                        <span className="text-green-600">✅ Published</span>
                      ) : (
                        <span className="text-yellow-600">⚠️ Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {stories.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Stories Found</h3>
            <p className="text-yellow-700">
              It looks like there are no stories in your Storyblok space yet. Make sure you've:
            </p>
            <ul className="list-disc list-inside text-yellow-700 mt-2">
              <li>Created content in your Storyblok space</li>
              <li>Published your stories (not just saved as drafts)</li>
              <li>Used the correct access token</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
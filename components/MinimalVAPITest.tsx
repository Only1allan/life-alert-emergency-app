'use client';

import React, { useState, useEffect } from 'react';

export default function MinimalVAPITest() {
  const [status, setStatus] = useState<string>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [vapi, setVapi] = useState<any>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const initVAPI = async () => {
      try {
        console.log('🔧 Initializing Minimal VAPI Test...');
        
        const publicKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        if (!publicKey || !assistantId) {
          throw new Error('VAPI keys not configured. Check your .env.local file.');
        }
        
        console.log('🔑 Using Assistant ID:', assistantId);
        
        // Import VAPI
        const VapiModule = await import('@vapi-ai/web');
        const Vapi = VapiModule.default;
        
        // Create instance
        const vapiInstance = new Vapi(publicKey);
        
        // Basic event listeners
        vapiInstance.on('call-start', () => {
          console.log('📞 Call started');
          setStatus('connected');
        });
        
        vapiInstance.on('call-end', () => {
          console.log('📞 Call ended');
          setStatus('completed');
        });
        
        // Log ALL messages to see what we're getting
        vapiInstance.on('message', (data: any) => {
          console.log('📨 RAW MESSAGE:', JSON.stringify(data, null, 2));
          setMessages(prev => [...prev, data]);
          
          // Try different ways to get transcript
          if (data.transcript) {
            console.log('📝 Found transcript in data.transcript:', data.transcript);
            setTranscript(data.transcript);
          } else if (data.message) {
            console.log('📝 Found transcript in data.message:', data.message);
            setTranscript(data.message);
          } else if (data.text) {
            console.log('📝 Found transcript in data.text:', data.text);
            setTranscript(data.text);
          }
        });
        
        vapiInstance.on('error', (err: any) => {
          console.error('❌ VAPI Error:', err);
          setError(err.message || 'VAPI error');
          setStatus('error');
        });
        
        setVapi(vapiInstance);
        setStatus('ready');
        console.log('✅ Minimal VAPI initialized');
        
      } catch (err) {
        console.error('❌ Init error:', err);
        setError(err instanceof Error ? err.message : 'Init failed');
        setStatus('error');
      }
    };
    
    initVAPI();
  }, []);

  const startCall = async () => {
    if (!vapi) return;
    
    try {
      console.log('🚨 Starting minimal call...');
      setStatus('connecting');
      
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      console.log('📞 Starting call with assistant:', assistantId);
      
      await vapi.start(assistantId);
      
      console.log('📞 Call started successfully');
      
    } catch (err) {
      console.error('❌ Start call error:', err);
      setError(err instanceof Error ? err.message : 'Call failed');
      setStatus('error');
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Minimal VAPI Test
          </h2>
          
          <div className="text-6xl mb-4">
            {status === 'error' ? '⚠️' : 
             status === 'completed' ? '✅' : 
             status === 'connected' ? '🎤' : 
             '📞'}
          </div>
          
          <p className="text-gray-600 mb-4">
            Status: {status}
          </p>
          
          {error && (
            <div className="p-3 bg-red-50 rounded-lg mb-4">
              <div className="text-red-800 font-semibold">Error:</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          
          {transcript && (
            <div className="p-3 bg-green-50 rounded-lg mb-4">
              <div className="text-green-800 font-semibold">Transcript:</div>
              <div className="text-green-700 text-sm">{transcript}</div>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'ready' && (
              <button
                onClick={startCall}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Start Test Call
              </button>
            )}
            
            {status === 'connected' && (
              <button
                onClick={endCall}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                End Call
              </button>
            )}
          </div>
          
          {messages.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-semibold mb-2">All Messages ({messages.length}):</h3>
              <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-y-auto text-xs">
                {messages.map((msg, i) => (
                  <div key={i} className="mb-2">
                    <strong>Message {i + 1}:</strong>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(msg, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



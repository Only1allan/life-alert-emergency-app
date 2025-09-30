import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { assistantId } = await request.json();
    
    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    // VAPI Assistant Configuration
    const assistantConfig = {
      name: "Life GuardPro Emergency Assistant",
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.3,
        maxTokens: 1000
      },
      voice: {
        provider: "elevenlabs",
        voiceId: "21m00Tcm4TlvDq8ikWAM"
      },
      firstMessage: "Hello, this is your Life GuardPro Emergency Assistant. I'm here to help assess your emergency situation. Please tell me what's happening and describe your emergency in detail. I'll ask you some questions to determine the severity level and coordinate the appropriate response.",
      systemMessage: `You are a professional emergency response AI assistant for Life GuardPro. Your role is to:

1. Assess emergency situations quickly and accurately
2. Determine severity levels (1-10 scale)
3. Ask relevant medical questions
4. Provide appropriate guidance
5. Coordinate emergency response

Always be calm, professional, and empathetic. Ask specific questions about:
- What type of emergency is occurring
- Current symptoms or situation
- Severity of pain or distress (1-10 scale)
- Ability to move or communicate
- Any medical conditions or medications
- Location and safety

For high-severity emergencies (8-10), immediately call the assess_emergency_severity function to trigger emergency notifications.

Be thorough but efficient - time is critical in emergencies.`,
      functions: [{
        name: "assess_emergency_severity",
        description: "Assess the severity of an emergency situation and trigger appropriate response",
        parameters: {
          type: "object",
          properties: {
            severity: {
              type: "number",
              description: "Emergency severity level from 1-10 (1=low, 5=moderate, 8-10=critical)",
              minimum: 1,
              maximum: 10
            },
            emergency_type: {
              type: "string",
              description: "Type of emergency (medical, fall, panic, injury, etc.)",
              enum: ["medical", "fall", "panic", "injury", "chest_pain", "breathing", "unconscious", "bleeding", "other"]
            },
            transcript: {
              type: "string",
              description: "Key details from the conversation about the emergency"
            },
            recommended_action: {
              type: "string",
              description: "Recommended immediate action",
              enum: ["call_911", "contact_emergency_contacts", "monitor_situation", "provide_guidance"]
            },
            medical_notes: {
              type: "string",
              description: "Important medical information or symptoms mentioned"
            }
          },
          required: ["severity", "emergency_type", "transcript"]
        }
      }],
      endCallMessage: "Thank you for using Life GuardPro Emergency Assistant. Help is being coordinated based on your situation. Stay safe and follow any instructions provided by emergency responders.",
      endCallPhrases: ["end call", "goodbye", "thank you", "that's all", "help is coming"],
      recordingEnabled: true,
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 600,
      backgroundSound: "office",
      voicemailDetectionEnabled: true,
      interruptionsEnabled: true,
      backchannelingEnabled: true,
      fillersEnabled: true,
      backchannelingSounds: ["mm-hmm", "uh-huh", "yes", "I see"],
      fillers: ["um", "uh", "let me think", "hmm"]
    };

    return NextResponse.json({
      success: true,
      assistantId,
      config: assistantConfig
    });

  } catch (error) {
    console.error('VAPI setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup VAPI assistant' },
      { status: 500 }
    );
  }
}

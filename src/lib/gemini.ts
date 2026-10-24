/**
 * Google AI Studio Gemini API Client Helper
 * Supports Gemini 1.5 Flash with fallback resilience
 */

export interface GeminiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callGemini(options: GeminiRequestOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If API key is present, invoke Google AI Studio REST API
  if (apiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const requestBody: any = {
        contents: [
          {
            role: 'user',
            parts: [{ text: options.prompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 1024,
        },
      };

      if (options.systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        // Cache setting: no-store for fresh AI responses
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn('Gemini API call returned non-200:', response.status, errorData);
        // Fall back to intelligent generator if quota exceeded or invalid key
      } else {
        const data = await response.json();
        const textCandidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textCandidate && typeof textCandidate === 'string' && textCandidate.trim()) {
          return textCandidate.trim();
        }
      }
    } catch (err) {
      console.error('Error contacting Gemini API:', err);
    }
  }

  // Graceful smart fallback when no GEMINI_API_KEY or offline
  return '';
}

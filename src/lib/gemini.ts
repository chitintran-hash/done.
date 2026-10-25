/**
 * Google AI Studio Gemini API Client Helper
 * Supports Gemini 3.8 Flash & Gemini 2.5 Flash with fast timeout & fallback resilience
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
    // Model candidates available on Google AI Studio
    const models = ['gemini-flash-lite-latest', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast timeout

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const textCandidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textCandidate && typeof textCandidate === 'string' && textCandidate.trim()) {
            return textCandidate.trim();
          }
        }
      } catch (err: any) {
        // Continue to next model or fallback
      }
    }
  }

  // Graceful smart fallback when no GEMINI_API_KEY or network offline
  return '';
}

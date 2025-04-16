import { GoogleGenAI } from '@google/genai';

export default async function main(userPrompt) {
  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });

    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.5-pro-preview-03-25';

    const contents = [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let finalText = '';
    for await (const chunk of response) {
      if (chunk.text) {
        finalText += chunk.text;
      }
    }

    return finalText;

  } catch (error) {
    if (error.message.includes("429")) {
      console.error("⚠️ Too many requests: Please wait and try again later.");
      return "⚠️ Too many requests: Please wait and try again later.";
    } else {
      console.error("❌ Error generating content:", error);
      return "❌ Failed to generate content. Try again later.";
    }
  }
}

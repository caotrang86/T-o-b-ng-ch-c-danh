import { GoogleGenAI } from "@google/genai";
import { NameplateData } from "../types.ts";

export const generateNameplateImage = async (data: NameplateData): Promise<string> => {
  if (!data.imageBase64 || !data.imageMimeType) {
    throw new Error("Image is required for the portrait relief.");
  }

  // Re-initialize AI client here to ensure it uses the latest key if selected via window.aistudio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct the prompt with strict text rendering instructions
  const prompt = `
Ultra hyper-realistic, close-up cinematic 3D shot of a luxury dark mahogany wooden nameplate placed on a premium leather executive desk pad.

IMPORTANT:
The 3D embossed relief portrait on the LEFT side of the nameplate must closely match and preserve the exact facial identity, facial structure, age, expression, and overall presence of the uploaded reference portrait image.
Facial likeness accuracy is the top priority.

On the RIGHT side of the nameplate, render the following text.
CRITICAL INSTRUCTION: RENDER THE TEXT EXACTLY AS WRITTEN BELOW. PRESERVE ALL VIETNAMESE ACCENTS AND DIACRITICS CORRECTLY. DO NOT MISSPELL.

1. Main Name (Large, Raised Imperial Gold Serif):
"${data.name}"

2. Job Title (Refined Imperial Gold Calligraphy, below name):
"${data.jobTitle}"

3. Phone Number (Smaller Imperial Gold Metallic, below title):
"${data.phone}"

TEXT STYLING REQUIREMENTS
– Color: Deep Imperial Gold / Royal Gold
– Finish: Polished metallic with soft reflections
– High contrast against dark mahogany wood
– Font: Elegant, bold serif for name; sophisticated calligraphy for title.
– Legibility: Text must be sharp, clear, and spelled correctly in Vietnamese.

MATERIAL & LIGHTING
– Rich dark mahogany wood grain
– Imperial gold metallic highlights
– Soft natural daylight blended with warm luxury lighting
– Premium executive desk atmosphere

CAMERA & RENDER
– Macro close-up shot
– Cinematic composition
– Ultra-detailed textures
– Photorealistic 3D render
– 8K resolution
– Studio-quality realism

No cartoon. No illustration. No fantasy style.
Pure luxury, royal authority, and corporate elegance.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Nano Banana Pro / Gemini 3 Pro Image
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: data.imageMimeType,
              data: data.imageBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: '2K', // High resolution for better text clarity
          aspectRatio: '16:9', // Wider aspect ratio suits nameplates better
        }
      }
    });

    // Check for the image in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image was generated. Please try again.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
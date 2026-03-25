import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateIcon() {
  console.log("Generating icon...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: "A modern, 3D stylized app icon for an Italian language learning app. A glossy, vibrant 3D speech bubble featuring the colors of the Italian flag (green, white, red). Clean, minimalist, solid dark blue background, high quality, UI design, suitable for an iOS or Android app logo.",
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        fs.writeFileSync('public/app-icon.png', Buffer.from(base64Data, 'base64'));
        console.log('Icon generated and saved to public/app-icon.png');
        return;
      }
    }
  } catch (e) {
    console.error("Error generating icon:", e);
  }
}

generateIcon();

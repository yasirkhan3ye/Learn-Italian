import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const basePrompt = "A modern, dynamic, 3D stylized illustration of [SUBJECT]. It must have a vibrant, consistent solid color background with subtle modern geometric patterns. High quality, clean, colorful, matching a language learning app aesthetic.";

const categoryPrompts: Record<string, string> = {
  'kitchen': 'kitchen utensils and appliances',
  'bathroom': 'bathroom items and accessories',
  'vegetables': 'fresh vegetables',
  'fruits': 'fresh fruits',
  'plants': 'plants and flowers',
  'animals': 'animals and pets',
  'body-parts': 'human body parts anatomy',
  'family': 'family members',
  'time-days': 'clocks and calendars',
  'travel': 'travel and transportation items'
};

const DB_NAME = 'ImageCacheDB';
const STORE_NAME = 'images';

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
}

async function getCachedImage(id: string): Promise<string | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
}

async function cacheImage(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataUrl, id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to cache image", e);
  }
}

// Concurrency control
const MAX_CONCURRENT = 2;
let activeRequests = 0;
const queue: (() => void)[] = [];

async function acquireToken(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise(resolve => queue.push(resolve));
}

function releaseToken() {
  activeRequests--;
  if (queue.length > 0) {
    activeRequests++;
    const next = queue.shift();
    if (next) next();
  }
}

export async function generateCategoryImage(categoryId: string): Promise<string | null> {
  const cached = await getCachedImage(categoryId);
  if (cached) return cached;

  const subject = categoryPrompts[categoryId];
  if (!subject) return null;

  await acquireToken();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: basePrompt.replace('[SUBJECT]', subject) }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const dataUrl = `data:image/png;base64,${base64Data}`;
        await cacheImage(categoryId, dataUrl);
        return dataUrl;
      }
    }
  } catch (e) {
    console.error(`Error generating image for ${categoryId}:`, e);
  } finally {
    releaseToken();
  }
  return null;
}


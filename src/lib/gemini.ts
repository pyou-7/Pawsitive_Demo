import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// AI-powered breed detection from image
export async function detectBreedFromImage(imageUrl: string): Promise<{
  breed: string;
  estimatedAge: number;
  size: 'small' | 'medium' | 'large';
  confidence: number;
}> {
  const model = genAI.models;

  // Fetch the image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString('base64');

  const response = await model.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
      {
        text: 'Analyze this dog image and provide: breed name, estimated age in years, and size category (small/medium/large). Respond in JSON format only: {"breed": "string", "estimatedAge": number, "size": "small|medium|large", "confidence": number (0-1)}',
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('No response from Gemini');

  return JSON.parse(content);
}

// Generate AI care plan based on pet data
export async function generateCarePlan(petData: {
  name: string;
  breed?: string;
  weightLbs?: number;
  ageYears?: number;
  recentActivities: Array<{
    activityType: string;
    value: number;
    loggedAt: Date;
  }>;
}): Promise<{
  targetExerciseMins: number;
  targetCalories: number;
  aiInsightText: string;
}> {
  const activitiesSummary = petData.recentActivities
    .slice(-7)
    .map(a => `${a.activityType}: ${a.value}`)
    .join(', ');

  const prompt = `Generate a daily care plan for ${petData.name}${
    petData.breed ? ` (${petData.breed})` : ''
  }${
    petData.weightLbs ? `, ${petData.weightLbs} lbs` : ''
  }${
    petData.ageYears ? `, ${petData.ageYears} years old` : ''
  }.

Recent activities (last 7 days): ${activitiesSummary || 'No recent activities'}

Provide a JSON response with:
{
  "targetExerciseMins": number (recommended daily exercise in minutes),
  "targetCalories": number (recommended daily calorie intake),
  "aiInsightText": string (2-3 sentence personalized insight)
}`;

  const model = genAI.models;
  const response = await model.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ text: prompt }],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('No response from Gemini');

  return JSON.parse(content);
}

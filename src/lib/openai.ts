import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI-powered breed detection from image
export async function detectBreedFromImage(imageUrl: string): Promise<{
  breed: string;
  estimatedAge: number;
  size: 'small' | 'medium' | 'large';
  confidence: number;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this dog image and provide: breed name, estimated age in years, and size category (small/medium/large). Respond in JSON format: {"breed": "string", "estimatedAge": number, "size": "small|medium|large", "confidence": number (0-1)}'
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return JSON.parse(content);
}

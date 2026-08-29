import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !geminiKey) {
      // If neither key is available, return 503 so the frontend knows to fallback to Demo Mode.
      return res.status(503).json({ error: 'AI API keys not configured on server' });
    }

    const systemPrompt = `You are an expert plant pathologist and agriculturist. Analyze the provided image of a leaf.
Respond ONLY with a valid JSON object (no markdown formatting, no \`\`\`json) matching this exact structure:
{
  "is_leaf": boolean, // true if the image contains a plant leaf, false if it's a person, car, building, random object, empty, etc.
  "crop": string, // The name of the plant/crop (e.g., "Tomato", "Mango", "Unknown plant").
  "health_status": "Healthy" | "Unhealthy" | "Uncertain", // Use Uncertain if image is blurry or unclear
  "health_score": number, // 0 to 100 based on visual condition (80-100 Healthy, 60-79 Mild Stress, 40-59 Needs Attention, 0-39 Severe Damage)
  "problem": string, // The disease or issue name (e.g., "Leaf Spot Disease", "None"). Use "Unknown / Possible Leaf Stress" if unsure.
  "confidence": number, // AI's certainty percentage (0-100)
  "severity": "None" | "Low" | "Moderate" | "High" | "Severe",
  "affected_area": string, // e.g., "0%", "5-15%", "15-40%", "40-70%", "70%+"
  "symptoms": string[], // List of visible symptoms ONLY. If healthy, ["No significant abnormal symptoms detected."]
  "recommendations": string[], // Actionable steps
  "prevention": string[] // Prevention steps
}
CRITICAL: If it is NOT a leaf, set "is_leaf": false and provide defaults for the rest. Do not invent symptoms. Rely strictly on visual evidence.`;

    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // using mini for speed/cost, can be gpt-4o
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: image } }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('OpenAI API Error:', err);
        return res.status(502).json({ error: 'AI analysis failed via OpenAI' });
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content;
      const parsedResult = JSON.parse(resultText);
      return res.status(200).json(parsedResult);
      
    } else if (geminiKey) {
       // Fallback to Gemini if only Gemini key is provided
       // Convert base64 data URI to format required by Gemini
       const base64Data = image.split(',')[1];
       const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
       
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           contents: [{
             parts: [
               { text: systemPrompt },
               { inline_data: { mime_type: mimeType, data: base64Data } }
             ]
           }],
           generationConfig: { response_mime_type: "application/json" }
         })
       });
       
       if (!response.ok) {
        const err = await response.text();
        console.error('Gemini API Error:', err);
        return res.status(502).json({ error: 'AI analysis failed via Gemini' });
       }
       
       const data = await response.json();
       const resultText = data.candidates[0].content.parts[0].text;
       const parsedResult = JSON.parse(resultText);
       return res.status(200).json(parsedResult);
    }

  } catch (error: any) {
    console.error('Error analyzing leaf:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

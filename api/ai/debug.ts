import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { errorLog } = req.body || {};
    if (!errorLog) return res.status(400).json({ error: 'Missing message' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Vercel Environment Variables' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `أنت مساعد تقني. أجب على هذه الرسالة: \n\n${errorLog}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return res.status(200).json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'AI Server Error: ' + (error.message || 'Unknown') });
  }
}

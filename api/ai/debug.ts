import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { errorLog } = req.body;
  if (!errorLog) return res.status(400).json({ error: 'Missing message' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured in Vercel' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `أنت مساعد تقني ذكي جداً (Senior Developer & Tech Support) لمنصة "ThakiHire".
المستخدم (مالك المنصة) قد يرسل لك:
1. رسالة ترحيب أو سؤال عام.
2. سؤال تقني.
3. كود خطأ (Error Log) يريد حله.

إذا أرسل كود خطأ، اشرحه ببساطة وأعطه الحل البرمجي.
إذا أرسل سؤالاً عاماً أو تقنياً، أجب عليه بمهنية وود.
كن مختصراً، مفيداً، وتكلم باللغة العربية.

رسالة المستخدم:
"""
${errorLog}
"""`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to contact AI' });
  }
}

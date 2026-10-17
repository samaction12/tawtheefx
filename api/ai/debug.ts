import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { errorLog } = req.body;
  if (!errorLog) return res.status(400).json({ error: 'Missing error log' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `أنت خبير برمجة أول (Senior Developer) في React, TypeScript, Vercel, و Firebase.
المستخدم (مالك المنصة) بيواجه خطأ تقني في منصته. إليك الخطأ:
"""
${errorLog}
"""
اشرح له سبب الخطأ ببساطة شديدة، وأعطه الحل البرمجي (الكود) بالضبط. كن مختصراً ومفيداً.`;
    
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

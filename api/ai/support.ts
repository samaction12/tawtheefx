import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured in Vercel settings' });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `أنت مساعد دعم فني ذكي ومحترف لمنصة "توظيف ذكي" (ThakiHire). 
    مهمتك مساعدة العملاء في فهم باقات التوظيف، وكيفية إجراء المقابلات الرقمية، ومشاكل الدفع.
    أجب باللغة العربية باختصار وبشكل ودي ومحترف.
    
    سؤال العميل: ${message}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to contact AI' });
  }
}

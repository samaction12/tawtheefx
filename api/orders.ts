export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Creating order:', req.body);
    
    return res.status(200).json({ 
      checkoutUrl: 'https://example.com/checkout',
      message: 'Order created (Test)'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

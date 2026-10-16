// api/orders/[id]/status.ts
export default async function handler(req: any, res: any) {
  // نسمح فقط بطلبات GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query; // هذا هو الـ order id القادم من الرابط

  try {
    // هنا لاحقاً بنحط كود الاتصال الحقيقي ببوابة الدفع
    // حالياً، رح نرجع رد تجريبي عشان نتأكد إن الـ API شغال
    console.log(`Checking status for order: ${id}`);
    
    return res.status(200).json({ 
      status: 'paid', // رد تجريبي
      orderId: id 
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

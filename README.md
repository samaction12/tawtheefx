# توظيف إكسبرتس (TawtheefX)

منصة نشر وظائف ومقابلات رقمية. الواجهة React/Vite، والخلفية Express (`server.ts`) تتولى الدفع والتحقق والذكاء الاصطناعي.

## التشغيل
1. `npm install`
2. انسخ `.env.example` إلى `.env` واملأه (المفاتيح تبقى على الخادم فقط).
3. انشر القواعد: `firebase deploy --only firestore:rules`
4. أنشئ مستخدماً في Firebase Auth ثم: `npx tsx scripts/set-admin.ts you@email.com`
5. تطوير: `npm run dev` — إنتاج: `npm run build && npm start`
6. في لوحة بوابة الدفع اضبط webhook على `https://your-domain.com/api/webhooks/moyasar` مع نفس `MOYASAR_WEBHOOK_SECRET`.

import type { Locale } from "@/lib/i18n/types";

type LegalPage = {
  title: string;
  body: string;
};

const termsContent: Record<Locale, LegalPage> = {
  en: {
    title: "Terms and Conditions",
    body: `Last updated: August 2026

Welcome to urbnit studio. By accessing or using our website and services, you agree to these Terms and Conditions. Please read them carefully.

1. Acceptance of Terms
By creating an account, enrolling in a course, or using any part of the platform, you confirm that you accept these terms and agree to comply with them.

2. Services
urbnit studio provides online educational content related to architectural representation and visualization. Course materials, live sessions, and digital products are offered subject to availability and may be updated from time to time.

3. Accounts
You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You must provide accurate information when registering and notify us promptly of any unauthorized use.

4. Payments and Access
Fees for courses, packs, or subscriptions are displayed at the time of purchase. Access is granted upon successful payment unless otherwise stated. Pricing and offers may change without prior notice for future purchases.

5. Intellectual Property
All content on the platform—including videos, documents, designs, and branding—is owned by urbnit studio or its licensors. You may not copy, distribute, sell, or share course materials outside your personal learning use unless explicitly permitted.

6. Acceptable Use
You agree not to misuse the platform, attempt unauthorized access, interfere with other users, or use the services for unlawful purposes.

7. Limitation of Liability
To the fullest extent permitted by law, urbnit studio is not liable for indirect or consequential damages arising from your use of the platform. Our total liability for any claim related to the services is limited to the amount you paid for the relevant purchase.

8. Changes
We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.

9. Contact
For questions about these terms, please contact us through the contact details provided on our website.`,
  },
  ar: {
    title: "الشروط والأحكام",
    body: `آخر تحديث: أغسطس 2026

مرحبًا بك في urbnit studio. باستخدامك لموقعنا أو خدماتنا، فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية.

1. قبول الشروط
بإنشاء حساب أو التسجيل في دورة أو استخدام أي جزء من المنصة، فإنك تؤكد موافقتك على هذه الشروط والالتزام بها.

2. الخدمات
توفر urbnit studio محتوى تعليميًا عبر الإنترنت في مجال التمثيل المعماري والتصور البصري. قد تُحدَّث المواد التعليمية والجلسات المباشرة والمنتجات الرقمية من وقت لآخر وفقًا للتوفر.

3. الحسابات
أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول وعن جميع الأنشطة التي تتم عبر حسابك. يجب تقديم معلومات دقيقة عند التسجيل وإبلاغنا فورًا بأي استخدام غير مصرح به.

4. المدفوعات والوصول
تُعرض رسوم الدورات أو الحزم أو الاشتراكات وقت الشراء. يُمنح الوصول بعد إتمام الدفع بنجاح ما لم يُذكر خلاف ذلك. قد تتغير الأسعار والعروض دون إشعار مسبق للمشتريات المستقبلية.

5. الملكية الفكرية
جميع المحتويات على المنصة—بما في ذلك الفيديوهات والمستندات والتصاميم والعلامة التجارية—مملوكة لـ urbnit studio أو لمرخِّصيها. لا يجوز نسخ أو توزيع أو بيع أو مشاركة مواد الدورة خارج نطاق الاستخدام الشخصي للتعلم إلا إذا سُمح بذلك صراحة.

6. الاستخدام المقبول
توافق على عدم إساءة استخدام المنصة أو محاولة الوصول غير المصرح به أو التدخل في تجربة المستخدمين الآخرين أو استخدام الخدمات لأغراض غير قانونية.

7. حدود المسؤولية
في الحدود التي يسمح بها القانون، لا تتحمل urbnit studio مسؤولية الأضرار غير المباشرة أو التبعية الناتجة عن استخدامك للمنصة. تقتصر مسؤوليتنا الإجمالية عن أي مطالبة متعلقة بالخدمات على المبلغ الذي دفعته مقابل الشراء المعني.

8. التعديلات
قد نقوم بتحديث هذه الشروط من وقت لآخر. يُعد استمرارك في استخدام المنصة بعد نشر التعديلات موافقة على الشروط المحدَّثة.

9. التواصل
للاستفسارات حول هذه الشروط، يرجى التواصل معنا عبر بيانات الاتصال المتاحة على موقعنا.`,
  },
};

const privacyContent: Record<Locale, LegalPage> = {
  en: {
    title: "Privacy Policy",
    body: `Last updated: August 2026

urbnit studio respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our website and services.

1. Information We Collect
We may collect information you provide directly, such as your name, email address, phone number, and payment-related details. We also collect technical data such as device type, browser, IP address, and usage activity on the platform.

2. How We Use Information
We use your information to create and manage your account, process purchases, deliver courses, provide customer support, improve our services, and send important service-related communications.

3. Sharing of Information
We do not sell your personal data. We may share information with trusted service providers who help us operate the platform (such as payment processors or hosting providers) under appropriate confidentiality obligations, or when required by law.

4. Cookies and Analytics
We may use cookies and similar technologies to remember preferences, keep you signed in, and understand how the platform is used. You can control cookies through your browser settings.

5. Data Security
We implement reasonable technical and organizational measures to protect your information. However, no online system can be guaranteed to be completely secure.

6. Data Retention
We retain personal information for as long as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.

7. Your Rights
Depending on applicable law, you may request access to, correction of, or deletion of your personal data. Contact us to exercise these rights.

8. Children
Our services are intended for users who can lawfully enter into agreements. If you believe a child has provided personal data without appropriate consent, please contact us.

9. Changes to This Policy
We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised date.

10. Contact
For privacy-related questions, please contact us through the contact details provided on our website.`,
  },
  ar: {
    title: "سياسة الخصوصية",
    body: `آخر تحديث: أغسطس 2026

تحترم urbnit studio خصوصيتك. توضح هذه السياسة كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها عند استخدامك لموقعنا وخدماتنا.

1. المعلومات التي نجمعها
قد نجمع المعلومات التي تقدمها مباشرة، مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وتفاصيل الدفع. كما نجمع بيانات تقنية مثل نوع الجهاز والمتصفح وعنوان IP ونشاط الاستخدام على المنصة.

2. كيفية استخدام المعلومات
نستخدم معلوماتك لإنشاء حسابك وإدارته، ومعالجة المدفوعات، وتقديم الدورات، وتقديم الدعم، وتحسين خدماتنا، وإرسال رسائل مهمة متعلقة بالخدمة.

3. مشاركة المعلومات
لا نبيع بياناتك الشخصية. قد نشارك المعلومات مع مزودي خدمات موثوقين يساعدوننا في تشغيل المنصة (مثل معالجات الدفع أو الاستضافة) ضمن التزامات سرية مناسبة، أو عندما يقتضي القانون ذلك.

4. ملفات تعريف الارتباط والتحليلات
قد نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتذكر تفضيلاتك والإبقاء على تسجيل دخولك وفهم كيفية استخدام المنصة. يمكنك التحكم في ملفات تعريف الارتباط من إعدادات المتصفح.

5. أمن البيانات
نطبق تدابير تقنية وتنظيمية معقولة لحماية معلوماتك. ومع ذلك، لا يمكن ضمان أمان أي نظام عبر الإنترنت بشكل كامل.

6. الاحتفاظ بالبيانات
نحتفظ بالمعلومات الشخصية طالما كان ذلك ضروريًا لتقديم خدماتنا والامتثال للالتزامات القانونية وحل النزاعات وإنفاذ اتفاقياتنا.

7. حقوقك
وفقًا للقانون المعمول به، قد تطلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها. تواصل معنا لممارسة هذه الحقوق.

8. الأطفال
خدماتنا موجهة للمستخدمين القادرين قانونيًا على إبرام الاتفاقيات. إذا كنت تعتقد أن طفلًا قد قدم بيانات شخصية دون موافقة مناسبة، يرجى التواصل معنا.

9. تغييرات على هذه السياسة
قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. ستُنشر النسخة المحدَّثة على هذه الصفحة مع تاريخ مراجعة جديد.

10. التواصل
للاستفسارات المتعلقة بالخصوصية، يرجى التواصل معنا عبر بيانات الاتصال المتاحة على موقعنا.`,
  },
};

const refundContent: Record<Locale, LegalPage> = {
  en: {
    title: "Refund Policy",
    body: `Last updated: August 2026

Thank you for choosing urbnit studio. This Refund Policy explains when refunds may be available for purchases made on our platform.

1. General Policy
Digital courses, packs, and subscription access are generally non-refundable once access has been granted, except where required by applicable law or as stated below.

2. Eligible Refund Requests
We may consider a refund if:
• You were charged incorrectly or charged more than once for the same purchase.
• You could not access the purchased content due to a technical issue on our side that we could not resolve within a reasonable time.
• You request a refund within 7 days of purchase and have not completed more than 20% of the course content or downloaded substantial materials.

3. Non-Refundable Cases
Refunds are generally not provided if:
• You changed your mind after accessing the content.
• You completed a significant portion of the course or pack.
• The issue resulted from your device, internet connection, or third-party payment provider outside our control.
• A promotional or discounted offer explicitly stated that the purchase is final.

4. Subscription Cancellations
You may cancel a recurring subscription to prevent future charges. Cancellation stops renewal but does not automatically refund the current billing period unless otherwise required by law.

5. How to Request a Refund
Contact us with your account email, order details, and reason for the request. We will review eligible requests within 5–10 business days.

6. Refund Method
Approved refunds are returned to the original payment method when possible. Processing times depend on your bank or payment provider.

7. Changes
We may update this Refund Policy from time to time. The current version will always be available on this page.

8. Contact
For refund requests or questions, please contact us through the contact details provided on our website.`,
  },
  ar: {
    title: "سياسة الاسترداد",
    body: `آخر تحديث: أغسطس 2026

شكرًا لاختيارك urbnit studio. توضح سياسة الاسترداد هذه متى قد تكون المبالغ المستردة متاحة للمشتريات التي تتم على منصتنا.

1. السياسة العامة
الدورات الرقمية والحزم والاشتراكات غير قابلة للاسترداد بشكل عام بعد منح الوصول، إلا إذا اقتضى القانون المعمول به ذلك أو كما هو موضح أدناه.

2. طلبات الاسترداد المؤهلة
قد ننظر في طلب الاسترداد إذا:
• تم خصم مبلغ غير صحيح أو خصم مرتين لنفس الشراء.
• لم تتمكن من الوصول إلى المحتوى المشترى بسبب مشكلة تقنية من جانبنا لم نتمكن من حلها خلال وقت معقول.
• طلبت الاسترداد خلال 7 أيام من الشراء ولم تكمل أكثر من 20% من محتوى الدورة أو تنزيل مواد جوهرية.

3. الحالات غير القابلة للاسترداد
لا يُقدَّم الاسترداد عادةً إذا:
• غيّرت رأيك بعد الوصول إلى المحتوى.
• أكملت جزءًا كبيرًا من الدورة أو الحزمة.
• نتجت المشكلة عن جهازك أو اتصال الإنترنت أو مزود الدفع خارج سيطرتنا.
• نص العرض الترويجي أو المخفَّض صراحة على أن الشراء نهائي.

4. إلغاء الاشتراكات
يمكنك إلغاء الاشتراك المتكرر لمنع الخصومات المستقبلية. الإلغاء يوقف التجديد ولا يسترد تلقائيًا فترة الفوترة الحالية إلا إذا اقتضى القانون خلاف ذلك.

5. كيفية طلب الاسترداد
تواصل معنا مع بريد حسابك وتفاصيل الطلب وسبب الطلب. سنراجع الطلبات المؤهلة خلال 5–10 أيام عمل.

6. طريقة الاسترداد
تُعاد المبالغ المعتمدة إلى وسيلة الدفع الأصلية عندما يكون ذلك ممكنًا. تعتمد مدة المعالجة على البنك أو مزود الدفع.

7. التعديلات
قد نقوم بتحديث سياسة الاسترداد من وقت لآخر. ستكون النسخة الحالية متاحة دائمًا على هذه الصفحة.

8. التواصل
لطلبات الاسترداد أو الاستفسارات، يرجى التواصل معنا عبر بيانات الاتصال المتاحة على موقعنا.`,
  },
};

export function getTermsContent(locale: Locale): LegalPage {
  return termsContent[locale];
}

export function getPrivacyContent(locale: Locale): LegalPage {
  return privacyContent[locale];
}

export function getRefundContent(locale: Locale): LegalPage {
  return refundContent[locale];
}

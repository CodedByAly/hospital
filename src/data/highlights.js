/**
 * Things Life Kitchen offers outside the regular menu.
 * Taken from the restaurant's printed menu and Instagram. Remove or edit freely.
 */

export const mission = {
  en: 'At Life Kitchen, every plate has a purpose. We serve delicious, thoughtfully prepared meals. For every plate sold, we give a plate to someone in need. As a non-profit kitchen built inside an NGO, our mission is simple: use good food to do good. Thank you for being part of the change.',
  ar: 'بـ لايف كيتشن، كل صحن إلو هدف. منحضّر أكل طيّب ومعمول بعناية، ومع كل صحن بينباع، منقدّم صحن لحدا محتاج. نحنا مطبخ غير ربحي قايم جوّا جمعية، ورسالتنا بسيطة: نستعمل الأكل الطيّب لنعمل الخير. شكراً لأنك جزء من هالتغيير.',
  signature: { en: 'The Life Kitchen Team', ar: 'فريق لايف كيتشن' },
};

export const platDuJour = {
  title: { en: 'Plat du Jour', ar: 'طبق اليوم' },
  text: {
    en: 'Ask for our daily special. It changes every day and goes fast.',
    ar: 'اسألنا عن طبق اليوم. بيتغيّر كل يوم وبيخلص بسرعة.',
  },
};

export const mealPlan = {
  title: { en: 'Monthly meal plan', ar: 'اشتراك شهري' },
  text: {
    en: '20 hot meals a month for $175.',
    ar: '20 وجبة سخنة بالشهر بـ 175$.',
  },
};

export const frozen = {
  title: { en: 'From our freezer', ar: 'من الفريزر' },
  text: {
    en: 'Boxes of 12 pieces, ready to fry at home. Message us for availability.',
    ar: 'علب من 12 قطعة، جاهزة للقلي بالبيت. راسلنا لنعرف شو متوفّر.',
  },
  image: '/images/frozen-boxes.webp',
  products: [
    { en: 'Kibbeh Kras', ar: 'كبة قراص' },
    { en: 'Cheese Rolls', ar: 'رقاقات جبنة' },
    { en: 'Sambousek', ar: 'سمبوسك' },
  ],
};

// Set `active: false` (or delete) when the offer ends.
export const offers = [
  {
    id: 'students',
    active: true,
    title: { en: 'ALBA and Balamand students', ar: 'طلاب ALBA والبلمند' },
    text: {
      en: '15% off and free delivery to the university in Dekwaneh. Show your valid student ID.',
      ar: 'حسم 15% وتوصيل مجاني عالجامعة بالدكوانة. بس فرجينا بطاقة الطالب.',
    },
  },
];

import { DiagramType, DiagramContent } from '@/types';

/* ─── Per-section hint + placeholder + example for every diagram type ─── */

export interface SectionGuidance {
  hint: string;
  placeholder: string;
  example: string;
}

export interface DiagramGuidanceData {
  /** Short intro shown at the top of the editor */
  intro: string;
  /** Step-by-step instructions (array of short sentences) */
  steps: string[];
  /** Per-section guidance keyed by section field name */
  sections: Record<string, SectionGuidance>;
  /** Full example content to fill all fields at once */
  exampleContent: DiagramContent;
}

type GuidanceMap = Record<DiagramType, DiagramGuidanceData>;

/* ─── Uzbek guidance ─── */

export const guidanceUz: GuidanceMap = {
  swot: {
    intro: 'SWOT tahlili — mavzuning kuchli, zaif tomonlari, imkoniyatlari va xavflarini aniqlash uchun ishlatiladi.',
    steps: [
      '1. Avval mavzuning kuchli tomonlarini o\'ylang ✅',
      '2. Keyin zaif tomonlarini yozing ⚠️',
      '3. Qanday imkoniyatlar borligini yozing 💡',
      '4. Qanday xavflar bo\'lishi mumkinligini yozing 🚨',
    ],
    sections: {
      strengths: {
        hint: '❓ Mavzuning eng yaxshi tomoni nima?',
        placeholder: 'Masalan: Sog\'lom ovqat tana uchun foydali',
        example: 'Sog\'lom ovqat tana uchun foydali\nKayfiyatni yaxshilaydi\nKasalliklardan saqlaydi',
      },
      weaknesses: {
        hint: '❓ Qaysi tomoni yaxshi emas yoki qiyin?',
        placeholder: 'Masalan: Ba\'zi sog\'lom ovqatlar qimmat',
        example: 'Ba\'zi sog\'lom ovqatlar qimmat\nTayyorlash ko\'p vaqt oladi\nBolalar yoqtirmasligi mumkin',
      },
      opportunities: {
        hint: '❓ Bu mavzuda qanday imkoniyatlar bor?',
        placeholder: 'Masalan: Maktabda sog\'lom ovqatlanish dasturi',
        example: 'Maktabda sog\'lom ovqatlanish dasturi\nOila bilan birga pishirish\nYangi retseptlar o\'rganish',
      },
      threats: {
        hint: '❓ Qanday muammolar yoki xavflar bo\'lishi mumkin?',
        placeholder: 'Masalan: Fast food juda ko\'p reklama qilinadi',
        example: 'Fast food juda ko\'p reklama qilinadi\nBolalar shirinlikni ko\'p yeydi\nSog\'lom ovqat har yerda sotilmaydi',
      },
    },
    exampleContent: {
      strengths: 'Sog\'lom ovqat tana uchun foydali\nKayfiyatni yaxshilaydi\nKasalliklardan saqlaydi',
      weaknesses: 'Ba\'zi sog\'lom ovqatlar qimmat\nTayyorlash ko\'p vaqt oladi\nBolalar yoqtirmasligi mumkin',
      opportunities: 'Maktabda sog\'lom ovqatlanish dasturi\nOila bilan birga pishirish\nYangi retseptlar o\'rganish',
      threats: 'Fast food juda ko\'p reklama qilinadi\nBolalar shirinlikni ko\'p yeydi\nSog\'lom ovqat har yerda sotilmaydi',
    },
  },

  mindmap: {
    intro: 'Aqliy xarita — bitta asosiy g\'oyani tarmoqlarga ajratib, chuqurroq tushunish uchun ishlatiladi.',
    steps: [
      '1. Markazga asosiy mavzuni yozing 🎯',
      '2. Asosiy tarmoqlar qo\'shing (3-5 ta) 🌿',
      '3. Har bir tarmoqqa kichik tarmoqlar qo\'shing 🍃',
    ],
    sections: {
      centralIdea: {
        hint: '❓ Asosiy mavzungiz nima?',
        placeholder: 'Masalan: Suv — hayot manbai',
        example: 'Suv — hayot manbai',
      },
      mainBranches: {
        hint: '❓ Bu mavzuning asosiy qismlari nimalardan iborat?',
        placeholder: 'Masalan: Ichimlik suvi',
        example: 'Ichimlik suvi',
      },
      subBranches: {
        hint: '❓ Har bir tarmoq haqida batafsil nima deyish mumkin?',
        placeholder: 'Masalan: Har kuni 8 stakan suv ichish kerak',
        example: 'Har kuni 8 stakan suv ichish kerak',
      },
    },
    exampleContent: {
      centralIdea: 'Suv — hayot manbai',
      mainBranches: 'Ichimlik suvi\nTabiatdagi suv\nSuvning foydalari\nSuvni tejash',
      subs_0: 'Toza suv ichish kerak\nHar kuni 8 stakan',
      subs_1: 'Daryo va ko\'llar\nOkean va dengizlar',
      subs_2: 'Sog\'liqqa foydali\nO\'simliklar uchun zarur',
      subs_3: 'Kranni yoping\nSuvni isrof qilmang',
    },
  },

  flowchart: {
    intro: 'Jarayon diagrammasi — biror ish qanday bosqichlardan o\'tishini ko\'rsatish uchun ishlatiladi.',
    steps: [
      '1. Boshlanish — jarayon qayerdan boshlanadi? 🟢',
      '2. Jarayon — qanday qadamlar bor? ⚙️',
      '3. Qaror — qayerda tanlov qilish kerak? 🤔',
      '4. Natija — nima chiqadi? 📤',
      '5. Yakun — jarayon qanday tugaydi? 🔴',
    ],
    sections: {
      start: {
        hint: '❓ Bu jarayon qayerdan boshlanadi?',
        placeholder: 'Masalan: Ertalab uyg\'onish',
        example: 'Ertalab soat 7:00 da uyg\'onish',
      },
      process: {
        hint: '❓ Qanday qadamlar bor? Ketma-ket yozing',
        placeholder: 'Masalan: Tishlarni yuvish, nonushta qilish',
        example: 'Tishlarni yuvish\nNonushta tayyorlash\nKiyimlarni kiyish',
      },
      decision: {
        hint: '❓ Qayerda tanlov yoki savol bor?',
        placeholder: 'Masalan: Bugun havo yaxshimi?',
        example: 'Bugun havo yaxshimi?\nAgar ha — piyoda boraman\nAgar yo\'q — avtobus bilan boraman',
      },
      output: {
        hint: '❓ Jarayondan qanday natija chiqadi?',
        placeholder: 'Masalan: Maktabga o\'z vaqtida yetib borish',
        example: 'Maktabga o\'z vaqtida yetib borish',
      },
      end: {
        hint: '❓ Jarayon qanday tugaydi?',
        placeholder: 'Masalan: Darslar muvaffaqiyatli boshlandi',
        example: 'Birinchi dars boshlandi ✅',
      },
    },
    exampleContent: {
      start: 'Ertalab soat 7:00 da uyg\'onish',
      process: 'Tishlarni yuvish\nNonushta tayyorlash\nKiyimlarni kiyish',
      decision: 'Bugun havo yaxshimi?\nAgar ha — piyoda boraman\nAgar yo\'q — avtobus bilan boraman',
      output: 'Maktabga o\'z vaqtida yetib borish',
      end: 'Birinchi dars boshlandi ✅',
    },
  },

  venn: {
    intro: 'Venn diagrammasi — ikki yoki undan ortiq narsaning o\'xshash va farqli tomonlarini ko\'rsatish uchun ishlatiladi.',
    steps: [
      '1. Har bir doiraga bitta mavzu yozing 🔵',
      '2. Faqat shu doiraga xos narsalarni yozing ✏️',
      '3. O\'rtadagi umumiy qismga ikkisiga ham tegishli narsalarni yozing 🤝',
    ],
    sections: {
      setA: {
        hint: '❓ Faqat A doirasiga xos narsalar nima?',
        placeholder: 'Masalan: Mushuk — miyovlaydi, kichik, uyda yashaydi',
        example: 'Miyovlaydi\nKichik\nUyda yashaydi',
      },
      common: {
        hint: '❓ Ikkisiga ham tegishli narsalar nima?',
        placeholder: 'Masalan: Ikkalasi ham hayvon, go\'sht yeydi',
        example: 'Hayvon\nGo\'sht yeydi\nPatli',
      },
      setB: {
        hint: '❓ Faqat B doirasiga xos narsalar nima?',
        placeholder: 'Masalan: It — huradi, katta, hovlida yashaydi',
        example: 'Huradi\nKatta\nHovlida yashaydi',
      },
    },
    exampleContent: {
      __vennSetCount: '2',
      setA: 'Miyovlaydi\nKichik\nUyda yashaydi',
      common: 'Hayvon\nGo\'sht yeydi\nPatli',
      setB: 'Huradi\nKatta\nHovlida yashaydi',
      region_A: 'Miyovlaydi\nKichik\nUyda yashaydi',
      region_A_B: 'Hayvon\nGo\'sht yeydi\nPatli',
      region_B: 'Huradi\nKatta\nHovlida yashaydi',
    },
  },

  timeline: {
    intro: 'Vaqt jadvali — voqealarni o\'tmish, hozir va kelajak bo\'yicha tartibga solish uchun ishlatiladi.',
    steps: [
      '1. O\'tmishda nima bo\'lganini yozing ⏪',
      '2. Hozir nima bo\'layotganini yozing ⏸️',
      '3. Kelajakda nima bo\'lishini yozing ⏩',
    ],
    sections: {
      past: {
        hint: '❓ Oldin nima bo\'lgan edi?',
        placeholder: 'Masalan: Qadimda odamlar ot minib yurgan',
        example: 'Qadimda odamlar ot minib yurgan\nBirinchi mashina 1886-yilda yaratildi\nSamolyot 1903-yilda uchdi',
      },
      present: {
        hint: '❓ Hozir nima bo\'lyapti?',
        placeholder: 'Masalan: Hozir elektr mashinalar bor',
        example: 'Hozir elektr mashinalar bor\nMetro va tezyurar poyezdlar ishlaydi\nDronlar ishlatilmoqda',
      },
      future: {
        hint: '❓ Kelajakda nima bo\'lishi mumkin?',
        placeholder: 'Masalan: Uchuvchi mashinalar yaratilishi mumkin',
        example: 'Uchuvchi mashinalar yaratilishi mumkin\nMarsga sayohat qilish\nSun\'iy intellekt haydovchi',
      },
    },
    exampleContent: {
      past: 'Qadimda odamlar ot minib yurgan\nBirinchi mashina 1886-yilda yaratildi\nSamolyot 1903-yilda uchdi',
      present: 'Hozir elektr mashinalar bor\nMetro va tezyurar poyezdlar ishlaydi\nDronlar ishlatilmoqda',
      future: 'Uchuvchi mashinalar yaratilishi mumkin\nMarsga sayohat qilish\nSun\'iy intellekt haydovchi',
    },
  },

  pyramid: {
    intro: 'Piramida diagrammasi — mavzuning eng muhim qismidan kamroq muhimiga qarab tartibga solish uchun ishlatiladi.',
    steps: [
      '1. Eng muhim narsani yuqoriga yozing ⬆️',
      '2. Muhimlik darajasiga qarab pastga yozing ⬇️',
      '3. Asos — eng keng va umumiy qism 📐',
    ],
    sections: {
      top: {
        hint: '❓ Eng muhim narsa nima?',
        placeholder: 'Masalan: Sog\'liq — eng muhim boylik',
        example: 'Sog\'liq — eng muhim boylik',
      },
      upperMiddle: {
        hint: '❓ Ikkinchi darajada muhim narsa nima?',
        placeholder: 'Masalan: Oila va do\'stlar',
        example: 'Oila va do\'stlar',
      },
      middle: {
        hint: '❓ O\'rtacha muhimlikdagi narsa nima?',
        placeholder: 'Masalan: Ta\'lim olish',
        example: 'Ta\'lim olish va bilim orttirish',
      },
      lowerMiddle: {
        hint: '❓ Kamroq muhim, lekin zarur narsa nima?',
        placeholder: 'Masalan: Sport va dam olish',
        example: 'Sport va dam olish',
      },
      base: {
        hint: '❓ Eng keng va asosiy narsa nima?',
        placeholder: 'Masalan: Kundalik odatlar — uyqu, ovqat, suv',
        example: 'Kundalik odatlar — uyqu, ovqat, suv ichish',
      },
    },
    exampleContent: {
      top: 'Sog\'liq — eng muhim boylik',
      upperMiddle: 'Oila va do\'stlar',
      middle: 'Ta\'lim olish va bilim orttirish',
      lowerMiddle: 'Sport va dam olish',
      base: 'Kundalik odatlar — uyqu, ovqat, suv ichish',
    },
  },

  causeeffect: {
    intro: 'Sabab-natija jadvali — biror voqeaning sabablari va natijalari orasidagi bog\'lanishni ko\'rsatish uchun ishlatiladi.',
    steps: [
      '1. Avval sabablarni yozing — nima uchun bu bo\'ldi? 🔍',
      '2. Keyin natijalarni yozing — nima bo\'ldi? 🎯',
      '3. Sabablar va natijalar orasidagi bog\'lanishni ko\'rsating 🔗',
    ],
    sections: {
      causes: {
        hint: '❓ Bu hodisaning sabablari nima?',
        placeholder: 'Masalan: Ko\'p televizor ko\'rish',
        example: 'Ko\'p televizor ko\'rish\nKam harakat qilish\nKo\'p shirinlik yeyish',
      },
      effects: {
        hint: '❓ Bu sabablar qanday natijaga olib keladi?',
        placeholder: 'Masalan: Ko\'z charchashi',
        example: 'Ko\'z charchashi\nSemirish\nUyqusizlik',
      },
      correlation: {
        hint: '❓ Sabablar va natijalar qanday bog\'langan?',
        placeholder: 'Masalan: Ko\'p televizor → ko\'z charchashi',
        example: 'Ko\'p televizor ko\'rish ko\'z charchashiga olib keladi\nKam harakat semirish sababchisi\nKo\'p shirinlik uyqusizlikka olib keladi',
      },
    },
    exampleContent: {
      causes: 'Ko\'p televizor ko\'rish\nKam harakat qilish\nKo\'p shirinlik yeyish',
      effects: 'Ko\'z charchashi\nSemirish\nUyqusizlik',
      correlation: 'Ko\'p televizor ko\'rish ko\'z charchashiga olib keladi\nKam harakat semirish sababchisi\nKo\'p shirinlik uyqusizlikka olib keladi',
    },
  },

  conceptmap: {
    intro: 'Tushuncha xaritasi — ikki yoki undan ko\'p tushunchalar orasidagi bog\'lanishni ko\'rsatish uchun ishlatiladi.',
    steps: [
      '1. Birinchi tushunchani yozing 📌',
      '2. Ikkinchi tushunchani yozing 📌',
      '3. Ularning bog\'lanishini yozing 🔗',
      '4. Qo\'shimcha tafsilot yozing 📝',
    ],
    sections: {
      concept1: {
        hint: '❓ Birinchi tushuncha nima?',
        placeholder: 'Masalan: O\'simliklar',
        example: 'O\'simliklar',
      },
      concept2: {
        hint: '❓ Ikkinchi tushuncha nima?',
        placeholder: 'Masalan: Fotosintez',
        example: 'Fotosintez',
      },
      relationship: {
        hint: '❓ Bu ikki tushuncha qanday bog\'langan?',
        placeholder: 'Masalan: O\'simliklar fotosintez jarayonini amalga oshiradi',
        example: 'O\'simliklar fotosintez jarayonini amalga oshiradi',
      },
      details: {
        hint: '❓ Qo\'shimcha ma\'lumot bormi?',
        placeholder: 'Masalan: Quyosh nuri va suv kerak',
        example: 'Fotosintez — quyosh nuri, suv va CO2 yordamida kislorod ishlab chiqarish jarayoni',
      },
    },
    exampleContent: {
      concept1: 'O\'simliklar',
      concept2: 'Fotosintez',
      relationship: 'O\'simliklar fotosintez jarayonini amalga oshiradi',
      details: 'Fotosintez — quyosh nuri, suv va CO2 yordamida kislorod ishlab chiqarish jarayoni',
    },
  },

  tchart: {
    intro: 'T-jadval — mavzuning ikki tomonini (masalan, ijobiy va salbiy) taqqoslash uchun ishlatiladi.',
    steps: [
      '1. Chap tomonga birinchi nuqtai nazarni yozing ⬅️',
      '2. O\'ng tomonga ikkinchi nuqtai nazarni yozing ➡️',
      '3. Har ikki tomonni taqqoslang 📊',
    ],
    sections: {
      left: {
        hint: '❓ Chap tomonda nimalarni yozasiz?',
        placeholder: 'Masalan: Kitob o\'qishning foydalari',
        example: 'Bilim oshadi\nLug\'at boyiydi\nXotira yaxshilanadi\nDiqqat kuchayadi',
      },
      right: {
        hint: '❓ O\'ng tomonda nimalarni yozasiz?',
        placeholder: 'Masalan: Telefon ishlatishning kamchiliklari',
        example: 'Ko\'z charchaydi\nVaqt behuda ketadi\nUyqu buziladi\nDiqqat tarqaladi',
      },
    },
    exampleContent: {
      left: 'Bilim oshadi\nLug\'at boyiydi\nXotira yaxshilanadi\nDiqqat kuchayadi',
      right: 'Ko\'z charchaydi\nVaqt behuda ketadi\nUyqu buziladi\nDiqqat tarqaladi',
    },
  },

  fishbone: {
    intro: 'Baliq skeleti — muammoning barcha sabablarini kategoriya bo\'yicha ko\'rsatish uchun ishlatiladi.',
    steps: [
      '1. O\'ng tomonga asosiy muammoni yozing 🐟',
      '2. Har bir kategoriyaga sabab yozing (odamlar, jarayon, material...) 📋',
      '3. Har bir sababga kichik sabablar qo\'shing 🔍',
    ],
    sections: {
      problem: {
        hint: '❓ Asosiy muammo nima?',
        placeholder: 'Masalan: O\'quvchilar darsga kech keladi',
        example: 'O\'quvchilar darsga kech keladi',
      },
      people: {
        hint: '❓ Odamlar bilan bog\'liq sabablar nima?',
        placeholder: 'Masalan: Ota-onalar kech turadi',
        example: 'Ota-onalar kech turadi\nO\'quvchilar budilnikni o\'chiradi',
      },
      process: {
        hint: '❓ Jarayon bilan bog\'liq sabablar nima?',
        placeholder: 'Masalan: Nonushta tayyorlash uzoq davom etadi',
        example: 'Nonushta tayyorlash uzoq davom etadi\nMaktab eshigi erta yopiladi',
      },
      materials: {
        hint: '❓ Material yoki vositalar bilan bog\'liq sabablar nima?',
        placeholder: 'Masalan: Avtobus kamchiligi',
        example: 'Avtobus kamchiligi\nVelosiped yo\'li yo\'q',
      },
      environment: {
        hint: '❓ Muhit bilan bog\'liq sabablar nima?',
        placeholder: 'Masalan: Yomg\'irli ob-havo',
        example: 'Yomg\'irli ob-havo\nQor tushadi\nYo\'llar tiqilinch',
      },
      methods: {
        hint: '❓ Usullar bilan bog\'liq sabablar nima?',
        placeholder: 'Masalan: Budilnik qo\'yish odati yo\'q',
        example: 'Budilnik qo\'yish odati yo\'q\nKechqurun erta uxlamaslik',
      },
    },
    exampleContent: {
      problem: 'O\'quvchilar darsga kech keladi',
      people: 'Ota-onalar kech turadi\nO\'quvchilar budilnikni o\'chiradi',
      process: 'Nonushta tayyorlash uzoq davom etadi\nMaktab eshigi erta yopiladi',
      materials: 'Avtobus kamchiligi\nVelosiped yo\'li yo\'q',
      environment: 'Yomg\'irli ob-havo\nQor tushadi\nYo\'llar tiqilinch',
      methods: 'Budilnik qo\'yish odati yo\'q\nKechqurun erta uxlamaslik',
    },
  },
};

/* ─── English guidance ─── */

export const guidanceEn: GuidanceMap = {
  swot: {
    intro: 'SWOT analysis helps you find the Strengths, Weaknesses, Opportunities, and Threats of a topic.',
    steps: [
      '1. Think about what\'s good about your topic ✅',
      '2. Write what\'s not so good ⚠️',
      '3. What chances or ideas exist? 💡',
      '4. What problems could happen? 🚨',
    ],
    sections: {
      strengths: {
        hint: '❓ What is the best part of this topic?',
        placeholder: 'e.g., Healthy food makes you strong',
        example: 'Healthy food makes you strong\nImproves your mood\nPrevents diseases',
      },
      weaknesses: {
        hint: '❓ What is not so good or difficult?',
        placeholder: 'e.g., Some healthy food is expensive',
        example: 'Some healthy food is expensive\nTakes time to prepare\nKids may not like the taste',
      },
      opportunities: {
        hint: '❓ What chances or ideas exist?',
        placeholder: 'e.g., School lunch programs',
        example: 'School lunch programs\nCooking with family\nLearning new recipes',
      },
      threats: {
        hint: '❓ What problems could happen?',
        placeholder: 'e.g., Fast food ads are everywhere',
        example: 'Fast food ads are everywhere\nKids eat too much candy\nHealthy food not always available',
      },
    },
    exampleContent: {
      strengths: 'Healthy food makes you strong\nImproves your mood\nPrevents diseases',
      weaknesses: 'Some healthy food is expensive\nTakes time to prepare\nKids may not like the taste',
      opportunities: 'School lunch programs\nCooking with family\nLearning new recipes',
      threats: 'Fast food ads are everywhere\nKids eat too much candy\nHealthy food not always available',
    },
  },

  mindmap: {
    intro: 'A Mind Map starts with one main idea in the center, then branches out into related topics.',
    steps: [
      '1. Write your main topic in the center 🎯',
      '2. Add 3-5 main branches 🌿',
      '3. Add details under each branch 🍃',
    ],
    sections: {
      centralIdea: {
        hint: '❓ What is your main topic?',
        placeholder: 'e.g., Water — source of life',
        example: 'Water — source of life',
      },
      mainBranches: {
        hint: '❓ What are the main parts of this topic?',
        placeholder: 'e.g., Drinking water',
        example: 'Drinking water',
      },
      subBranches: {
        hint: '❓ What details can you add?',
        placeholder: 'e.g., Drink 8 glasses a day',
        example: 'Drink 8 glasses a day',
      },
    },
    exampleContent: {
      centralIdea: 'Water — source of life',
      mainBranches: 'Drinking water\nWater in nature\nBenefits of water\nSaving water',
      subs_0: 'Drink clean water\n8 glasses a day',
      subs_1: 'Rivers and lakes\nOceans and seas',
      subs_2: 'Good for health\nPlants need water',
      subs_3: 'Turn off the tap\nDon\'t waste water',
    },
  },

  flowchart: {
    intro: 'A Flowchart shows the steps of a process from start to finish.',
    steps: [
      '1. Start — where does the process begin? 🟢',
      '2. Process — what steps happen? ⚙️',
      '3. Decision — where is there a choice? 🤔',
      '4. Output — what comes out? 📤',
      '5. End — how does it finish? 🔴',
    ],
    sections: {
      start: {
        hint: '❓ Where does this process begin?',
        placeholder: 'e.g., Wake up in the morning',
        example: 'Wake up at 7:00 AM',
      },
      process: {
        hint: '❓ What steps happen? Write them in order',
        placeholder: 'e.g., Brush teeth, eat breakfast',
        example: 'Brush teeth\nMake breakfast\nGet dressed',
      },
      decision: {
        hint: '❓ Where is there a choice or question?',
        placeholder: 'e.g., Is the weather nice today?',
        example: 'Is the weather nice today?\nIf yes — walk to school\nIf no — take the bus',
      },
      output: {
        hint: '❓ What is the result?',
        placeholder: 'e.g., Arrive at school on time',
        example: 'Arrive at school on time',
      },
      end: {
        hint: '❓ How does the process end?',
        placeholder: 'e.g., First class starts successfully',
        example: 'First class has started ✅',
      },
    },
    exampleContent: {
      start: 'Wake up at 7:00 AM',
      process: 'Brush teeth\nMake breakfast\nGet dressed',
      decision: 'Is the weather nice today?\nIf yes — walk to school\nIf no — take the bus',
      output: 'Arrive at school on time',
      end: 'First class has started ✅',
    },
  },

  venn: {
    intro: 'A Venn Diagram compares two or more things by showing what is the same and what is different.',
    steps: [
      '1. Write a topic for each circle 🔵',
      '2. Write what is unique to each circle ✏️',
      '3. In the middle, write what both share 🤝',
    ],
    sections: {
      setA: {
        hint: '❓ What is unique to circle A?',
        placeholder: 'e.g., Cat — meows, small, lives indoors',
        example: 'Meows\nSmall\nLives indoors',
      },
      common: {
        hint: '❓ What do they have in common?',
        placeholder: 'e.g., Both are animals, eat meat',
        example: 'Animal\nEats meat\nHas fur',
      },
      setB: {
        hint: '❓ What is unique to circle B?',
        placeholder: 'e.g., Dog — barks, big, lives outdoors',
        example: 'Barks\nBig\nLives outdoors',
      },
    },
    exampleContent: {
      __vennSetCount: '2',
      setA: 'Meows\nSmall\nLives indoors',
      common: 'Animal\nEats meat\nHas fur',
      setB: 'Barks\nBig\nLives outdoors',
      region_A: 'Meows\nSmall\nLives indoors',
      region_A_B: 'Animal\nEats meat\nHas fur',
      region_B: 'Barks\nBig\nLives outdoors',
    },
  },

  timeline: {
    intro: 'A Timeline organizes events into past, present, and future.',
    steps: [
      '1. Write what happened in the past ⏪',
      '2. Write what is happening now ⏸️',
      '3. Write what might happen in the future ⏩',
    ],
    sections: {
      past: {
        hint: '❓ What happened before?',
        placeholder: 'e.g., Long ago people rode horses',
        example: 'Long ago people rode horses\nFirst car made in 1886\nAirplane flew in 1903',
      },
      present: {
        hint: '❓ What is happening right now?',
        placeholder: 'e.g., We have electric cars now',
        example: 'We have electric cars now\nTrains run very fast\nDrones are being used',
      },
      future: {
        hint: '❓ What could happen in the future?',
        placeholder: 'e.g., Flying cars might be built',
        example: 'Flying cars might be built\nTravel to Mars\nAI drivers',
      },
    },
    exampleContent: {
      past: 'Long ago people rode horses\nFirst car made in 1886\nAirplane flew in 1903',
      present: 'We have electric cars now\nTrains run very fast\nDrones are being used',
      future: 'Flying cars might be built\nTravel to Mars\nAI drivers',
    },
  },

  pyramid: {
    intro: 'A Pyramid Diagram shows things from most important (top) to least important (bottom).',
    steps: [
      '1. Write the most important thing at the top ⬆️',
      '2. Write less important things going down ⬇️',
      '3. The base is the widest, most general part 📐',
    ],
    sections: {
      top: {
        hint: '❓ What is the most important thing?',
        placeholder: 'e.g., Health is the greatest wealth',
        example: 'Health is the greatest wealth',
      },
      upperMiddle: {
        hint: '❓ What is second most important?',
        placeholder: 'e.g., Family and friends',
        example: 'Family and friends',
      },
      middle: {
        hint: '❓ What has medium importance?',
        placeholder: 'e.g., Education and learning',
        example: 'Education and learning',
      },
      lowerMiddle: {
        hint: '❓ What is less important but still needed?',
        placeholder: 'e.g., Sports and rest',
        example: 'Sports and rest',
      },
      base: {
        hint: '❓ What is the broadest, most basic thing?',
        placeholder: 'e.g., Daily habits — sleep, food, water',
        example: 'Daily habits — sleep, food, water',
      },
    },
    exampleContent: {
      top: 'Health is the greatest wealth',
      upperMiddle: 'Family and friends',
      middle: 'Education and learning',
      lowerMiddle: 'Sports and rest',
      base: 'Daily habits — sleep, food, water',
    },
  },

  causeeffect: {
    intro: 'A Cause-Effect Matrix shows how causes lead to results.',
    steps: [
      '1. Write causes — why did this happen? 🔍',
      '2. Write effects — what happened? 🎯',
      '3. Show how causes and effects connect 🔗',
    ],
    sections: {
      causes: {
        hint: '❓ What caused this event?',
        placeholder: 'e.g., Watching too much TV',
        example: 'Watching too much TV\nNot exercising enough\nEating too many sweets',
      },
      effects: {
        hint: '❓ What happened as a result?',
        placeholder: 'e.g., Eye strain',
        example: 'Eye strain\nWeight gain\nSleep problems',
      },
      correlation: {
        hint: '❓ How are causes and effects connected?',
        placeholder: 'e.g., Too much TV → eye strain',
        example: 'Too much TV causes eye strain\nLack of exercise leads to weight gain\nToo many sweets causes sleep problems',
      },
    },
    exampleContent: {
      causes: 'Watching too much TV\nNot exercising enough\nEating too many sweets',
      effects: 'Eye strain\nWeight gain\nSleep problems',
      correlation: 'Too much TV causes eye strain\nLack of exercise leads to weight gain\nToo many sweets causes sleep problems',
    },
  },

  conceptmap: {
    intro: 'A Concept Map shows how ideas are connected to each other.',
    steps: [
      '1. Write your first concept 📌',
      '2. Write your second concept 📌',
      '3. Describe how they connect 🔗',
      '4. Add extra details 📝',
    ],
    sections: {
      concept1: {
        hint: '❓ What is the first concept?',
        placeholder: 'e.g., Plants',
        example: 'Plants',
      },
      concept2: {
        hint: '❓ What is the second concept?',
        placeholder: 'e.g., Photosynthesis',
        example: 'Photosynthesis',
      },
      relationship: {
        hint: '❓ How are these two connected?',
        placeholder: 'e.g., Plants do photosynthesis',
        example: 'Plants perform the process of photosynthesis',
      },
      details: {
        hint: '❓ Any extra information?',
        placeholder: 'e.g., Needs sunlight and water',
        example: 'Photosynthesis uses sunlight, water, and CO2 to produce oxygen',
      },
    },
    exampleContent: {
      concept1: 'Plants',
      concept2: 'Photosynthesis',
      relationship: 'Plants perform the process of photosynthesis',
      details: 'Photosynthesis uses sunlight, water, and CO2 to produce oxygen',
    },
  },

  tchart: {
    intro: 'A T-Chart compares two sides of a topic, like pros vs. cons.',
    steps: [
      '1. Write one viewpoint on the left ⬅️',
      '2. Write the other viewpoint on the right ➡️',
      '3. Compare both sides 📊',
    ],
    sections: {
      left: {
        hint: '❓ What goes on the left side?',
        placeholder: 'e.g., Benefits of reading books',
        example: 'Gain knowledge\nBuild vocabulary\nImprove memory\nBetter focus',
      },
      right: {
        hint: '❓ What goes on the right side?',
        placeholder: 'e.g., Downsides of too much phone use',
        example: 'Eye strain\nTime wasted\nSleep disruption\nLoss of focus',
      },
    },
    exampleContent: {
      left: 'Gain knowledge\nBuild vocabulary\nImprove memory\nBetter focus',
      right: 'Eye strain\nTime wasted\nSleep disruption\nLoss of focus',
    },
  },

  fishbone: {
    intro: 'A Fishbone Diagram shows all the causes of a problem, organized by category.',
    steps: [
      '1. Write the main problem on the right 🐟',
      '2. Add causes under each category (people, process, materials...) 📋',
      '3. Add sub-causes under each cause 🔍',
    ],
    sections: {
      problem: {
        hint: '❓ What is the main problem?',
        placeholder: 'e.g., Students arrive late to class',
        example: 'Students arrive late to class',
      },
      people: {
        hint: '❓ What people-related causes are there?',
        placeholder: 'e.g., Parents wake up late',
        example: 'Parents wake up late\nStudents turn off the alarm',
      },
      process: {
        hint: '❓ What process-related causes are there?',
        placeholder: 'e.g., Making breakfast takes too long',
        example: 'Making breakfast takes too long\nSchool door closes early',
      },
      materials: {
        hint: '❓ What material or tool causes are there?',
        placeholder: 'e.g., Not enough buses',
        example: 'Not enough buses\nNo bike lanes',
      },
      environment: {
        hint: '❓ What environment causes are there?',
        placeholder: 'e.g., Rainy weather',
        example: 'Rainy weather\nSnow\nTraffic jams',
      },
      methods: {
        hint: '❓ What method-related causes are there?',
        placeholder: 'e.g., No alarm habit',
        example: 'No alarm habit\nNot sleeping early enough',
      },
    },
    exampleContent: {
      problem: 'Students arrive late to class',
      people: 'Parents wake up late\nStudents turn off the alarm',
      process: 'Making breakfast takes too long\nSchool door closes early',
      materials: 'Not enough buses\nNo bike lanes',
      environment: 'Rainy weather\nSnow\nTraffic jams',
      methods: 'No alarm habit\nNot sleeping early enough',
    },
  },
};

/* ─── Helper to pick by language ─── */

export function getGuidance(type: DiagramType, language: 'en' | 'uz'): DiagramGuidanceData {
  return language === 'uz' ? guidanceUz[type] : guidanceEn[type];
}

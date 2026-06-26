const recommendationsRepo = {
  Autism: {
    High: [
      {
        en: "Schedule a comprehensive evaluation with an autism specialist.",
        ar: "احجز تقييماً شاملاً مع أخصائي في اضطراب طيف التوحد.",
      },
      {
        en: "Start early intervention programs as soon as possible.",
        ar: "ابدأ برامج التدخل المبكر في أقرب وقت ممكن.",
      },
      {
        en: "Maintain a consistent daily routine.",
        ar: "حافظ على روتين يومي ثابت للطفل.",
      },
      {
        en: "Use visual schedules to support daily activities.",
        ar: "استخدم الجداول والصور لتوضيح الأنشطة اليومية.",
      },
      {
        en: "Encourage communication using simple language.",
        ar: "شجع الطفل على التواصل باستخدام لغة بسيطة وواضحة.",
      },
      {
        en: "Reduce sensory distractions at home.",
        ar: "قلل المشتتات الحسية داخل المنزل.",
      },
      {
        en: "Work closely with teachers and therapists.",
        ar: "تعاون باستمرار مع المعلمين والأخصائيين.",
      },
      {
        en: "Monitor progress regularly.",
        ar: "تابع تطور الطفل بشكل دوري.",
      },
    ],

    Medium: [
      {
        en: "Maintain structured daily activities.",
        ar: "احرص على تنظيم الأنشطة اليومية.",
      },
      {
        en: "Encourage eye contact during conversations.",
        ar: "شجع الطفل على التواصل البصري أثناء الحديث.",
      },
      {
        en: "Practice social interaction through play.",
        ar: "شجع التفاعل الاجتماعي من خلال اللعب.",
      },
      {
        en: "Use visual learning materials.",
        ar: "استخدم وسائل تعليمية بصرية.",
      },
      {
        en: "Observe behavioral changes.",
        ar: "راقب أي تغيرات سلوكية.",
      },
      {
        en: "Provide positive reinforcement.",
        ar: "استخدم التعزيز الإيجابي.",
      },
    ],

    Low: [
      {
        en: "Continue supporting social interaction.",
        ar: "استمر في تشجيع التفاعل الاجتماعي.",
      },
      {
        en: "Maintain healthy daily routines.",
        ar: "حافظ على الروتين اليومي الصحي.",
      },
      {
        en: "Encourage communication activities.",
        ar: "شجع الأنشطة التي تنمي مهارات التواصل.",
      },
      {
        en: "Monitor future development.",
        ar: "تابع تطور الطفل مستقبلًا.",
      },
    ],
  },

  Hyperactivity: {
    High: [
      {
        en: "Consult an ADHD specialist for a full assessment.",
        ar: "استشر أخصائي اضطراب فرط الحركة ونقص الانتباه لإجراء تقييم شامل.",
      },
      {
        en: "Create a structured daily routine.",
        ar: "ضع روتينًا يوميًا منظمًا.",
      },
      {
        en: "Break tasks into smaller steps.",
        ar: "قسم المهام الكبيرة إلى خطوات صغيرة.",
      },
      {
        en: "Reduce distractions while studying.",
        ar: "قلل المشتتات أثناء المذاكرة.",
      },
      {
        en: "Encourage regular physical activity.",
        ar: "شجع الطفل على ممارسة النشاط البدني.",
      },
      {
        en: "Work with school teachers.",
        ar: "تعاون مع معلمي المدرسة.",
      },
      {
        en: "Use reward-based motivation.",
        ar: "استخدم نظام المكافآت لتحفيز الطفل.",
      },
      {
        en: "Monitor behavior consistently.",
        ar: "تابع السلوك باستمرار.",
      },
    ],

    Medium: [
      {
        en: "Use short study sessions.",
        ar: "اجعل جلسات المذاكرة قصيرة.",
      },
      {
        en: "Provide regular breaks.",
        ar: "وفر فترات راحة منتظمة.",
      },
      {
        en: "Use visual reminders.",
        ar: "استخدم وسائل تذكير بصرية.",
      },
      {
        en: "Maintain sleep routines.",
        ar: "حافظ على مواعيد نوم منتظمة.",
      },
      {
        en: "Encourage organized activities.",
        ar: "شجع الأنشطة المنظمة.",
      },
      {
        en: "Monitor symptom progression.",
        ar: "تابع تطور الأعراض.",
      },
    ],

    Low: [
      {
        en: "Support healthy study habits.",
        ar: "ادعم عادات المذاكرة الصحية.",
      },
      {
        en: "Encourage outdoor activities.",
        ar: "شجع الأنشطة الخارجية.",
      },
      {
        en: "Maintain balanced routines.",
        ar: "حافظ على روتين متوازن.",
      },
      {
        en: "Repeat assessment if needed.",
        ar: "أعد التقييم عند الحاجة.",
      },
    ],
  },

  "Learning difficulty": {
    High: [
      {
        en: "Consult a learning specialist.",
        ar: "استشر أخصائي صعوبات التعلم.",
      },
      {
        en: "Develop an individualized learning plan.",
        ar: "ضع خطة تعليمية فردية.",
      },
      {
        en: "Use interactive learning techniques.",
        ar: "استخدم وسائل تعليمية تفاعلية.",
      },
      {
        en: "Provide additional practice time.",
        ar: "امنح الطفل وقتًا إضافيًا للتدريب.",
      },
      {
        en: "Collaborate with teachers.",
        ar: "تعاون مع المعلمين.",
      },
      {
        en: "Track learning progress weekly.",
        ar: "تابع التقدم الدراسي أسبوعيًا.",
      },
      {
        en: "Focus on strengths and encourage confidence.",
        ar: "ركز على نقاط القوة وزد ثقة الطفل بنفسه.",
      },
      {
        en: "Celebrate small achievements.",
        ar: "احتفل بالإنجازات الصغيرة.",
      },
    ],

    Medium: [
      {
        en: "Practice reading daily.",
        ar: "شجع القراءة اليومية.",
      },
      {
        en: "Use educational games.",
        ar: "استخدم الألعاب التعليمية.",
      },
      {
        en: "Provide extra learning support.",
        ar: "قدم دعمًا إضافيًا أثناء التعلم.",
      },
      {
        en: "Reduce learning distractions.",
        ar: "قلل المشتتات أثناء التعلم.",
      },
      {
        en: "Encourage patience and confidence.",
        ar: "شجع الصبر والثقة بالنفس.",
      },
      {
        en: "Review progress regularly.",
        ar: "راجع التقدم باستمرار.",
      },
    ],

    Low: [
      {
        en: "Continue practicing basic skills.",
        ar: "استمر في ممارسة المهارات الأساسية.",
      },
      {
        en: "Support independent learning.",
        ar: "شجع التعلم الذاتي.",
      },
      {
        en: "Keep learning enjoyable.",
        ar: "اجعل التعلم ممتعًا.",
      },
      {
        en: "Monitor school performance.",
        ar: "تابع الأداء الدراسي.",
      },
    ],
  },
};

// function getRandomRecommendations(testType, level, count = 3) {
//   const list = recommendationsRepo?.[testType]?.[level] || [];

//   return [...list].sort(() => Math.random() - 0.5).slice(0, count);
// }

// module.exports = {
//   getRandomRecommendations,
// };

function getRandomRecommendations(testType, level, count = 3) {
  const list = recommendationsRepo?.[testType]?.[level] || [];

  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

function getRecommendations(testType, level) {
  const interpretations = {
    High: {
      en: "The child shows a high level of symptoms that may require professional evaluation and early intervention.",
      ar: "تشير النتيجة إلى وجود مستوى مرتفع من الأعراض، ويُنصح بالتوجه إلى أخصائي لإجراء تقييم شامل والبدء في التدخل المبكر.",
    },

    Medium: {
      en: "The child shows moderate symptoms that should be monitored and supported.",
      ar: "تشير النتيجة إلى وجود أعراض متوسطة، ويُنصح بمتابعة الطفل وتقديم الدعم المناسب.",
    },

    Low: {
      en: "The child currently shows a low level of symptoms.",
      ar: "تشير النتيجة إلى انخفاض مستوى الأعراض في الوقت الحالي.",
    },
  };

  return {
    interpretation: interpretations[level],
    recommendations: getRandomRecommendations(testType, level),
  };
}

module.exports = {
  getRecommendations,
};

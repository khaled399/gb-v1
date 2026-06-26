const Kid = require("../models/Kid");
const Test = require("../models/Test");
const TestResult = require("../models/TestResult");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const calculateScore = require("../services/scoring.service");
const TestDetail = require("../models/TestDetail");
const { getRecommendations } = require("../services/recommendations.service");

exports.submitTest = asyncHandler(async (req, res, next) => {
  const { testId, answers: submittedAnswers, kidId } = req.body;

  // 1️⃣ تأكد إن الأب عنده أطفال
  const kidsCount = await Kid.countDocuments({
    parent_ref: req.user._id,
  });

  if (kidsCount === 0) {
    return next(new ApiError("You must add a child before taking a test", 400));
  }

  // 2️⃣ تأكد إن الطفل تابع للأب
  const kid = await Kid.findOne({
    _id: kidId,
    parent_ref: req.user._id,
  });

  if (!kid) {
    return next(new ApiError("Kid not found or not authorized", 403));
  }

  // 3️⃣ تأكد إن التست موجود
  const test = await Test.findById(testId).populate("category_id");
  if (!test) {
    return next(new ApiError("Test not found", 404));
  }

  // 4️⃣ هات كل الأسئلة مرة واحدة
  const questions = await TestDetail.find({
    test_ref: testId,
    _id: { $in: submittedAnswers.map((a) => a.questionId) },
  });

  let totalScore = 0;
  const formattedAnswers = [];

  for (const ans of submittedAnswers) {
    const question = questions.find((q) => q._id.toString() === ans.questionId);

    if (!question) continue;

    const selected = question.answers.find(
      (a) => a._id.toString() === ans.selectedAnswer,
    );

    if (!selected) continue;

    totalScore += selected.score;
    formattedAnswers.push({
      question: question._id,
      selectedAnswer: selected._id,
      score: selected.score,
    });
  }

  // 6️⃣ احسب maxScore
  let maxScore = 0;

  for (const question of questions) {
    const highest = Math.max(...question.answers.map((a) => a.score));
    maxScore += highest;
  }

  // 7️⃣ احسب percentage
  const percentage = Math.round((totalScore / maxScore) * 100) || 0;

  // 8️⃣ Level Mapping
  let level;

  if (percentage >= 70) level = "High";
  else if (percentage >= 40) level = "Medium";
  else level = "Low";

  // // 9️⃣ Interpretation & Recommendations
  // let interpretation;
  // // let recommendations = [];
  // const recommendations = getRandomRecommendations(
  //   test.category.name_en,
  //   level,
  // );

  // if (level === "High") {
  //   interpretation = {
  //     en: "The child shows a high level of symptoms that may require professional evaluation and early intervention.",
  //     ar: "تشير النتيجة إلى وجود مستوى مرتفع من الأعراض، ويُنصح بالتوجه إلى أخصائي لإجراء تقييم شامل والبدء في التدخل المبكر.",
  //   };

  //   recommendations = [
  //     {
  //       en: "Schedule an evaluation with a child psychologist or specialist.",
  //       ar: "احجز موعدًا مع أخصائي نفسي أو متخصص في تقييم الأطفال.",
  //     },
  //     {
  //       en: "Follow a structured daily routine to reduce distractions.",
  //       ar: "احرص على وجود روتين يومي منظم يساعد الطفل على تقليل التشتت.",
  //     },
  //     {
  //       en: "Maintain close communication with teachers to monitor behavior.",
  //       ar: "تابع باستمرار مع المدرسة أو المعلمين لمراقبة سلوك الطفل وتقدمه.",
  //     },
  //   ];
  // } else if (level === "Medium") {
  //   interpretation = {
  //     en: "The child shows moderate symptoms that should be monitored and supported.",
  //     ar: "تشير النتيجة إلى وجود أعراض متوسطة، ويُنصح بمتابعة الطفل وتقديم الدعم المناسب.",
  //   };

  //   recommendations = [
  //     {
  //       en: "Create a consistent daily schedule.",
  //       ar: "أنشئ جدولًا يوميًا ثابتًا ومنظمًا للطفل.",
  //     },
  //     {
  //       en: "Encourage focus through short learning activities.",
  //       ar: "شجع الطفل على التركيز من خلال أنشطة قصيرة ومتنوعة.",
  //     },
  //     {
  //       en: "Observe any changes and consult a specialist if symptoms increase.",
  //       ar: "راقب تطور الحالة واستشر متخصصًا إذا زادت الأعراض.",
  //     },
  //   ];
  // } else {
  //   interpretation = {
  //     en: "The child currently shows a low level of symptoms.",
  //     ar: "تشير النتيجة إلى انخفاض مستوى الأعراض في الوقت الحالي.",
  //   };

  //   recommendations = [
  //     {
  //       en: "Continue supporting healthy daily habits.",
  //       ar: "استمر في دعم العادات اليومية الصحية للطفل.",
  //     },
  //     {
  //       en: "Encourage play, learning, and social interaction.",
  //       ar: "شجع الطفل على اللعب والتعلم والتفاعل الاجتماعي.",
  //     },
  //     {
  //       en: "Repeat the assessment if new symptoms appear.",
  //       ar: "يمكن إعادة الاختبار إذا ظهرت أعراض جديدة مستقبلًا.",
  //     },
  //   ];
  // }

  const { interpretation, recommendations } = getRecommendations(
    test.category_id.name_en,
    level,
  );

  // 5️⃣ خزّن النتيجة بالشكل الصح
  const result = await TestResult.create({
    kid_ref: kidId,
    test: testId,
    answers: formattedAnswers,
    totalScore,
    maxScore,
    percentage,
    level,
  });

  res.status(201).json({
    status: "success",
    data: {
      totalScore,
      maxScore,
      percentage,
      level,
      interpretation,
      recommendations,
      submittedAt: result.createdAt,
    },
  });
});

// const TestDetail = require("../models/TestDetail");
// const ApiError = require("../utils/apiError");

// const calculateScore = async (answers) => {
//   let totalScore = 0;
//   const processedAnswers = [];

//   for (const ans of answers) {
//     const question = await TestDetail.findById(ans.questionId);

//     if (!question) {
//       throw new ApiError("Question not found", 404);
//     }

//     const score = question.scores?.[ans.selectedAnswer];

//     if (score === undefined) {
//       throw new ApiError(`Invalid selectedAnswer: ${ans.selectedAnswer}`, 400);
//     }

//     processedAnswers.push({
//       question: question._id,
//       selectedAnswer: ans.selectedAnswer,
//       score,
//     });

//     totalScore += score;
//   }

//   return { processedAnswers, totalScore };
// };

// module.exports = calculateScore;
const TestDetail = require("../models/TestDetail");
const ApiError = require("../utils/apiError");
const calculateScore = async (testId, submittedAnswers) => {
  let totalScore = 0;

  for (const ans of submittedAnswers) {
    const question = await TestDetail.findOne({
      _id: ans.questionId,
      test_ref: testId,
    });

    if (!question) continue;

    const selected = question.answers.find(
      (a) => a._id.toString() === ans.selectedAnswer,
    );

    if (selected) {
      totalScore += selected.score;
    }
  }

  return totalScore;
};

module.exports = calculateScore;

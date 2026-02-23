const TestDetail = require("../models/TestDetail");
const ApiError = require("../utils/apiError");

const calculateScore = async (answers) => {
  let totalScore = 0;
  const processedAnswers = [];

  for (const ans of answers) {
    const question = await TestDetail.findById(ans.questionId);

    if (!question) {
      throw new ApiError("Question not found", 404);
    }

    const score = question.scores?.[ans.selectedAnswer];

    if (score === undefined) {
      throw new ApiError(`Invalid selectedAnswer: ${ans.selectedAnswer}`, 400);
    }

    processedAnswers.push({
      question: question._id,
      selectedAnswer: ans.selectedAnswer,
      score,
    });

    totalScore += score;
  }

  return { processedAnswers, totalScore };
};

module.exports = calculateScore;

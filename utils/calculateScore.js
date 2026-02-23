const calculateScore = (answers = []) => {
  let totalScore = 0;

  answers.forEach((item) => {
    if (typeof item.score === "number") {
      totalScore += item.score;
    }
  });

  return totalScore;
};

module.exports = calculateScore;

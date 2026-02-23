const getResultLevel = (totalScore, maxScore) => {
  const percentage = (totalScore / maxScore) * 100;

  if (percentage >= 70) {
    return "High";
  } else if (percentage >= 40) {
    return "Medium";
  } else {
    return "Low";
  }
};

module.exports = getResultLevel;

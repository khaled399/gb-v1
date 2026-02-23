module.exports = function generateScores(detail) {
  const scores = {};

  for (let i = 1; i <= 6; i++) {
    if (detail[`answer${i}_en`] || detail[`answer${i}_ar`]) {
      scores[`answer${i}`] = i - 1;
    }
  }

  return scores;
};
///////////
// const generateScores = (question) => {
//   const scores = {};

//   for (let i = 1; i <= 6; i++) {
//     const answerKey = `answer${i}_en`;

//     if (question[answerKey]) {
//       scores[`answer${i}`] = i - 1; // 0,1,2,3...
//     } else {
//       scores[`answer${i}`] = null;
//     }
//   }

//   return scores;
// };

// module.exports = generateScores;

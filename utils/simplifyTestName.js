exports.simplifyTestName = (name) => {
  if (!name) return "Unknown Test";

  if (name.includes("Attention")) return "ADHD Test";
  if (name.includes("Autism")) return "Autism Test";

  return name;
};

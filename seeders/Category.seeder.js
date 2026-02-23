const Category = require("../models/Category");

const categorySeeder = async () => {
  await Category.deleteMany();

  await Category.create([
    {
      name_ar: "صعوبه التعلم",
      name_en: "Learning difficulty",
      img: "categories/1.png",
      desc_ar: null,
      desc_en: null,
    },
    {
      name_ar: "التوحد",
      name_en: "Autism",
      img: "categories/2.jpg",
      desc_ar: null,
      desc_en: null,
    },
    {
      name_ar: "فرط الحركه",
      name_en: "Hyperactivity",
      img: "categories/3.jpg",
      desc_ar: null,
      desc_en: null,
    },
  ]);

  console.log("Categories seeded ✅");
};

module.exports = categorySeeder;

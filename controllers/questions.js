const { Op, fn, col } = require("sequelize");
const { Question } = require("../models/Qusetions");

const handleAddQuestion = async (req, res) => {
  const { question, answer, category, language } = req.body;
  console.log(req.body, "body");
  if(!question || !answer || !category || !language) return res.status(400).json({msg: "Bad Request"});
  try {
    const ques = await Question.create({
      question,
      answer,
      category,
      language,
    });
    // return res.status(200).json({ ques });
    return res.redirect('/');
  } catch (error) {
    console.log("Error in add question", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
const handleGetAllQuestion = async (req, res) => {
  try {
    const {
      category = "",
      search = "",
      language = "JavaScript",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: questions } = await Question.findAndCountAll({
      where: {
        category: { [Op.like]: `%${category}%` },
        question: { [Op.like]: `%${search}%` },
        answer: { [Op.like]: `%${search}%` },
        language: language,
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    // return res
    //   .status(200)
    //   .json({
    //     ques,
    //     totalItems: count,
    //     totalPages: Math.ceil(count / limit),
    //     currentPage: parseInt(page),
    //   });
    // Fetch distinct languages and categories
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(200).json({ questions, totalItems: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) });
  } else {
      return res.render('home', {
          questions,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          search,
          selectedLanguage: language,
          selectedCategory: category,
          languages: await getLanguages(),
          categories: await getCategories(language),
      });
  }
  } catch (error) {
    console.log("Error in get all question", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getLanguages = async () => {
  const languages = await Question.findAll({
      attributes: [[fn('DISTINCT', col('language')), 'language']],
  });
  return languages.map(lang => lang.language);
};

const getCategories = async (language) => {
  const categories = await Question.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      where: { language: { [Op.like]: `%${language}%` } },
  });
  return categories.map(cat => cat.category);
};
// const handleGetQuestionByCategory = async (req, res) => {
//     try {
//         const {category} = req.body;
//         const ques = await Question.findAll({where: {category: category}});
//         return res.status(200).json({ques})
//     } catch (error) {
//         console.log("Error in get questions by category", error);
//         return res.status(500).json({msg: "Internal Server Error"});
//     }
// }
const handleGetCategoryByLanguage = async (req, res) => {
  try {
    console.log(req, "req")
    const {language='JavaScript'} = req.query;
    console.log(language);
    const categories = await Question.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      where: { language: language },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.log("Error in get category by language", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
const handleSearchCategory = async (req, res) => {
  try {
    const {search=''} = req.query;
    const categories = await Question.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      where: { category: { [Op.like]: `%${search}%` } },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.log("Error in search category by language", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
const handleSearchLanguage = async (req, res) => {
  try {
    const {search=''} = req?.query;
    const languages = await Question.findAll({
      attributes: [[fn('DISTINCT', col('language')), 'language']],
      where: { language: { [Op.like]: `%${search}%` } },
    });
    return res.status(200).json(languages);
  } catch (error) {
    console.log("Error in search language", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  handleAddQuestion,
  handleGetAllQuestion,
  handleGetCategoryByLanguage,
  handleSearchCategory,
  handleSearchLanguage
};

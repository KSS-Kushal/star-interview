const express = require('express');
const { handleAddQuestion, handleGetAllQuestion, handleGetCategoryByLanguage, handleSearchCategory, handleSearchLanguage } = require('../controllers/questions');
const router = express.Router();

router.post('/', handleAddQuestion);
router.get('/', handleGetAllQuestion);
// router.post('/category', handleGetQuestionByCategory);
router.get('/category', handleGetCategoryByLanguage);
router.get('/search-categories', handleSearchCategory);
router.get('/search-languages', handleSearchLanguage);

module.exports = router;
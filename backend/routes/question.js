const express = require('express');
const Question = require('../models/question');
const { verifyToken } = require('../authorization/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().select('-answer');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const questions = await Question.find({ category }).select('-answer').limit(5);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/question', async (req, res) => {
  const { category, question, options, answer } = req.body;

  try {
    const newQuestion = new Question({ category, question, options, answer });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/check-answers', async (req, res) => {
  const { answers } = req.body;

  try {
    // Retrieve the correct answers for the given question IDs
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Compare the user's selected options with the correct answers
    let score = 0;
    answers.forEach((answer) => {
      const question = questions.find((q) => q._id.toString() === answer.questionId);
      if (question && question.answer === answer.value) {
        score++;
      }
    });

    // Return the score or any other relevant result
    res.json({ score });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;

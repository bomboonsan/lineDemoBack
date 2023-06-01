const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const cookieParser = require('cookie-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://bomboonsan:U7gWqYrBd83kAGwp@linedemo-01.ykb9rqz.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Define a schema and model for your collection
const questionSchema = new mongoose.Schema({    
  title: { type: String, default: null},
  embed: { type: String, default: null},
  questionImage: { type: String, default: null},
  type: String,
  point: String,
  correct: { type: [], default: null},
  answer: { type: [], default: null},
  answerImg: { type: [], default: null},
//   slug: { type: String, unique: true },
});


const Question = mongoose.model('Question', questionSchema);

// Enable CORS for all domains
router.use(cors());






//  ALL
router.get('/', (req, res) => {    
    Question.find()
    .then((movies) => res.json(movies))
    .catch((error) => res.status(500).json({ error: 'Unable to fetch movies' }));
});

// RANDOM 3
router.get('/random', (req, res) => {
  Question.aggregate([{ $sample: { size: 3 } }])
    .then(
      // (randomQuestions) => res.json(randomQuestions)
      (randomQuestions) => {

        const modifiedJson = randomQuestions.map(({ _id }) => ({ _id })); // ดึงเฉพาะ _id

        res.json(modifiedJson)
      }
    )
    .catch((error) => res.status(500).json({ error: 'Unable to fetch random questions' }));
});

router.get('/random/:number', (req, res) => {
  let { number } = req.params;
  Question.aggregate([{ $sample: { size: Number(number) } }])
    .then(
      // (randomQuestions) => res.json(randomQuestions)
      (randomQuestions) => {

        const modifiedJson = randomQuestions.map(({ _id }) => ({ _id })); // ดึงเฉพาะ _id

        res.json(modifiedJson)
      }
    )
    .catch((error) => res.status(500).json({ error: 'Unable to fetch random questions' }));
});

// ADD
router.post('/add', (req, res) => {
    const { title , type , questionImage , point , correct , answer , answerImg } = req.body;
  
    const question = new Question({
        title,
        type,
        questionImage,
        point,
        correct,
        answer,
        answerImg,
    });
  
    question.save()
      .then((result) => res.json(result))
      .catch((error) => res.status(500).json({ error: 'Unable to create Question' }));
});

// Get a specific movie by ID
router.get('/id/:id', (req, res) => {
    const { id } = req.params;
  
    Question.findById(id)
      .then((question) => {
        if (!question) {
          res.status(404).json({ error: 'Question not found' });
        } else {
          res.json(question);
        }
      })
      .catch((error) => res.status(500).json({ error: 'Unable to fetch question' }));
});

// Remove
router.delete('/id/:id', (req, res) => {
  const { id } = req.params;

  Question.findByIdAndDelete(id)
      .then((question) => {
          if (!question) {
              res.status(404).json({ error: 'Question not found' });
          } else {
              res.json({ message: 'Question deleted successfully' });
          }
      })
      .catch((error) => res.status(500).json({ error: 'Unable to delete question' }));
});

module.exports = router
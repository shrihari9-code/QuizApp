import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Quiz() {
  const location = useLocation();
  const history = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
        setAnswers(response.data.map((question) => ({ questionId: question._id, value: '' })));
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (e) => {
    const { questionId, value } = e.target;

    const updatedAnswers = answers.map((answer) => {
      if (answer.questionId === questionId) {
        return { questionId, value };
      }
      return answer;
    });

    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions/check-answers', { answers });
      history('/results');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Quiz</h2>
      {questions.length > 0 ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question._id}>
              <h3>{question.question}</h3>
              {question.options.map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={option}
                    name={question._id}
                    questionId={question._id}
                    value={option}
                    checked={answers.find((answer) => answer.questionId === question._id && answer.value === option)}
                    onChange={handleAnswerChange}
                    required
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default Quiz;

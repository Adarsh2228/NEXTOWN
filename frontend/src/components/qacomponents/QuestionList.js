import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionList = ({ selectedCategory, onSelectQuestion }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://localhost:4000/api/questions/category/${selectedCategory}`)
        .then((response) => setQuestions(response.data))
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }, [selectedCategory]);

  return (
    <div>
      <h3>Questions</h3>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question._id} onClick={() => onSelectQuestion(question._id)}>
            <h4>{question.title}</h4>
            <p>{question.description}</p>
          </div>
        ))
      ) : (
        <p>No questions found for this category.</p>
      )}
    </div>
  );
};

export default QuestionList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnswerList = ({ questionId }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (questionId) {
      axios
        .get(`http://localhost:4000/api/answers/question/${questionId}`)
        .then((response) => setAnswers(response.data))
        .catch((error) => console.error('Error fetching answers:', error));
    }
  }, [questionId]);

  return (
    <div>
      <h3>Answers</h3>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <div key={answer._id}>
            <p>{answer.content}</p>
            <small>Posted by: {answer.userEmail}</small>
          </div>
        ))
      ) : (
        <p>No answers found for this question.</p>
      )}
    </div>
  );
};

export default AnswerList;
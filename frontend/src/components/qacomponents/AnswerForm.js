import React, { useState } from 'react';
import axios from 'axios';

const AnswerForm = ({ userEmail, questionId, onAnswerPosted }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/answers', {
        content,
        questionId,
        userEmail,
      });
      alert('Answer posted successfully!');
      setContent('');
      onAnswerPosted(); // Refresh the answer list
    } catch (error) {
      console.error('Error posting answer:', error);
      alert('Failed to post answer.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Post an Answer</h3>
      <div>
        <label>Your Answer: </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Post Answer</button>
    </form>
  );
};

export default AnswerForm;
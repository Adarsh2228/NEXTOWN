import React, { useState } from 'react';
import axios from 'axios';

const QuestionForm = ({ userEmail, selectedCategory, onQuestionPosted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/questions', {
        title,
        description,
        category: selectedCategory,
        userEmail,
      });
      alert('Question posted successfully!');
      setTitle('');
      setDescription('');
      onQuestionPosted();
    } catch (error) {
      console.error('Error posting question:', error);
      alert('Failed to post question.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ask a Question</h3>
      <div>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description: </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Post Question</button>
    </form>
  );
};

export default QuestionForm;
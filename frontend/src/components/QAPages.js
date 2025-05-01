import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QAPage.css'; // Import the separate CSS file

const QAPage = () => {
  // Static list of categories
  const categories = [
    "Ice Cream Parlor", "Clothing Store", "Shoe Store", "Fruit Vendor",
    "Pharmacy", "Pet Shop", "Electrical Appliances", "Bakery",
    "Sweet Shop", "Gym", "Spice Shop", "Auto Parts Shop",
    "Toy Shop", "Photo Studio", "Tea Stall", "Stationery Shop",
    "Optician", "Vegetable Vendor", "Bookstore", "Cyber Cafe",
    "Tailor Shop", "Dry Cleaning Service", "Hair Salon", "Furniture Store",
    "Grocery Store", "Flower Shop", "Street Food Vendor", "Jewelry Store",
    "Tech Shop", "Mobile Repair Shop"
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [mode, setMode] = useState('question');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Fetch questions for the selected category
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`/api/questions/${selectedCategory}`)
        .then(response => setQuestions(response.data))
        .catch(error => {
          console.error('Error fetching questions:', error);
          // Use mock data for demo/development purposes
          const mockQuestions = [
            { _id: '1', content: 'What are the best flavors to try?', userEmail: 'customer@example.com' },
            { _id: '2', content: 'Do you offer dairy-free options?', userEmail: 'visitor@example.com' },
            { _id: '3', content: 'What are your opening hours?', userEmail: 'shopper@example.com' }
          ];
          setQuestions(mockQuestions);
        });
    }
  }, [selectedCategory]);

  // Fetch answers for the selected question
  useEffect(() => {
    if (selectedQuestion) {
      axios.get(`/api/answers/${selectedQuestion}`)
        .then(response => setAnswers(response.data))
        .catch(error => {
          console.error('Error fetching answers:', error);
          // Use mock data for demo/development purposes
          const mockAnswers = [
            { _id: 'a1', questionId: '1', text: 'Our most popular flavors are vanilla bean, chocolate fudge, and strawberry delight!', userEmail: 'owner@icecream.com' },
            { _id: 'a2', questionId: '1', text: 'I would recommend trying our seasonal specials too!', userEmail: 'employee@icecream.com' },
            { _id: 'a3', questionId: '2', text: 'Yes, we offer almond milk and coconut milk based options.', userEmail: 'manager@icecream.com' }
          ];
          setAnswers(mockAnswers.filter(a => a.questionId === selectedQuestion));
        });
    }
  }, [selectedQuestion]);

  // Handle asking a new question
  const handleAskQuestion = () => {
    if (newQuestion && userEmail && selectedCategory) {
      axios.post('/api/questions', { content: newQuestion, category: selectedCategory, userEmail })
        .then(response => {
          setQuestions([...questions, response.data]);
          setNewQuestion('');
          alert('Your question has been submitted successfully!');
        })
        .catch(error => {
          console.error('Error posting question:', error);
          // For demo purposes, create a mock response
          const mockNewQuestion = {
            _id: `q${Date.now()}`,
            content: newQuestion,
            category: selectedCategory,
            userEmail
          };
          setQuestions([...questions, mockNewQuestion]);
          setNewQuestion('');
          alert('Your question has been submitted! (Demo mode)');
        });
    } else {
      alert('Please fill in all fields (email, category, and question).');
    }
  };

  // Handle posting a new answer
  const handleAnswerQuestion = (questionId) => {
    if (newAnswer && userEmail) {
      axios.post('/api/answers', { questionId, text: newAnswer, userEmail })
        .then(response => {
          setAnswers([...answers, response.data]);
          setNewAnswer('');
          alert('Your answer has been submitted successfully!');
        })
        .catch(error => {
          console.error('Error posting answer:', error);
          // For demo purposes, create a mock response
          const mockNewAnswer = {
            _id: `a${Date.now()}`,
            questionId,
            text: newAnswer,
            userEmail
          };
          setAnswers([...answers, mockNewAnswer]);
          setNewAnswer('');
          alert('Your answer has been submitted! (Demo mode)');
        });
    } else {
      alert('Please fill in all fields (email and answer).');
    }
  };

  // Toggle expanded question for viewing answers
  const toggleQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
      setSelectedQuestion(id);
    }
  };

  return (
    <div className="qa-container">
      <header className="qa-header">
        <h1>Community Q&A</h1>
        <p>Ask questions and share knowledge about local businesses</p>
      </header>

      {/* User Info Section */}
      <section className="qa-section user-info">
        <div className="section-header">
          <span className="icon">✉️</span>
          <h2>Your Information</h2>
        </div>
        <div className="form-group">
          <label>Your Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email address"
          />
        </div>
      </section>

      {/* Controls Section */}
      <section className="qa-section controls">
        <div className="controls-grid">
          <div className="form-group">
            <label>Select Category</label>
            <div className="select-wrapper">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Choose a business category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Select Mode</label>
            <div className="select-wrapper">
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="question">Ask a Question</option>
                <option value="answer">Answer Questions</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Question Section */}
      {mode === 'question' && selectedCategory && (
        <section className="qa-section ask-question">
          <div className="section-header">
            <span className="icon">❓</span>
            <h2>Ask about {selectedCategory}</h2>
          </div>
          <div className="form-group">
            <label>Your Question</label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
            />
          </div>
          <button 
            onClick={handleAskQuestion}
            className="submit-button"
          >
            <span className="icon">📤</span>
            Submit Question
          </button>
        </section>
      )}

      {/* Answer Questions Section */}
      {mode === 'answer' && selectedCategory && questions.length > 0 && (
        <section className="qa-section answer-questions">
          <div className="section-header">
            <span className="icon">💬</span>
            <h2>Questions about {selectedCategory}</h2>
          </div>
          
          <div className="questions-list">
            {questions.map(question => (
              <div key={question._id} className="question-card">
                <div 
                  onClick={() => toggleQuestion(question._id)}
                  className="question-header"
                >
                  <h3>{question.content}</h3>
                  <span className={`toggle-icon ${expandedQuestion === question._id ? 'expanded' : ''}`}>▼</span>
                </div>
                
                {expandedQuestion === question._id && (
                  <div className="question-body">
                    <p className="asker-info">Asked by: {question.userEmail}</p>
                    
                    {/* Existing Answers */}
                    {answers.length > 0 ? (
                      <div className="answers-container">
                        <h4>Answers:</h4>
                        <div className="answers-list">
                          {answers.map(answer => (
                            <div key={answer._id} className="answer-item">
                              <p className="answer-text">{answer.text}</p>
                              <p className="answerer-info">Answered by: {answer.userEmail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="no-answers">No answers yet. Be the first to respond!</p>
                    )}
                    
                    {/* Add Answer Form */}
                    <div className="add-answer">
                      <label>Your Answer</label>
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={3}
                      />
                      <button 
                        onClick={() => handleAnswerQuestion(question._id)}
                        className="submit-button"
                      >
                        <span className="icon">📤</span>
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Empty state for when no questions are available */}
      {mode === 'answer' && selectedCategory && questions.length === 0 && (
        <section className="qa-section empty-state">
          <div className="empty-state-content">
            <span className="empty-icon">❓</span>
            <h3>No questions yet</h3>
            <p>Be the first to ask a question about {selectedCategory}</p>
            <button 
              onClick={() => setMode('question')}
              className="switch-button"
            >
              Switch to Ask Mode
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default QAPage;
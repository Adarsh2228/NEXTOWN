// import React, { useState } from 'react';
// import axios from 'axios';

// const BusinessAnalytics = () => {
//   const [businessType, setBusinessType] = useState('');
//   const [question, setQuestion] = useState('');
//   const [qaResponse, setQaResponse] = useState('');
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleAnalyze = async () => {
//     if (!businessType) return alert('Please enter a business type');
//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:5000/api/analyze', { businessType });
//       setData(res.data);
//     } catch (err) {
//       alert('Error: ' + err.response?.data?.error);
//     }
//     setLoading(false);
//   };

//  // Update handleAsk function
// const handleAsk = async () => {
//   if (!question) return;

//   try {
//     const res = await axios.post('http://localhost:5000/api/ask', {
//       question,
//       graph_insights: {
//         revenue: data.revenue_interpretation,
//         sentiment: data.sentiment_interpretation,
//         season: data.seasonal_interpretation,
//         ratings: data.rating_interpretation,
//         summary: data.business_insights
//       },
//       dataset: data.summary  // Send relevant dataset metrics
//     });
//     setQaResponse(res.data.answer);
//   } catch (err) {
//     alert('Error asking question: ' + err.response?.data?.error);
//   }
// };

  

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">📊 Business Analyzer</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter business type"
//           value={businessType}
//           onChange={(e) => setBusinessType(e.target.value)}
//           className="border p-2 rounded mr-2"
//         />
//         <button onClick={handleAnalyze} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Analyze
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}

//       {data && (
//         <>
//           <div className="bg-white p-4 rounded shadow mb-6">
//             <h2 className="text-xl font-semibold mb-2">📋 Summary</h2>
//             <ul className="list-disc pl-5">
//               <li>Total Revenue: ₹{data.summary["Total Revenue"].toLocaleString()}</li>
//               <li>Average Monthly Revenue: ₹{data.summary["Average Monthly Revenue"].toLocaleString()}</li>
//               <li>Peak Month: {data.summary["Peak Month"]}</li>
//               <li>Best Season: {data.summary["Best Season"]}</li>
//               <li>Average Sentiment Score: {data.summary["Average Sentiment Score"]}/5</li>
//               <li>Profit Margin: {data.summary["Profit Margin"]}%</li>
//             </ul>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.entries(data.figures).map(([key, src]) => (
//               <div key={key} className="bg-white p-3 rounded shadow">
//                 <h3 className="font-medium mb-2 capitalize">{key.replaceAll('_', ' ')}</h3>
//                 <img src={src} alt={key} className="w-full" />
//               </div>
//             ))}
//           </div>

//           <div className="bg-white p-4 mt-6 rounded shadow">
//             <h2 className="text-xl font-semibold mb-2">💡 Insights</h2>
//             <p><strong>Revenue:</strong> {data.revenue_interpretation}</p>
//             <p><strong>Sentiment:</strong> {data.sentiment_interpretation}</p>
//             <p><strong>Seasonal:</strong> {data.seasonal_interpretation}</p>
//             <p><strong>Ratings:</strong> {data.rating_interpretation}</p>
//             <p><strong>Summary:</strong> {data.business_insights}</p>
//           </div>
//         </>
//       )}

//       <div className="mt-8 bg-white p-4 rounded shadow">
//         <h2 className="text-xl font-semibold mb-2">❓ Ask the Data</h2>
//         <input
//           type="text"
//           placeholder="Ask a question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className="border p-2 rounded mr-2 w-full md:w-2/3"
//         />
//         <button onClick={handleAsk} className="bg-green-500 text-white px-4 py-2 mt-2 md:mt-0 rounded">
//           Ask
//         </button>
//         {qaResponse && <p className="mt-4 text-gray-700">{qaResponse}</p>}
//       </div>
//     </div>
//   );
// };

// export default BusinessAnalytics;




// import React, { useState } from 'react';
// import axios from 'axios';

// const BusinessAnalytics = () => {
//     const [businessType, setBusinessType] = useState('');
//     const [question, setQuestion] = useState('');
//     const [qaResponse, setQaResponse] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [askLoading, setAskLoading] = useState(false);

//     const handleAnalyze = async () => {
//         if (!businessType) return alert('Please enter a business type');
//         setLoading(true);
//         try {
//             const res = await axios.post('http://localhost:5000/api/analyze', { businessType });
//             setData(res.data);
//             setQaResponse(''); // Clear previous Q&A response on new analysis
//         } catch (err) {
//             alert('Error: ' + (err.response?.data?.error || err.message));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAsk = async () => {
//         if (!question.trim()) return alert("Enter a question");
//         if (!data) return alert("Analyze a business first");
    
//         setQaResponse(""); // Clear previous response
//         setAskLoading(true);
    
//         try {
//             const res = await axios.post('http://localhost:5000/api/ask', {
//                 question: question.trim(),
//                 graph_insights: {
//                     revenue: data.revenue_interpretation,
//                     sentiment: data.sentiment_interpretation,
//                     season: data.seasonal_interpretation,
//                     ratings: data.rating_interpretation,
//                     summary: data.business_insights
//                 }
//             }, {
//                 timeout: 20000  // 10 second timeout
//             });
            
//             setQaResponse(res.data.answer);
//         } catch (err) {
//             if (err.code === 'ECONNABORTED') {
//                 setQaResponse("⚠️ Request timed out. Please try again.");
//             } else if (err.response?.data?.error) {
//                 setQaResponse(`⚠️ Error: ${err.response.data.error}`);
//             } else {
//                 setQaResponse("⚠️ Failed to get answer. Try rephrasing.");
//             }
//             console.error("Ask error:", err);
//         } finally {
//             setAskLoading(false);
//         }
//     };

//     return (
//         <div className="p-6 max-w-5xl mx-auto">
//             <h1 className="text-2xl font-bold mb-4">Business Analyzer</h1>
            
//             {/* Analysis Section */}
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="Enter business type"
//                     value={businessType}
//                     onChange={(e) => setBusinessType(e.target.value)}
//                     className="border p-2 rounded mr-2"
//                 />
//                 <button 
//                     onClick={handleAnalyze} 
//                     disabled={loading}
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                     {loading ? 'Analyzing...' : 'Analyze'}
//                 </button>
//             </div>

//             {loading && <p className="text-gray-600">Loading analysis...</p>}

//             {/* Results Section */}
//             {data?.error && (
//     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
//         <strong className="font-bold">Analysis failed:</strong> <span className="block sm:inline">{data.error}</span>
//     </div>
// )}

// {data && !data.error && (
//     <>
//         <div className="bg-white p-4 rounded shadow mb-6">
//             <h2 className="text-xl font-semibold mb-2">Summary</h2>
//             <ul className="list-disc pl-5 space-y-2">
//                 <li>Total Revenue: ₹{data.summary["Total Revenue"]?.toLocaleString()}</li>
//                 <li>Average Monthly Revenue: ₹{data.summary["Average Monthly Revenue"]?.toLocaleString()}</li>
//                 <li>Peak Month: {data.summary["Peak Month"]}</li>
//                 <li>Best Season: {data.summary["Best Season"]}</li>
//                 <li>Average Sentiment Score: {data.summary["Average Sentiment Score"]}/5</li>
//                 <li>Profit Margin: {data.summary["Profit Margin"]}%</li>
//             </ul>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             {Object.entries(data.figures).map(([key, src]) => (
//                 <div key={key} className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow">
//                     <h3 className="font-medium mb-2 capitalize">{key.replaceAll('_', ' ')}</h3>
//                     <img src={src} alt={key} className="w-full h-48 object-contain" loading="lazy" />
//                 </div>
//             ))}
//         </div>

//         <div className="bg-white p-4 rounded shadow mb-6">
//             <h2 className="text-xl font-semibold mb-2">Insights</h2>
//             <div className="space-y-3">
//                 <p><strong>Revenue:</strong> {data.revenue_interpretation}</p>
//                 <p><strong>Sentiment:</strong> {data.sentiment_interpretation}</p>
//                 <p><strong>Seasonal:</strong> {data.seasonal_interpretation}</p>
//                 <p><strong>Ratings:</strong> {data.rating_interpretation}</p>
//                 <p><strong>Summary:</strong> {data.business_insights}</p>
//             </div>
//         </div>
//     </>
// )}
 

//             {/* Q&A Section */}
//             <div className="mt-8 bg-white p-4 rounded shadow">
//                 <h2 className="text-xl font-semibold mb-2">Ask the Data</h2>
//                 <div className="flex flex-col md:flex-row gap-2">
//                     <input
//                         type="text"
//                         placeholder="Ask a question about the data..."
//                         value={question}
//                         onChange={(e) => setQuestion(e.target.value)}
//                         className="border p-2 rounded flex-1"
//                         onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
//                     />
//                     <button
//                         onClick={handleAsk}
//                         disabled={askLoading}
//                         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
//                     >
//                         {askLoading ? 'Asking...' : 'Ask Question'}
//                     </button>
//                 </div>

//                 {qaResponse && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded">
//                         <strong>Answer:</strong>
//                         <div 
//                             className="mt-2 text-gray-700"
//                             dangerouslySetInnerHTML={{ 
//                                 __html: qaResponse
//                                     .replace(/\n/g, '<br/>')
//                                     .replace(/<a/g, '<a class="text-blue-600 hover:underline"')
//                             }}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BusinessAnalytics;






import React, { useState } from 'react';
import axios from 'axios';
import './BusinessAnalytics.css';

const BusinessAnalytics = () => {
    const [businessType, setBusinessType] = useState('');
    const [question, setQuestion] = useState('');
    const [qaResponse, setQaResponse] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [askLoading, setAskLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!businessType) return alert('Please enter a business type');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/analyze', { businessType });
            setData(res.data);
            setQaResponse(''); // Clear previous Q&A response on new analysis
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!question.trim()) return alert("Enter a question");
        if (!data) return alert("Analyze a business first");
    
        setQaResponse(""); // Clear previous response
        setAskLoading(true);
    
        try {
            // Replace "this business" or "this business?" with actual businessType
            const updatedQuestion = question
                .replace(/this business\?/gi, `${businessType}?`)
                .replace(/this business/gi, businessType);
    
            const res = await axios.post('http://localhost:5000/api/ask', {
                question: updatedQuestion.trim(),
                graph_insights: {
                    revenue: data.revenue_interpretation,
                    sentiment: data.sentiment_interpretation,
                    season: data.seasonal_interpretation,
                    ratings: data.rating_interpretation,
                    summary: data.business_insights
                }
            }, {
                timeout: 20000
            });
    
            setQaResponse(res.data.answer);
        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                setQaResponse("⚠️ Request timed out. Please try again.");
            } else if (err.response?.data?.error) {
                setQaResponse(`⚠️ Error: ${err.response.data.error}`);
            } else {
                setQaResponse("⚠️ Failed to get answer. Try rephrasing.");
            }
            console.error("Ask error:", err);
        } finally {
            setAskLoading(false);
        }
    };
    

    return (
        <div className="analytics-container">
            <header className="analytics-header">
                <div className="logo-area">
                    <div className="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                    </div>
                    <h1>Business Analytics Dashboard</h1>
                </div>
                <div className="search-area">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Enter business type..."
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="search-input"
                        />
                        <button 
                            onClick={handleAnalyze} 
                            disabled={loading}
                            className="search-button"
                        >
                            {loading ? 
                                <div className="loader-small"></div> : 
                                'Analyze'
                            }
                        </button>
                    </div>
                </div>
            </header>

            {loading && (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Generating comprehensive business analysis...</p>
                </div>
            )}

            {data?.error && (
                <div className="error-container">
                    <div className="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <p><strong>Analysis failed:</strong> {data.error}</p>
                </div>
            )}
            
            {!data && !loading && (
                <div className="welcome-container">
                    <div className="welcome-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                    </div>
                    <h2>Welcome to Professional Business Analytics</h2>
                    <p>Enter a business type above to generate comprehensive analysis and insights</p>
                </div>
            )}

            {data && !data.error && (
                <div className="dashboard-container">
                    <div className="metrics-row">
                        <div className="metric-card">
                            <div className="metric-icon revenue-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div className="metric-content">
                                <h3>Total Revenue</h3>
                                <div className="metric-value">
    ₹{(data.summary["Total Revenue"] / 10).toFixed(1)}
</div>
<div className="metric-subtitle">
    Monthly Avg: ₹{(data.summary["Average Monthly Revenue"] / 10).toFixed(1)}
</div>

                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon season-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <div className="metric-content">
                                <h3>Peak Performance</h3>
                                <div className="metric-value">{data.summary["Peak Month"]}</div>
                                <div className="metric-subtitle">Best Season: {data.summary["Best Season"]}</div>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon sentiment-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <div className="metric-content">
                                <h3>Customer Sentiment</h3>
                                <div className="metric-value">{data.summary["Average Sentiment Score"]}/5</div>
                                <div className="metric-subtitle">Profit Margin: {data.summary["Profit Margin"]}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="charts-container">
                        {Object.entries(data.figures).map(([key, src]) => (
                            <div key={key} className="chart-card">
                                <div className="chart-header">
                                    <h3>{key.replaceAll('_', ' ')}</h3>
                                    <div className="chart-actions">
                                        <button className="chart-action-btn" title="Zoom">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                                <line x1="8" y1="11" x2="14" y2="11"></line>
                                            </svg>
                                        </button>
                                        <button className="chart-action-btn" title="Download">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="7 10 12 15 17 10"></polyline>
                                                <line x1="12" y1="15" x2="12" y2="3"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="chart-content">
                                    <img src={src} alt={key} className="chart-image" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="insights-container">
                        <h2 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Business Insights
                        </h2>
                        <div className="insights-cards">
                            <div className="insight-card">
                                <h3>Revenue Insights</h3>
                                <p>{data.revenue_interpretation}</p>
                            </div>
                            <div className="insight-card">
                                <h3>Customer Sentiment Analysis</h3>
                                <p>{data.sentiment_interpretation}</p>
                            </div>
                            <div className="insight-card">
                                <h3>Seasonal Performance</h3>
                                <p>{data.seasonal_interpretation}</p>
                            </div>
                            <div className="insight-card">
                                <h3>Rating Analysis</h3>
                                <p>{data.rating_interpretation}</p>
                            </div>
                            <div className="insight-card wide">
                                <h3>Executive Summary</h3>
                                <p>{data.business_insights}</p>
                            </div>
                        </div>
                    </div>

                    <div className="qa-container">
                        <h2 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Ask Business Intelligence
                        </h2>
                        <div className="qa-input-area">
                            <input
                                type="text"
                                placeholder="Ask a question about this business data..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="qa-input"
                                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                            />
                            <button
                                onClick={handleAsk}
                                disabled={askLoading}
                                className="qa-button"
                            >
                                {askLoading ? 
                                    <div className="loader-small"></div> : 
                                    'Ask Question'
                                }
                            </button>
                        </div>
                        <div className="qa-examples">
                            <span>Example questions:</span>
                            <button 
                                className="qa-example-pill"
                                onClick={() => setQuestion("how to compete with the competitors to increase revenue?")}
                            >
                                how to compete with the competitors to increase revenue?
                            </button>
                            <button 
                                className="qa-example-pill"
                                onClick={() => setQuestion("what are the pre-requisits for this business?")}
                            >
                                what are the pre-requisits for this business?
                            </button>
                            <button 
                                className="qa-example-pill"
                                onClick={() => setQuestion("which place is best for this business?")}
                            >
                                which place is best for this business?
                            </button>
                        </div>

                        {askLoading && (
                            <div className="qa-loading">
                                <div className="loader-small"></div>
                                <p>Analyzing your question...</p>
                            </div>
                        )}

                        {qaResponse && (
                            <div className="qa-response">
                                <div className="qa-response-header">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <h3>Analysis Result</h3>
                                </div>
                                <div 
                                    className="qa-response-body"
                                    dangerouslySetInnerHTML={{ 
                                        __html: qaResponse
                                            .replace(/\n/g, '<br/>')
                                            .replace(/<a/g, '<a class="qa-link"')
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="analytics-footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Business Analytics Dashboard</p>
                    <div className="footer-links">
                        <a href="#">Documentation</a>
                        <a href="#">Support</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BusinessAnalytics;
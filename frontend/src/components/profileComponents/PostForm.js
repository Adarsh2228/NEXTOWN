

import React from 'react';

const PostForm = ({ content, setContent, mediaPreview, handleMediaChange, handlePostSubmit, businessCategory }) => {
  return (
    <form onSubmit={(e) => handlePostSubmit(e, businessCategory)}>
      <div>
        <textarea
          placeholder="Enter post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
      </div>
      {mediaPreview && (
        <div>
          {mediaPreview.endsWith('.mp4') ? (
            <video controls style={{ height: '100px', width: '50px' }}>
              <source src={mediaPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={mediaPreview} alt="Media preview" style={{ height: '100px', width: '50px' }} />
          )}
        </div>
      )}
      <button type="submit">Submit Post</button>
    </form>
  );
};

export default PostForm;
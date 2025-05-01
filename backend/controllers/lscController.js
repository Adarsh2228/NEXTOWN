

// import LSCModel from '../models/lscModel.js';
// import mongoose from 'mongoose';

// // Get LSC data for a post
// export const getLSC = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: 'Invalid post ID' });
//     }

//     const post = await LSCModel.findById(postId)
//       .populate('comments.user', 'name email') // adjust according to your user model
//       .exec();

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     res.status(200).json(post);
//   } catch (err) {
//     console.error('Error fetching post:', err);
//     res.status(500).json({ error: 'Failed to fetch post' });
//   }
// };

// // Like or Unlike a Post
// export const likePost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: 'Invalid post ID' });
//     }

//     const post = await LSCModel.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     if (!Array.isArray(post.likes)) post.likes = [];

//     const userIdStr = userId.toString();
//     const alreadyLiked = post.likes.some(id => id.toString() === userIdStr);

//     if (alreadyLiked) {
//       post.likes = post.likes.filter(id => id.toString() !== userIdStr);
//     } else {
//       post.likes.push(mongoose.Types.ObjectId(userId));
//     }

//     await post.save();
//     res.status(200).json({ message: 'Post liked/unliked successfully', likes: post.likes });
//   } catch (err) {
//     console.error('Failed to like post:', err);
//     res.status(500).json({ error: 'Failed to like/unlike post' });
//   }
// };

// // Share a Post (optional logic)
// export const sharePost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: 'Invalid post ID' });
//     }

//     const post = await LSCModel.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     if (!Array.isArray(post.shares)) post.shares = [];

//     const alreadyShared = post.shares.some(id => id.toString() === userId.toString());

//     if (!alreadyShared) {
//       post.shares.push(mongoose.Types.ObjectId(userId));
//       await post.save();
//     }

//     res.status(200).json({ message: 'Post shared successfully', shares: post.shares });
//   } catch (err) {
//     console.error('Failed to share post:', err);
//     res.status(500).json({ error: 'Failed to share post' });
//   }
// };

// // Add a Comment
// export const commentPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { text } = req.body;
//     const userId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: 'Invalid post ID' });
//     }

//     if (!text || typeof text !== 'string' || text.trim().length === 0) {
//       return res.status(400).json({ error: 'Comment text is required' });
//     }

//     const post = await LSCModel.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     post.comments.push({
//       text,
//       user: mongoose.Types.ObjectId(userId),
//       createdAt: new Date(),
//     });

//     await post.save();
//     res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
//   } catch (err) {
//     console.error('Failed to add comment:', err);
//     res.status(500).json({ error: 'Failed to add comment' });
//   }
// };



import LSCModel from '../models/lscModel.js';
import mongoose from 'mongoose';

// Get LSC data for a post
export const getLSC = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Find LSC document or create a new one if it doesn't exist
    let lscData = await LSCModel.findOne({ postId });
    
    if (!lscData) {
      lscData = new LSCModel({
        postId,
        likes: [],
        shares: 0,
        comments: [],
      });
      await lscData.save();
    }
    
    res.status(200).json(lscData);
  } catch (err) {
    console.error('Error fetching LSC data:', err);
    res.status(500).json({ error: 'Failed to fetch LSC data' });
  }
};

// Like or Unlike a Post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { businessName } = req.body; // Get business name from request body
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Find LSC document or create if it doesn't exist
    let lscData = await LSCModel.findOne({ postId });
    
    if (!lscData) {
      lscData = new LSCModel({
        postId,
        likes: [],
        shares: 0,
        comments: [],
      });
    }
    
    // Toggle like status
    const alreadyLiked = lscData.likes.includes(businessName);
    
    if (alreadyLiked) {
      lscData.likes = lscData.likes.filter(name => name !== businessName);
    } else {
      lscData.likes.push(businessName);
    }
    
    await lscData.save();
    res.status(200).json({ 
      message: alreadyLiked ? 'Post unliked successfully' : 'Post liked successfully', 
      likes: lscData.likes,
      likeCount: lscData.likes.length
    });
  } catch (err) {
    console.error('Failed to like/unlike post:', err);
    res.status(500).json({ error: 'Failed to like/unlike post' });
  }
};

// Share a Post
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Find LSC document or create if it doesn't exist
    let lscData = await LSCModel.findOne({ postId });
    
    if (!lscData) {
      lscData = new LSCModel({
        postId,
        likes: [],
        shares: 0,
        comments: [],
      });
    }
    
    // Increment share count
    lscData.shares += 1;
    
    await lscData.save();
    res.status(200).json({
      message: 'Post shared successfully',
      shares: lscData.shares
    });
  } catch (err) {
    console.error('Failed to share post:', err);
    res.status(500).json({ error: 'Failed to share post' });
  }
};

// Add a Comment
export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, user } = req.body; // Get text and user (business name)
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    // Find LSC document or create if it doesn't exist
    let lscData = await LSCModel.findOne({ postId });
    
    if (!lscData) {
      lscData = new LSCModel({
        postId,
        likes: [],
        shares: 0,
        comments: [],
      });
    }
    
    // Add new comment
    const newComment = {
      text,
      user,
      timestamp: new Date()
    };
    
    lscData.comments.push(newComment);
    
    await lscData.save();
    res.status(201).json({
      message: 'Comment added successfully',
      comments: lscData.comments,
      newComment
    });
  } catch (err) {
    console.error('Failed to add comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
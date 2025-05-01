// const Business = require('../models/Business');
// const User = require('../models/User');
// const Post = require('../models/Post');
// const Order = require('../models/Order');
// const mongoose = require('mongoose');

// // Helper function to generate a unique code
// const generateUniqueCode = (prefix) => {
//   return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
// };

// // Register a new business
// exports.registerBusiness = async (req, res) => {
//   const { businessName, category, phoneNumber, email, shopAddress, shopWebsite, shopDescription } = req.body;
//   const userId = req.user.id; // Extracted from the authenticated user

//   // Validate required fields
//   if (!businessName || !category || !phoneNumber || !email || !shopAddress || !shopDescription) {
//     return res.status(400).json({ error: 'All fields are required except website.' });
//   }

//   try {
//     // Check if the user already has a registered business
//     const existingBusiness = await Business.findOne({ userId });
//     if (existingBusiness) {
//       return res.status(400).json({ error: 'User can only register one business.' });
//     }

//     // Generate a unique business code
//     const businessCode = generateUniqueCode('BIZ');

//     // Create a new business
//     const newBusiness = new Business({
//       businessName,
//       category,
//       phoneNumber,
//       email,
//       shopAddress,
//       shopWebsite,
//       shopDescription,
//       userId,
//       businessCode,
//     });

//     // Save the business to the database
//     const savedBusiness = await newBusiness.save();

//     // Update the user with the new businessId
//     await User.findByIdAndUpdate(userId, { businessId: savedBusiness._id });

//     res.status(201).json({
//       message: 'Business registered successfully',
//       business: savedBusiness,
//     });
//   } catch (error) {
//     console.error('Error registering business:', error);
//     res.status(500).json({ error: 'Error registering business. Please try again.' });
//   }
// };

// // Get business profile by ID
// exports.getBusinessProfile = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid business ID.' });
//   }

//   try {
//     const business = await Business.findById(id)
//       .populate('followers')
//       .populate('posts')
//       .populate('orders');

//     if (!business) {
//       return res.status(404).json({ error: 'Business not found.' });
//     }

//     res.json(business);
//   } catch (error) {
//     console.error('Error fetching business profile:', error);
//     res.status(500).json({ error: 'Error fetching business profile.' });
//   }
// };

// // Fetch business by name
// exports.getBusinessByName = async (req, res) => {
//   const { name } = req.params;

//   try {
//     const business = await Business.findOne({ businessName: name });
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }
//     res.json(business);
//   } catch (error) {
//     console.error('Error fetching business by name:', error);
//     res.status(500).json({ error: 'Error fetching business' });
//   }
// };

// // Follow a business
// exports.followBusiness = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid business ID' });
//   }

//   try {
//     const business = await Business.findById(id);
//     const user = await User.findById(req.user.id);

//     if (!business || !user) {
//       return res.status(404).json({ error: 'Business or User not found' });
//     }

//     if (business.followers.includes(user._id)) {
//       return res.status(400).json({ error: 'User already follows this business' });
//     }

//     business.followers.push(user._id);
//     await business.save();

//     res.json(business);
//   } catch (error) {
//     console.error('Error following business:', error);
//     res.status(500).json({ error: 'Error following business' });
//   }
// };

// // Create a new post for a business
// exports.createPost = async (req, res) => {
//   const { businessId, content } = req.body;

//   if (!businessId || !content) {
//     return res.status(400).json({ error: 'Business ID and content are required.' });
//   }

//   if (!mongoose.Types.ObjectId.isValid(businessId)) {
//     return res.status(400).json({ error: 'Invalid business ID' });
//   }

//   try {
//     const business = await Business.findById(businessId);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     const newPost = new Post({
//       business: business._id,
//       content,
//     });

//     if (req.file) {
//       if (req.file.mimetype.startsWith('image/')) {
//         newPost.images.push(req.file.path);
//       } else if (req.file.mimetype.startsWith('video/')) {
//         newPost.videos.push(req.file.path);
//       }
//     }

//     await newPost.save();
//     business.posts.push(newPost._id);
//     await business.save();

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ error: 'Error creating post' });
//   }
// };

// // Create a new order for a business
// exports.createOrder = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid business ID' });
//   }

//   try {
//     const business = await Business.findById(id);
//     if (!business) {
//       return res.status(404).json({ error: 'Business not found' });
//     }

//     const newOrder = new Order({
//       ...req.body,
//       businessId: id,
//     });

//     business.orders.push(newOrder._id);
//     await newOrder.save();
//     await business.save();

//     res.status(201).json(newOrder);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ error: 'Error creating order' });
//   }
// };

// // Fetch all businesses
// exports.getAllBusinesses = async (req, res) => {
//   try {
//     const businesses = await Business.find();
//     if (!businesses.length) {
//       return res.status(404).json({ error: 'No businesses found' });
//     }
//     res.json(businesses);
//   } catch (error) {
//     console.error('Error fetching businesses:', error);
//     res.status(500).json({ error: 'Error fetching businesses' });
//   }
// };



import Business from '../models/Business.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

// Helper function to generate a unique code
const generateUniqueCode = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Register a new business
export const registerBusiness = async (req, res) => {
  const { businessName, category, phoneNumber, email, shopAddress, shopWebsite, shopDescription } = req.body;
  const userId = req.user.id;

  if (!businessName || !category || !phoneNumber || !email || !shopAddress || !shopDescription) {
    return res.status(400).json({ error: 'All fields are required except website.' });
  }

  try {
    const existingBusiness = await Business.findOne({ userId });
    if (existingBusiness) {
      return res.status(400).json({ error: 'User can only register one business.' });
    }

    const businessCode = generateUniqueCode('BIZ');

    const newBusiness = new Business({
      businessName,
      category,
      phoneNumber,
      email,
      shopAddress,
      shopWebsite,
      shopDescription,
      userId,
      businessCode,
    });

    const savedBusiness = await newBusiness.save();
    await User.findByIdAndUpdate(userId, { businessId: savedBusiness._id });

    res.status(201).json({
      message: 'Business registered successfully',
      business: savedBusiness,
    });
  } catch (error) {
    console.error('Error registering business:', error);
    res.status(500).json({ error: 'Error registering business. Please try again.' });
  }
};

// Get business profile by ID
export const getBusinessProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid business ID.' });
  }

  try {
    const business = await Business.findById(id)
      .populate('followers')
      .populate('posts')
      .populate('orders');

    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ error: 'Error fetching business profile.' });
  }
};

// Fetch business by name
export const getBusinessByName = async (req, res) => {
  const { name } = req.params;

  try {
    const business = await Business.findOne({ businessName: name });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error fetching business by name:', error);
    res.status(500).json({ error: 'Error fetching business' });
  }
};

// Follow a business
export const followBusiness = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid business ID' });
  }

  try {
    const business = await Business.findById(id);
    const user = await User.findById(req.user.id);

    if (!business || !user) {
      return res.status(404).json({ error: 'Business or User not found' });
    }

    if (business.followers.includes(user._id)) {
      return res.status(400).json({ error: 'User already follows this business' });
    }

    business.followers.push(user._id);
    await business.save();

    res.json(business);
  } catch (error) {
    console.error('Error following business:', error);
    res.status(500).json({ error: 'Error following business' });
  }
};

// Create a new post for a business
export const createPost = async (req, res) => {
  const { businessId, content } = req.body;

  if (!businessId || !content) {
    return res.status(400).json({ error: 'Business ID and content are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ error: 'Invalid business ID' });
  }

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newPost = new Post({
      business: business._id,
      content,
    });

    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        newPost.images.push(req.file.path);
      } else if (req.file.mimetype.startsWith('video/')) {
        newPost.videos.push(req.file.path);
      }
    }

    await newPost.save();
    business.posts.push(newPost._id);
    await business.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Create a new order for a business
export const createOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid business ID' });
  }

  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const newOrder = new Order({
      ...req.body,
      businessId: id,
    });

    business.orders.push(newOrder._id);
    await newOrder.save();
    await business.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

// Fetch all businesses
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    if (!businesses.length) {
      return res.status(404).json({ error: 'No businesses found' });
    }
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Error fetching businesses' });
  }
};

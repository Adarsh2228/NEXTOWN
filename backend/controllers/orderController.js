const Order = require('../models/Order');
const Business = require('../models/Business');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const business = await Business.findById(req.body.businessId);
    const user = await User.findById(req.body.userId);
    if (!business || !user) return res.status(404).json({ error: 'Business or User not found' });
    const newOrder = new Order(req.body);
    newOrder.business = business._id;
    newOrder.user = user._id;
    await newOrder.save();
    business.orders.push(newOrder._id);
    user.orders.push(newOrder._id);
    await business.save();
    await user.save();
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('business')
      .populate('user');
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = 'accepted';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error accepting order' });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = 'rejected';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting order' });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = 'completed';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error completing order' });
  }
};

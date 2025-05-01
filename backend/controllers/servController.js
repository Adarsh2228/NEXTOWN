import { Service } from '../models/servModel.js'; // Use named import
import Business from '../models/Business.js'; // ✅ default import


export const createService = async (req, res) => {
  try {
    const { businessId, name, category, subcategory, description, originalPrice, discount } = req.body;
    const sellingPrice = originalPrice - (originalPrice * discount / 100);
    const imageUrl = req.file.filename;

    const service = new Service({
      businessId, name, category, subcategory, description,
      originalPrice, discount, sellingPrice, imageUrl
    });

    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const getServicesByBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const services = await Service.find({ businessId });
    const business = await Business.findById(businessId);
    res.json({ products: services, ownerId: business.userId.toString() });
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
};
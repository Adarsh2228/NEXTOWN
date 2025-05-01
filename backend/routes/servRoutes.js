import express from 'express';
import multer from 'multer';
import { createService, getServicesByBusiness, deleteService } from '../controllers/servController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('image'), createService);
router.get('/business/:businessId', getServicesByBusiness);
router.delete('/:id', deleteService);

export default router;

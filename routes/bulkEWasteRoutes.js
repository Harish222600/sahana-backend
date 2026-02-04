const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../config/multer');
const { protect, authorize } = require('../middleware/auth');
const {
    createBulkEWaste,
    getMyBulkEWaste,
    getAllBulkEWaste,
    getBulkEWasteById,
    updateBulkEWaste,
    deleteBulkEWaste,
    markAsSold,
    getOrdersByMe
} = require('../controllers/bulkEWasteController');

// Validation rules
const bulkEWasteValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').optional().isIn(['Electronics', 'Appliances', 'Computers', 'Mobile Devices', 'Batteries', 'Mixed', 'Other']),
    body('condition').isIn(['working', 'not working', 'damaged', 'mixed']).withMessage('Invalid condition'),
    body('weightInKg').isFloat({ min: 0.1 }).withMessage('Weight must be at least 0.1 kg'),
    body('pricePerKg').optional().isFloat({ min: 0 }).withMessage('Price per kg must be positive')
];

// Routes - Only collectors can create/manage bulk posts
router.post('/', protect, authorize('collector'), upload.array('images', 5), bulkEWasteValidation, createBulkEWaste);
router.get('/my-posts', protect, authorize('collector'), getMyBulkEWaste);
router.get('/orders-by-me', protect, authorize('organization'), getOrdersByMe); // Add this before /:id
router.get('/', protect, getAllBulkEWaste);
router.get('/:id', protect, getBulkEWasteById);
router.put('/:id', protect, authorize('collector'), upload.array('images', 5), updateBulkEWaste);
router.delete('/:id', protect, authorize('collector'), deleteBulkEWaste);
router.put('/:id/sold', protect, authorize('admin', 'organization'), markAsSold);

module.exports = router;

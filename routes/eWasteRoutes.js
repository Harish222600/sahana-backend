const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const upload = require('../config/multer');
const { protect, authorize } = require('../middleware/auth');
const {
    createEWaste,
    getMyEWaste,
    getAllEWaste,
    getEWasteById,
    updateEWaste,
    deleteEWaste,
    markAsBooked,
    markAsCollected,
    getBookedByMe
} = require('../controllers/eWasteController');

// Validation rules
const eWasteValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').optional().isIn(['Electronics', 'Appliances', 'Computers', 'Mobile Devices', 'Batteries', 'Other']),
    body('condition').isIn(['working', 'not working', 'damaged']).withMessage('Invalid condition'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Multer fields configuration for images and warranty card
const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'warrantyCard', maxCount: 1 }
]);

// Routes
router.post('/', protect, uploadFields, eWasteValidation, createEWaste);
router.get('/my-posts', protect, getMyEWaste);
router.get('/booked-by-me', protect, authorize('collector'), getBookedByMe); // Add this before /:id to avoid conflict
router.get('/', protect, getAllEWaste);
router.get('/:id', protect, getEWasteById);
router.put('/:id', protect, uploadFields, updateEWaste);
router.delete('/:id', protect, deleteEWaste);
router.put('/:id/book', protect, authorize('collector'), markAsBooked);
router.put('/:id/collect', protect, authorize('collector', 'admin'), markAsCollected);

module.exports = router;

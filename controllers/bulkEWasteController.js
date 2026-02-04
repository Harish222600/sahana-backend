const BulkEWaste = require('../models/BulkEWaste');

// @desc    Create new bulk e-waste post (collectors only)
// @route   POST /api/bulk-ewaste
// @access  Private (Collector only)
const createBulkEWaste = async (req, res) => {
    try {
        const { title, description, category, condition, weightInKg, pricePerKg, location } = req.body;

        // Get Cloudinary URLs from uploaded files
        const images = req.files ? req.files.map(file => file.path) : [];

        // Calculate total price if pricePerKg is provided
        const totalPrice = pricePerKg ? (parseFloat(weightInKg) * parseFloat(pricePerKg)).toFixed(2) : null;

        const bulkEWaste = await BulkEWaste.create({
            collector: req.user.id,
            title,
            description,
            category,
            condition,
            weightInKg: parseFloat(weightInKg),
            pricePerKg: pricePerKg ? parseFloat(pricePerKg) : null,
            totalPrice,
            location,
            images
        });

        res.status(201).json({
            success: true,
            message: 'Bulk e-waste posted successfully',
            data: bulkEWaste
        });
    } catch (error) {
        console.error('Create bulk e-waste error:', error);
        res.status(500).json({ error: 'Failed to create bulk e-waste post' });
    }
};

// @desc    Get all bulk e-waste posts by current collector
// @route   GET /api/bulk-ewaste/my-posts
// @access  Private (Collector)
const getMyBulkEWaste = async (req, res) => {
    try {
        const bulkEWastes = await BulkEWaste.find({ collector: req.user.id })
            .sort({ createdAt: -1 })
            .populate('collector', 'name email phone address')
            .populate('soldTo', 'name email phone');

        res.status(200).json({
            success: true,
            count: bulkEWastes.length,
            data: bulkEWastes
        });
    } catch (error) {
        console.error('Get my bulk e-waste error:', error);
        res.status(500).json({ error: 'Failed to fetch bulk e-waste posts' });
    }
};

// @desc    Get all bulk e-waste posts
// @route   GET /api/bulk-ewaste
// @access  Private
const getAllBulkEWaste = async (req, res) => {
    try {
        const { status, condition, category } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (condition) filter.condition = condition;
        if (category) filter.category = category;

        const bulkEWastes = await BulkEWaste.find(filter)
            .sort({ createdAt: -1 })
            .populate('collector', 'name email phone address')
            .populate('soldTo', 'name email phone');

        res.status(200).json({
            success: true,
            count: bulkEWastes.length,
            data: bulkEWastes
        });
    } catch (error) {
        console.error('Get all bulk e-waste error:', error);
        res.status(500).json({ error: 'Failed to fetch bulk e-waste posts' });
    }
};

// @desc    Get single bulk e-waste post
// @route   GET /api/bulk-ewaste/:id
// @access  Private
const getBulkEWasteById = async (req, res) => {
    try {
        const bulkEWaste = await BulkEWaste.findById(req.params.id)
            .populate('collector', 'name email phone address')
            .populate('soldTo', 'name email phone');

        if (!bulkEWaste) {
            return res.status(404).json({ error: 'Bulk e-waste post not found' });
        }

        res.status(200).json({
            success: true,
            data: bulkEWaste
        });
    } catch (error) {
        console.error('Get bulk e-waste by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch bulk e-waste post' });
    }
};

// @desc    Update bulk e-waste post
// @route   PUT /api/bulk-ewaste/:id
// @access  Private (Owner only)
const updateBulkEWaste = async (req, res) => {
    try {
        let bulkEWaste = await BulkEWaste.findById(req.params.id);

        if (!bulkEWaste) {
            return res.status(404).json({ error: 'Bulk e-waste post not found' });
        }

        // Check if user is the owner
        if (bulkEWaste.collector.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        const { title, description, category, condition, weightInKg, pricePerKg, location, status } = req.body;

        // Update fields
        if (title) bulkEWaste.title = title;
        if (description) bulkEWaste.description = description;
        if (category) bulkEWaste.category = category;
        if (condition) bulkEWaste.condition = condition;
        if (weightInKg) bulkEWaste.weightInKg = parseFloat(weightInKg);
        if (pricePerKg !== undefined) bulkEWaste.pricePerKg = pricePerKg ? parseFloat(pricePerKg) : null;
        if (location) bulkEWaste.location = location;
        if (status) bulkEWaste.status = status;

        // Recalculate total price
        if (bulkEWaste.pricePerKg && bulkEWaste.weightInKg) {
            bulkEWaste.totalPrice = (bulkEWaste.weightInKg * bulkEWaste.pricePerKg).toFixed(2);
        }

        // Handle images
        let currentImages = [];

        // Retrieve existing images from request body
        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                currentImages = req.body.existingImages;
            } else {
                currentImages = [req.body.existingImages];
            }
        }

        // Add new uploaded images
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => file.path);
        }

        // Combine and update
        bulkEWaste.images = [...currentImages, ...newImages];

        await bulkEWaste.save();

        res.status(200).json({
            success: true,
            message: 'Bulk e-waste post updated successfully',
            data: bulkEWaste
        });
    } catch (error) {
        console.error('Update bulk e-waste error:', error);
        res.status(500).json({ error: 'Failed to update bulk e-waste post' });
    }
};

// @desc    Delete bulk e-waste post
// @route   DELETE /api/bulk-ewaste/:id
// @access  Private (Owner only)
const deleteBulkEWaste = async (req, res) => {
    try {
        const bulkEWaste = await BulkEWaste.findById(req.params.id);

        if (!bulkEWaste) {
            return res.status(404).json({ error: 'Bulk e-waste post not found' });
        }

        // Check if user is the owner
        if (bulkEWaste.collector.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await bulkEWaste.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Bulk e-waste post deleted successfully'
        });
    } catch (error) {
        console.error('Delete bulk e-waste error:', error);
        res.status(500).json({ error: 'Failed to delete bulk e-waste post' });
    }
};

// @desc    Mark bulk e-waste as sold
// @route   PUT /api/bulk-ewaste/:id/sold
// @access  Private (Admin/Organization)
const markAsSold = async (req, res) => {
    try {
        const bulkEWaste = await BulkEWaste.findById(req.params.id);

        if (!bulkEWaste) {
            return res.status(404).json({ error: 'Bulk e-waste post not found' });
        }

        if (bulkEWaste.status === 'sold') {
            return res.status(400).json({ error: 'Bulk e-waste already sold' });
        }

        bulkEWaste.status = 'sold';
        bulkEWaste.soldTo = req.user.id;
        bulkEWaste.soldAt = Date.now();

        await bulkEWaste.save();

        res.status(200).json({
            success: true,
            message: 'Bulk e-waste marked as sold',
            data: bulkEWaste
        });
    } catch (error) {
        console.error('Mark as sold error:', error);
        res.status(500).json({ error: 'Failed to mark as sold' });
    }
};

// @desc    Get bulk items bought by current organization
// @route   GET /api/bulk-ewaste/orders-by-me
// @access  Private (Organization)
const getOrdersByMe = async (req, res) => {
    try {
        const orders = await BulkEWaste.find({ soldTo: req.user.id })
            .sort({ soldAt: -1 })
            .populate('collector', 'name email phone address'); // Populate collector details

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get orders by me error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

module.exports = {
    createBulkEWaste,
    getMyBulkEWaste,
    getAllBulkEWaste,
    getBulkEWasteById,
    updateBulkEWaste,
    deleteBulkEWaste,
    markAsSold,
    getOrdersByMe
};

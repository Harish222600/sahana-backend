const mongoose = require('mongoose');

const bulkEWasteSchema = new mongoose.Schema({
    collector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Electronics', 'Appliances', 'Computers', 'Mobile Devices', 'Batteries', 'Mixed', 'Other'],
        default: 'Mixed'
    },
    condition: {
        type: String,
        required: [true, 'Please specify the condition'],
        enum: ['working', 'not working', 'damaged', 'mixed'],
        default: 'mixed'
    },
    weightInKg: {
        type: Number,
        required: [true, 'Please specify weight in kg'],
        min: 0.1
    },
    pricePerKg: {
        type: Number,
        min: 0
    },
    totalPrice: {
        type: Number,
        min: 0
    },
    images: [{
        type: String
    }],
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
    },
    soldTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    soldAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
bulkEWasteSchema.index({ collector: 1, createdAt: -1 });
bulkEWasteSchema.index({ status: 1 });
bulkEWasteSchema.index({ category: 1 });

module.exports = mongoose.model('BulkEWaste', bulkEWasteSchema);

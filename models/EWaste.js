const mongoose = require('mongoose');

const eWasteSchema = new mongoose.Schema({
    user: {
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
        enum: ['Electronics', 'Appliances', 'Computers', 'Mobile Devices', 'Batteries', 'Other'],
        default: 'Other'
    },
    condition: {
        type: String,
        required: [true, 'Please specify the condition'],
        enum: ['working', 'not working', 'damaged'],
        default: 'working'
    },
    images: [{
        type: String
    }],
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        default: null,
        min: 0
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'booked', 'collected', 'cancelled'],
        default: 'pending'
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    collectedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
eWasteSchema.index({ user: 1, createdAt: -1 });
eWasteSchema.index({ status: 1 });

module.exports = mongoose.model('EWaste', eWasteSchema);

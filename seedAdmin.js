const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

// Admin user data
const adminUser = {
    name: 'Admin User',
    email: 'admin@sahana.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890',
    address: 'Admin Office',
};

// Seed admin user
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminUser);
        console.log('Admin user created successfully');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        console.log('\nPlease change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();

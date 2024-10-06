const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: [true, 'Hospital name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid contact number']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        zipcode: {
            type: String,
            required: [true, 'Zip code is required']
        }
    },
    verificationDocument: {
        type: String,
        required: [true, 'Verification document is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    hospitalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalDetails'
    }
});

hospitalSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

hospitalSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        // Add password hashing logic here if not handled elsewhere
    }
    next();
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;

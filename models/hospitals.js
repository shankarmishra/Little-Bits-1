const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that email addresses are unique
        match: /.+\@.+\..+/ // Basic email validation regex
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{10,15}$/ // Basic phone number validation
    },
    address: {
        type:String,
        required: true

    },
    verificationDocument: {
        type: String, // Path to the verification document
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets the date when the record is created
    },
    updatedAt: {
        type: Date,
        default: Date.now // Sets the date when the record is updated
    }
});

// Middleware to update the updatedAt field on every save
hospitalSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model
const Hospital = mongoose.model('hospitals', hospitalSchema);

module.exports = Hospital;

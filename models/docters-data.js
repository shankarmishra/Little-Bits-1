const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    specialization: {
        type: String,
        required: true,
        enum: [
            'Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Dermatologist',
            'Oncologist', 'Pediatrician', 'Gastroenterologist', 'Pulmonologist',
            'Endocrinologist', 'Nephrologist', 'Ophthalmologist', 'Psychiatrist',
            'Gynecologist', 'Urologist', 'Rheumatologist', 'Hematologist',
            'ENT Specialist', 'General Surgeon', 'Plastic Surgeon', 'Radiologist'
        ]
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hospitals',
        required: true,
    }
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;


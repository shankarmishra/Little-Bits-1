const mongoose = require('mongoose');

// Create hospital details schema
const hospitalDetailsSchema = new mongoose.Schema({
  bedsAvailable: {
    type: Number,
    required: true,
    min: [0, 'Number of beds cannot be negative'],
  },
  bedsBooked: {
    type: Number,
    required: true,
    min: [0, 'Number of beds booked cannot be negative'],
  },
  nurses: {
    type: Number,
    required: true,
    min: [0, 'Number of nurses cannot be negative'],
  },
  labs: {
    type: Number,
    required: true,
    min: [0, 'Number of labs cannot be negative'],
  },
  icuBeds: {
    type: Number,
    required: true,
    min: [0, 'Number of ICU beds cannot be negative'],
  },
  icuBedsBooked: {
    type: Number,
    required: true,
    min: [0, 'Number of ICU beds booked cannot be negative'],
  },
  ventilators: {
    type: Number,
    required: true,
    min: [0, 'Number of ventilators cannot be negative'],
  },
  oxygenUnits: {
    type: Number,
    required: true,
    min: [0, 'Number of oxygen units cannot be negative'],
  },
  ambulances: {
    type: Number,
    required: true,
    min: [0, 'Number of ambulances cannot be negative'],
  },
  operatingRooms: {
    type: Number,
    required: true,
    min: [0, 'Number of operating rooms cannot be negative'],
  },
  emergencyRooms: {
    type: Number,
    required: true,
    min: [0, 'Number of emergency rooms cannot be negative'],
  },
  pharmacies: {
    type: Number,
    required: true,
    min: [0, 'Number of pharmacies cannot be negative'],
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true, // Add this to enforce every detail belongs to a hospital
  },
});


// Create the hospital details model
const HospitalDetails = mongoose.model('HospitalDetails', hospitalDetailsSchema); // Ensure the model name is clear

module.exports = HospitalDetails;


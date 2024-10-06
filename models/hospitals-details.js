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
    validate: {
      validator: function(value) {
        return value <= this.bedsAvailable;
      },
      message: 'Number of booked beds cannot exceed available beds'
    }
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
    required: true,
  },
});

// Add a pre-save hook to check for any logical errors
hospitalDetailsSchema.pre('save', function(next) {
  if (this.isModified('bedsBooked') || this.isModified('bedsAvailable')) {
    if (this.bedsBooked > this.bedsAvailable) {
      return next(new Error('Number of booked beds cannot exceed available beds'));
    }
  }
  if (this.isModified('icuBedsBooked') || this.isModified('icuBeds')) {
    if (this.icuBedsBooked > this.icuBeds) {
      return next(new Error('Number of booked ICU beds cannot exceed available ICU beds'));
    }
  }
  next();
});

// Create the hospital details model
const HospitalDetails = mongoose.model('HospitalDetails', hospitalDetailsSchema);

module.exports = HospitalDetails;

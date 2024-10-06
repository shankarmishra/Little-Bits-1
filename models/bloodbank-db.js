const mongoose = require('mongoose');

// Create blood bank schema
const bloodBankSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospitals',
    required: true,
  },
  bloodUnits: {
    aPositive: {
      type: Number,
      required: true,
      min: [0, 'A+ blood units cannot be negative'],
    
    },
    aNegative: {
      type: Number,
      required: true,
      min: [0, 'A- blood units cannot be negative'],
      
    },
    bPositive: {
      type: Number,
      required: true,
      min: [0, 'B+ blood units cannot be negative'],
      
    },
    bNegative: {
      type: Number,
      required: true,
      min: [0, 'B- blood units cannot be negative'],
      
    },
    oPositive: {
      type: Number,
      required: true,
      min: [0, 'O+ blood units cannot be negative'],
  
    },
    oNegative: {
      type: Number,
      required: true,
      min: [0, 'O- blood units cannot be negative'],
   
    },
    abPositive: {
      type: Number,
      required: true,
      min: [0, 'AB+ blood units cannot be negative'],

    },
    abNegative: {
      type: Number,
      required: true,
      min: [0, 'AB- blood units cannot be negative'],
    
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

module.exports = BloodBank;

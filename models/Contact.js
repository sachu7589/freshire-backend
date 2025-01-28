const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  companyName: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  socialMedia: {
    type: String
  },
  view: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    nhi:  {
      type: String,
      required: true,
      unique: true
    },
    name: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  medication: [{ id: String, dosage: String }]
});

module.exports = mongoose.model('Prescription', prescriptionSchema)
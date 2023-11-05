const mongoose = require('mongoose');
const Prescription = require('./Prescription');

async function sync({actionType, data}) {
  if (actionType === 'add') {
    const prescription = new Prescription(data);
    await prescription.save();

    return {message: "ADDED PRESCRIPTION TO EXTERNAL API", data: prescription, actionType};
  } else if (actionType === 'edit') {
    const { newMedication } = data;
    const updatedPrescription = await Prescription.findOneAndUpdate(
      {"patient.nhi": data.patient.nhi},
      {
        $set: { "patient.name": data.patient.name },
        $push: { medication: newMedication },
      },
      { new: true }
    )

    return {message: "UPDATED PRESCRIPTION IN EXTERNAL API", data: updatedPrescription, actionType};
  } else if(actionType === 'query') {
    const prescription = await Prescription.findOne({"patient.nhi": data.nhi});
    return {message: "FOUND PRESCRIPTION IN EXTERNAL API", data: prescription, actionType};
  }
}

module.exports = sync;



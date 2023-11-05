const amqp = require('amqplib');
const Prescription = require('../models/Prescription');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLEnumType, GraphQLSchema, GraphQLList, GraphQLNonNull } = require("graphql")

// Project Type 
const PrescriptionType = new GraphQLObjectType({
  name: "Prescription",
  fields: () => ({
    id: { type: GraphQLID },
    patient: {
      type: new GraphQLObjectType({
        name: "Patient",
        fields: () => ({
          nhi: { type: GraphQLString },
          name: { type: GraphQLString },
        })
      }),
    },
    date: { type: GraphQLString },
    medication: {
      type: new GraphQLList(new GraphQLObjectType({
        name: "Medication",
        fields: () => ({
          id: { type: GraphQLString },
          dosage: { type: GraphQLString },
        })
      }))
    }
   
  })
})

var channel, connection;

async function connectRabbitMq() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("INTERNAL");
};
connectRabbitMq();

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    prescription: {
      type: PrescriptionType,
      args: { nhi: { type: GraphQLString } },
      resolve: async (parent, args) => {
        let prescription = await Prescription.findOne({ "patient.nhi": args.nhi });
        // console.log("prescription", prescription);
        if(!prescription) {
          // get from external api
          channel.sendToQueue("EXTERNAL", Buffer.from(JSON.stringify({ "actionType": "query", "data": args })));
          await new Promise((resolve, reject) => {
            channel.consume("INTERNAL", (data) => {
              let content = JSON.parse(data.content);
              // console.log(`${content.message}`, content.data);
              // if (content.actionType === "query" && content.data.patient.nhi === args.nhi) { 
                channel.ack(data);
                prescription = content.data;
                resolve(prescription); 
              // }
            })
          })
        }
        return prescription;
      }
    }
  })
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a prescription
    addPrescription: {
      type: PrescriptionType,
      args: {
        "patient_nhi": { type: GraphQLNonNull(GraphQLString) },
        "patient_name": { type: GraphQLNonNull(GraphQLString) },
        "date": { type: GraphQLNonNull(GraphQLString) },
        "medication_id": { type: GraphQLNonNull(GraphQLString) },
        "medication_dosage": { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const prescription = new Prescription({
          patient: {
            nhi: args.patient_nhi,
            name: args.patient_name
          },
          date: args.date,
          medication: {
            id: args.medication_id,
            dosage: args.medication_dosage
          }
        });

        const savedPrescription = await prescription.save();
        channel.sendToQueue("EXTERNAL", Buffer.from(JSON.stringify({ "actionType": "add", "data": savedPrescription })));
        return savedPrescription;
      }
    },

    // Edit Prescription 
    editPrescription: {
      type: PrescriptionType,
      args: {
        nhi: { type: GraphQLString },
        patient_name: { type: GraphQLString },
        medication_id: { type: GraphQLString },
        medication_dosage: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        const updatedPrescription = await Prescription.findOneAndUpdate(
          {"patient.nhi": args.nhi},
          {
            $set: {
              "patient.name": args.patient_name,
              // "medication.$": {id: args.medication_id, dosage: args.medication_dosage}
            },
            $push: { medication:  {id: args.medication_id, dosage: args.medication_dosage} },
          },
          // { upsert: true },
          { new: true }
        );
        
        channel.sendToQueue("EXTERNAL", Buffer.from(JSON.stringify({ "actionType": "edit", "data": { newMedication: updatedPrescription.medication[updatedPrescription.medication.length - 1], patient: updatedPrescription.patient} })));
        return updatedPrescription
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
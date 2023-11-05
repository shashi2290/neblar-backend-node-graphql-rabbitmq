const { GraphQLEnumType } = require('graphql');
const { request, gql } = require('graphql-request');
const serverUrl = 'http://localhost:5000';
require('dotenv').config(); // Replace with your server URL

// Define your GraphQL endpoint
const endpoint = '/graphql';

// Sample data for testing
const sampleClient = {
  name: 'Sample Client',
  email: 'sample@example.com',
  phone: '123-456-7890',
};

const sampleProject = {
  name: 'Sample Project',
  description: 'Sample Project Description',
  status: 'new',
  clientId: 'replace-with-existing-client-id', // Replace with a valid client ID
};

// Sample prescription data for testing
const samplePrescription = {
  patient: {
    nhi: "1234567890", // changes after every test run as validation on nhi as uniquely generated 
    name: 'John Smith',
  },
  date: '2023-05-01',
  medication: {
    id: '1',
    dosage: '10 mg',
  },
}


// GraphQL request function
const graphqlRequest = (query, variables = {}, headers = {}) => {
  return request(serverUrl + endpoint, query, variables, headers);
};
let patient_nhi = samplePrescription.patient.nhi, patient_name;

describe('GraphQL Mutations', () => {
  let clientId = null;
  it('should add a prescription', async () => {
    const query = gql`
      mutation AddPrescription($patient_nhi: String!, $patient_name: String!, $date: String!, $medication_id: String!, $medication_dosage: String!) {
        addPrescription(patient_nhi: $patient_nhi, patient_name: $patient_name, date: $date, medication_id: $medication_id, medication_dosage: $medication_dosage) {
          id
          patient {
            nhi
            name
          }
          date
          medication {
            id
            dosage
          }
        }
      }
    `;

    const variables = {
      patient_nhi: samplePrescription.patient.nhi,
      patient_name: samplePrescription.patient.name,
      date: samplePrescription.date,
      medication_id: samplePrescription.medication.id,
      medication_dosage: samplePrescription.medication.dosage
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY
    }

    const {addPrescription: {id, patient: {nhi, name}}} = await graphqlRequest(query, variables, headers);
    // Add assertions to check the response
    patient_name = name;
    // patient_nhi = nhi;
    expect(id).toBeDefined();
    expect(name).toEqual(samplePrescription.patient.name);
  });

  it('should edit a prescription', async () => {
    const query = gql`
      mutation EditPrescription($nhi: String!, $patient_name: String!, $medication_id: String!, $medication_dosage: String!) {
        editPrescription(nhi: $nhi, patient_name: $patient_name, medication_id: $medication_id, medication_dosage: $medication_dosage) {
          id
          patient {
            nhi
            name
          }
          date
          medication {
            id
            dosage
          }
        }
      }
    `;
 

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY
  }

  const variables = {
    nhi: patient_nhi,
    patient_name: "Fury",
    medication_id: "2",
    medication_dosage: "20 mg",
  }

  const {editPrescription: {patient: {nhi, name}, medication }} = await graphqlRequest(query, variables, headers);
    // Add assertions to check the response
    const {dosage} = medication[medication.length - 1]; 
    expect(name).toEqual(variables.patient_name);
    expect(dosage).toEqual(variables.medication_dosage);

})

  // it('should add a project', async () => {
  //   const query = gql`
  //     mutation AddProject($name: String!, $description: String!, $status: ProjectStatus, $clientId: ID!) {
  //       addProject(name: $name, description: $description, status: $status, clientId: $clientId) {
  //         id
  //         name
  //         description
  //         status
  //         client {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     name: sampleProject.name,
  //     description: sampleProject.description,
  //     status: sampleProject.status,
  //     clientId: clientId,
  //   };

  //   const {addProject: {id, name}} = await graphqlRequest(query, variables);
  //   // Add assertions to check the response
  //   expect(id).toBeDefined();
  //   expect(name).toBe(sampleProject.name);
  // });

  // it('should delete a client', async () => {
  //   const query = gql`
  //     mutation DeleteClient($id: ID!) {
  //       deleteClient(id: $id) {
  //         id
  //         name
  //         email
  //         phone
  //       }
  //     }
  //   `;

  //   const variables = {
  //     id: clientId, // Replace with a valid client ID
  //   };

  //   const {deleteClient: {id}} = await graphqlRequest(query, variables);
  //   // Add assertions to check the response
  //   expect(id).toBe(clientId);
  // });

  // it('should edit a project', async () => {
  //   const query = gql`
  //     mutation EditProject($id: ID!, $name: String, $description: String, $status: ProjectStatusUpdate, $clientId: ID) {
  //       editProject(id: $id, name: $name, description: $description, status: $status, clientId: $clientId) {
  //         id
  //         name
  //         description
  //         status
  //       }
  //     }
  //   `;

  //   const variables = {
  //     id: 'replace-with-existing-project-id', // Replace with a valid project ID
  //     name: 'Updated Project Name',
  //     description: 'Updated Project Description',
  //     status: 'In Progress',
  //   };

  //   const response = await graphqlRequest(query, variables);
  //   // Add assertions to check the response
  // });
});


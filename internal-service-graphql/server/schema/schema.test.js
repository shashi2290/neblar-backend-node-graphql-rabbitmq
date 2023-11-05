// const { GraphQLEnumType } = require('graphql');
// const { request, gql } = require('graphql-request');
// const serverUrl = 'http://localhost:5000'; // Replace with your server URL

// // Define your GraphQL endpoint
// const endpoint = '/graphql';

// // Sample data for testing
// const sampleClient = {
//   name: 'Sample Client',
//   email: 'sample@example.com',
//   phone: '123-456-7890',
// };

// const sampleProject = {
//   name: 'Sample Project',
//   description: 'Sample Project Description',
//   status: 'new',
//   clientId: 'replace-with-existing-client-id', // Replace with a valid client ID
// };

// // GraphQL request function
// const graphqlRequest = (query, variables = {}) => {
//   return request(serverUrl + endpoint, query, variables);
// };

// describe('GraphQL Mutations', () => {
//   let clientId = null;
//   it('should add a client', async () => {
//     const query = gql`
//       mutation AddClient($name: String!, $email: String!, $phone: String!) {
//         addClient(name: $name, email: $email, phone: $phone) {
//           id
//           name
//           email
//           phone
//         }
//       }
//     `;

//     const variables = {
//       name: sampleClient.name,
//       email: sampleClient.email,
//       phone: sampleClient.phone,
//     };

//     const {addClient: {id, name}} = await graphqlRequest(query, variables);
//     // Add assertions to check the response
//     expect(id).toBeDefined();
//     expect(name).toBe(sampleClient.name);
//     clientId = id;
//   });

  

//   it('should add a project', async () => {
//     const query = gql`
//       mutation AddProject($name: String!, $description: String!, $status: ProjectStatus, $clientId: ID!) {
//         addProject(name: $name, description: $description, status: $status, clientId: $clientId) {
//           id
//           name
//           description
//           status
//           client {
//             id
//           }
//         }
//       }
//     `;

//     const variables = {
//       name: sampleProject.name,
//       description: sampleProject.description,
//       status: sampleProject.status,
//       clientId: clientId,
//     };

//     const {addProject: {id, name}} = await graphqlRequest(query, variables);
//     // Add assertions to check the response
//     expect(id).toBeDefined();
//     expect(name).toBe(sampleProject.name);
//   });

//   it('should delete a client', async () => {
//     const query = gql`
//       mutation DeleteClient($id: ID!) {
//         deleteClient(id: $id) {
//           id
//           name
//           email
//           phone
//         }
//       }
//     `;

//     const variables = {
//       id: clientId, // Replace with a valid client ID
//     };

//     const {deleteClient: {id}} = await graphqlRequest(query, variables);
//     // Add assertions to check the response
//     expect(id).toBe(clientId);
//   });

//   it('should edit a project', async () => {
//     const query = gql`
//       mutation EditProject($id: ID!, $name: String, $description: String, $status: ProjectStatusUpdate, $clientId: ID) {
//         editProject(id: $id, name: $name, description: $description, status: $status, clientId: $clientId) {
//           id
//           name
//           description
//           status
//         }
//       }
//     `;

//     const variables = {
//       id: 'replace-with-existing-project-id', // Replace with a valid project ID
//       name: 'Updated Project Name',
//       description: 'Updated Project Description',
//       status: 'In Progress',
//     };

//     const response = await graphqlRequest(query, variables);
//     // Add assertions to check the response
//   });
// });


### Services:
  1. Auth Service -JWT
  2. External API Service - Express Server
  3. Internal API Service - Express Graphql Server

![Shahi Kant - fury-coder](https://github.com/shashi2290/)
### Frameworks
  1. NodeJS - API server
  2. Graphql - Graph end points for internal-service
  3. RabbitMQ - AMQP server - Microservice communications
  4. JWT - Authentication
  5. Docker - Running RabbitMQ server locally

### Architectural Flowchart
![Shashi Kant - Flow Chart](https://i.ibb.co/55X2vdL/neblar-backend-drawio.png)

### Steps:
  1. Clone the repository

  2. Install dependencies with npm install
      - a. in the root folder
      - b. cd auth-service && npm install
      - c. cd external-api-service && npm install
      - d. cd internal-service-graphql && npm install

  3. Update the .env files with correct MONGO_URI to allow server to connect to Mongo db

  4. The API-KEY for internal-service is in the .env file inside the  internal-service-graphql folder

  5. cd auth-service && npm start - to start auth-service

  6. Register a user from POSTMAN 
      - path /register
      - port 7070 
      - payload as  { email, password, name }

  7. Use postman to hit login api to get jwt token
      - path /login
      - payload { email, password }

  8. Run Rabbit mq server using docker service
      - docker run -d --hostname my-rabbit --name some-rabbit rabbitmq

  9. Start both Internal(port:5000) and External Service
     cd into the folder and npm start - in both the services

  10. Using postman hit interval-service-api for crud operations
    - add Auth Bearer token as headers
    - http://localhost:5000/graphql - wont work as it will not be able to autheticate the api 
    - graphql sample query and mutations via graphql variables
    
  **NOTE** - if you wish to use http://localhost:5000/graphql then, remove isAuthenticated middleware from /internal-service-graphql/index.js (see - line 47)

    # mutation {
    #   addPrescription(patient_nhi: "xyz", patient_name: "test4", date: "24 Aug", medication_id: "1234", medication_dosage: "3 times a day") {
    #     patient {
    #       nhi
    #       name
    #     }
    #     medication{
    #       id
    #       dosage
    #     }
    #   }
    # }

    # {
    #   prescription(nhi: "123456789") {
    #     patient {
    #       name
    #       nhi
    #     }
    #   }
    # }

    # mutation {
    #   editPrescription(nhi: "xyz", patient_name: "mounika", medication_id: "abcd", medication_dosage: "6 times a day") {
    #     patient {
    #       nhi
    #       name
    #     }
    #     medication {
    #       id 
    #       dosage
    #     }
    #   }
    # }



  11. watch the sync update in the external db

  ### API Testing
    In the root folder in terminal, run "npm run test"
    - Note: The test in schema.test.js are for api testing, so an instance of the internal-service should be running to test the APIs

  ### Unit Tests
    Not Implement - Write separate test for each functions and test those functions



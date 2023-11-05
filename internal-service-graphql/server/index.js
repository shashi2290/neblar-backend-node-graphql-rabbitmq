const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const colors = require('colors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDb = require('./config/dbConnection');
const cors = require('cors');
const isAuthenticated = require('../../isAuthenticated');

const port = process.env.PORT || 5000;

const app = express();

// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       scriptSrc: ["'self'", "localhost:5000"],
//       styleSrc: null,
//       unsafeInline: null
//     }
//   }
// }));

app.use(cors( {
  origin: 'http://localhost:3000',
}));

app.use((req, res, next) => {
  // console.log('req-headers', req.headers);
  // if (req.headers['user-agent'].includes('PostmanRuntime')) {
  //     res.status(403).send('Postman is not allowed to access this API.');
  //     return;
  // }

  if(req.headers['x-api-key'] !== process.env.API_KEY) {
    res.status(403).send('Request is not authenticated');
    return;
  }

  next();
});

// connect to db
connectDb();

app.use('/graphql',isAuthenticated , graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development',
}))

app.listen(port, console.log(`Server running on port ${port}`))
// write an express server
const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const amqp = require("amqplib");
const sync = require("./syncService");
require("dotenv").config();


var channel, connection;
const PORT = process.env.PORT_ONE || 6060;
const app = express();
app.use(express.json());

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
  console.log(`external MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
}
connectDb();

async function connectRabbitMq() {
  connection = await amqp.connect(process.env.RABBIT_MQ_URI);
  channel = await connection.createChannel();
  await channel.assertQueue("EXTERNAL");
  return channel;
}

connectRabbitMq().then(() => {
  channel.consume("EXTERNAL", (msg) => {
    const message = JSON.parse(msg.content);
    console.log("message", message)
    // // const { actionType, data } = message;
    sync(message).then(data => {
      console.log(data.message)
      channel.sendToQueue("INTERNAL", Buffer.from(JSON.stringify(data)));
    });
    channel.ack(msg);
  })
});


app.listen(PORT, () => {
  console.log(`EXTERNAL-API-Service at ${PORT}`);
})

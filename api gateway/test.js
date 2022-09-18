const amqp = require("amqplib");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const EventEmitter = require("events").EventEmitter;
emitter = new EventEmitter();

var connection, channel;

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("clientResponse","clientRequest",{durable : false});
}

app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(bodyParser.json());



connect().then(async () => {


    app.post("/api/phone",(req, res) => {

let helloMessage = emitter.emit("sayHello", a);
        console.log(helloMessage); // It should output: "Hello World"
        res.send(helloMessage);


});




});
        setTimeout(() => { 


       
        });

        emitter.on("sayHello", function(message) {
            return message + " World";
        },"hello");
        







    
    app.listen(8080);
    console.log("test listening on 8080");
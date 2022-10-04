const amqp = require("amqplib");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const events = require("events");
const eventEmitter = new events.EventEmitter();

var connection, channel,q;

async function connect() {

    //amqp://guest:guest@rabbitmq:5672/
    //amqp://172.20.0.6:5672
    const amqpServer = "amqp://172.20.0.6:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertExchange("clientResponse", 'fanout', {durable : false});
    q = await channel.assertQueue('', {exclusive : true});
    await channel.bindQueue(q.queue, "clientResponse");
    await channel.assertQueue("clientRequest", {durable : false});
}

app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(bodyParser.json());

connect().then(async () => {

  function wait (time){
  return new Promise((resolve,reject)=>{
      setTimeout(function(){
          resolve()
      },time)
  })
}

channel.consume(q.queue, async function(msg) {
            
  const value = await JSON.parse(msg.content.toString()); 
  //console.log(value);  
      
    eventEmitter.emit('response', value);

  channel.ack(msg);            

}); 

    app.post("/api/phone", async (req, res) => {

        let uuid = uuidv4();

        const data = {
            action: req.body.action,
            params: req.body.params,
            id: uuid
        }; 


        function myEventHandler (value) {

          if(value.id === uuid) {
            
          eventEmitter.removeListener('response', myEventHandler);

            res.send(value.resultStack);
            res.end();
            console.log("isWorking :)");

          }

         }

         eventEmitter.on('response', myEventHandler);

            channel.sendToQueue("clientRequest", Buffer.from(JSON.stringify(data)));
            console.log("mesaj yollandı");

        });

});

    app.listen(8080);
    console.log("api listening on 8080");
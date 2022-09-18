const amqp = require('amqplib');
var connection, channel;

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("clientResponse","clientRequest",{durable : false});
}

const data = {
    action: "getPhoneById",
    params: {_id: "62f5fbccfd0e520f68e290c4", tckn: "121543543564", name:"test", phoneNumber:"1231654"}
}; 
              
connect().then(async () => {    

    channel.sendToQueue("clientRequest", Buffer.from(JSON.stringify(data)));
    console.log("mesaj yollandı");

    channel.consume("clientResponse", async function(msg) {
        
         let data = JSON.parse(msg.content.toString()); 
         console.log(data);   
         channel.ack(msg);

    }); 
   
})   
     
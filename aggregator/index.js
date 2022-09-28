const amqp = require('amqplib');
const routeConfig = require("./route-config.json");

var connection, channel;

async function connect() {
    const amqpServer = "amqp://172.20.0.6:5672";
     connection = await amqp.connect(amqpServer);
     channel = await connection.createChannel();
     await channel.assertQueue("clientRequest", {durable : false});
     await channel.assertQueue("aggregator", {durable : false});
     await channel.assertExchange("clientResponse", 'fanout', {durable : false})

}

connect().then(async () => {

    channel.consume("clientRequest", async function(msg) {
        
        let data = JSON.parse(msg.content.toString());
        
      const route = routeConfig[data.action].actionRoute;
        
        const test = {
        action: data.action,
        routeIndex: 0,
        params: data.params,
        id: data.id,
        resultStack: {}
        }
      
        channel.sendToQueue(route[0], Buffer.from(JSON.stringify(test)));

        channel.consume("aggregator", async function(msg) {

        
        
            let data = JSON.parse(msg.content.toString());
            const route = routeConfig[data.action].actionRoute;

                 if(data.routeIndex < routeConfig[data.action].actionRoute.length) {

                   channel.sendToQueue(route[data.routeIndex], Buffer.from(JSON.stringify({
                    action: data.action,
                    routeIndex: data.routeIndex,
                    params: data.params,
                    id: data.id, 
                    resultStack: data.resultStack
                })));


                 } else{

                    channel.publish("clientResponse", '', Buffer.from(JSON.stringify(data)));
                    
                 }
                    

              channel.ack(msg);
        });

        channel.ack(msg);
    });

})

console.log("Aggregator listening");
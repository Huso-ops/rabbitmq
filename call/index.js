const amqp = require('amqplib');
const callService = require('./domain/call-service');

var connection, channel;

 async function call () {

  const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();

    const ActionArr = _getFunctionList(callService);

    for(let i = 0; i < ActionArr.length; i++){

    await channel.assertQueue("call." + ActionArr[i],"aggregator");
    await channel.consume("call." + ActionArr[i], async function(msg) {
             
      let data = JSON.parse(msg.content.toString()); 

       const result = await callService[ActionArr[i]](data);

       if(result) {

       data.resultStack[ActionArr[i] + "Result"] = result;
       }
 
      await channel.sendToQueue("aggregator", Buffer.from(JSON.stringify({

       action: data.action,
       routeIndex: data.routeIndex + 1,
       params: data.params,
       id: data.id, 
       resultStack: data.resultStack
 
     })));

 channel.ack(msg);

   });

    }

 console.log("Call listening");

 }

 function _getFunctionList(classObject) {

  const props = [];

  let obj = classObject;

  do {

      props.push(...Object.getOwnPropertyNames(obj));

  } while (obj = Object.getPrototypeOf(obj));

  const ignoredFunctionList = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];

  return props.sort().filter((functionName, i, functionNameList) => {

      return functionName !== functionNameList[i + 1] &&
          typeof classObject[functionName] === "function" &&
          functionName.substring(0, 1) !== "_" &&
          ignoredFunctionList.indexOf(functionName) === -1;
  });
}

 
module.exports = call();
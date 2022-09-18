const routeConfig = require("./route-config.json");


const stop = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            resolve()
        });
    },3000)
}

const rm = function(message){


     consume(message);

   
}

const run = function (request) {

    for (let i = 0; i<routeConfig[request.action].actionRoute.length; i++) {

        console.log(routeConfig[request.action].actionRoute[i]);

    rm({
        action:request.action,
        routeIndex:i,
        params:request.params.number,
        resultStack:{}
    });

    }

};

 const consume = function(message) {

    const msg = {
        action:message.action,
        routeIndex:message.routeIndex, 
        params:message.params,
        resultStack:message.resultStack
    };


    console.log(msg);
  
}

run({ action: "insertCall", params: { number: "12345" } });






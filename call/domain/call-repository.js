const mongojs = require("mongojs");
const url = "mongodb+srv://huso:3rcGPzoUA6UR6sSi@nestjs.77vms.mongodb.net/redis?retryWrites=true&w=majority";
const {MongoClient} = require("mongodb");
const client = new MongoClient(url);


module.exports = new class CallRepository {

    constructor(){
    
    }

    async add(
      _id,
      name,
      phoneNumber
      ) {
      
      const db = client.db("redis");
      let collection = db.collection("call");
      await collection.insertOne({
        phoneId: _id,
        name: name,
        number: phoneNumber,
        createdAt : new Date(),
      });
  
    }
    
     async getCall(){
    
        const db = client.db("redis");
        let collection = db.collection("call");
        let call = await collection.find({});
        
        return call.toArray();
        
      }
    
      async getCallById(req){
    
        const db = client.db("redis");
        let collection = db.collection("call");
        let call = await collection.findOne({_id: mongojs.ObjectID(req)});
    
        return call;
    
      }
    
      async getCallByPhoneId(req){
    
        const db = client.db("redis");
        let collection = db.collection("call");
        let call = await collection.find({phoneId: req}).toArray();
    
        return call;
    
      }
    
      async deleteCall(req) {
    
        await client.connect();
        const db = client.db("redis");
        let collection = db.collection("call");
        await collection.deleteOne({_id: mongojs.ObjectID(req)});
 
    
      }
    
    };
    
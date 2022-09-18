const mongojs = require("mongojs");
const dotenv = require("dotenv");
dotenv.config();
const url = "mongodb+srv://huso:3rcGPzoUA6UR6sSi@nestjs.77vms.mongodb.net/redis?retryWrites=true&w=majority";
const collection = ["phone2","call"];
const {MongoClient} = require("mongodb");
const client = new MongoClient(url);


module.exports = new class PhoneRepository {

constructor(){

}

  async add(
    
    tckn,
    name,
    phoneNumber,
    email,
    birthDay,
    isMarried,
    kidsNumber,
    city,
    district,
    neighbourhood,
    street,
    last_call_datetime
  ) {  

      const db = client.db("redis");

      let collection = db.collection("phone2");
      
      await collection.insertOne({
      tckn: tckn,
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      birthDay: birthDay,
      isMarried: isMarried,
      kidsNumber: kidsNumber,
      city: city,
      district: district,
      neighbourhood: neighbourhood,
      street: street,
      last_call_datetime: last_call_datetime,
      createdAt : new Date(),
    });
   
  }

  async getList() {
 
    await client.connect();

    const db = client.db("redis");
    let collection = db.collection("phone2");
    let phone = await collection.find({});

    return phone.toArray();

  }


  async getPhoneById(req){

    const db = client.db("redis");
    let collection = db.collection("phone2");
    let entity = await collection.findOne({_id: mongojs.ObjectID(req)});
  
    return entity;
 
  }


  async update(req) {

    const db = client.db("redis");
    let collection = db.collection("phone2");
    await collection.updateOne(    
    {_id: mongojs.ObjectID(req.params._id)} ,
    { $set:
      { 
        name: req.params.name,
        phoneNumber : req.params.phoneNumber,
        email : req.params.email,
        birthDay: req.params.birthDay,
        isMarried: req.params.isMarried,
        kidsNumber: req.params.kidsNumber,
        city: req.params.city,
        district: req.params.district,
        neighbourhood: req.params.neighbourhood,
        street: req.params.street,     
 }
},);

  }

  async deletePhone(req) {

    const db = client.db("redis");
    let collection = db.collection("phone2");
    await collection.deleteOne({_id: mongojs.ObjectID(req)});

  
    }


    async updateCallPhone(req, max){

      const db = client.db("redis");
      let collection = db.collection("phone2");
      await collection.updateOne(    
      {_id: mongojs.ObjectID(req)} ,
      { $set:
        { 
          last_call_datetime : max
   }
  });
  
    }
  


};
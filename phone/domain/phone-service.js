const repository = require("./phone-repository");
const amqp = require('amqplib');

module.exports = new class PhoneService {

    constructor(){



    }


       wait (time){
      return new Promise((resolve,reject)=>{
          setTimeout(function(){
              resolve()
          },time)
      })
  }


      async addPhone(req){  

      await repository.add(

            req.params.tckn,
            req.params.name,
            req.params.phoneNumber,
            req.params.email,
            req.params.birthDay,
            req.params.isMarried,
            req.params.kidsNumber,
            req.params.city,
            req.params.district,
            req.params.neighbourhood,
            req.params.street, 
            req.params.last_call_datetime

        );
   
      }

      async getPhone () {

      await this.wait(5000);

      return repository.getList();
      
      }

      async getPhoneById(req) {

        //await this.wait(5000);

        if(req.action === "deleteCall") {

          return repository.getPhoneById(req.resultStack.getCallByIdResult.phoneId);

        }else {

          return repository.getPhoneById(req.params._id);

        }    

      }
  
      async updatePhone(req) {

       await repository.update(req);

      }

      async deletePhone(req) {

        await repository.deletePhone(req.params._id);
      }

      async updateCallPhone(req) {

      const id = req.resultStack.getPhoneByIdResult._id;

      let value = req.resultStack.getCallByPhoneIdResult.map(a => a.phoneId);
      let maxDate = "";

      if(value[0]) {

      maxDate = new Date(Math.max( ...req.resultStack.getCallByPhoneIdResult.map(a => {return new Date(a.createdAt)})));

      }

      await repository.updateCallPhone(id, maxDate);

      }

    };

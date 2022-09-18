const repository = require("./call-repository");

module.exports = new class CallService {

    constructor(){
    
        
    }

    wait (time){
      return new Promise((resolve,reject)=>{
          setTimeout(function(){
              resolve()
          },time)
      })
  }

    
     async addCall(req) {

      await repository.add(req.resultStack.getPhoneByIdResult._id, req.resultStack.getPhoneByIdResult.name, req.resultStack.getPhoneByIdResult.phoneNumber);
        
      }

      async getCall(req) {
        
      //await this.wait(5000);

      const calls = await repository.getCall();

      if(!calls){
        throw new Error("Not Found");
       }

       return calls;
 
      }

      async deleteCall(req){

      await repository.deleteCall(req.resultStack.getCallByIdResult._id);
   
      }

      async getCallById(req){

        //await this.wait(5000);

        return await repository.getCallById(req.params._id);
      }

      async getCallByPhoneId(req){
 
        return repository.getCallByPhoneId(req.resultStack.getPhoneByIdResult._id);

      }

    };
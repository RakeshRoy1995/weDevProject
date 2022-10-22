
var ObjectId = require('MongoDb').ObjectId; 
import { Response } from 'express';
const MongoDb = require("./db");

// constructor
const Admin = function() {
};


Admin.create = async(type:any,data:Response, result: (arg0: any, arg1: any) => void ) => {

  let res = await MongoDb.doRequest("shop", "tags")
  let x = { ...data }
  
  
  res.insertOne(x , function name(error:Response, response:Response) {
    if (error) {
      result(null, error);
    } else{
      result(0, true);
    }
  })
  
};


Admin.createStore = async(type:any,data:Response, result: (arg0: any, arg1: any) => void ) => {

  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }
  let res = await MongoDb.doRequest("shop", table)
  
  res.insertOne(data , function name(error:Response, response:Response) {
    if (error) {
      result(null, error);
    } else{
      result(0, true);
    }
  })
  
};


Admin.findById = async(type:any ,id:Response, result:(arg0: any, arg1: any) => void) => {

  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }

  let res = await MongoDb.doRequest("shop", table)
  res.find({ _id: ObjectId(id)  }).toArray(function (error:Response, resolve:any) {
      if (error) {
        result(1, error);
        return;
      }
      result(0, resolve);
  });
};

Admin.findByIdTag = async(type:any ,id:Response, result:(arg0: any, arg1: any) => void) => {

  let res = await MongoDb.doRequest("shop", "tags")
  res.find({ _id: ObjectId(id)  }).toArray(function (error:Response, resolve:any) {
      if (error) {
        result(1, error);
        return;
      }
      result(0, resolve);
  });
};

Admin.getAllTags = async (type:string , result:(arg0: any, arg1: any) => void) => {
  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }
  let res = await MongoDb.doRequest("shop", "tags")
  res.find().toArray(function (error:any, resolve:any) {
      if (error) {
        result(null, error);
        return;
      }

      result(null, resolve);
  });
};

Admin.getAll = async (type:string , result:(arg0: any, arg1: any) => void) => {
  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }
  let res = await MongoDb.doRequest("shop", table)
  res.find().toArray(function (error:any, resolve:any) {
      if (error) {
        result(null, error);
        return;
      }

      result(null, resolve);
  });
};


Admin.updateByIdTag = async(type:string , id:number, data: {} | [] , result:(arg0: any, arg1: any) => void    ) => {

  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }

  var Item = {_id : ObjectId(id)  } 

  let updateData = {
    $set : data
  }

  console.log("updateData" , updateData);
  

  let res = await MongoDb.doRequest("shop", "tags")
  res.updateOne(Item , updateData , function name(error:any, response:{} | []) {
    if (error) {
      result(null, error);
    } else{
      result(null, true);
    }
  })
};


Admin.updateById = async(type:string , id:number, data: {} | [] , result:(arg0: any, arg1: any) => void    ) => {

  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }

  var Item = {_id : ObjectId(id)  } 

  let updateData = {
    $set : data
  }

  let res = await MongoDb.doRequest("shop", table)
  res.updateOne(Item , updateData , function name(error:any, response:{} | []) {
    if (error) {
      result(null, error);
    } else{
      result(null, true);
    }
  })
};



Admin.change_order = async(data: any , result:(arg0: any, arg1: any) => void    ) => {

  var Item = {order_id : parseInt(data.order_id) } 

  let updateData = {
    $set : {status:data.val}
  }

  let res = await MongoDb.doRequest("shop", "orders")
  res.updateOne(Item , updateData , function name(error:any, response:{} | []) {
    if (error) {
      result(null, error);
    } else{
      result(null, true);
    }
  })
};

Admin.removeTag = async(type:string , id:number, result:(arg0: any, arg1: any) => void ) => {

  let res = await MongoDb.doRequest("shop", type)

  
  

  var deleteItem = {_id : ObjectId(id)  } 
    res.deleteOne(deleteItem , function name(error:any, response: any ) {
        if (error) {
          result(null, error);
        } else if(response.deletedCount==1) {
          result(null, response);
        }else{
          result({ kind: "not_found" }, null);
        }
    })

};


Admin.remove = async(type:string , id:number, result:(arg0: any, arg1: any) => void ) => {

  let table = ""
  if(type == "variant"){
    table = "variant"
  }else{
    table = "products"
  }

  let res = await MongoDb.doRequest("shop", table)

  var deleteItem = {_id : ObjectId(id)  } 
    res.deleteOne(deleteItem , function name(error:any, response: any ) {
        if (error) {
          result(null, error);
        } else if(response.deletedCount==1) {
          result(null, response);
        }else{
          result({ kind: "not_found" }, null);
        }
    })

};



Admin.user_order = async(result:(arg0: any, arg1: any) => void) => {
  // let res_user = await MongoDb.doRequest("shop", "users")
  let res_order_singel = await MongoDb.doRequest("shop", "orders")
  let res_order_details = await MongoDb.doRequest("shop", "orders_details")

  res_order_singel.find().toArray(function (error:Response, resolve:any) {
    if (error) {
      result(true, error);
      return;
    }
    let orderID = resolve.map((collection:any, key:any)=>{
        return collection.order_id
    })

    res_order_details.find({ order_id: {$in : orderID } }).toArray(function (error:Response, resolve_order:any) {
      if (error) {
        result(true, error);
        return;
      }

      let orders = resolve.map((collection:any, key:any)=>{
          return resolve_order.map((info:any, key_:any)=>{
            if (collection.order_id == info.order_id ) {
              let temporary : any= {}
              temporary.under_order = info
              temporary.order = collection
              return temporary
            }
          })
      })
      result(null, orders);
    });
  });









  // res_user.find({ p_key: parseInt(data.token) }).toArray(function (error:Response, resolve_user:any) {
  //   if (error) {
  //     result(1, error);
  //     return;
  //   }
  //   if (resolve_user.length) {
  //     res_order_singel.find({ user_pk_id: parseInt(data.token) }).toArray(function (error:Response, resolve:any) {
  //       if (error) {
  //         result(true, error);
  //         return;
  //       }
  //       let orderID = resolve.map((collection:any, key:any)=>{
  //           return collection.order_id
  //       })

  //       res_order_details.find({ order_id: {$in : orderID } }).toArray(function (error:Response, resolve_order:any) {
  //         if (error) {
  //           result(true, error);
  //           return;
  //         }

  //         let orders = resolve.map((collection:any, key:any)=>{
  //             return resolve_order.map((info:any, key_:any)=>{
  //               if (collection.order_id == info.order_id ) {
  //                 let temporary : any= {}
  //                 temporary.under_order = info
  //                 temporary.order = collection
  //                 temporary.user = resolve_user
  //                 return temporary
  //               }
  //             })
  //         })
  //         result(null, orders);
  //       });
  //     });
  //   }else{
  //     result({ kind: "login_failed" }, resolve_user);
  //   }

  // });
};


export = Admin;

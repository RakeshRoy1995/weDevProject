
var ObjectId = require('MongoDb').ObjectId; 
import { Response } from 'express';
const MongoDb = require("./db");
var nodemailer = require('nodemailer');
require('dotenv').config()

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_HOST,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

// constructor
const Admin = function() {
};


Admin.registration = async(type:any,data:any, result: (arg0: any, arg1: any) => void ) => {

  // result(null, data);
  let res = await MongoDb.doRequest("shop", "users")

  res.find({ email: data.email }).toArray(function (error:Response, resolve:any) {
      if (error) {
        result(1, error);
        return;
      }

      if (resolve.length != 0) {
        result({ kind: "Email_unique" }, {message:"Email is taaken"});
      } else {
        res.insertOne(data , function name(error:Response, response:Response) {
          if (error) {
            result(null, error);
          } else{
            result(0, {name:data.name , email:data.email,token:data.p_key});
          }
        })
      }
  });
  
};






Admin.login = async(type:any,data:any, result: (arg0: any, arg1: any) => void ) => {

  // result(null, data);
  let res = await MongoDb.doRequest("shop", "users")
  res.find({ email: data.email, password: data.password }).toArray(function (error:Response, resolve:any) {
      if (error) {
        result(1, error);
        return;
      }
      if (resolve.length == 0) {
        result({ kind: "failed" }, null);
      } else {
        result(null, resolve);
      }
  });
  
};




Admin.product_order = async(type:any,data:any, result: (arg0: any, arg1: any) => void ) => {

  let res = await MongoDb.doRequest("shop", "products")
  let res_orders = await MongoDb.doRequest("shop", "orders_details")
  let res_order_singel = await MongoDb.doRequest("shop", "orders")
  let datas = JSON.parse(data.data)
  let updateProduct = true

  let order_id = new Date().getTime()
  let date = new Date()
  let user_pk_id = parseInt(data.p_key) 

  let updateData:any = []
  datas.map((collection:any,key:any)=>{

    res.find({ p_key: collection.p_key }).toArray(async function (error:Response, resolve:any) {
      if (error) {
        result(1, error);
        return;
      }

      if ( parseInt(resolve[0].qty) <0 ) {
        updateProduct = false
        result({ kind: "quantity_stock_out" }, resolve[0]);
        return;
        
      }else{
        resolve[0].order_id = order_id
        resolve[0].date = date
        resolve[0].user_pk_id = user_pk_id
        delete resolve[0]._id
        updateData.push(resolve[0])
      }

      if(updateProduct && (datas.length == updateData.length)  ){
        

        updateData.map((up_data:any , key_:any)=>{
          var Item = {_id : ObjectId(up_data._id)  } 
          let qty = parseInt(up_data.qty) - 1
          let upProductData = {
            $set : {qty : qty}
          }

          res.updateOne(Item , upProductData , function name(error:any, response:{} | []) {
            if (error) {
              result(1, error);
            } 
          })
        })

        res_orders.insertMany( updateData, function name(error:any, response:{} | []) {
          if (error) {
            
            result(null, error);
          } else{
            
            let order:any = {}
            order.order_id = order_id
            order.status = "Processing"
            order.user_pk_id = user_pk_id

            res_order_singel.insert( order,  async function name(error:any, response:{} | []) {
              if (error) {
                result(null, error);
              } else{
                await transporter.sendMail({
                  from: process.env.MAIL_FROM, // sender address
                  to: process.env.MAIL_TO, // list of receivers
                  subject: "New Order Place", // Subject line
                  text: "New Order Place", // plain text body
                  html: "New Order Place", // html body
                });
                result(null, true);
              }
            })
          }
        })
      }
    });
  })
};


Admin.user_order = async(type:any ,data:any, result:(arg0: any, arg1: any) => void) => {
  let res_user = await MongoDb.doRequest("shop", "users")
  let res_order_singel = await MongoDb.doRequest("shop", "orders")
  let res_order_details = await MongoDb.doRequest("shop", "orders_details")

  res_user.find({ p_key: parseInt(data.token) }).toArray(function (error:Response, resolve_user:any) {
    if (error) {
      result(1, error);
      return;
    }
    if (resolve_user.length) {
      res_order_singel.find({ user_pk_id: parseInt(data.token) }).toArray(function (error:Response, resolve:any) {
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
                  temporary.user = resolve_user
                  return temporary
                }
              })
          })
          result(null, orders);
        });
      });
    }else{
      result({ kind: "login_failed" }, resolve_user);
    }

  });
};




Admin.check_auth = async(type:any ,data:any, result:(arg0: any, arg1: any) => void) => {
  let res_user = await MongoDb.doRequest("shop", "users")
  res_user.find({ p_key: parseInt(data.token) }).toArray(function (error:Response, resolve_user:any) {
    if (error) {
      result(1, error);
      return;
    }
    if (resolve_user.length == 0) {
      
    }else{
      result({ kind: "login_failed" }, resolve_user);
    }

  });
};









export = Admin;

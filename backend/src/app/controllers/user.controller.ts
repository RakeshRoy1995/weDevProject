import Admin from "../models/user.model"
const AdminController   = function() {
};
// Create and Save a new product
AdminController.registration = (req: any, res: any) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let icon = req.query.type == "variant" ? "" : req.files.image.path.replace('files', '');
  icon = icon.replace(/[&\/\\#]/g, '');
  if (req.query.type) {
    req.body.p_key = new Date().getTime()
  }else{
    req.body.image = icon
    req.body.p_key = new Date().getTime()
  }

  // Save Data in the database
  Admin.registration(req.query.type , req.body, (err: any, data :{}) => {
    if (err){
      if (err.kind === "Email_unique") {
        res.status(500).send({
          message: "Registration Failed. Email has been taken before"
        });
      } else {
        res.status(500).send({
          message: "Something went wrong"
        });
      }
    }
    else res.send(data);
  });
};




AdminController.login = (req: any, res: any) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save Data in the database
  Admin.login(req.query.type , req.body, (err: any, data :{}) => {
    if (err){
      if (err.kind === "failed") {
        res.status(500).send({
          message: "Wrong Password or email"
        });
      } else {
        res.status(500).send({
          message: "Something went wrong"
        });
      }
    }
    else res.send(data);
  });
};



AdminController.product_order = (req: any, res: any) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save Data in the database
  Admin.product_order(req.query.type , req.body, (err: any, data :{}) => {
    if (err){
      if (err.kind === "quantity_stock_out") {
        res.status(500).send(data);
      } else {
        res.status(500).send({
          message: "Something went wrong"
        });
      }
    }
    else res.send(data);
  });
};

AdminController.user_order = (req: any, res: any) => {
  Admin.user_order(req.query.type , req.body, (err:any, data : any) => {
    if (err) {
      if (err.kind === "login_failed") {
        res.status(500).send({message:"Login Failed"});
      } else {
        res.status(500).send({
          message: "Something went wrong"
        });
      }
    } else res.send(data);
  });
};

AdminController.check_auth = (req: any, res: any) => {
  Admin.check_auth(req.query.type , req.body, (err:any, data : any) => {
    if (err) {
      if (err.kind === "login_failed") {
        res.status(500).send({message:"Login Failed"});
      } else {
        res.status(500).send({
          message: "Something went wrong"
        });
      }
    } else res.send(data);
  });
};














export = AdminController;

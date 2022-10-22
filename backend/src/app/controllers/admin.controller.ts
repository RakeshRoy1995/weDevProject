import Admin from "../models/admin.model"
const AdminController   = function() {
};
// Create and Save a new product
AdminController.create = (req: any, res: any) => {
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
    req.body.image = icon
  }else{
    req.body.image = icon
    req.body.p_key = new Date().getTime()
  }

  // Save Data in the database
  Admin.createStore(req.query.type , req.body, (err: {message : ""}, data :{}) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    else res.send(data);
  });
};




AdminController.tagCreate = (req: any, res: any) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save Data in the database
  Admin.create(req.query.type , req.body, (err: {message : ""}, data :{}) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    else res.send(data);
  });
};


AdminController.findAllTags = (req: any, res: any) => {
  Admin.getAllTags(req.query.type , (err:any, data : any) => {
    if (err)
      res.status(500).send({
        message: "Some error occurred while retrieving Data."
      });
    else res.send(data);
  });
};




// Retrieve all Data from the database (with condition).
AdminController.findAll = (req: any, res: any) => {
  Admin.getAll(req.query.type , (err:any, data : any) => {
    if (err)
      res.status(500).send({
        message: "Some error occurred while retrieving Data."
      });
    else res.send(data);
  });
};

// Find a single product by Id
AdminController.findOne = (req: any, res: any) => {
  Admin.findById(req.query.type , req.params.id, (err:any, data : any) => {
    if (err) {
      res.status(404).send({
        message: `Not found Product with id ${req.params.id}.`
      });
    } else res.send(data);
  });
};

AdminController.findOneTag = (req: any, res: any) => {
  Admin.findByIdTag(req.query.type , req.params.id, (err:any, data : any) => {
    if (err) {
      res.status(404).send({
        message: `Not found Product with id ${req.params.id}.`
      });
    } else res.send(data);
  });
};


AdminController.updateTag = (req: any, res: any) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Admin.updateByIdTag(req.query.type,
    req.params.id, req.body,
    (err:any, data : any) => {
      if (err) {
        res.status(500).send({
          message: "Error updating product with id " + req.params.id
        });
      } else res.send(data);
    }
  );
};


// Update a product identified by the id in the request
AdminController.update = (req: any, res: any) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (req.files.image && req.files.image.size) {
    let icon = req?.files?.image?.path?.replace('files', '');
    icon = icon.replace(/[&\/\\#]/g, '');
    req.body.image = icon
  }

  Admin.updateById(req.query.type,
    req.params.id, req.body,
    (err:any, data : any) => {
      if (err) {
        res.status(500).send({
          message: "Error updating product with id " + req.params.id
        });
      } else res.send(data);
    }
  );
};

// Delete a data with the specified id in the request
AdminController.delete = (req: any, res: any) => {
  Admin.remove(req.query.type,req.params.id, (err:any, data : any) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete  with id " + req.params.id
      });
    } else res.send({ message: `deleted successfully!` });
  });
};

AdminController.deleteTag = (req: any, res: any) => {

  console.log("type" , req.query.type , req.params.id);
  Admin.removeTag(req.query.type,req.params.id, (err:any, data : any) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete  with id " + req.params.id
      });
    } else res.send({ message: `deleted successfully!` });
  });
};


AdminController.user_order = (req: any, res: any) => {
  Admin.user_order( (err:any, data : any) => {
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



AdminController.change_order = (req: any, res: any) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Admin.change_order(req.body,
    (err:any, data : any) => {
      if (err) {
        res.status(500).send({
          message: "Error updating product with id " + req.params.id
        });
      } else res.send(data);
    }
  );
};

export = AdminController;

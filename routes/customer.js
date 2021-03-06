const express = require("express");
var mongodb = require('mongodb');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const customerRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

// CUSTOMER CRAETE ACCOUNT // (FC1)
customerRoutes.route("/cust/signup").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    // console.log(req)
    if(req.body.customer_password == req.body.password_verification){
        console.log("verifikasi password berhasil");
        let new_account = {
            customer_email: req.body.customer_email,
            customer_password: req.body.customer_password,
            profile:{
                name: req.body.profile.name,
                prof_pic: req.body.profile.prof_pic,
                phone_number: req.body.profile.phone_number,
                gender: req.body.profile.gender,
                birth_of_date: req.body.profile.birth_of_date
            },
            signUp_date: new Date(),
            blocked: req.body.blocked
        };

        try{
            db_connect.collection("DataCustomer").insertOne(new_account);
            res.status(201).json({
            message: "Succesfully inserted",
            new_account
        });
        }catch(err){
            console.log(err);
        }
    }else{
        res.status(401).json({
            message: "Unsuccesful",
        });
    }
});
//CUSTOMER READ DATA SENDIRI (FC6)
customerRoutes.route("/cust/read/account/:id").get(function(req, res){
    let db_connect = dbo.getDb("employees");
    let id_account = { _id : new mongodb.ObjectID(req.params.id)}
    db_connect.collection("DataCustomer").find(id_account).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    //    console.log(result);
    });
});

  
// CUSTOMER UPDATE ACCOUNT // (FC2)
customerRoutes.route("/cust/update/account/:id").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    let id_account = { _id : new mongodb.ObjectID(req.params.id)}
    let new_values = {
        $set: {
        customer_email: req.body.customer_email,
        customer_password: req.body.customer_password,
        profile:{
            name: req.body.profile.name,
            prof_pic: req.body.profile.prof_pic,
            phone_number: req.body.profile.phone_number,
            gender: req.body.profile.gender,
            birth_of_date: new Date(req.body.profile.birth_of_date)
        }
        }
    };  
        db_connect.collection("DataCustomer").updateOne(id_account, new_values, function (err, result){
            if (err) throw err;
            res.status(201).json({
                message: "Succesfully updated",
                result
        });
    });
});

// CUSTOMER CREATE ORDER // (FR1)
customerRoutes.route("/cust/create/order/transportasi").post(function (req, res) {
    let db_connect = dbo.getDb("On-Demand");

    var id_driver = "";
    if(req.body.type_of_service == "transportasi motor"){
        var myquery = { active_status: true , verification_status: true, "vehicle_details.transportation_type": "Motorcycle"};
    }else{
        var myquery = { active_status: true , verification_status: true, "vehicle_details.transportation_type": "Car"};
    }
    

    db_connect
    .collection("DataDriver")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      let selected = Math.floor(Math.random() * result.length);
      id_driver = result[selected]._id; 

      let new_order = {
        id_driver: id_driver.toHexString(),
        id_customer: req.body.id_customer,
        date: new Date(),
        type_of_service: req.body.type_of_service,
        start_loc: {
            longitude: req.body.start_loc.longitude,
            latitude: req.body.start_loc.latitude
        },
        end_loc: {
            longitude: req.body.end_loc.longitude,
            latitude: req.body.end_loc.latitude
        },
        activity_status: "new order",
        price: req.body.price
    };

    try{
        db_connect.collection("ActivityHistory").insertOne(new_order);
        res.status(201).json({
        message: "Succesfully inserted",
        new_order
    });
    }catch(err){
        console.log(err);
    }

    });
});

customerRoutes.route("/cust/create/order/antarbarang").post(function (req, res) {
    let db_connect = dbo.getDb("On-Demand");

    let id_driver = "";
    let length = 0;
    var myquery = { active_status: true , verification_status: true, "vehicle_details.transportation_type": "Motorcycle"};

    db_connect
    .collection("DataDriver")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      let selected = Math.floor(Math.random() * result.length);
      id_driver = result[selected]._id; 

      let new_order = {
        id_driver: id_driver,
        id_customer:req.body.id_customer,
        item_detail: {
            id_item:new mongodb.ObjectID(),
            weight: req.body.item_detail.weight,
            type: req.body.item_detail.type,
            delivery_instruction: req.body.item_detail.delivery_instruction
        },
        recipient_detail: {
            id_recepient: new mongodb.ObjectID(),
            recipient_name: req.body.recipient_detail.recipient_name,
            recipient_phone_number: req.body.recipient_detail.recipient_phone_number
        },
        date: new Date(),
        type_of_service: 'Antar Barang',
        start_loc: {
            longitude: req.body.start_loc.longitude,
            latitude: req.body.start_loc.latitude
        },
        end_loc: {
            longitude: req.body.end_loc.longitude,
            latitude: req.body.end_loc.latitude
        },
        activity_status: "new order",
        price: req.body.price
    };

    try{
        db_connect.collection("ActivityHistory").insertOne(new_order);
        res.status(201).json({
        message: "Succesfully inserted",
        new_order
    });
    }catch(err){
        console.log(err);
    }


    });

    

    
});


// CUSTOMER READ 1 ORDER // (FR4)
customerRoutes.route("/cust/read/order/:id").get(function (req, res) {
    let db_connect = dbo.getDb("On-Demand");
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    db_connect
        .collection("ActivityHistory")
        .find(myquery)
        .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        });
});
// CUSTOMER GET DRIVER PROFILE // (FD9)
customerRoutes.route("/cust/get/driver_profile/:id").get(function (req, res) {
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    try{
        db_connect.collection("DataDriver").find(myquery);
        res.status(201).json({
        message: "Succesfully inserted",
        new_account
    });
    }catch(err){
        console.log(err);
    }
});
// CUSTOMER CREATE REVIEW // (FR3)
customerRoutes.route("/cust/create/review").post(function (req, res) {
    let db_connect = dbo.getDb("On-Demand");
    let new_review = {
        rating: req.body.rating,
        review: req.body.review
    };

    try{
        db_connect.collection("Feedback").insertOne(new_review);
        res.status(201).json({
        message: "Succesfully inserted",
        new_review
    });
    }catch(err){
        console.log(err);
    }
});

customerRoutes.route("/cust/get/allorder_history/:id").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    let mysort = {date: -1}
    let myquery = { id_customer: req.params.id };
    db_connect
      .collection("ActivityHistory")
      .find(myquery)
      .sort(mysort)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });
// CUSTOMER GET ORDER HISTORY (per category) // (FR4)
customerRoutes.route("/cust/get/history/:id/:category").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    let mysort = {date: -1}
    let myquery = {id_customer: req.params.id, type_of_service: req.params.category };
    db_connect
      .collection("ActivityHistory")
      .find(myquery)
      .sort(mysort)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });


customerRoutes.route("/cust/create/review/:id_act").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id_act) };
    let id_review =  new mongodb.ObjectID();
      let new_review = {
        _id :id_review,
        rating: req.body.rating,
        review: req.body.review
      };
      try{
        db_connect.collection("Feedback").insertOne(new_review);
            res.status(201).json({
            message: "Succesfully inserted",
            new_review
        });

        let newvalues = {
            $set: {
              id_feedback: id_review.toHexString()
            },
          };
          db_connect
            .collection("ActivityHistory")
            .updateOne(myquery, newvalues, function (err, result) {
              if (err) throw err;
              res.status(201).json({result, message : "Updated Succesfully"})
            });

      }catch(err){
        console.log(err);
      }
});

module.exports = customerRoutes;
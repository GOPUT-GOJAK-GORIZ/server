const express = require("express");
var mongodb = require('mongodb');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const driverRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

// DRIVER DAFTAR (email pass) (FD1)
driverRoutes.route("/driver/signup").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    if(req.body.driver_password == req.body.password_verification){
        let new_profile = {
          nik: "",
          sim_no: "",
          name: req.body.profile.name,
          profpict: "",
          phone_number: "",
          gender: "",
          birth_of_date: "",
        };
      
        let new_vehicle_details = {
          transportation_type: "",
          plat_number: "",
          capacity: 0,
          merk_and_type: "",
          stnk_no_registration: "",
      
        };
      
        let newAddress = {
          province: "",
          city: "",
          sub_district: "",
          zip_code: "",
          street: ""
      
        };
      
        let newDocuments = {
          skck: "",
          ktp: "",
          sim: "",
          stnk:"",
      
        };
      
        let newDriver = {
          driver_email: req.body.driver_email,
          driver_password: req.body.driver_password,
          profile: new_profile,
          vehicle_details: new_vehicle_details,
          address: newAddress,
          documents:newDocuments,
          verification_status: false,
          rating: null,
          submitted: false,
          active_status: false,
          blocked: false
        };
        try{
          db_connect.collection("DataDriver").insertOne(newDriver);
          res.status(201).json({
          message: "Succesfully inserted",
          newDriver
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


// READ REVIEW AFTER ORDER FINISHED (Read 1 feedback)// (FR9)
driverRoutes.route("/driver/read/feedback/:id").get((req, res) => {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    db_connect
      .collection("Feedback")
      .find(myquery)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });



// DRIVER GET ALL ORDER HISTORY // (FR7)
driverRoutes.route("/driver/get/history/:id").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    let mysort = {date: -1}
    let myquery = { id_driver: req.params.id, activity_status: {$in: ['finished', 'cancelled']} };
    db_connect
      .collection("ActivityHistory")
      .find(myquery)
      .sort(mysort)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

// DRIVER GET New Order // (FR4)
driverRoutes.route("/driver/get/neworder/:id").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mysort = {date: -1}
  let myquery = { id_driver: req.params.id, activity_status: {$not : {$in: ['finished', 'cancelled']}} };
  db_connect
    .collection("ActivityHistory")
    .find(myquery)
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


// DRIVER READ PROFILE // (FD9)
driverRoutes.route("/driver/read/profile/:id").get((req, res) => {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    db_connect
      .collection("DataDriver")
      .find(myquery)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });


// DRIVER UPDATE PROFILE DLL // (FD5)
driverRoutes.route("/driver/update/profile/:id").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id), submitted: false };
    let newvalues = {
      $set: req.body
    };
    db_connect
      .collection("DataDriver")
      .updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        console.log("1 document updated");
        res.status(201).json({result, message : "Updated Succesfully"})
      });
  });


// DRIVER UPDATE ACTIVE STATUS // (FD10)
driverRoutes.route("/driver/update/active/:id").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    let _active_status = req.body.active_status;
    let newvalues = {
      $set: {
        active_status: _active_status
      },
    };
    db_connect
      .collection("DataDriver")
      .updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.status(201).json({result, message : "Updated Succesfully"})
      });
  });


  // DRIVER UPDATE ORDER STATUS (FR13)
driverRoutes.route("/driver/update/activitystatus/:id").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    var myquery = { _id: new mongodb.ObjectID(req.params.id) };
    let newvalues = {
      $set: {
        activity_status: req.body.activity_status
      },
    };
    db_connect
      .collection("ActivityHistory")
      .updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.status(201).json({result, message : "Updated Succesfully"})
      });
  });

// READ 1 ACTIVITY
driverRoutes.route("/driver/read/activity/:id").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect
    .collection("ActivityHistory")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

driverRoutes.route("/driver/read/cust/:id").get(function(req, res){
  let db_connect = dbo.getDb("employees");
  let id_account = { _id : new mongodb.ObjectID(req.params.id)}
  db_connect.collection("DataCustomer").find(id_account).toArray(function (err, result) {
    if (err) throw err;
    res.json(result);
  //    console.log(result);
  });
});


module.exports = driverRoutes;
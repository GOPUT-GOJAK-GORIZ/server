const express = require("express");
var mongodb = require('mongodb');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const customerRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

// CUSTOMER CRAETE ACCOUNT // (FC1)
customerRoutes.route("/cust/create/newaccount").post(function (req, res) {
    let db_connect = dbo.getDb("employees");
    console.log(req)
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
            signUp_date: req.body.signUp_date,
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
       console.log(result);
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
            birth_of_date: req.body.profile.birth_of_date
        },
        signUp_date: req.body.signUp_date,
        blocked: req.body.blocked
        }
    };  

    
        db_connect.collection("DataCustomer").updateOne(id_account, new_values, function (err, res){
            if (err) throw err;
            res.status(201).json({
                message: "Succesfully updated",
                result
        });
    });
});

// CUSTOMER CREATE ORDER // (FR1)
customerRoutes.route("/cust/create/order").post(function (req, res) {
    let db_connect = dbo.getDb("On-Demand");
    let new_order = {
        id_driver: req.body.profile.name,
        id_customer:req.body,
        id_feedback:req.body,
        item_detail: {
            id_item: req.body.item_detail.id_item,
            weight: req.body.item_detail.weight,
            type: req.body.item_detail.type,
            delivery_instruction: req.body.item_detail.delivery_instruction
        },
        recipient_detail: {
            id_recepient:req.body,
            recipient_name: req.body.recipient_detail.recipient_name,
            recipient_phone_number: req.body.recipient_detail.recipient_phone_number
        },
        date: req.body.date,
        type_of_service: req.body.type_of_service,
        start_loc: {
            longtitude: req.body.start_loc.longtitude,
            latitude: req.body.start_loc.latitude
        },
        end_loc: {
            longtitude: req.body.end_loc.longtitude,
            latitude: req.body.end_loc.latitude
        },
        activity_status: req.body.activity_status,
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
// CUSTOMER READ 1 ORDER // (FR4)
customerRoutes.route("/cust/read/order").get(function (req, res) {
    try{
        db_connect.collection("ActivityHistory").find();
        res.status(201).json({
        message: "Succesfully inserted",
        new_account
    });
    }catch(err){
        console.log(err);
    }
});
// CUSTOMER GET DRIVER PROFILE // (FD9)
customerRoutes.route("/cust/get/driver_profile").get(function (req, res) {
    try{
        db_connect.collection("DataDriver").find();
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
// CUSTOMER GET ALL ORDER HISTORY // (FR4)
// customerRoutes.route("/cust/get/allorder_history").get(function (req, res) {
//     try{
//         db_connect.collection("ActivityHistory").find();
//         res.status(201).json({
//         message: "Succesfully inserted",
//         new_account
//     });
//     }catch(err){
//         console.log(err);
//     }
// });

customerRoutes.route("/cust/get/allorder_history").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    let mySort = {name: 1};
    db_connect
      .collection("ActivityHistory")
      .find({})
      .sort(mySort)
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });
// CUSTOMER GET ORDER HISTORY (motorcycle) // (FR4)
customerRoutes.route("/cust/get/order_history/motorcycle").get(function (req, res) {
    try{
        db_connect.collection("ActivityHistory").find();
        res.status(201).json({
        message: "Succesfully inserted",
        new_account
    });
    }catch(err){
        console.log(err);
    }
});
// CUSTOMER GET ORDER HISTORY (car) // (FR4)
customerRoutes.route("/cust/get/order_history/car").get(function (req, res) {
    try{
        db_connect.collection("ActivityHistory").find();
        res.status(201).json({
        message: "Succesfully inserted",
        new_account
    });
    }catch(err){
        console.log(err);
    }
});
// CUSTOMER GET ORDER HISTORY (barang) // (FR4)
customerRoutes.route("/cust/get/order_history/barang").get(function (req, res) {
    try{
        db_connect.collection("ActivityHistory").find();
        res.status(201).json({
        message: "Succesfully inserted",
        new_account
    });
    }catch(err){
        console.log(err);
    }
});
module.exports = customerRoutes;
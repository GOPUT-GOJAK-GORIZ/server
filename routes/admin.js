const express = require("express");
var mongodb = require('mongodb');

// adminRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const adminRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

/* ADMIN CRUD DATA DRIVER */

// ADMIN READ DRIVER BELUM DI VERIFIKASI (FD7)
adminRoutes.route("/admin/get/driver/unverificated").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myquery = { verification_status: false };
  db_connect
    .collection("DataDriver")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});


// ADMIN VERIFIKASI DRIVER (FD8)
adminRoutes.route("/admin/update/verif/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  let newvalues = {
    $set: {
      verification_status: true
    },
  };
  db_connect
    .collection("DataDriver")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
});


// ADMIN READ 1 DRIVER (FD9)
adminRoutes.route("/admin/read/driver/:id").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect
    .collection("DataDriver")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

// ADMIN READ ALL DRIVER (FD2)
adminRoutes.route("/admin/read/alldriver").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mySort = {name: 1};
  db_connect
    .collection("DataDriver")
    .find({})
    .sort(mySort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

// ADMIN UPDATE DRIVER (FD5)
adminRoutes.route("/admin/update/driver/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  let newvalues = {
    $set: req.body
  };
  db_connect
    .collection("DataDriver")
    .updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      res.status(201).json({result, message : "Updated Succesfully"});
    });
});

// ADMIN DELETE DRIVER (FD4)
adminRoutes.route("/admin/delete/driver/:id").delete((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect.collection("DataDriver").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    res.status(201).json({obj, message : "Deleted Succesfully"});
  });
});

// ADMIN SEARCH DRIVER BY NIK (FD3)
adminRoutes.route("/admin/search/driver/:nik").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { "profile.NIK": (req.params.nik).toString() };
  // console.log((req.params.nik).toString());
  db_connect
    .collection("DataDriver")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

// ADMIN UPDATE DRIVER STATUS BLOKIR (FC7)  
adminRoutes.route("/admin/update/blokirdriver/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  let newvalues = {
    $set: {
      blocked: req.body.blocked
    },
  };
  db_connect
    .collection("DataDriver")
    .updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      res.status(201).json({result, message : "Updated Succesfully"});
    });
});
/* ADMIN READ UPDATE SEARCH DATA CUSTOMER */

// ADMIN READ CUSTOMER (FC3)
adminRoutes.route("/admin/read/allcust").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mySort = {name: 1};
  db_connect
    .collection("DataCustomer")
    .find({})
    .sort(mySort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

// AdMIN READ 1 CUSTOMER (FC6)
adminRoutes.route("/admin/read/cust/:id").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect
    .collection("DataCustomer")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

// ADMIN UPDATE CUSTOMER STATUS BLOKIR (FC7)  
adminRoutes.route("/admin/update/blokircust/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  let newvalues = {
    $set: {
      blocked: req.body.blocked
    },
  };
  db_connect
    .collection("DataCustomer")
    .updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      res.status(201).json({result, message : "Updated Succesfully"});
    });
});


// ADMIN SEARCH CUSTOMER (FC4)
adminRoutes.route("/admin/search/cust/:name").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { "profile.name": (req.params.name).toString() };
  db_connect
    .collection("DataCustomer")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      // console.log(result);
    });
});

//ADMIN DELETE CUSTOMER
adminRoutes.route("/admin/delete/customer/:id").delete((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect.collection("DataCustomer").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    res.status(201).json({obj, message : "Deleted Succesfully"});
  });
});

/* ADMIN CRUD DATA ADMIN */

// ADMIN CREATE ADMIN ACCOUNT (FA1)
adminRoutes.route("/admin/add/newadmin").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  // console.log(req)
  if(req.body.admin_password == req.body.password_verification){
    console.log("verif pass berhasil");
    let newAdm = {
      admin_name: req.body.admin_name,
      admin_email: req.body.admin_email,
      admin_password: req.body.admin_password,
      created_at: new Date()
    };
    try{
      //console.log(req.data);
      db_connect.collection("DataAdmin").insertOne(newAdm);
      res.status(201).json({
      message: "Succesfully inserted",
      newAdm
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

// ADMIN READ ALL ADMIN ACCOUNT (FA2)
adminRoutes.route("/admin/read/alladmin").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mySort = {name: 1};
  db_connect
    .collection("DataAdmin")
    .find({})
    .sort(mySort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// ADMIN READ AKUN ADMIN TERENTU (FA3)
adminRoutes.route("/admin/read/admin/:id").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect
    .collection("DataAdmin")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// ADMIN UPDATE ADMIN ACCOUNT (FA4)
adminRoutes.route("/admin/update/admin/:id").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myquery = { _id: new mongodb.ObjectID(req.params.id), admin_password: req.body.admin_curr_password};

  let newvalues = {
    $set: {
      admin_name: req.body.admin_name,
      admin_email: req.body.admin_email,
      admin_password: req.body.admin_new_password
    }
  };

  db_connect
    .collection("DataAdmin")
    .updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      res.status(201).json({
        message: "Succesfully updated",
        result
      });
    });
  
});

// ADMIN DELETE ADMIN ACCOUNT (FA5)
adminRoutes.route("/admin/delete/admin/:id").delete((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { _id: new mongodb.ObjectID(req.params.id) };
  db_connect.collection("DataAdmin").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    res.status(201).json({obj, message : "Deleted Succesfully"});
  });
});

/* ADMIN READ ACTIVITY HISTORY (ALL AND PER DAY/ PER CATEGORY) */

// ADMIN READ ALL ACTIVITY (FR5)
adminRoutes.route("/admin/read/allactivity").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mysort = {date: -1}
  db_connect
    .collection("ActivityHistory")
    .find({})
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// ADMIN READ ACTIVITY PER DAY (FR6)
adminRoutes.route("/admin/get/history/perday/:date").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let mysort = {date: -1}
  let myquery = { date: {$gte: new Date(req.params.date), $lt: new Date(new Date(req.params.date).setDate(new Date(req.params.date).getDate()+1))} };
  // console.log(new Date(new Date(req.params.date).setDate(new Date(req.params.date).getDate()+1)));
  db_connect
    .collection("ActivityHistory")
    .find(myquery)
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// ADMIN READ ACTIVITY PER CATEGORY (FR11)
adminRoutes.route("/admin/get/history/:category").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myquery = { type_of_service: req.params.category };
  let mysort = {date: -1}
  db_connect
    .collection("ActivityHistory")
    .find(myquery)
    .sort(mysort)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// READ 1 ACTIVITY FR10
adminRoutes.route("/admin/read/activity/:id").get((req, res) => {
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

// READ FEEDBACK 
adminRoutes.route("/admin/read/feedback/:id").get((req, res) => {
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




/* ADMIN READ ABOUT REPORTS */

/* Total order per layanan*/

adminRoutes.route("/admin/read/report/pertype").get((req, res) => {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("ActivityHistory")
    .aggregate([
      { $group : { _id : '$type_of_service', totalorder : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

/*REPORT THIS MONTH */
adminRoutes.route("/admin/get/totalorder/thismonth").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let order_month = { date: {$gt: new Date(new Date().setDate(new Date().getDate() - 30))} };
  db_connect
    .collection("ActivityHistory")
    .aggregate([
      {$match : order_month},
      { $group : { _id : 0, totalorder : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});


//TOTAL ORDER THIS WEEK
adminRoutes.route("/admin/get/totalorder/thisweek").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let order_week = { date: {$gt: new Date(new Date().setDate(new Date().getDate() - 7))} };
  db_connect
    .collection("ActivityHistory")
    .aggregate([
      {$match : order_week},
      { $group : { _id : 0, totalorder : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});

// TOTAL ORDER TODAY
adminRoutes.route("/admin/get/totalorder/today").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let order_day = { date: {$gt: new Date(new Date().setDate(new Date().getDate() - 1))} };
  db_connect
    .collection("ActivityHistory")
    .aggregate([
      {$match : order_day},
      { $group : { _id : 0, totalorder : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});


//NEW ACCOUNT THIS MONTH
adminRoutes.route("/admin/get/totalnewcust/thismonth").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let this_month = { signUp_date: {$gt: new Date(new Date().setDate(new Date().getDate() - 30))} };
  db_connect
    .collection("DataCustomer")
    .aggregate([
      {$match : this_month},
      { $group : { _id : 0, totaluser : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});

//REPORT IN 1 YEAR
adminRoutes.route("/admin/get/totalorder/:year").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let year = req.params.year;
  let nextyear = (parseInt(year) + 1).toString();
  let myquery = { date: {$gte: new Date(year), $lt: new Date(new Date(nextyear).setDate(new Date(nextyear).getDate() - 1))} };
  // console.log(new Date();
  db_connect
    .collection("ActivityHistory")
    .aggregate([
      {$match: myquery },
      { $group : {  _id: {$substr: ['$date', 5, 2]} , totalorder : { $sum : 1 } } }
    ])
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
    
});

module.exports = adminRoutes;
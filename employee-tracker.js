var cTable = require("console.table");
var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Port, if not 3306
    port: 3306,
  
    // Username
    user: "root",
  
    // Password
    password: "",
    database: "employee_trackerDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });
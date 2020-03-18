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

    // Show the user the main menu -- the one that allows the user to begin the process of adding, viewing,
    // or updating a department, role, or employee
    showMainMenu();
});

function showMainMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Update Employee Roles",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Add Department":
                    addDepartment();
                    break;

                case "Exit":
                    connection.end();
                    break;

                default:
                    console.log("Sorry, but that operation is invalid. Please try again.");
                    showMainMenu();
            }
        });
}

// Prompt the user for a department and add it to the department table
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Which department would you like to add?"
        })
        .then(function(answer) {
            var query = "INSERT INTO department SET ?";
            connection.query(query, { name: answer.department }, function(err) {
                if (err) throw err;
                showMainMenu();
            });
        });
}
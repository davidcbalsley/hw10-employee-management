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

                case "Add Role":
                    addRole();
                    break;

                case "View All Departments":
                    viewAllDepartments();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "View All Employees":
                    viewAllEmployees();
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

// Prompt the user for a role and add it to the role table
function addRole() {
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "Which role would you like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?"
            }
        ])
        .then(function(roleAnswer) {
            // Get the list of departments 
            var query = "SELECT * FROM department";
            connection.query(query, function(err, res) {
                // console.log(res);

            });
        });
}

// Console log all of the departments
function viewAllDepartments() {
    var query = "SELECT name FROM department";
    connection.query(query, function(err, res) {
        // Insert a blank row
        console.log("\n");

        // Output the list of departments
        console.table(res);

        // Prompt the user for the next action
        showMainMenu();
    });
}

// Console log all of the roles
function viewAllRoles() {
    var query = "SELECT role.id, role.title, role.salary, department.name AS department ";
    query += "FROM role ";
    query += "JOIN department ON role.department_id = department.id";

    connection.query(query, function(err, res) {
        // Insert a blank row
        console.log("\n");

        // Output the list of employees
        console.table(res);

        // Prompt the user for the next action
        showMainMenu();
    });
}

// Console log all of the employees
function viewAllEmployees() {
    var query = "SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, SPACE(1), e2.last_name) AS manager ";
    query += "FROM employee e1 ";
    query += "JOIN role ON e1.role_id = role.id ";
    query += "JOIN department ON role.department_id = department.id ";
    query += "LEFT JOIN employee e2 ON e1.manager_id = e2.id";

    // I figured out how to join a table to itself from 
    // https://www.sqlservertutorial.net/sql-server-basics/sql-server-self-join/

    connection.query(query, function(err, res) {
        // Insert a blank row
        console.log("\n");

        // Output the list of employees
        console.table(res);

        // Prompt the user for the next action
        showMainMenu();
    });
}
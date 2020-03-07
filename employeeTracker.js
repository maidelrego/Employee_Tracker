var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "oddun077",
  database: "employee_tracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  start();
});



function start() {
    inquirer
      .prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all Employees", 
            "View all Employees by Deparment", 
            "View all Employees by Manager", 
            "Add Employee", 
            "Remove Employee", 
            "Update Employee Role", 
            "Update Employee Manager"
        ]
      })
      .then(function(answer){

        switch (answer.menu) {
            case "View all Employees":
              viewEmployees();
              break;
      
            case "View all Employees by Deparment":
              employeeByDeparment();
              break;
      
            case "View all Employees by Manager":
              employeeByManager();
              break;
      
            case "Add Employee":
              addEmployee();
              break;
      
            case "Remove Employee":
              removeEmployee();
              break;

            case "Update Employee Role":
                updateRole();
                break;

                case "Update Employee Manager":
                updateManager();
                break;
            }
      })

    }

function viewEmployees(){

};

function employeeByDeparment(){

};

function employeeByManager(){

};

function addEmployee(){
  
  // do query to get roles
  // then
    // do query to get managers
    // then
      // ask for first name and last name, and role, and manager
      // then
        // insert the employee

  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the Employee's First Name?"
      },

      {
        name: "last_name",
        type: "input",
        message: "What is the Employee's Last Name?"
      },

    ])
    .then(nameresponse => {
      connection.query("SELECT title FROM role", function (err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              message: "What is the Employee's Role?",
              choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].title);
                }
                return choiceArray;
              }

            }
          ]).then(department => {
            connection.query("SELECT * FROM employee WHERE role_id = 'Manager'", function (err, results) {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "choice",
                    type: "rawlist",
                    message: "What is the Employee's Manager?",
                    choices: function () {
                      var choiceArray = [];
                      for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].first_name + " " + results[i].last_name);
                        console.log(choiceArray);
                      }
                      return choiceArray;
                    }

                  }
                ]).then(function(roleanswer) {
                  console.log(roleanswer)
                  connection.query("INSERT INTO employee SET ?", {
                    first_name: nameresponse.first_name,
                    last_name: nameresponse.last_name,
                    role_id: department.choice,
                    manager_id: roleanswer.choice 
                  })
                  connection.end()
                });
            })
          })
    });
  }) 
  

};

function removeEmployee(){

};

function updateRole(){

};

function updateManager(){

};



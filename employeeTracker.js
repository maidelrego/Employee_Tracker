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
          "View all Department",
          "View all Roles",
          "View all Employees",
          "Add a New Department",
          "Add a New Role",
          "Add Employee",
          "Update Employee Role"
        ]
      })
      .then(function(answer){

        switch (answer.menu) {
            case "View all Department":
              viewDepartment();
              break;

              case "View all Roles":
              viewRole();
              break;
              case "View all Employees":
              viewEmployees();
              break;
      
            case "Add a New Department":
              addDepartment();
              break;
      
            case "Add a New Role":
              addRole();
              break;
      
            case "Add Employee":
              addEmployee();
              break;

            case "Update Employee Role":
                updateRole();
                break;
            }
      })

    }

function viewDepartment(){
connection.query("SELECT name FROM department", function(err, results){
  if(err){throw err};
  console.table(results);
  start()
})

};

function viewRole(){
  connection.query("SELECT title, salary FROM role", function(err, results){
    if(err){throw err};
    console.table(results);
    start()
  })

};

function viewEmployees(){
  connection.query("SELECT * FROM employee", function(err, results){
    if(err){throw err};
    console.table(results);
    start()
  })
};

function addDepartment(){
 
  inquirer
  .prompt({
    name: "addDept",
    type: "input",
    message: "Enter the name of the new Department"
  }).then(deptRes=>{
    connection.query("INSERT INTO department SET ?", {
      name: deptRes.addDept
    })
    start();
  })

};



function addRole() {

  inquirer
    .prompt([
      {
        name: "addRo",
        type: "input",
        message: "Enter the name of the new Role"
      },

      {
        name: "addSal",
        type: "input",
        message: "Enter the Anual Salary for this Role"
      }

    ]).then(deptRes => {
      console.log(deptRes)
      connection.query("INSERT INTO role SET ?", {
        title: deptRes.addRo,
        salary: deptRes.addSal,
      })
      start();
    })

};


function addEmployee() {

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
      }

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
                ]).then(function (roleanswer) {
                  console.log(roleanswer)
                  connection.query("INSERT INTO employee SET ?", {
                    first_name: nameresponse.first_name,
                    last_name: nameresponse.last_name,
                    role_id: department.choice,
                    manager_id: roleanswer.choice
                  })
                  start();
                });
            })
          })
      });
    })
};

function updateRole(){
  connection.query("SELECT * FROM employee", function(err, results){
    if(err){throw err};
    inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        message: "What is the Employee's Role?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].first_name);
          }
          return choiceArray;
        }
      }
    ]).then(function(nameList){
      connection.query("SELECT title FROM role", function(err,results){
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              message: "What is the New Employee's Role?",
              choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].title);
                }
                return choiceArray;
              }

            }
          ]).then(function(roleList){
            connection.query("UPDATE employee SET ? WHERE ?", [
              {
                role_id: roleList.choice
              },
              {
                first_name: nameList.choice,
              }
            ])
          })
      })
    })
  })
  
};




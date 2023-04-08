const inquirer = require('inquirer')
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})


const mainMenu = () => {
  inquirer.prompt(
    {
     type: 'list',
     name: 'Action',
     message: 'What would you like to do?',
     choices: [
       'view all departments',
       'view all roles',
       'view all employees',
       'add a department',
       'add a role', 
       'add an employee', 
       'update an employee role',
       "exit"
     ]
    }
   )
   .then(answer => {
     console.log(answer.Action)
       if(answer.Action == 'view all departments') {
          viewAllDepartments();
       }
       if(answer.Action == 'view all roles') {
          viewAllRoles();
       }
       if(answer.Action == 'view all employees') {
          viewAllEmployee();
       }
       if(answer.Action == 'add a department') {
         addDepartment()
       }
       if(answer.Action == 'add a role')  {
   
       }
       if(answer.Action == 'add an employee')  {
   
       }
       if(answer.Action == 'update an employee role') {
   
       }
       if(answer.Action == "exit") {
        console.log("Goodbye!")
        process.exit(1)
       }
   })
}

const viewAllDepartments = () => {
  db.query("SELECT * FROM department;", (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    console.table(data)
    mainMenu();
  })
}

const viewAllRoles = () => {
  db.query("SELECT * FROM role;", (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    console.table(data)
    mainMenu();
  })
}

const viewAllEmployee = () => {
  db.query("SELECT * FROM employee;", (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    console.table(data)
    mainMenu();
  })
}

const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the new department?"
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO department (name) VALUES ("${answer.name}");`, (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("Department added!");
      mainMenu();
    }) 
  })
}


mainMenu();
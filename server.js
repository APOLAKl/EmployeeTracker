const inquirer = require('inquirer')
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

// Connect to database
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
         viewAllEmployees();
       }
       if(answer.Action == 'add a department') {
         addDepartment();
       }
       if(answer.Action == 'add a role')  {
         addRole();
       }
       if(answer.Action == 'add an employee')  {
         addEmployee();
       }
       if(answer.Action == 'update an employee role') {
   
       }
       if(answer.Action == "quit") {
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

const viewAllEmployees = () => {
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

const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the job title of the employee?"
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the employee?"
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO role (title, salary) VALUES ("${answer.title}", "${answer.salary}");`, (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("Job Title and Salary added!(Role)");
      mainMenu();
    })
  })
}

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first_name of the employee?"
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last_name of the employee?"
    }
    {
      type: "confirm",
      name: "isManager",
      message: "is he/she a Manager? Type \`y\` to update",
      default: false
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO role (title, salary) VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.isManager}");`, (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("isManager, First and Last name added!(Employee)");
      mainMenu();
    })
  })
}

mainMenu();
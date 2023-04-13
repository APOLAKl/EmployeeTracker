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

db.connect(function(err) {
  if (err) throw err;
  console.log("You are connected to database!")
});

// Main Menu
const mainMenu = () => {
  inquirer.prompt(
    {
     type: "list",
     name: "Action",
     message: "What would you like to do?",
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
         updateEmployeeRole();
       }
       if(answer.Action == "quit") {
        console.log("Goodbye!")
        process.exit(1)
       }
   })
}

const viewAllDepartments = () => {
  db.promise().query("SELECT * FROM department;", (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log("Showing all departments!\n");
    console.table(data)
    mainMenu();
  })
}

const viewAllRoles = () => {
  db.promise().query("SELECT * FROM role;", (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log("Showing all roles!\n");
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
    console.log("Showing all employees!\n");
    console.table(data)
    mainMenu();
  })
}

const addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "addDept",
      message: "What is the name of the new department?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log("Department cannot be null");
            return false;
        }
      }
    }
  ])
  .then(answer => {
    db.query(`INSERT INTO department (name) VALUES ("${answer.addDept}");`, (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("Department added!");
      viewAllDepartments();
      mainMenu();
    }) 
  })
}

const addRole = () => {
  db.query(`SELECT * FROM department;`, (err, data) => {
      const dept = data.map(department => ({name: department.name, value: department.id}));
      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is the job title of the employee?",
          validate: addTitle => {
            if (addTitle) {
                return true;
            } else {
                console.log("Please enter a title");
                return false;
            }
          }
        },
        {
          type: "input",
          name: "salary",
          message: "What is the job salary of the employee?",
          validate: addSalary => {
            if (isNAN(addSalary)) {
                return true;
            } else {
                console.log("Please enter a salary");
                return false;
            }
          }
        },
        {
          type: "rawlist",
          name: "deptName",
          message: "What department would you like to add the new role to?",
          choices: "dept"
        },
      ])
      .then((answer)) => {
        db.query(`INSERT INTO role SET ?`,
        {
          TITLE: answer.title,
          salary: answer.salary,
          id: answer.deptName,
        }, (err, data) => {
          if(err) {
            console.log(err);
            return;
          }
          console.log("\nAdded to database!\n");
          viewAllRoles();
          mainMenu();
        })
      }
    
  })
}

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first_name of the employee?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a valid first name');
            return false;
        }
      }
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last_name of the employee?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a valid last name');
            return false;
        }
      }
    },
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


const updateEmployeeRole = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role would you like to update?",
    },
    {
      type: "list",
      name: "newrole",
      message: "What is their new role?",
    }
  ])
  .then(answer => {
    db.query(`UPDATE role (title) SET ("${answer.newrole}");`, (err, data) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("Job Title updated");
      mainMenu();
    })
  })
}

mainMenu();
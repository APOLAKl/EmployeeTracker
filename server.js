const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("You are connected to database!");
});

// Main Menu
const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "Action",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "exit",
      ],
    })
    .then((answer) => {
      console.log(answer.Action);
      if (answer.Action == "view all departments") {
        viewAllDepartments();
      }
      if (answer.Action == "view all roles") {
        viewAllRoles();
      }
      if (answer.Action == "view all employees") {
        viewAllEmployees();
      }
      if (answer.Action == "add a department") {
        addDepartment();
      }
      if (answer.Action == "add a role") {
        addRole();
      }
      if (answer.Action == "add an employee") {
        addEmployee();
      }
      if (answer.Action == "update an employee role") {
        updateEmployeeRole();
      }
      if (answer.Action == "quit") {
        console.log("Goodbye!");
        process.exit(1);
      }
    });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM department;", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing all departments!\n");
    console.table(data);
    mainMenu();
  });
};

const viewAllRoles = () => {
  db.query("SELECT * FROM role;", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing all roles!\n");
    console.table(data);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  db.query("SELECT * FROM employee;", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Showing all employees!\n");
    console.table(data);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What is the name of the new department?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Department cannot be null");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (department_name) VALUES ("${answer.addDept}");`,
        (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Department added!");
          viewAllDepartments();
          // mainMenu();
        }
      );
    });
};

const addRole = () => {
  db.query(`SELECT * FROM department;`, (err, data) => {
    const dept = data.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the job title of the employee?",
          validate: (addTitle) => {
            if (addTitle) {
              return true;
            } else {
              console.log("Please enter a title");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "salary",
          message: "What is the job salary of the employee?",
          validate: (addSalary) => {
            if (isNAN(addSalary)) {
              return true;
            } else {
              console.log("Please enter a salary");
              return false;
            }
          },
        },
        {
          type: "rawlist",
          name: "department_id",
          message: "What department would you like to add the new role to?",
          choices: dept,
        },
      ])
      .then((answer) => {
        db.query(
          // `INSERT INTO role (title, salary, department_id)
          // VALUES
          // (? ,? ,?)`,
          // [
          //   answer.title,
          //   answer.salary,
          //   answer.department_id
          // ]
          `INSERT INTO role SET ?`,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("\nAdded to database!\n");
            viewAllRoles();
            mainMenu();
          }
        );
      });
  });
};

const addEmployee = () => {
  db.query("SELECT * FROM employee WHERE manager_id IS NULL", (err, data) => {
    // const managerList = data.filter(emp => emp.manager_id == null);
    // console.log(managerList)
    console.log(data);

    const managerList = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });

    db.query("SELECT * FROM role", (err, data) => {
      const roleList = data.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the first_name of the employee?",
            validate: (addFirstName) => {
              if (addFirstName) {
                return true;
              } else {
                console.log("Please enter a valid first name");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the last_name of the employee?",
            validate: (addLastName) => {
              if (addLastName) {
                return true;
              } else {
                console.log("Please enter a valid last name");
                return false;
              }
            },
          },
          {
            type: "rawlist",
            name: "role_id",
            message: "What is the role for this employee?",
            choices: roleList,
          },
          {
            type: "rawlist",
            name: "manager_id",
            message: "Who is the manager for this employee?",
            choices: managerList,
          },
        ])
        .then((answer) => {
          db.query(
            `INSERT INTO employee SET ?`,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            (err, data) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Employee added!");
              viewAllEmployees();
            }
          );
        });
    });
  });
};

const updateEmployeeRole = () => {
  db.query("SELECT * FROM employee", (err, data) => {
    // const managerList = data.filter(emp => emp.manager_id == null);
    // console.log(managerList)
    console.log(data);

    const employeeList = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });

    db.query("SELECT * FROM role", (err, data) => {
      const roleList = data.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });

      inquirer
        .prompt([
          {
            type: "rawlist",
            name: "employee_id",
            message: "Which employee would you like to update",
            choices: employeeList,
          },
          {
            type: "rawlist",
            name: "role_id",
            message: "What is the new role for this employee",
            choices: roleList,
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employee SET role_id = ? WHERE id = ?;`,
            [
              answer.role_id,
              answer.employee_id
            ],
            (err, data) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Employee updated!");
              viewAllEmployees();
            }
          );
        });
    });
  });
};

mainMenu();

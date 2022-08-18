const express = require('express');
const PORT = process.env.PORT || 3003;
const app = express();
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
// const apiRoutes = require('./routes/apiRoutes');

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Default response for any other request (Not found)
app.use((req, res) => {
    res.status(404).end();
});

//start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
    app.listen(PORT, () => {
        // console.log(`Server is running on port ${PORT}`);
    });
});


//code for inquirer
const employee_tracker = function () {
    const startApp = inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All departments', 'View All roless', 'View All Employees', 'Add A departments', 'Add A roles', 'Add An Employee', 'Update roles', 'Log Out']
    }]).then((answers) => {
        // Views the departments Table in the Database
        if (answers.prompt === 'View All departments') {
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All departmentss: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All roless') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All roless: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employees`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A departments') {
            inquirer.prompt([{
                // Adding a departments
                type: 'input',
                name: 'departments',
                message: 'What is the name of the dpeartment?',
                validate: departmentsInput => {
                    if (departmentsInput) {
                        return true;
                    } else {
                        console.log('Please Add A departments!');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO departments (name) VALUES (?)`, [answers.departments], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.departments} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add A roles') {
            // Beginning with the database so that we may acquire the departmentss for the choice
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Adding A roles
                        type: 'input',
                        name: 'roles',
                        message: 'What is the name of the roles?',
                        validate: rolesInput => {
                            if (rolesInput) {
                                return true;
                            } else {
                                console.log('Please Add A roles!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding the Salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the roles?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // departments
                        type: 'list',
                        name: 'departments',
                        message: 'Which departments does the roles belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.departments) {
                            var departments = result[i];
                        }
                    }

                    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.roles, answers.salary, departments.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.roles} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add An Employee') {
            // Calling the database to acquire the roless and managers
            db.query(`SELECT * FROM employees, roles`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Adding Employee First Name
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A First Name!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding Employee Last Name
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding Employee roles
                        type: 'list',
                        name: 'roles',
                        message: 'What is the employees roles?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        // Adding Employee Manager
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please Add A Manager!');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.roles) {
                            var roles = result[i];
                        }
                    }

                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, roles.id, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update An Employee roles') {
            // Calling the database to acquire the roless and managers
            db.query(`SELECT * FROM employees, roles`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employees',
                        message: 'Which employees roles do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Updating the New roles
                        type: 'list',
                        name: 'roles',
                        message: 'What is the new roles?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employees) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.roles) {
                            var roles = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: roles}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employees} roles to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }
    })
};
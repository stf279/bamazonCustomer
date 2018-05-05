// add requires for mysql, inquirer
let inquirer = require("inquirer");
var mysql = require("mysql");

// add question array

var questions = [
    {
      // question 1
        message: "Enter the Product ID you want to purchase:",
        type: "input",
        name: "id",
    },
    {
      // question 2
        message: "How many do you want to buy?",
        type: "input",
        name: "quantity",
    }
  ];

// add DB connection

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Wynt3Rb0W!",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

      listProducts();
  });
  

// when you node this js have the data in the DB appear in the terminal

function listProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all ress of the SELECT statement
      console.log(res);
      for (var i = 0; i < res.length; i++)
      {
        console.log(`-ID ${res[i].item_id}-
                    Item: ${res[i].product_name}
                    Department: ${res[i].department_name}
                    Price: $${res[i].price}
                    Quantity Available: ${res[i].stock_quantity}`);
      }

      function ask(){
        // use  inquirer to have the user answer the questions in the question array 
        inquirer.prompt(questions).then(answers => {
          // after the user has put in their answers, process them. See processAnswers()
          // function for more information 
          processAnswers(answers);
        })
      };
      function processAnswers(answers){
        // this is what happens after the user answers both questions
        console.log("processing answers...");
        console.log("You selected Item ID " + answers.id)
       console.log("You selected quantity " + answers.quantity)
       console.log("This ITEM ID corresponds to " + res[answers.id-1].product_name)
       console.log("This item costs " + res[answers.id-1].price + " per unit and there are " + res[answers.id-1].stock_quantity)
       console.log("The overall price of this order is " + (answers.quantity*res[answers.id-1].price).toFixed(2));
      }
      ask();
      connection.end();
    });

// verify that the amount that the user is asking is less than or equal to the amount in the DB
// IF it's over, tell them they asked for too many
// IF it's equal or under, update the stock_quantity and then tell them how much their order will be
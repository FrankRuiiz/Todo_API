var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; 


app.use(bodyParser.json()); 

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET request to get all todos, well use /todos
app.get('/todos', function(req, res) {
	res.json(todos);  // the json method allows us to send the data without having to use json.stringify like you normally would 
});

// GET request to get a singel todo, todos/:id
app.get('/todos/:id', function(req, res) {
	//res.send('Asking for todo with id of ' + req.params.id);
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo;
	for(var i=0; i<todos.length; i+=1) {
		if(todos[i].id === todoID) {
			matchedTodo = todos[i];
		}
	}
	if(matchedTodo) {
		res.json(matchedTodo); 
	} else {
		res.status(404).send('Id not found.');
	}
});

// POST /todos/
app.post('/todos', function(req, res) {
	var newTodo = req.body;
	newTodo.id = todoNextId;
	console.log(newTodo);
	todos.push(newTodo);
	todoNextId+=1; 

	res.json(newTodo + ' Added'); 
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + ' !');
});
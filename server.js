var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
	var queryParams = req.query;
	var filteredTodos = todos;

	// console.log('queryParams', queryParams);
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			'completed': true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			'completed': false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos); // the json method allows us to send the data without having to use json.stringify like you normally would 
});

// GET request to get a singel todo, todos/:id
app.get('/todos/:id', function(req, res) {
	//res.send('Asking for todo with id of ' + req.params.id);
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send('ID not found.');
	}
});

// POST /todos/
app.post('/todos', function(req, res) {
	// uses _.pick to use only the description and completed fields 
	var newTodo = _.pick(req.body, 'description', 'completed');
	if (!_.isBoolean(newTodo.completed) || !_.isString(newTodo.description) || newTodo.description.trim().length === 0) {
		return res.status(400).send(); // req cant be completed 
	}
	// set body.description to be trimmed value
	newTodo.description = newTodo.description.trim();

	newTodo.id = todoNextId;
	console.log(newTodo);
	todos.push(newTodo);
	todoNextId += 1;

	res.json(newTodo + ' Added');
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
		return matchedTodo;
	} else {
		res.status(404).json({
			'error': 'ID not found.'
		});
	}


});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}


	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + ' !');
});
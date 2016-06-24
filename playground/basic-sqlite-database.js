var Sequelize = require('Sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync()

.then(function() {
	console.log('everything is synced');

	Todo.findById(5).then(function(todo) {
		if(todo) {
			console.log(todo.toJSON());
		}
		else {
			console.log('Todo not found');
		}
	})
	
	// Todo.create({
	// 	description: 'Take dog for walk',
	// 	// completed: false
	// }).then(function(todo) {
	// 	return Todo.create({
	// 		description: 'clean office'
	// 	})
	// }).then(function() {
	// 	return Todo.findById(1)	
	// })
	// .catch(function(e) {
	// 	console.log(e);
	// });
});
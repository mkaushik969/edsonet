const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

//	console.log("abccc");

	const neo4j = require('neo4j-driver').v1;

	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

//	console.log("conn created");

	const resultPromise = session.run(
		'CREATE (st:Student{firstname: $firstname,lastname: $lastname,email: $email,password: $password,city: $city,phoneno: $phoneno}) RETURN st',
//	  'CREATE (a:Person {name: $name}) RETURN a',
	  {
	  	firstname: req.body.firstname,
	  	lastname: req.body.lastname,
	  	email: req.body.email,
	  	password: req.body.password,
	  	city: req.body.city,
	  	phoneno: req.body.phoneno
	  }
	);

//	console.log("query created");

	resultPromise.then(result => {
	  session.close();

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);

		res.json({"response":"success"});
//	  console.log(node.properties.name);

	  // on application exit:
	  driver.close();
	})
	.catch((err) => {
		res.json({"response":"failure"});		
	})
//	console.log("query run");

});

module.exports = router;


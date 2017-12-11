const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	const resultPromise = session.run(
		'MATCH (u:User {email: $email,password:$password}) RETURN u',
	  {
	  	email: req.body.email,
	  	password: req.body.pass,
	  }
	);

	resultPromise.then(result => {
	  session.close();

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
	  req.session.email=req.body.email;
	  res.status(200).json({"response" :"success"});
   	console.log("Success");

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})
});

// router.get('/', function(req, res, next) {
// 	  res.render('portal');
// });

module.exports = router;


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
		'MATCH (u:User)-[:FOLLOWS]->(u1:User{email:$email}) where u.email<>$email RETURN u LIMIT 4',
	  {
	  	email: req.body.email,
	  }
	);

	resultPromise.then(result => {
	  session.close();

	  var data=[];
	  for(var i=0;i<result.records.length;i++)
	  {
	  const singleRecord = result.records[i];
	  const node = singleRecord.get(0).properties;
	  data.push(node);
	  }

	  res.status(200).json({"response" :"success",data});
   	console.log("Success");

	  driver.close();
	})
	.catch((err) => {
	console.log("failure");
		res.status(200).json({"response" : "failure"});
	})
});

// router.get('/', function(req, res, next) {
// 	  res.render('portal');
// });

module.exports = router;


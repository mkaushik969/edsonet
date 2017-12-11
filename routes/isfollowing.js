const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	if(req.session.email==req.body.email)
	  res.status(200).json({"response":"success","follow":"-1"});

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	const resultPromise = session.run(
		'match (u1:User{email:$semail})-[f:FOLLOWS]->(u2:User{email:$email}) return f',
	  {
	  	semail: req.session.email,
	  	email: req.body.email
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

	   const singleRecord = result.records[0];

//	   const node = singleRecord.get(0);
//	 log.console(singleRecord);
//	 log.console(node);
	if(result.records.length>0)
	  res.status(200).json({"response":"success","follow":"1"});
	else
	  res.status(200).json({"response":"success","follow":"0"});
//	  res.status(200).json({result});

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})
});

module.exports = router;


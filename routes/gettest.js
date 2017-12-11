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
		'MATCH (q:Question{tag:$tag}) return q',
	  {
	  	 tag: req.body.tagid
	  	// password: req.body.pass,
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

	   const singleRecord = result.records[0];

	   var jsonArr = { data:[] };

		for (var i = 0; i < 10; i++) {
		    jsonArr.data.push(result.records[i].get(0).properties);
		}


//	   const node = singleRecord.get(0);
//	 log.console(singleRecord);
//	 log.console(node);
	  res.status(200).json({response:"success",data:jsonArr.data});
//	  res.status(200).json({"response" :"success"});

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})
});

module.exports = router;


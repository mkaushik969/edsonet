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
		'MATCH (n:Post)<-[:POSTS]-(us:User)<-[:FOLLOWS]-(u:User{email:$email}) RETURN us,n ORDER BY n.cdate desc',
	  {
	  	email: req.body.email
	  	// password: req.body.pass,
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

	   const singleRecord = result.records[0];

	   var jsonArr = { data:[] };
	   var user,post;

		for (var i = 0; i < result.records.length; i++) {
		    jsonArr.data.push({user:result.records[i]._fields[0].properties,post:result.records[i]._fields[1].properties});
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


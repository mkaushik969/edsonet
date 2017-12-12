const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	  var data=[];

	const resultPromise = session.run(
		'MATCH (me:User)-[:FOLLOWS]->(myFriend:User)-[:FOLLOWS]->(friendOfFriend:User) '+
		'WHERE NOT (me)-[:FOLLOWS]->(friendOfFriend:User) '+
    	'AND me.email = $email return distinct friendOfFriend LIMIT 8',
	  {
	  	email: req.body.email,
	  }
	);

	resultPromise.then(result => {
//	  session.close();

	  for(var i=0;i<result.records.length;i++)
	  {
	  const singleRecord = result.records[i];
	  const node = singleRecord.get(0).properties;
	  data.push(node);
	  }

	  if(data.length>0)
	  {
	    	console.log("Success1");
	  	  session.close();
		  res.status(200).json({"response" :"success",data});
		  driver.close();
	  }
	  else
	  {
	  		const resultPromise1 = session.run(
		'MATCH (u:User) where not u.email=$email return distinct u LIMIT 8',
		  {
		  	email: req.session.email,
		  }
		);


	  resultPromise1.then(result => {
//	  session.close();

   	console.log("Success2");	 

	  data=[];
	  for(var i=0;i<result.records.length;i++)
	  {
	  const singleRecord = result.records[i];
	  const node = singleRecord.get(0).properties;
	  data.push(node);
	  }

	  res.status(200).json({"response" :"success",data});

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})

	  
	}
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


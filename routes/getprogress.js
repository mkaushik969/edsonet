const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	var monthly=[],sub=[];

	const resultPromise = session.run(
		'MATCH (s:Submission{email:$email}) return count(s.tid),s.submonth order by s.submonth',
	  {
	  	email: req.body.email,
	  }
	);

	resultPromise.then(result => {
//	  session.close();
    	console.log("Success");

    	for(var i=0;i<result.records.length;i++)
    	{
    		monthly.push(result.records[i]._fields);
    	}

	const resultPromise1 = session.run('MATCH (s:Submission)<-[:SUBMITS]-(u:User{email:$email}) '+
		'MATCH(test:Test) where test.tid=s.tid '+
		'MATCH (cl:Class)-[:HAS_COURSE]->(co:Course)-[:HAS_SUBJECT]->(t:Tag) where cl.cid=test.class and co.cid=test.course and test.tag=t.tagid return s.tagid,t.name,count(s.tid)',
	  {
	  	email: req.body.email,
	  }
	);

	resultPromise1.then(result => {
	  session.close();
	  
    	for(var i=0;i<result.records.length;i++)
    	{
    		sub.push(result.records[i]._fields);
    	}

	  res.status(200).json({"response" :"success",monthly,sub});
   	console.log("Success");
	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})

	  // res.status(200).json({"response" :"success",monthly});
//	  driver.close();
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


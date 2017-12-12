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
		'MATCH (t:Test{tid:$tid})<-[:CONDUCTS]-(u:User) MATCH (cl:Class)-[:HAS_COURSE]->(co:Course)-[:HAS_SUBJECT]->(tag:Tag) where cl.cid=t.class and co.cid=t.course and tag.tagid=t.tag return t,u,cl,co,tag',
	  {
	  	tid: req.body.tid
	  }
	);

	resultPromise.then(result => {
	  session.close();
//data:result.records[0]._fields[0].properties
//	  res.status(200).json({"response" :"success",result});
	  res.status(200).json({"response" :"success",test:result.records[0]._fields[0].properties,user:result.records[0]._fields[1].properties,subject:result.records[0]._fields[2].properties});
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


const express = require('express');
const config = require('../config.json');
var router = express.Router();
async = require("async");

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body.data);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	var correct=0,incorrect=0;
 
	async.each(JSON.parse(req.body.data),function(item, callback){
		console.log('item:'+item);
      	const resultPromise = session.run(
		'MATCH (u:Question {qid: $qid,correct:$aid}) RETURN u',
	  {
	  	qid: item.qid,
	  	aid: item.aid
	  }
	);
			
	resultPromise.then(result => {
	  session.close();

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
	  console.log("success:"+singleRecord);		
	  correct=correct+1;
	  console.log('correct:'+correct);
	  driver.close();
      callback();
	})
	.catch((err) => {
		incorrect=incorrect+1;
		console.log("failure:"+err);		
      callback();
	})
  },
  function(err){
    // All tasks are done now

    console.log('fcorrect:'+correct);

    console.log('incorrect:'+incorrect);

	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	const resultPromisee = session.run('MATCH (u:User) WHERE u.email = $email '+
		'CREATE (st:Submission{email: $email,subdate: $subdate,subday: $subday,submonth: $submonth,subyear: $subyear,correct: $correct,incorrect: $incorrect,tid: $tid}) '+
		'CREATE (u)-[:SUBMITS]->(st) return st',
	  {
	  	email: req.session.email,
	  	subdate: dateObj.getTime(),
	  	subday: day,
	  	submonth: month,
	  	subyear: year,
	  	correct: String(correct),
	  	incorrect: String(incorrect),
	  	tid: req.body.tid
	  }
	);

	resultPromisee.then(result => {
	  session.close();
	console.log("Success");
	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
   res.status(200).json({"response" :"success","correct":String(correct),"incorrect":String(incorrect)});

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})
  }
);


/*	for (var i = 0; i < req.body.data.length; i++) {
			const resultPromise = session.run(
		'MATCH (u:Question {qid: $qid,correct:$aid}) RETURN u',
	  {
	  	qid: req.body.data[i].qid,
	  	aid: req.body.data[i].aid
	  }
	);
			
	resultPromise.then(result => {
	  session.close();

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
	  console.log("success:"+singleRecord);		
	  correct=correct+1;
	  console.log('correct:'+correct);
	  driver.close();
	})
	.catch((err) => {
		console.log("failure:"+err);		
	})
	}

	  console.log('fcorrect:'+correct);
	var incorrect=req.body.data.length-correct;
	var d = new Date();
	const resultPromisee = session.run(
		'CREATE (st:Test{email: $email,datesub: $datesub,correct: $correct,incorrect: $incorrect}) RETURN st',
	  {
	  	email: req.body.email,
	  	datesub: String(d),
	  	correct: String(correct),
	  	incorrect: String(incorrect)
	  }
	);

	resultPromisee.then(result => {
	  session.close();
	console.log("Success");

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
   res.status(200).json({"response" :"success","correct":String(correct),"incorrect":String(incorrect)});

	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})
*/
});

module.exports = router;


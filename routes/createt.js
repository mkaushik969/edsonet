const express = require('express');
const config = require('../config.json');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();
	
	var course=req.body.course[parseInt(req.body.clss)-1];
	var subject=req.body.tag[parseInt(course)-1];
	var tg=req.body.clss+''+String(course)+''+String(subject);

	var d = new Date();
	var n = d.getTime();
	const resultPromise = session.run('MATCH (u:User) WHERE u.email = $email '+
		'CREATE (t:Test{tid:$tid,email:$email,tag:$tag,class:$clss,course:$course,level:$level,timer:$timer}) '+
		'CREATE (u)-[:CONDUCTS]->(t) RETURN t',
	  {
	  	tid: 't'+String(n),
	  	email: req.session.email,
	  	tag: String(subject),
	  	course: String(course),
	  	clss: String(req.body.clss),
	  	level: req.body.level,
	  	timer: req.body.timer
	  }
	);

	resultPromise.then(result => {
//	  session.close();
	console.log("Success");

	  // const singleRecord = result.records[0];
	  // const node = singleRecord.get(0);	 
	  // res.status(200).json({"response" :"success"});
//	   driver.close();

	  const resultPromise1 = session.run('MATCH (u:User) WHERE u.email = $email '+
			'CREATE (p:Post{pid: $pid,msg: $msg,pimage: $pimage,email: $email,cdate: $cdate,type: $type,tid: $tid}) '+
			'CREATE (u)-[:POSTS]->(p) RETURN p',
	  {
	  	pid:'p'+n,
	  	tid:'t'+String(n),
	  	email: req.session.email,
	  	msg: 'Hello, I have created this new test',
	  	pimage: '',
	  	type:'2',
	  	cdate: String(n)
	  }
	);

	resultPromise1.then(result => {
	  session.close();
	console.log("Success");

//	  const singleRecord = result.records[0];
//	  const node = singleRecord.get(0);
//	  res.status(200).json({"response" :"success"});
	  res.redirect("timeline");
	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
	  res.render('createtest',{"response" :"failure"});
	})

	})
	.catch((err) => {
	console.log("failure:"+err);
	  res.render('createtest',{"response" :"failure"});
	})
});

module.exports = router;


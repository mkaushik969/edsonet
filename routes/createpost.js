const express = require('express');
const config = require('../config.json');
const fileUpload = require('express-fileupload');
var router = express.Router(); 
// default options
router.use(fileUpload());
 
router.post('/', function(req, res) {

  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');
	console.log(req.body);
	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();
 
  let PImage = req.files.postimage;
  var pimg;
 
	var d = new Date();
	var n = d.getTime();

	try{
  	  pimg='/node_projects/myapp/public/images/p'+n+'.jpg';
  	  PImage.mv(pimg);
  	  pimg='/public/images/p'+n+'.jpg';
	}catch(err){
		pimg='';
		console.log('err');
	}

		const resultPromise = session.run('MATCH (u:User) WHERE u.email = $email '+
			'CREATE (p:Post{pid: $pid,msg: $msg,pimage: $pimage,email: $email,cdate: $cdate,type: $type}) '+
			'CREATE (u)-[:POSTS]->(p) CREATE (p)-[:OF_USER]->(u) RETURN p',
	  {
	  	pid:'p'+n,
	  	msg: req.body.msg,
	  	pimage: pimg,
	  	type: req.body.type,

	  	email: req.session.email,
	  	cdate: String(d)
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

//	  const singleRecord = result.records[0];
//	  const node = singleRecord.get(0);
//	  res.status(200).json({"response" :"success"});
		res.render('timeline',{"response" : "success"});
	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.render('timeline',{"response" : "failure"});
//		res.status(200).json({"response" : "failure"});
	})



//    res.status(200).send("file uploaded");
 
});
module.exports = router;



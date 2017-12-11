const express = require('express');
const config = require('../config.json');
const fileUpload = require('express-fileupload');
var session = require('express-session');
var router = express.Router();

/* GET users listing. */
router.use(fileUpload());

router.get('/', function(req, res, next) {

	if(!req.session.email)
	  res.redirect('home');

	console.log(req.session);
	  res.render('timeline',{"response" :"normal",email:req.session.email});
});

router.post('/', function(req, res) {

  // if (!req.files)
  //   return res.status(400).send('No files were uploaded.');
	console.log(req.session);
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
  	  pimg='/images/p'+n+'.jpg';
	}catch(err){
		pimg='';
		console.log('err');
	}

		const resultPromise = session.run('MATCH (u:User) WHERE u.email = $email '+
			'CREATE (p:Post{pid: $pid,msg: $msg,pimage: $pimage,email: $email,cdate: $cdate,type: $type}) '+
			'CREATE (u)-[:POSTS]->(p) RETURN p',
	  {
	  	pid:'p'+n,
	  	msg: req.body.msg,
	  	pimage: pimg,
	  	type:'1',

	  	email: req.session.email,
	  	cdate: String(n)
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

//	  const singleRecord = result.records[0];
//	  const node = singleRecord.get(0);
//	  res.status(200).json({"response" :"success"});
		res.render('timeline',{"response" : "success",email:req.session.email});
	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.render('timeline',{"response" : "failure",email:req.session.email});
	})
});


module.exports = router;


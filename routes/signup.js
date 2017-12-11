const express = require('express');
const config = require('../config.json');
const fileUpload = require('express-fileupload');
var router = express.Router();
router.use(fileUpload());

/* GET users listing. */
router.post('/', function(req, res, next) {

	console.log(req.body);

	const neo4j = require('neo4j-driver').v1;
	const driver = neo4j.driver(config.neo4j.bolt, neo4j.auth.basic(config.neo4j.auth.user, config.neo4j.auth.pass));
	const session = driver.session();

	let Image = req.files.image;
 
	var d = new Date();
	var n = d.getTime();

	var img;

	try{
  	  img=__basedir+'/public/images/u'+n+'.jpg';
  	  Image.mv(img);
  	  img='/images/u'+n+'.jpg';
	}catch(err){
		img='';
		console.log('err');
	}

	const resultPromise = session.run(
		'CREATE (u:User{firstname: $firstname,lastname: $lastname,email: $email,password: $password,city: $city,phoneno: $phoneno,image: $image}) '+
		'CREATE (u)-[:FOLLOWS]->(u) return u',
	  {
	  	firstname: req.body.fname,
	  	lastname: req.body.lname,
	  	email: req.body.email,
	  	password: req.body.pass,
	  	city: req.body.city,
	  	phoneno: req.body.contact,
	  	image: img
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

	  const singleRecord = result.records[0];
	  const node = singleRecord.get(0);
	  req.session.email=req.body.email;

//	  res.status(200).json({"response" :"success"});
	res.redirect("/timeline");

	  driver.close();
	})
	.catch((err) => {
	console.log("failure");
//		res.status(200).json({"response" : "failure"});
	res.redirect("/createaccount");
	})
});

module.exports = router;


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
 
  let QImage = req.files.QImage;
  let OImage1 = req.files.OImage1;
  let OImage2 = req.files.OImage2;
  let OImage3 = req.files.OImage3;
  let OImage4 = req.files.OImage4;
 
	var d = new Date();
	var n = d.getTime();
//	n='55';
	var qimg,o1img,o2img,o3img,o4img;
	try{
  	  qimg='/node_projects/myapp/public/images/q'+n+'.jpg';
  	  QImage.mv(qimg);
  	  qimg='/images/q'+n+'.jpg';
	}catch(err){
		qimg='';
		console.log('err');
	}
	try{
  	  o1img='/node_projects/myapp/public/images/'+'opt1'+n+'.jpg';
  	  OImage1.mv(o1img);
  	  o1img='/images/'+'opt1'+n+'.jpg';
	}catch(err){
		o1img='';
		console.log('err');
	}
	try{
  	  o2img='/node_projects/myapp/public/images/'+'opt2'+n+'.jpg';
  	  OImage2.mv(o2img);
  	  o2img='/images/'+'opt2'+n+'.jpg';
	}catch(err){
		o2img='';
		console.log('err');
	}
	try{
  	  o3img='/node_projects/myapp/public/images/'+'opt3'+n+'.jpg';
  	  OImage3.mv(o3img);
  	  o3img='/images/'+'opt3'+n+'.jpg';
	}catch(err){
		o3img='';
		console.log('err');
	}
	try{
  	  o4img='/node_projects/myapp/public/images/'+'opt4'+n+'.jpg';
  	  OImage4.mv(o4img);
  	  o4img='/images/'+'opt4'+n+'.jpg';
	}catch(err){
		o4img='';
		console.log('err');
	}

//		console.log('q'+n);
		const resultPromise = session.run('MATCH (t:Tag) WHERE t.tagid = $tag '+
			'CREATE (q:Question{qid: $qid,ques: $ques,qimage: $qimage,opt1id: $opt1id,opt1: $opt1,opt1image: $opt1image,opt2id: $opt2id,opt2: $opt2,opt2image: $opt2image,opt3id: $opt3id,opt3: $opt3,opt3image: $opt3image,opt4id: $opt4id,opt4: $opt4,opt4image: $opt4image,exp: $exp,correct: $correct,level: $level,tag: $tag})'+
			' CREATE (t)-[:HAS_Q]->(q) RETURN q',
	  {
	  	qid:'q'+n,
	  	ques: req.body.ques,
	  	qimage: qimg,

	  	opt1id: 'opt1'+n,
	  	opt1: req.body.opt1,
	  	opt1image: o1img,
	  	
	  	opt2id: 'opt2'+n,
	  	opt2: req.body.opt2,
	  	opt2image: o2img,

	  	opt3id: 'opt3'+n,
	  	opt3: req.body.opt3,
	  	opt3image: o3img,

	  	opt4id: 'opt4'+n,
	  	opt4: req.body.opt4,
	  	opt4image: o4img,

	  	exp: req.body.exp,
	  	correct: req.body.correct+n,
	  	level: req.body.level,
	  	tag: req.body.tag
	  }
	);

	resultPromise.then(result => {
	  session.close();
	console.log("Success");

//	  const singleRecord = result.records[0];
//	  const node = singleRecord.get(0);
//	 res.sendFile(path.join(__dirname, '../views', 'account.ejs'));
	  res.status(200).json({"response" :"success"});
//	res.redirect('/account');
	  driver.close();
	})
	.catch((err) => {
	console.log("failure:"+err);
		res.status(200).json({"response" : "failure"});
	})



//    res.status(200).send("file uploaded");
 
});
module.exports = router;



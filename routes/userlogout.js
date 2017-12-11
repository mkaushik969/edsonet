var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	req.session.destroy(function(err) {
	  if(err) {
	    console.log(err);
	  } else {
	  res.status(200).json({"response" :"success"});
	  }
	});
});

module.exports = router;


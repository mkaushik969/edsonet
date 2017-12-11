var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	  res.render('profile',{email:req.body.email});

});

module.exports = router;


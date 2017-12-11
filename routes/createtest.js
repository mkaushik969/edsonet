var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(!req.session.email)
	  res.redirect('home');

	  res.render('createtest');

});

module.exports = router;


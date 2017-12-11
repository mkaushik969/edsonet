var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	  res.render('testresult');
});
router.post('/', function(req, res, next) {
	  res.render('testresult');
});

module.exports = router;


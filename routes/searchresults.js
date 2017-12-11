var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
	  res.render('searchresults',{txt:req.body.search});
});

module.exports = router;


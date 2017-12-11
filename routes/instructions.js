var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	  res.render('instructions',{tid:req.body.tid,tagid:req.body.tagid});
});

module.exports = router;


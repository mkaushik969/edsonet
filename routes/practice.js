var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	  res.render('practice',{clss:req.body.class,course:req.body.course,tagid:req.body.tagid});
});

module.exports = router;


var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
	res.render('test',{email:req.session.email,tid: req.body.tid});
});

module.exports = router;


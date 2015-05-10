var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var array_uniq = require('array-uniq');

var dburl  = process.env.CRANDB_ROOT_URL;
var dbuser = process.env.CRANDB_USER;
var dbpass = process.env.CRANDB_PASS;

router.get('/', function(req, res) {
    var url = urls.crandb + '/-/maintainer';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return res.render('error'); }
	var maints = JSON.parse(body)
	    .map(function(x) { return x[0]; });
	var num = Object.keys(array_uniq(maints)).length;

	var url = dburl
	    .replace(':user:', dbuser)
	    .replace(':pass:', dbpass) +
	    '/num-maint';

	var data = { '_id' : 'num_maint',
		     'type': 'data',
		     'count': num };
	
	request(
	    { url: url,
	      method: 'PUT',
	      json: data },
	    function(error, response, body) {
		if (error || (response.statusCode != 200 &&
			      response.statusCode != 201)) {
		    return res.render('error');
		}
		
		res.set('Content-Type', 'application/json');
		res.send({ 'result': 'ok' });
		res.end();
	    }
	)
    })
})

module.exports = router;

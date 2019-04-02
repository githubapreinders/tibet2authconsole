(function()
{
	var app;
	var Iaftag;
	var fs;
	var path;
	var _;

	init();

	/**************** DEFAULT INITIALIZATION *********************/
	function init()
	{
		var express = require('express'); // basic API builder
		var cors = require('cors');// anticipate cross browser origin requests
		//var bodyParser = require('body-parser');//easy post request handling
		fs = require('fs');
		path = require('path');
		_ = require('underscore-node'); //convenience library
		app = express();
		app.use(cors());
		app.set('port', process.env.PORT || 3000);
		//app.use(bodyParser.json({limit: "50mb"}));
		//app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
		var xmlparser = require('express-xml-bodyparser');
		app.use(xmlparser());
		app.listen(app.get('port'), function ()
		{
		    console.log('\nApp listening on port\n ' + app.get('port'));
		});
	}

	/**********************  API URLS **********************************/
	app.get('/getalltibcoqueues', function (req, res)
	{
		console.log('getting a request for all tibco queues...');
		var filepath = path.join(__dirname,'./resources/stubQueue-compleet.xml');
		fs.readFile(filepath, {encoding :'utf-8'}, function read(err, data)
		{
			res.send(data);
		});
	});

	app.post('/claimqueue', function (req, res)
	{
		console.log('getting a claim request...' , req.body.input.claimrole[0], req.body.input.role[0] );
		if(req.body.input.claimrole[0] === 'group1' && req.body.input.role[0] === 'role1')
		{
			res.send({message: "claim successful!"})
		}
		if(req.body.input.claimrole[0] === 'group1' && req.body.input.role[0] !== 'role1')
		{
			res.send({message: "No claim (wrong LDAP role)"});
		}
		if(req.body.input.claimrole[0] !== 'group1' && req.body.input.role[0] === 'role1')
		{
			res.send({message: "No claim (wrong Management role)"});
		}
		if(req.body.input.claimrole[0] !== 'group1' && req.body.input.role[0] !== 'role1')
		{
			res.send({message: "No claim (wrong Management and LDAP role)"});
		}
	});

	app.post('/unclaimqueue', function (req, res)
	{
		console.log('getting an unclaim request...');
		res.send({message: "unclaimed!"})
	});

}());




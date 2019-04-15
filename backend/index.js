var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var qs = require('querystring');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


const config = {
	"linkedin":{
		"clientId":"client-id",
		"secret" : "app-secret"
	},
	"facebook":{
		"clientId":"app-id",
		"secret" : "app-secret"
	},
	"google":{
		"clientId":"client-id",
		"secret" : "app-secret"
	}
};
app.get('/', function (req, res) {
	return res.status(200).json('hello world');
});

app.post('/facebook/login', function (req, res) {
	// return res.status(200).json(req.body);

	var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name','picture.type(large)'];
	var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
	var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
	var params = {
		code: req.body.code,
		client_id: config.facebook.clientId,
		client_secret: config.facebook.secret,
		redirect_uri: req.body.redirectURI
	};

  // Step 1. Exchange authorization code for access token.
	request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
	  	
	  	if (response.statusCode !== 200) {
	  		return res.status(500).send({ message: accessToken.error.message });
	  	}

	    // Step 2. Retrieve profile information about the current user.
	    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
	    	if (response.statusCode !== 200) {
	    		return res.status(500).send({ message: profile.error.message });
	    	}

	    	return res.status(200).json(profile);
	    });
	});
});

app.post('/google/login', function (req, res) {
	var accessTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
	var peopleApiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cfamily_name%2Cgender%2Cgiven_name%2Chd%2Cid%2Clink%2Clocale%2Cname%2Cpicture%2Cverified_email';
	var params = {
		code: req.body.code,
		client_id: config.facebook.clientId,
		client_secret: config.facebook.secret,
		redirect_uri: req.body.redirectURI,
		grant_type: 'authorization_code'
	};
	var token_request='code='+req.body.code+
	'&client_id='+config.facebook.clientId+
	'&client_secret='+config.facebook.secret+
	'&redirect_uri='+req.body.redirectURI+
	'&grant_type=authorization_code';
	var request_length = token_request.length;
  // Step 1. Exchange authorization code for access token.
	request.post(accessTokenUrl, { body: token_request, headers: {'Content-type':'application/x-www-form-urlencoded'} }, function(err, response, token) {
	  	var accessToken = JSON.parse(token).access_token;
	  	var headers = { Authorization: 'Bearer ' + accessToken };

	    // Step 2. Retrieve profile information about the current user.
	    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
	    	if (profile.error) {
	    		return res.status(500).send({message: profile.error.message});
	    	}
	    	return res.status(200).json(profile);

	    });
	});
});

app.post('/linkedin/login', function (req, res) {
	var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  var params = {
    code: req.body.code,
    client_id: config.facebook.clientId,
    client_secret: config.facebook.secret,
    redirect_uri: req.body.redirectURI,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

        return res.status(200).json(profile);
    });
  });
});
var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
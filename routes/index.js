var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var Event = require('../schemas/event.js');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	User.remove({});

	res.render('index', { 
  	title: 'Nearbi',
  	user: req.user,
  	});
});

router.get('/login', function(req, res, next) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('login', {title: 'Login'});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', {title: 'Register'});
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.get('/settings', function(req, res, next) {
	if(!req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('settings', {title: 'Settings'});
	}
});

router.get('/getuser', function(req, res, next) {
	if(!req.isAuthenticated()) {
		res.send({});
	} else {
		res.send(req.user);
	}
});

// currently unused
router.get('/getevents', function(req, res, next) {
	Event.find({}, function(err, events) {
		res.send(events);
	});
});

router.post('/login',
		passport.authenticate('local', { successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: false })
		);

router.post('/signup', function (req, res, next) {
	if (req.body.username === "" || req.body.password === "") {
		console.log("Missing inforation!");
		return res.redirect('/signup');
	}

	var user = new User({username: req.body.username, search:{filter:'no', category:[]}});
	User.register(user, req.body.password, function(registrationError) {
		if(!registrationError) {
			req.login(user, function(loginError) {
				if (loginError) { return next(loginError); }
				return res.redirect('/');
			});
		} else {
			res.send(registrationError);
		}
	});

});

router.post('/savesettings', function (req, res, next) {
	User.update({'username':req.user.username}, {$set:{search:req.body}}, {'multi':false}, function (err, changed) {
		console.log(changed);
	});
	console.log(req.user);
	res.redirect('/');
});

// Currently unused
router.post('/uploadevents', function(req, res, next) {
	var data = req.body.data;
	
	//Clear the database of old events
	Event.remove({}, function(err,result) {
		if (err) {
			console.log('An error occurred!');
		}
		console.log('Events cleared!');
	});

	//Populate database with new events
	for (i=0;i<data.length;i++) {
		var newEvent = new Event({
			'name':data[i].name.text,
			'id':data[i].id,
			'address':data[i].venue.address,
			'description':data[i].description.html,
			'start':data[i].start.local,
			'end':data[i].end.local,
			'latitude':data[i].venue.latitude,
			'longitude':data[i].venue.longitude,
			'url':data[i].url
		});

		newEvent.save();
	}	

    res.send({
    	message: "Event information uploaded!"
    });
});

module.exports = router;

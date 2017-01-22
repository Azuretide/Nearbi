var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var Event = require('../schemas/event');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
  	title: 'Nearbi',
  	user: req.user });
});

router.get('/login', function(req, res, next) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('login', {});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', {});
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

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
	console.log('signed up');
	var user = new User({username: req.body.username});
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

router.post('/uploadevents', function(req, res, next) {
	var data = req.body;
	
	var newEvent = new Event({
		'name':data.name.text,
		'id':data.id,
		'address':data.venue.address,
		'description':data.description.text,
		'start':data.start.local,
		'end':data.end.local,
		'latitude':data.venue.latitude,
		'longitude':data.venue.longitude,
		'url':data.url
	});
	//Check for duplicates
	Event.find({'id': data.id}, function(err, found) {
		if (err) {
  			console.log('Error!');
		}

		if (found.length === 0) {
  			newEvent.save();
		}
	});

    res.send({
    	message: "Event information uploaded!"
    });
});

module.exports = router;

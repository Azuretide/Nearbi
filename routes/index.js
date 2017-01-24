var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var Event = require('../schemas/event');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	//Clear the database
	Event.remove({}, function(err,result) {
		if (err) {
			console.log('An error occurred!');
		}
		console.log('Events cleared!');
	});
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

		//Check for duplicates (non-working)
		// Event.find({'id': data[i].id}, function(err, found) {
		// 	if (err) {
	 //  			console.log('Error!');
		// 	}

		// 	if (found.length === 0) {
	 //  			var self = this;
	 //  			console.log(self);
	 //  			// console.log(newEvent.name);
	 //  			// newEvent.save();
		// 	}
		// });
	}	

    res.send({
    	message: "Event information uploaded!"
    });
});

module.exports = router;

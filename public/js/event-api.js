// Code for handling event api requests

//For Eventbrite API
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.within=20mi&location.latitude=42.360&location.longitude=-71.0589&start_date.keyword=today&token=ZYKD3KHDFOVXM5BHSLXO&expand=venue",
    "method": "GET",
    "headers": {}
  }

  $.ajax(settings).done(function (data) {
  	
  	for (i=0;i<data.events.length;i++) {
  		// console.log(data.events[i]);
  		$.ajax({
  			url: '/uploadevents',
  			data: data.events[i],
  			dataType:"json",
  			type: 'POST',
  			success: function(data) {
        	//Nothing to do here
      		},
      		error: function(xhr, status, error) {
        		console.log("Uh oh there was an error: " + error);
      		}
  		});
  	}
  });


//Unused code block for handling Facebook Graph API requests (broken)
// var EventSearch = require("facebook-events-by-location-core");

// var es = new EventSearch({
//     "lat": 40.710803,
//     "lng": -73.964040,
//     "accessToken": ,
//     "distance": 2500,
//     "since": 0,
//     "until": 0
// });

// es.search().then(function (events) {
//     console.log(JSON.stringify(events));
// }).catch(function (error) {
//     console.error(JSON.stringify(error));
// });
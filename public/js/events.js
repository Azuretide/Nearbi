var EventSearch = require("facebook-events-by-location-core");

var es = new EventSearch({
    "lat": 40.710803,
    "lng": -73.964040,
    "distance": 2500,
    "since": 0,
    "until": 0
});

es.search().then(function (events) {
    console.log(JSON.stringify(events));
}).catch(function (error) {
    console.error(JSON.stringify(error));
});
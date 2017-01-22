// Code for Google Maps Javascript API

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.360, lng: -71.0589},
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchBox');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var testim = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: testim,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    
        //Mapping the event locations (hard-coded for now)
        $.ajax({
            url: '/getevents',
            data: {},
            type: 'GET',
            success: function(data) {
                // for (i=0;i<12;i++) {
                for (i=0;i<data.length;i++) {
                    var marker = new google.maps.Marker({
                        position: {lat: Number(data[i].latitude), lng: Number(data[i].longitude)},
                        map: map,
                        info: data[i]
                    });

                    var now = moment("2017-01-21T18:15:00");
                    // var now = moment();

                    if (now.isAfter(moment(data[i].end))) {
                        marker.setVisible(false);
                    }
                    else if (now.isBefore(moment(data[i].start))) {
                        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png");
                    }
                    else if (now.isAfter(moment(data[i].start)) && now.isBefore(moment(data[i].end))) {
                        if (now.isAfter(moment(data[i].end).subtract(30, 'minutes'))) {
                            marker.setIcon("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
                        }
                        else {
                            marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
                        }
                    }

                    marker.addListener('click', function() {
                        var self = this;
                        console.log(self);
                        console.log(self.info.name);
                    });

                    markers.push(marker);
                }
            },
            error: function(xhr, status, error) {
                console.log("Uh oh there was an error: " + error);
            }
        });
    });
}
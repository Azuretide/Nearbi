// Code for Google Maps Javascript API

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.360, lng: -71.0589},
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchBox');
    var autocomplete = new google.maps.places.Autocomplete(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //Immediately collect events
            google.maps.event.trigger(autocomplete, 'place_changed');

        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }
      

    function handleLocationError(browserHasGeolocation, pos) {
        console.log("Browser doesn't support geolocation!");
    }

    // Initialize the map legend
    var legend = document.getElementById('legend');
    var div = document.createElement('div');
    div.innerHTML = '<img src="/images/slimlegend.png" alt="Map Key" class="legend" height="125" width="125">';
    legend.appendChild(div);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

    // Bias the Autocomplete results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        autocomplete.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
    autocomplete.addListener('place_changed', function() {
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        var lat = "&location.latitude=0";
        var lng = "&location.longitude=0";
        bounds = new google.maps.LatLngBounds();

        // Allows events to be searched for based purely on location
        if (typeof autocomplete.getPlace() === 'undefined') {
            lat = "&location.latitude=" + String(pos.lat);
            lng = "&location.longitude=" + String(pos.lng);

            markers.push(new google.maps.Marker({
                map: map,
                icon: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                title: 'Current Location',
                position: pos
            }));
            bounds.extend(pos);
            center = pos;

        } else {
            var place = autocomplete.getPlace();
    
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            lat = "&location.latitude=" + place.geometry.location.lat();
            lng = "&location.longitude=" + place.geometry.location.lng();

            markers.push(new google.maps.Marker({
                map: map,
                icon: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                title: place.name,
                position: place.geometry.location
            }));   

            bounds.extend(place.geometry.location);
            center = place.geometry.location
        }
        
        //Eventbrite API: Getting the events
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.within=15mi&start_date.keyword=today&token=MFUSAXDCM4W2GBD67JSB&expand=venue" + lat + lng,
            "method": "GET",
            "headers": {}
        }

        $.ajax(settings).done(function (data) {
            raw = data.events;
            for (i=0;i<raw.length;i++) {
                var event = {
                    'name':raw[i].name.text,
                    'id':raw[i].id,
                    'address':raw[i].venue.address,
                    'description':raw[i].description.html,
                    'start':raw[i].start.local,
                    'end':raw[i].end.local,
                    'latitude':raw[i].venue.latitude,
                    'longitude':raw[i].venue.longitude,
                    'url':raw[i].url
                }

                var marker = new google.maps.Marker({
                    position: {lat: Number(event.latitude), lng: Number(event.longitude)},
                    map: map,
                    animation: null,
                    icon: "https://maps.google.com/mapfiles/marker_white.png",
                    info: event
                });

                bounds.extend(marker.getPosition());

                //Selecting marker color based on event timing
                var now = moment();
                if (now.isAfter(moment(event.end))) {
                    marker.setVisible(false);
                }
                else if (now.isBefore(moment(event.start))) {
                    marker.setIcon("https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png");
                }
                else if (now.isAfter(moment(event.start)) && now.isBefore(moment(event.end))) {
                    if (now.isAfter(moment(event.end).subtract(30, 'minutes'))) {
                        marker.setIcon("https://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
                    }
                    else {
                        marker.setIcon("https://maps.google.com/mapfiles/ms/icons/green-dot.png");
                    }
                }

                marker.addListener('click', function() {
                    var self = this;

                    //Toggle bounce animation for selected marker
                    if (self.getAnimation() !== null) {
                        self.setAnimation(null);
                    } else {
                        for (i=0;i<markers.length;i++) {
                            markers[i].setAnimation(null);
                        }
                        self.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    // Populate the right div with event information
                    $(".event-detail").empty();
                    $("#name").text(self.info.name);
                    $("#time").text(moment(self.info.start).format("dddd, MMMM Do YYYY, h:mm a") + " - " + moment(self.info.end).format("dddd, MMMM Do YYYY, h:mm a"));
                    $("#address").empty();
                    $("#address").append(self.info.address.address_1 + "</br>" + self.info.address.city + ", " + self.info.address.region + " " + self.info.address.postal_code);
                    $("#description").empty();
                    $("#description").append(self.info.description);
                    $(".event-detail").append($(".template").html());
                    $("#olink").attr("href", self.info.url);
                });

                markers.push(marker);
            }
            map.fitBounds(bounds);
            map.setCenter(center);
        });
        map.fitBounds(bounds);
        map.setZoom(13);
        map.setCenter(center);
    });
}
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
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

            // Create a marker for each place.
            var yourIcon = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
            markers.push(new google.maps.Marker({
                map: map,
                icon: yourIcon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            //Eventbrite API: Getting the events
            var lat = "&location.latitude=" + place.geometry.location.lat();
            var lng = "&location.longitude=" + place.geometry.location.lng();
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.within=20mi&start_date.keyword=today&token=ZYKD3KHDFOVXM5BHSLXO&expand=venue" + lat + lng,
                "method": "GET",
                "headers": {}
            }

            $.ajax(settings).done(function (data) {
        
                for (i=0;i<data.events.length;i++) {
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
                    }).done(function () {
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

                                    // var now = moment("2017-01-21T18:15:00");
                                    var now = moment();

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

                                    console.log(self.info);
                                    $(".event-detail").empty();
                                    $("#name").text(self.info.name);
                                    $("#time").text(moment(self.info.start).format("dddd, MMMM Do YYYY, h:mm a") + " - " + moment(self.info.end).format("dddd, MMMM Do YYYY, h:mm a"));
                                    $("#address").text(self.info.address.address_1 + "</br>" + self.info.address.city + ", " + self.info.address.region + " " + self.info.address.postal_code);
                                    $("#description").empty();
                                    $("#description").append(self.info.description);
                                    $(".event-detail").append($(".template").html());
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
            });

      
        });
        map.fitBounds(bounds);
  
        //Mapping the event locations (hard-coded for now)
        // $.ajax({
        //     url: '/getevents',
        //     data: {},
        //     type: 'GET',
        //     success: function(data) {
        //         // for (i=0;i<12;i++) {
        //         for (i=0;i<data.length;i++) {
        //             var marker = new google.maps.Marker({
        //                 position: {lat: Number(data[i].latitude), lng: Number(data[i].longitude)},
        //                 map: map,
        //                 info: data[i]
        //             });

        //             // var now = moment("2017-01-21T18:15:00");
        //             var now = moment();

        //             if (now.isAfter(moment(data[i].end))) {
        //                 marker.setVisible(false);
        //             }
        //             else if (now.isBefore(moment(data[i].start))) {
        //                 marker.setIcon("http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png");
        //             }
        //             else if (now.isAfter(moment(data[i].start)) && now.isBefore(moment(data[i].end))) {
        //                 if (now.isAfter(moment(data[i].end).subtract(30, 'minutes'))) {
        //                     marker.setIcon("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
        //                 }
        //                 else {
        //                     marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
        //                 }
        //             }

        //             marker.addListener('click', function() {
        //             var self = this;

        //             console.log(self.info);
        //             $(".event-detail").empty();
        //             $("#name").text(self.info.name);
        //             $("#time").text(moment(self.info.start).format("dddd, MMMM Do YYYY, h:mm a") + " - " + moment(self.info.end).format("dddd, MMMM Do YYYY, h:mm a"));
        //             $("#address").text(self.info.address.address_1 + "</br>" + self.info.address.city + ", " + self.info.address.region + " " + self.info.address.postal_code);
        //             $("#description").empty();
        //             $("#description").append(self.info.description);
        //             $(".event-detail").append($(".template").html());
        //             });

        //             markers.push(marker);
        //         }
        //     },
        //     error: function(xhr, status, error) {
        //         console.log("Uh oh there was an error: " + error);
        //     }
        // });
    });
}